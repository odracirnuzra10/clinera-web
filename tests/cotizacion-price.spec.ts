import { expect, test } from "@playwright/test";

test("la cotización usa USD 450 para la configuración inicial", async ({ page }) => {
  await page.goto("/cotizacion", { waitUntil: "domcontentloaded" });

  const setupToggle = page.locator("label").filter({
    hasText: "Incluir configuración inicial",
  });
  await expect(setupToggle).toContainText("450,00");

  const setupRow = page.getByRole("row").filter({
    hasText: "Configuración inicial",
  });
  await expect(setupRow).toContainText("450,00");
});
