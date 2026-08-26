import { expect, test, type Page, type Request } from "@playwright/test";

type LeadPayload = {
  event_id?: string;
  lead_stage?: string;
  nombre?: string;
  clinica?: string;
  nombre_clinica?: string;
  tamano_operacion?: string;
  tamano_operacion_label?: string;
  cargo?: string;
  sitio_web?: string;
  ciudad?: string;
  necesidad_principal?: string;
  necesidad_principal_label?: string;
  fuente?: string;
};

function nonce() {
  return `e2e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function recordWizard(page: Page) {
  const hits: LeadPayload[] = [];
  page.on("request", (req: Request) => {
    if (!req.url().includes("/api/wizard") || req.method() !== "POST") return;
    try {
      hits.push(JSON.parse(req.postData() || "{}"));
    } catch {
      /* noop */
    }
  });
  return hits;
}

test.describe("/agenda — wizard Hebe + agendador Clinera", () => {
  test("pasa los 5 pasos, manda clínica/tamaño y abre el widget de Rebeca/Nohelymar", async ({ page }) => {
    const id = nonce();
    const hits = recordWizard(page);

    await page.goto("/agenda", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Hablemos de tus necesidades" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Fichas, recetas y consentimientos/i })).toBeVisible();
    await page.getByRole("button", { name: /Fichas, recetas y consentimientos/i }).click();
    await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();

    await expect(page.getByRole("heading", { name: "¿Cuántos pacientes al mes?" })).toBeVisible();
    await page.getByRole("button", { name: "200 a 500 pacientes / mes Operación en crecimiento" }).click();

    await expect(page.getByRole("heading", { name: "Hablemos más de tu clínica" })).toBeVisible();
    await page.getByPlaceholder("Ej: Clínica Sonríe").fill(`[E2E TEST] Clinica ${id}`);
    await page.getByPlaceholder("www.tuclinica.cl o @tuclinica").fill("www.e2e-clinera.cl");
    await page.getByLabel("Tipo de clínica").selectOption("medica");
    await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();

    await expect(page.getByRole("heading", { name: "Tus datos de contacto" })).toBeVisible();
    await page.getByPlaceholder("Tu nombre completo").fill(`[E2E TEST] ${id}`);
    await page
      .locator("select")
      .filter({ has: page.locator('option[value="Dueño / Fundador"]') })
      .selectOption("Dueño / Fundador");
    await page.getByPlaceholder("9 1234 5678").fill("912345678");
    await page.getByPlaceholder("tu@clinica.cl").fill(`${id}@e2e.clinera.io`);

    await page.getByRole("button", { name: /Agenda con tu ingeniero/i }).click();

    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({ timeout: 12000 });
    await expect(page.getByRole("button", { name: /Confirmar reunión/i })).toBeVisible();

    await expect.poll(() => hits.some((h) => h.lead_stage === "contact"), { timeout: 12000 }).toBeTruthy();
    const contact = hits.find((h) => h.lead_stage === "contact");
    expect(contact?.nombre_clinica || contact?.clinica).toContain(id);
    expect(contact?.tamano_operacion).toBe("vol_200_500");
    expect(contact?.cargo).toBe("Dueño / Fundador");
    expect(contact?.sitio_web).toContain("e2e-clinera");
    expect(contact?.ciudad ?? "").toBe("");
    expect(contact?.necesidad_principal).toMatch(/fichas|consentimientos|odontograma/);
    expect(contact?.fuente).toContain("/agenda");
  });
});

test.describe("/agenda — no ofrece madrugada UTC", () => {
  test.use({ timezoneId: "America/Santiago" });

  test("oculta 01:45/02:45 aunque la API las mande", async ({ page }) => {
    const id = nonce();

    await page.route("https://n8n.oacg.cl/webhook/clinera-agenda-config", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, duracionMin: 45 }),
      }),
    );
    await page.route(/n8n\.oacg\.cl\/webhook\/clinera-agenda-disponibilidad/, (route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.has("desde")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ dias: { "2099-01-01": 2 } }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            horariosDisponibles: [
              { horaInicio: "01:45", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
              { horaInicio: "02:45", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
              { horaInicio: "10:00", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
              { horaInicio: "16:45", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
            ],
          },
        }),
      });
    });
    await page.route("**/api/wizard", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
        : route.continue(),
    );

    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Fichas, recetas y consentimientos/i }).click();
    await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();
    await page.getByRole("button", { name: "200 a 500 pacientes / mes Operación en crecimiento" }).click();
    await page.getByPlaceholder("Ej: Clínica Sonríe").fill(`[E2E TEST] Clinica ${id}`);
    await page.getByPlaceholder("www.tuclinica.cl o @tuclinica").fill("www.e2e-clinera.cl");
    await page.getByLabel("Tipo de clínica").selectOption("medica");
    await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();
    await page.getByPlaceholder("Tu nombre completo").fill(`[E2E TEST] ${id}`);
    await page
      .locator("select")
      .filter({ has: page.locator('option[value="Dueño / Fundador"]') })
      .selectOption("Dueño / Fundador");
    await page.getByPlaceholder("9 1234 5678").fill("912345678");
    await page.getByPlaceholder("tu@clinica.cl").fill(`${id}@e2e.clinera.io`);
    await page.getByRole("button", { name: /Agenda con tu ingeniero/i }).click();

    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({ timeout: 12000 });
    await expect(page.getByRole("button", { name: /^10:00$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^16:45$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /01:45/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /02:45/ })).toHaveCount(0);
  });
});
