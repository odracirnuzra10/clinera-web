import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Deck interno del modelo de venta en dos reuniones. Una idea por slide,
 * máximo 12, tuteo chileno, rango de precio en R1 (nunca el número exacto).
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion-venta-2-reuniones.html"),
  "utf8",
);

const slideCount = (html.match(/<section class="slide/g) ?? []).length;

test.describe("venta en dos reuniones — contrato del deck", () => {
  test("cabe en 12 slides y es un HTML standalone", () => {
    expect(slideCount).toBeGreaterThanOrEqual(10);
    expect(slideCount).toBeLessThanOrEqual(12);
    expect(html).toContain("noindex");
    expect(html).not.toMatch(/font-family:\s*['"]?Inter/);
    expect(html).not.toMatch(/\b(hacé|agendá|confirmá|volvé|mostrá|tenés|sos |podés)\b/i);
  });

  test("califica quién va a dos reuniones y quién no", () => {
    expect(html).toContain("Va a dos reuniones");
    expect(html).toContain("Va a una sola reunión");
    expect(html).toContain("Clínica multi-sucursal");
    expect(html).toContain("Decisión compartida");
    expect(html).toMatch(/Lead frío/);
    expect(html).toContain("Clínica de una sucursal");
    expect(html).toMatch(/dueña decide sola/i);
    expect(html).toMatch(/Lead caliente/);
    expect(html).toMatch(/Si ya estaba lista para comprar, no la alargues/);
  });

  test("R1 muestra rango, no precio exacto, y agenda R2 en vivo", () => {
    expect(html).toContain("USD 279");
    expect(html).toContain("USD 479");
    expect(html).toMatch(/Nunca “te escribo”/);
    expect(html).toMatch(/precio exacto/i);
    expect(html).toMatch(/2 o 3 funciones/);
    expect(html).toContain("Máximo 72 horas");
    expect(html).toMatch(/el que firma/i);
    expect(html).toMatch(/tasa de cierre/i);
    expect(html).toMatch(/primer contacto hasta la firma/i);
  });

  test("el gancho de R2 es el dato de la clínica, no más software", () => {
    expect(html).toMatch(/Vuelve por/);
    expect(html).toMatch(/su número/);
    expect(html).toMatch(/no-show/);
    expect(html).toMatch(/se descarta/);
  });

  test("abre, pinta la portada y navega con el teclado", async ({ page }) => {
    await page.goto("/presentacion-venta-2-reuniones", {
      waitUntil: "domcontentloaded",
    });
    const cover = page.locator("#portada");
    await expect(cover).toHaveClass(/active/);
    await expect(
      page.getByRole("heading", { name: /Venta en/i }),
    ).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#problema")).toHaveClass(/active/);

    await page.goto("/presentacion-venta-2-reuniones#calificacion", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("#calificacion")).toHaveClass(/active/);
    await expect(page.getByText("Va a dos reuniones")).toBeVisible();
    await expect(page.getByText("Va a una sola reunión")).toBeVisible();
  });
});
