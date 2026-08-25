import { expect, test } from "@playwright/test";
import {
  PARTNERS_CANONICAL,
  PARTNERS_CTA_HREF,
  PARTNERS_PATH,
  PARTNERS_PRESENTATION_HREF,
  PARTNERS_REFERRAL_FEE_LABEL,
  PARTNERS_REFERRAL_FEE_USD,
} from "@/content/partners-program";

test.describe("fuente de verdad del programa partner", () => {
  test("el número público es US$ 150 de bono, sin comisión sobre el plan", () => {
    expect(PARTNERS_REFERRAL_FEE_USD).toBe(150);
    expect(PARTNERS_REFERRAL_FEE_LABEL).toBe("US$ 150");
    expect(PARTNERS_PATH).toBe("/partners");
    expect(PARTNERS_CANONICAL).toBe("https://www.clinera.io/partners");
    expect(PARTNERS_CTA_HREF).toBe("/reunion-comercial");
    expect(PARTNERS_PRESENTATION_HREF).toBe("/presentacion-partners");
  });
});

test.describe("landing /partners", () => {
  test("publica el bono de US$ 150 y no el 10% ni el 15%", async ({ page }) => {
    await page.goto("/partners");
    await expect(page).toHaveTitle(/Programa Partner/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", PARTNERS_CANONICAL);

    const hero = page.locator("section").first();
    await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(hero.getByText("US$ 150", { exact: true })).toBeVisible();
    await expect(hero.getByText("10%", { exact: true })).toHaveCount(0);
    await expect(hero.getByText("15%", { exact: true })).toHaveCount(0);

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/10%/);
    expect(body).not.toMatch(/15%/);
    expect(body).not.toMatch(/Permanente para todos los clientes/);
    expect(body).not.toMatch(/\bEficiente\b/);
    expect(body).not.toMatch(/Agentic Pro/);
    expect(body).toMatch(/US\$ 150/);

    const apply = page.getByRole("link", { name: /Aplicar al programa/ }).first();
    await expect(apply).toHaveAttribute("href", PARTNERS_CTA_HREF);
    await apply.click();
    await expect(page).toHaveURL(/\/reunion-comercial/);
    await expect(page.getByRole("heading", { name: "Hablemos de tus necesidades" })).toBeVisible();
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
    await expect(page.locator("body")).not.toContainText("10%");
    await expect(page.locator("body")).not.toContainText("15%");
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
    await expect(page.locator("body")).not.toContainText("10%");
  });
});
