import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Deck interno del modelo de venta en dos reuniones. Titulares, sin texto
 * chico, máximo 12 slides, tuteo chileno. Por defecto todos van a dos:
 * R1 exploración, R2 cierre con gerente de operaciones.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion-venta-2-reuniones.html"),
  "utf8",
);

const slideCount = (html.match(/<section class="slide/g) ?? []).length;

test.describe("venta en dos reuniones — contrato del deck", () => {
  test("cabe en 12 slides, standalone, sin texto chico", () => {
    expect(slideCount).toBeGreaterThanOrEqual(8);
    expect(slideCount).toBeLessThanOrEqual(12);
    expect(html).toContain("noindex");
    expect(html).toContain("https://www.clinera.io/nueva-reunion");
    expect(html).not.toMatch(/font-family:\s*['"]?Inter/);
    expect(html).not.toMatch(/font-size:\s*1[0-5]px/);
    expect(html).not.toMatch(/\b(hacé|agendá|confirmá|volvé|mostrá|tenés|sos |podés)\b/i);
  });

  test("por defecto todos van a dos reuniones", () => {
    expect(html).toMatch(/reunión inicial de\s+<span class="g">exploración/i);
    expect(html).toMatch(/reunión de\s+<span class="g">cierre/i);
    expect(html).toMatch(/Todos van a\s+<span class="g">dos reuniones/i);
    expect(html).toMatch(/Una sola, solo si el cliente lo pide/);
    expect(html).toMatch(/gerente de operaciones/i);
    expect(html).not.toContain("Clínica multi-sucursal");
    expect(html).not.toMatch(/Lead frío/);
    expect(html).not.toMatch(/Lead caliente/);
    expect(html).not.toMatch(/Si ya estaba lista para comprar/);
  });

  test("R1 muestra rango, no precio exacto, y agenda R2 en vivo", () => {
    expect(html).toContain("USD 279");
    expect(html).toContain("USD 479");
    expect(html).toMatch(/Nunca “te escribo”/);
    expect(html).toMatch(/precio exacto/i);
    expect(html).toMatch(/2 o 3 funciones/);
    expect(html).toContain("Máximo 72 horas");
    expect(html).toMatch(/tasa de cierre/i);
    expect(html).toMatch(/días hasta la firma/i);
  });

  test("R1 es exploración y R2 es cierre", () => {
    expect(html).toMatch(/R1 explora/);
    expect(html).toMatch(/R2 cierra/);
    expect(html).toMatch(/exploración/);
    expect(html).toMatch(/gerente de operaciones/);
  });

  test("abre, pinta la portada y navega con el teclado", async ({ page }) => {
    await page.goto("/nueva-reunion", {
      waitUntil: "domcontentloaded",
    });
    const cover = page.locator("#portada");
    await expect(cover).toHaveClass(/active/);
    await expect(
      page.getByRole("heading", { name: /Venta en/i }),
    ).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#problema")).toHaveClass(/active/);

    await page.goto("/nueva-reunion#calificacion", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("#calificacion")).toHaveClass(/active/);
    await expect(
      page.locator("#calificacion").getByRole("heading", { name: /Todos van a/i }),
    ).toBeVisible();
    await expect(
      page.locator("#calificacion").getByText("Una sola, solo si el cliente lo pide."),
    ).toBeVisible();
  });
});
