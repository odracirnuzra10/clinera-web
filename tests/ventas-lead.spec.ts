import { test, expect, Page, Request } from "@playwright/test";

/**
 * E2E para el wizard de calificación de /ventas y /hablar-con-ventas.
 * Flujo (4 pasos): Software → Filtro (precio + tamaño) → Contacto → Agenda.
 * Toda clínica que completa el filtro califica (no hay lista de espera).
 *
 * Verifica:
 *  - Paso 1: opciones de software + microcopy condicional.
 *  - Paso 2: encuadre de precio + chips de tamaño.
 *  - Card de inversión, CTA "Agenda con tu ingeniero", payload n8n.
 *
 * Nota: el request al webhook se DEJA PASAR a producción para validar downstream.
 * Por eso prefijamos los identificadores con [E2E TEST].
 */

const WEBHOOK_URL =
  "https://n8n.oacg.cl/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";

type LeadPayload = {
  event_id: string;
  lead_stage?: string;
  lead_status?: string;
  booking_status?: string;
  software_actual?: string;
  software_actual_label?: string;
  sucursales?: string;
  pacientes_mes?: string;
  operational_profile?: string;
  operational_profile_label?: string;
  locations_band?: string;
  patients_band?: string;
  lead_priority?: string;
  profesionales?: string;
  prioridad_alta?: boolean;
  califica?: boolean;
  nombre?: string;
  nombre_clinica?: string;
  email?: string;
  celular?: string;
  celular_prefix?: string;
  celular_digits?: string;
  tipo_clinica?: string;
  lead_source?: string;
  fuente?: string;
};

