import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Rediseño del deck /presentacion según informe de Rebeca (ago 2026):
 * AURA tras origen y razones (ya no es la 2.ª), sin logos de clientes en el
 * hero, sin cobros/conciliación/exámenes, sin inventario de funciones,
 * migración como "Red de Seguridad". #canales y #empleados-digitales se
 * mantienen (guardians propios). Origen + por-qué: tests/presentacion-por-que-clinera.spec.ts.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);

const slideOrder = [
  "clinera",
  "origen",
  "por-que-clinera",
  "aura",
  "intelligence",
  "la-fuga",
  "inteligencia",
  "inteligencia-deudas",
  "inteligencia-profesionales",
  "empleados-digitales",
  "canales",
  "normativa",
  "migracion",
];

test.describe("Rediseño Rebeca del deck /presentacion", () => {
  test("el orden pone AURA antes de módulos y métricas", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(
      (m) => m[1],
    );
    const deck = ids.filter((id) => slideOrder.includes(id));
    expect(deck).toEqual(slideOrder);
    expect(html).not.toContain('id="veredicto"');
    expect(html).not.toContain('id="herramientas"');
  });

  test("el hero no muestra clínicas/clientes y abre con métricas", () => {
    const body = html.slice(html.indexOf("<body>"));
    expect(body).not.toContain("hero-clients-label");
    expect(body).not.toContain("Clínicas que ya operan con Clinera");
    expect(body).not.toContain("Sanatorio Alemán");
    expect(html).toContain("hero-metrics");
    expect(html).toContain("US$&nbsp;1.500");
  });

  test("AURA es el corazón y no promete cobros", () => {
    expect(html).toMatch(/EL CORAZÓN DE CLINERA/);
    expect(html).toMatch(/Empleado Digital 24\/7/);
    expect(html).not.toMatch(/Cobros y conciliación/i);
    expect(html).not.toMatch(/Cobra y recupera/);
    expect(html).not.toMatch(/agenda y cobra/i);
    expect(html).not.toMatch(/>Pagos</);
    expect(html).not.toMatch(/Exámenes/);
    expect(html).toContain("aura-channels");
  });

  test("migración habla de Red de Seguridad, no de solapamiento ni pagos", () => {
    expect(html).toContain("7 días de Red de Seguridad");
    expect(html).toContain("Semana de Transición");
    expect(html).not.toContain("solapamiento");
    const migStart = html.indexOf('id="migracion"');
    const migEnd = html.indexOf("</section>", migStart);
    const mig = html.slice(migStart, migEnd);
    expect(mig).not.toMatch(/\bpagos\b/i);
  });

  test("abre en el hero oscuro y AURA es la cuarta diapositiva", async ({
    page,
  }) => {
    await page.goto("/presentacion", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#clinera")).toHaveClass(/active/);
    await expect(page.locator("#clinera")).toHaveClass(/blk-dark/);
    await expect(page.getByText("US$ 1.500").first()).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#origen")).toHaveClass(/active/);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#aura")).toHaveClass(/active/);
    await expect(
      page.getByRole("heading", { name: /Empleado Digital 24\/7/i }),
    ).toBeVisible();
  });
});
