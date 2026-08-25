import { expect, test } from "@playwright/test";
import {
  PARTNERS_CANONICAL,
  PARTNERS_CLIENT_DISCOUNT_MONTHS,
  PARTNERS_CLIENT_DISCOUNT_PERCENT,
  PARTNERS_CTA_HREF,
  PARTNERS_PATH,
  PARTNERS_PRESENTATION_HREF,
  PARTNERS_REFERRAL_FEE_LABEL,
  PARTNERS_REFERRAL_FEE_USD,
  PARTNERS_REQUIREMENTS,
} from "@/content/partners-program";

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
    await expect(page.locator("body")).toContainText("4 historias al mes");
    await expect(page.locator("body")).toContainText("1 reel al mes");
    await expect(page.locator("body")).toContainText("partner de clinera.io");
    await expect(page.locator("body")).toContainText("10%");
    await expect(page.locator("body")).toContainText("3 meses");
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
    await expect(page.locator("body")).toContainText("10%");
    await expect(page.locator("body")).not.toContainText("15%");
  });
});
