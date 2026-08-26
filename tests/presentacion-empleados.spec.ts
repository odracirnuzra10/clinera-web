import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * En el deck, AURA está disponible hoy; CAMILA y LIA salen en octubre 2026.
 * El lead no puede volver a decir "Disponibles hoy" sobre las tres.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);

test.describe("CAMILA y LIA próximamente octubre 2026", () => {
  test("el deck no vende las tres como disponibles hoy", () => {
    expect(html).not.toMatch(/Disponibles hoy/);
    expect(html.match(/Próximamente · octubre 2026/g)?.length).toBe(2);
    expect(html).toContain("Disponible hoy");
  });

  test("la diapositiva #empleados-digitales marca el recorte", async ({
    page,
  }) => {
    await page.goto("/presentacion#empleados-digitales", {
      waitUntil: "domcontentloaded",
    });
    const slide = page.locator("#empleados-digitales");
    await expect(slide).toHaveClass(/active/);
    await expect(slide.getByText("Próximamente · octubre 2026")).toHaveCount(2);
    await expect(slide.getByText("Disponible hoy", { exact: true })).toBeVisible();
    await expect(slide.locator(".ed-agent-now")).toHaveCount(1);
    await expect(slide.locator(".ed-agent-soon")).toHaveCount(2);
  });
});
