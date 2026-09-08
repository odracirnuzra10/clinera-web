import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Quiénes somos (#origen) y por qué Clinera (#por-que-clinera) van justo
 * después del hero y antes de AURA (Ricardo, sep 2026). Las razones vienen
 * de la tarea Todoist «Optimizar presentación ¿por qué Clinera…?».
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);

function slideChunk(id: string): string {
  const start = html.indexOf(`id="${id}"`);
  expect(start).toBeGreaterThan(-1);
  const end = html.indexOf("</section>", start);
  return html.slice(start, end);
}

test.describe("Origen y por qué Clinera en /presentacion", () => {
  test("origen y por-que-clinera existen, en ese orden, antes de AURA", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(
      (m) => m[1],
    );
    const origen = ids.indexOf("origen");
    const porQue = ids.indexOf("por-que-clinera");
    const aura = ids.indexOf("aura");
    expect(origen).toBeGreaterThan(-1);
    expect(porQue).toBeGreaterThan(-1);
    expect(aura).toBeGreaterThan(-1);
    expect(origen).toBeLessThan(porQue);
    expect(porQue).toBeLessThan(aura);
  });

  test("la historia y las cuatro razones están en el HTML", () => {
    const origen = slideChunk("origen");
    const porQue = slideChunk("por-que-clinera");

    expect(origen).toMatch(/agencia/i);
    expect(origen).toContain("2017");
    expect(origen).toContain("Método Hebe");
    expect(origen).toContain("Protocolo Lumina");
    expect(origen).toMatch(/octubre de 2025/);

    expect(porQue).toContain("Contacto 100 % personalizado");
    expect(porQue).toContain("Implementación con un ingeniero");
    expect(porQue).toContain("Escuchamos y entendemos al cliente");
    expect(porQue).toContain("Unificamos tu operación, a tu medida");
  });

  test("no nombran competidores, Open Factura ni cobros/conciliación", () => {
    const origen = slideChunk("origen");
    const porQue = slideChunk("por-que-clinera");
    const ban =
      /Reservo|AgendaPro|Medilink|Dentalink|Dentalsoft|Open Factura|cobros|conciliación/i;
    expect(origen).not.toMatch(ban);
    expect(porQue).not.toMatch(ban);
  });

  test("el deck no usa voseo argentino", () => {
    expect(html).not.toMatch(/\b(hacé|agendá|tenés|podés|sos)\b/);
  });

  test("por-que-clinera abre con el heading y cuatro razones", async ({
    page,
  }) => {
    await page.goto("/presentacion#por-que-clinera", {
      waitUntil: "domcontentloaded",
    });
    const slide = page.locator("#por-que-clinera");
    await expect(slide).toHaveClass(/active/);
    await expect(
      slide.getByRole("heading", {
        name: /¿Por qué Clinera y no otro software\?/i,
      }),
    ).toBeVisible();
    await expect(slide.locator(".hr-item")).toHaveCount(4);
    for (const item of await slide.locator(".hr-item").all()) {
      await expect(item).toBeVisible();
    }
  });

  test("origen abre con el heading y tres pasos", async ({ page }) => {
    await page.goto("/presentacion#origen", { waitUntil: "domcontentloaded" });
    const slide = page.locator("#origen");
    await expect(slide).toHaveClass(/active/);
    await expect(
      slide.getByRole("heading", { name: /Somos clínicas/i }),
    ).toBeVisible();
    await expect(slide.locator(".og-step")).toHaveCount(3);
    for (const step of await slide.locator(".og-step").all()) {
      await expect(step).toBeVisible();
    }
  });
});
