import { expect, test } from "@playwright/test";
import { getPartner } from "@/lib/partners";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

test.describe("atribución del partner en WhatsApp", () => {
  test("el mensaje lleva nombre, ref y no se acorta", () => {
    const partner = getPartner("katherine");
    expect(partner).toBeTruthy();
    const message = buildWhatsAppMessage(partner!);
    expect(message).toBe(
      "Hola Rebeca, vengo de parte de Katherine Meza (ref: KATHE01). Quiero saber cómo funciona Clinera en mi clínica.",
    );
    const url = buildWhatsAppUrl(partner!);
    expect(url.startsWith("https://wa.me/56965810649?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("ref: KATHE01"));
    expect(decodeURIComponent(url)).toContain(message);
  });
});

test.describe("landing /p/katherine", () => {
  test("el CTA del hero se ve en iPhone SE sin hacer scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/p/katherine");
    const cta = page.getByRole("link", { name: "Hablar con Rebeca por WhatsApp" }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toBeInViewport();
    await expect(cta).toHaveAttribute("href", /wa\.me\/56965810649/);
    await expect(cta).toHaveAttribute("href", /KATHE01/);
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", /noopener/);
  });

  test("no publica precios ni planes", async ({ page }) => {
    await page.goto("/p/katherine");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/USD\s*\d/);
    expect(body).not.toMatch(/US\$\s*\d/);
    expect(body).not.toMatch(/\bVortex\b/);
    expect(body).not.toMatch(/\bAtlas\b/);
    expect(body).not.toMatch(/\bSummit\b/);
    expect(body).not.toMatch(/\b279\b/);
    expect(body).not.toMatch(/\b379\b/);
    expect(body).not.toMatch(/\b479\b/);
    expect(body).not.toMatch(/\b450\b/);
  });

  test("un slug que no existe responde 404", async ({ request }) => {
    const res = await request.get("/p/no-existe");
    expect(res.status()).toBe(404);
  });
});

test.describe("kit /p/katherine/kit", () => {
  test("no es indexable y trae el link, el ref y el QR", async ({ page }) => {
    await page.goto("/p/katherine/kit");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
    await expect(page.getByText("https://www.clinera.io/p/katherine")).toBeVisible();
    await expect(page.getByText("KATHE01")).toBeVisible();
    await expect(page.getByRole("img", { name: /QR del link de Katherine Meza/ })).toBeVisible();
  });
});
