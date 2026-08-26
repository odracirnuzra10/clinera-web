import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 1 cuenta Clinera = 1 WhatsApp + 1 Instagram + 1 Facebook.
 * Es el recorte comercial de canales del deck de ventas. Si se diluye en un
 * bullet de AURA, en la demo se asume que una cuenta ata N números.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);

test.describe("1 cuenta Clinera = 1 canal de cada red", () => {
  test("el deck publica la equivalencia en una diapositiva propia", () => {
    expect(html).toContain('id="canales"');
    expect(html).toMatch(/1 cuenta Clinera\s*=/);
    expect(html).toContain("1 WhatsApp");
    expect(html).toContain("1 Instagram");
    expect(html).toContain("1 Facebook");
    expect(html).toMatch(/una cuenta Clinera por cada uno/i);
  });

  test("la diapositiva #canales muestra la regla al abrirla", async ({
    page,
  }) => {
    await page.goto("/presentacion#canales", { waitUntil: "domcontentloaded" });
    const slide = page.locator("#canales");
    await expect(slide).toHaveClass(/active/);
    await expect(
      slide.getByRole("heading", { name: /1 cuenta Clinera/i }),
    ).toBeVisible();
    await expect(slide.getByText("Un número", { exact: true })).toBeVisible();
    await expect(slide.getByText("Una cuenta", { exact: true })).toHaveCount(2);
    await expect(
      slide.getByText(/una cuenta Clinera por cada uno/i),
    ).toBeVisible();
  });
});
