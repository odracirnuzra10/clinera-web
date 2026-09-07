import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Clinera Intelligence en /presentacion (sep 2026): el WOW son 3 diapos
 * con pregunta + gráfico. El QR «Prueba tú mismo» ya no va.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);

test.describe("Clinera Intelligence en /presentacion", () => {
  test("ya no hay QR de prueba en vivo", () => {
    expect(html).not.toContain('id="demostracion"');
    expect(html).not.toMatch(/Prueba tú mismo/i);
    expect(html).not.toContain("clinera-ai-whatsapp-qr");
    expect(html).not.toContain("wa.me/56953230056");
  });

  test("tres diapos con las tres preguntas y sus gráficos", () => {
    expect(html).toContain('id="inteligencia"');
    expect(html).toContain('id="inteligencia-deudas"');
    expect(html).toContain('id="inteligencia-profesionales"');

    expect(html).toMatch(/¿Cuánto vendí el mes pasado\?/);
    expect(html).toMatch(/¿Qué pacientes me deben dinero\?/);
    expect(html).toMatch(/¿Qué profesional ha vendido más\?/);

    const ventas = html.slice(
      html.indexOf('id="inteligencia"'),
      html.indexOf('id="inteligencia-deudas"'),
    );
    expect(ventas).toContain("agent-bars");
    expect(ventas).toMatch(/Trifásico|Botox|Rellenos/);

    const deudas = html.slice(
      html.indexOf('id="inteligencia-deudas"'),
      html.indexOf('id="inteligencia-profesionales"'),
    );
    expect(deudas).toContain("agent-rank");
    expect(deudas).toMatch(/\$186\.000/);

    const pros = html.slice(html.indexOf('id="inteligencia-profesionales"'));
    expect(pros).toContain("agent-rank");
    expect(pros).toMatch(/Dra\. Daniela Araya/);
  });

  test("las tres diapos se abren en el deck", async ({ page }) => {
    await page.goto("/presentacion#inteligencia", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("#inteligencia")).toHaveClass(/active/);
    await expect(
      page.getByText("¿Cuánto vendí el mes pasado?").first(),
    ).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#inteligencia-deudas")).toHaveClass(/active/);
    await expect(
      page.getByText("¿Qué pacientes me deben dinero?").first(),
    ).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#inteligencia-profesionales")).toHaveClass(
      /active/,
    );
    await expect(
      page.getByText("¿Qué profesional ha vendido más?").first(),
    ).toBeVisible();
  });
});