function makeNonce(): string {
  return `e2e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function recordWebhookHits(page: Page): LeadPayload[] {
  const hits: LeadPayload[] = [];
  page.on("request", (req: Request) => {
    if (req.url() !== WEBHOOK_URL || req.method() !== "POST") return;
    const body = req.postData();
    if (!body) return;
    try {
      hits.push(JSON.parse(body));
    } catch {
      /* noop */
    }
  });
  return hits;
}

test.describe("Ventas wizard — software + tamaño + payload n8n", () => {
  test("flujo CALIFICA: AgendaPro + perfil 1 sede/≤500 manda lead completo a n8n", async ({ page }) => {
    const nonce = makeNonce();
    const hits = recordWebhookHits(page);

    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    // Paso 1 — Software
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/software/i);
    // Elegir software avanza solo: no hay botón Continuar en el paso 1.
    await page.getByRole("button", { name: "AgendaPro", exact: true }).click();

    // Paso 2 — Perfil operativo (1 sede · hasta 500 → prioridad standard)
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/inversión/i);
    await expect(page.getByText("USD 279 mensuales", { exact: true })).toBeVisible();
    await expect(page.getByText("USD 750", { exact: true })).toHaveCount(0);
    await expect(page.getByText("¿Cuál describe mejor tu operación?")).toBeVisible();
    const ctaPaso2 = page.getByRole("button", { name: /Continuar con esta inversión/i });
    await expect(ctaPaso2, "el CTA arranca deshabilitado sin perfil").toBeDisabled();
    await page.getByRole("radio", { name: "1 sede · hasta 500 pacientes/mes" }).click();
    await expect(ctaPaso2).toBeEnabled();
    await ctaPaso2.click();

    // Paso 3 — Contacto
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/datos/i);
    await expect(page.getByText("Te escribimos directo a quien decide, no a recepción.")).toBeVisible();

    await page.locator('input[autocomplete="name"]').fill(`[E2E TEST] ${nonce} Dueño`);
    await page.locator('input[autocomplete="organization"]').fill(`[E2E TEST] Clinica ${nonce}`);
    await page.getByRole("button", { name: "Médica", exact: true }).click();
    await page.locator('input[autocomplete="tel-national"]').fill("9 1234 5678");
    await page.locator('input[autocomplete="email"]').fill(`${nonce}@e2e.clinera.io`);

    const cta = page.getByRole("button", { name: /Agenda con tu ingeniero/i });
    await expect(cta).toBeEnabled();
    const reqPromise = page.waitForRequest(
      (r) => {
        if (r.url() !== WEBHOOK_URL || r.method() !== "POST") return false;
        try {
          return JSON.parse(r.postData() || "{}").lead_stage === "contact";
        } catch {
          return false;
        }
      },
      { timeout: 8000 },
    );
    await cta.click();
    await reqPromise;
    await page.waitForTimeout(500);

    // Lead de tamaño (paso 2) + lead de contacto (paso 3)
    const sizeLead = hits.find((h) => h.lead_stage === "size_captured");
    const contactLead = hits.find((h) => h.lead_stage === "contact");

    expect(sizeLead, "esperaba lead de tamaño en el paso 2").toBeTruthy();
    expect(sizeLead!.califica).toBe(true);
    expect(sizeLead!.prioridad_alta).toBe(false);
    expect(sizeLead!.lead_status).toBe("qualified");

    expect(contactLead, "esperaba lead de contacto en el paso 3").toBeTruthy();
    expect(contactLead!.software_actual).toBe("agendapro");
    // Perfil operativo (esquema nuevo)
    expect(contactLead!.operational_profile).toBe("single_upto_500");
    expect(contactLead!.operational_profile_label).toBe("1 sede · hasta 500 pacientes/mes");
    expect(contactLead!.locations_band).toBe("1");
    expect(contactLead!.patients_band).toBe("lte_500");
    expect(contactLead!.lead_priority).toBe("standard");
    // Legacy derivado — n8n / Baserow 152 / Monday siguen recibiendo lo de siempre
    expect(contactLead!.sucursales).toBe("1");
    expect(contactLead!.pacientes_mes).toBe("200_500");
    expect(contactLead!.califica).toBe(true);
    expect(contactLead!.prioridad_alta).toBe(false);
    expect(contactLead!.nombre).toContain(nonce);
    expect(contactLead!.email).toBe(`${nonce}@e2e.clinera.io`);
    expect(contactLead!.celular).toBe("+56912345678");
    expect(contactLead!.booking_status).toBe("pending");
    expect(contactLead!.fuente).toContain("Landing /ventas");

    // Upsert: las dos etapas comparten event_id → n8n actualiza la MISMA fila.
    expect(sizeLead!.event_id).toBeTruthy();
    expect(contactLead!.event_id).toBe(sizeLead!.event_id);
    // Y no hay más de un lead por etapa (sin duplicados).
    expect(hits.filter((h) => h.lead_stage === "size_captured")).toHaveLength(1);
    expect(hits.filter((h) => h.lead_stage === "contact")).toHaveLength(1);

    console.log("=== E2E LEAD CALIFICA ===");
    console.log("nonce:", nonce);
    console.log("event_id:", contactLead!.event_id);
    console.log("=========================");
  });

  test("perfil multisede: 4+ sedes → strategic y patients_band unknown", async ({ page }) => {
    const hits = recordWebhookHits(page);
    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: "AgendaPro", exact: true }).click();
    await page.getByRole("radio", { name: "4 o más sedes" }).click();
    await page.getByRole("button", { name: /Continuar con esta inversión/i }).click();
    await page.waitForTimeout(600);

    const sizeLead = hits.find((h) => h.lead_stage === "size_captured");
    expect(sizeLead, "esperaba lead de tamaño").toBeTruthy();
    expect(sizeLead!.operational_profile).toBe("multi_4_plus");
    expect(sizeLead!.locations_band).toBe("4_plus");
    // No se inventa volumen de pacientes para multisede.
    expect(sizeLead!.patients_band).toBe("unknown");
    expect(sizeLead!.pacientes_mes).toBe("");
    expect(sizeLead!.lead_priority).toBe("strategic");
    expect(sizeLead!.prioridad_alta).toBe(true);
    expect(sizeLead!.sucursales).toBe("3plus");
  });

  test('"No es para mí" no bloquea el paso y lleva al cierre suave', async ({ page }) => {
    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "AgendaPro", exact: true }).click();
    await expect(page.getByText("¿Cuál describe mejor tu operación?")).toBeVisible();
    // El enlace de salida existe pero no es una respuesta obligatoria.
    await page.getByRole("button", { name: "No es para mí" }).click();
    await expect(page.getByText("Sin problema.")).toBeVisible();
  });

});
