import { expect, test } from "@playwright/test";
import {
  PARTNERS_CANONICAL,
  PARTNERS_CLIENT_DISCOUNT_MONTHS,
  PARTNERS_CLIENT_DISCOUNT_PERCENT,
  PARTNERS_CTA_HREF,
  PARTNERS_DOCTORS_API,
  PARTNERS_DOCTORS_CONVENIO,
  PARTNERS_DOCTORS_EMAIL,
  PARTNERS_DOCTORS_HREF,
  PARTNERS_PATH,
  PARTNERS_PRESENTATION_HREF,
  PARTNERS_REFERRAL_FEE_LABEL,
  PARTNERS_REFERRAL_FEE_USD,
  PARTNERS_REQUIREMENTS,
} from "@/content/partners-program";
import {
  errorDelPaso,
  normalizarPostulacion,
  validarPostulacion,
} from "@/lib/convenio-doctores";

test.describe("fuente de verdad del programa partner", () => {
  test("el partner cobra US$ 150; el referido recibe 10% por 3 meses", () => {
    expect(PARTNERS_REFERRAL_FEE_USD).toBe(150);
    expect(PARTNERS_REFERRAL_FEE_LABEL).toBe("US$ 150");
    expect(PARTNERS_CLIENT_DISCOUNT_PERCENT).toBe(10);
    expect(PARTNERS_CLIENT_DISCOUNT_MONTHS).toBe(3);
    expect(PARTNERS_PATH).toBe("/partners");
    expect(PARTNERS_CANONICAL).toBe("https://www.clinera.io/partners");
    expect(PARTNERS_CTA_HREF).toBe("/reunion-comercial");
    expect(PARTNERS_PRESENTATION_HREF).toBe("/presentacion-partners");
    expect(PARTNERS_REQUIREMENTS.map((r) => r.title)).toEqual([
      "4 historias al mes",
      "1 reel al mes",
      "Bio de Instagram",
    ]);
    expect(PARTNERS_DOCTORS_CONVENIO.cta).toBe("Postula");
    expect(PARTNERS_DOCTORS_CONVENIO.h2Accent).toBe("Postula.");
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/Si eres doctor, postulas/);
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/no es automático/i);
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/dominio el primer año/i);
    expect(PARTNERS_DOCTORS_EMAIL).toBe("ricardo@oacg.cl");
    expect(PARTNERS_DOCTORS_API).toBe("/api/convenio-doctores");
    expect(PARTNERS_DOCTORS_HREF).toBe("/partners#convenio-doctores");
    expect(PARTNERS_DOCTORS_CONVENIO.wizard.steps.map((s) => s.key)).toEqual([
      "nombre",
      "correo",
      "motivo",
    ]);
  });

  test("una postulación corta no pasa; nombre+correo+motivo sí", () => {
    expect(validarPostulacion(normalizarPostulacion({}))).toContain("Escribe tu nombre.");
    expect(errorDelPaso("correo", "hola")).toMatch(/correo/i);
    expect(errorDelPaso("motivo", "muy corto")).toMatch(/motivo/i);
    expect(
      validarPostulacion(
        normalizarPostulacion({
          nombre: "María Soto",
          correo: "maria@clinica.cl",
          motivo: "Soy dermatóloga en Temuco y no tengo sitio web.",
        }),
      ),
    ).toEqual([]);
  });
});

