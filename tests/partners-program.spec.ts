import { expect, test } from "@playwright/test";
import {
  PARTNERS_CANONICAL,
  PARTNERS_COMMISSION_DURATION_LABEL,
  PARTNERS_COMMISSION_LABEL,
  PARTNERS_COMMISSION_MONTHS,
  PARTNERS_COMMISSION_PERCENT,
  PARTNERS_CTA_HREF,
  PARTNERS_PATH,
  PARTNERS_REFERRAL_FEE_LABEL,
  PARTNERS_REFERRAL_FEE_USD,
} from "@/content/partners-program";

test.describe("fuente de verdad del programa partner", () => {
  test("los números públicos son US$ 150 + 10% por 6 meses", () => {
    expect(PARTNERS_REFERRAL_FEE_USD).toBe(150);
    expect(PARTNERS_COMMISSION_PERCENT).toBe(10);
    expect(PARTNERS_COMMISSION_MONTHS).toBe(6);
    expect(PARTNERS_REFERRAL_FEE_LABEL).toBe("US$ 150");
    expect(PARTNERS_COMMISSION_LABEL).toBe("10%");
    expect(PARTNERS_COMMISSION_DURATION_LABEL).toBe("6 meses");
    expect(PARTNERS_PATH).toBe("/partners");
    expect(PARTNERS_CANONICAL).toBe("https://www.clinera.io/partners");
    expect(PARTNERS_CTA_HREF).toBe("/reunion-comercial");
  });
});

test.describe("landing /partners", () => {
  test("publica el modelo de comisión y no el 15% de descuento permanente", async ({
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
    await expect(hero.getByText("6 meses", { exact: true })).toBeVisible();
    await expect(hero.getByText("15%", { exact: true })).toHaveCount(0);

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Permanente para todos los clientes/);
    expect(body).not.toMatch(/\bEficiente\b/);
    expect(body).not.toMatch(/Agentic Pro/);

    const apply = page.getByRole("link", { name: /Aplicar al programa/ }).first();
    await expect(apply).toHaveAttribute("href", PARTNERS_CTA_HREF);
    await apply.click();
    await expect(page).toHaveURL(/\/reunion-comercial/);
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