test.describe("landing /partners", () => {
  test("publica el bono, el 10% del referido y no el 15% de agencias", async ({
    page,
  }) => {
    await page.goto("/partners");
    await expect(page).toHaveTitle(/Programa Partner/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", PARTNERS_CANONICAL);

    const hero = page.locator("section").first();
    await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(hero.getByText("US$ 150", { exact: true })).toBeVisible();
    await expect(hero.getByText("10%", { exact: true })).toBeVisible();
    await expect(hero.getByText("15%", { exact: true })).toHaveCount(0);

    const body = await page.locator("body").innerText();
    expect(body).toMatch(/10%/);
    expect(body).toMatch(/3 meses/);
    expect(body).not.toMatch(/15%/);
    expect(body).not.toMatch(/Permanente para todos los clientes/);
    expect(body).not.toMatch(/\bEficiente\b/);
    expect(body).not.toMatch(/Agentic Pro/);
    expect(body).not.toMatch(/comisión del 10%/i);
    expect(body).toMatch(/US\$ 150/);
    expect(body).toMatch(/4 historias al mes/);
    expect(body).toMatch(/1 reel al mes/);
    expect(body).toMatch(/partner de clinera\.io/);
    expect(body).toMatch(/closer/i);
    expect(body).toMatch(/Convenio doctores/i);
    expect(body).toMatch(/sitio web/i);
    expect(body).toMatch(/dominio/i);
    expect(body).toMatch(/No es automático/);

    const apply = page.getByRole("link", { name: /Aplicar al programa/ }).first();
    await expect(apply).toHaveAttribute("href", PARTNERS_CTA_HREF);
    await apply.click();
    await expect(page).toHaveURL(/\/reunion-comercial/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("convenio doctores se postula en un wizard propio, no el de agendar", async ({
    page,
  }) => {
    const enviados: unknown[] = [];
    await page.route("**/api/convenio-doctores", async (route) => {
      enviados.push(route.request().postDataJSON());
      await route.fulfill({ json: { ok: true } });
    });

    await page.goto("/partners");
    const block = page.locator("#convenio-doctores");
    await expect(block.getByRole("heading", { level: 2 })).toContainText("Postula");
    await expect(block).toContainText("sitio web");
    await expect(block).toContainText("No es automático");
    await expect(block.getByRole("link", { name: /Aplicar al programa/ })).toHaveCount(0);
    await expect(block.getByRole("link", { name: /^Postula/ })).toHaveCount(0);

    await block.getByRole("button", { name: /^Postula/ }).click();
    await expect(block.getByText("Paso 1 de 3")).toBeVisible();
    await block.getByLabel("Tu nombre").fill("María Soto");
    await block.getByRole("button", { name: /Continuar/ }).click();
    await expect(block.getByText("Paso 2 de 3")).toBeVisible();
    await block.getByLabel("Tu correo").fill("maria@clinica.cl");
    await block.getByRole("button", { name: /Continuar/ }).click();
    await expect(block.getByText("Paso 3 de 3")).toBeVisible();
    await block
      .getByLabel("Motivo")
      .fill("Soy dermatóloga en Temuco y no tengo sitio web.");
    await block.getByRole("button", { name: /Enviar postulación/ }).click();

    await expect(block.getByRole("heading", { name: "Postulación enviada" })).toBeVisible();
    expect(enviados).toEqual([
      {
        nombre: "María Soto",
        correo: "maria@clinica.cl",
        motivo: "Soy dermatóloga en Temuco y no tengo sitio web.",
      },
    ]);
    await expect(page).not.toHaveURL(/\/reunion-comercial/);
    await expect(page).not.toHaveURL(/\/agenda/);
  });

  test("el ancla #convenio-doctores abre el wizard en el bloque", async ({ page }) => {
    await page.goto("/partners#convenio-doctores");
    const block = page.locator("#convenio-doctores");
    await expect(block.getByText("Paso 1 de 3")).toBeVisible();
    await expect(block.getByLabel("Tu nombre")).toBeVisible();
  });

  test("muestra el diagrama de Clinera O.S.", async ({ page }) => {
    await page.goto("/partners");
    await expect(page.getByText("Toda tu operación la alimenta")).toBeVisible();
    await expect(page.getByText("Clinera O.S. actúa")).toBeVisible();
    await expect(page.getByText("Contexto · decisiones · acción")).toBeVisible();
  });

  test("el botón Ver presentación abre el deck de partners", async ({ page }) => {
    await page.goto("/partners");
    const deck = page.getByRole("link", { name: /Ver presentación/ }).first();
    await expect(deck).toHaveAttribute("href", PARTNERS_PRESENTATION_HREF);
    await deck.click();
    await expect(page).toHaveURL(/\/presentacion-partners/);
    await expect(page.locator(".slide.active")).toContainText("US$ 150");
    await expect(page.locator("body")).toContainText("4 historias al mes");
    await expect(page.locator("body")).toContainText("1 reel al mes");
    await expect(page.locator("body")).toContainText("partner de clinera.io");
    await expect(page.locator("body")).toContainText("10%");
    await expect(page.locator("body")).toContainText("3 meses");
    await expect(page.locator("body")).not.toContainText("15%");
    await expect(page.locator("#convenio-doctores")).toContainText("Postula");
    await expect(page.locator("#convenio-doctores")).toContainText("No es automático");
    await expect(page.locator("#convenio-doctores")).toContainText("Dominio");
    await expect(page.locator("#convenio-doctores a.partner-cta-primary")).toHaveAttribute(
      "href",
      PARTNERS_DOCTORS_HREF,
    );
  });

  test("el footer apunta a /partners, no a /agencias", async ({ page }) => {
    await page.goto("/partners");
    const partners = page.locator("footer").getByRole("link", { name: "Partners" });
    await expect(partners).toHaveAttribute("href", "/partners");
    await expect(
      page.locator("footer").getByRole("link", { name: "Agencias" }),
    ).toHaveCount(0);
  });
});

test.describe("redirect /agencias → /partners", () => {
  test("308 permanente y el visitante aterriza en /partners", async ({
    page,
    request,
  }) => {
    const res = await request.get("/agencias", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/partners");

    await page.goto("/agencias");
    expect(new URL(page.url()).pathname).toBe("/partners");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("redirect /presentacion-agencia → /presentacion-partners", () => {
  test("308 permanente hacia el deck nuevo", async ({ page, request }) => {
    const res = await request.get("/presentacion-agencia", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/presentacion-partners");

    await page.goto("/presentacion-agencia");
    expect(new URL(page.url()).pathname).toBe("/presentacion-partners");
    await expect(page.locator(".slide.active")).toContainText("US$ 150");
    await expect(page.locator("body")).toContainText("10%");
    await expect(page.locator("body")).not.toContainText("15%");
  });
});

test.describe("/api/convenio-doctores", () => {
  test("un body vacío se rechaza; el SMTP no se filtra al cliente", async ({
    request,
    page,
  }) => {
    const res = await request.post("/api/convenio-doctores", { data: {} });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.errores.length).toBeGreaterThan(0);
    expect(JSON.stringify(json)).not.toContain("SMTP_PASS");

    await page.goto("/partners");
    const html = await page.content();
    expect(html).not.toContain("SMTP_PASS");
    expect(html).not.toContain("SMTP_USER");
  });
});
