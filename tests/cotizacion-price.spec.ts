import { expect, test } from "@playwright/test";
import { CLINERA_PLANS, SETUP_FEE_NUMBER, SETUP_FEE_USD } from "../src/content/pricing";

/**
 * El constructor de cotizaciones se movió a cotizacion.oacg.cl y `/cotizacion`
 * quedó como redirect 308 (next.config.ts), así que el test viejo —que abría
 * esa página y buscaba el toggle de configuración inicial— ya no tenía página
 * que abrir: navegaba fuera del sitio y moría.
 *
 * Lo que se cuida acá es lo que sigue viviendo en este repo:
 *   1. la ruta vieja lleva al cotizador nuevo (nadie queda en un 404),
 *   2. `/planes` comunica la estructura de pago canónica de AGENTS.md
 *      (mes 1 = implementación US$ 450, mes 2 en adelante = el plan), y
 *   3. los links de pago que se publican son EXACTAMENTE los de pricing.ts.
 *
 * Que el cotizador cobre esa misma estructura se prueba en el repo `baserow`:
 * `tests/frontend/test_cotizacion_pago.js`.
 */

test("la ruta vieja /cotizacion lleva al cotizador de cotizacion.oacg.cl", async ({ request }) => {
  const r = await request.get("/cotizacion", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers()["location"]).toBe("https://cotizacion.oacg.cl/");
});

test("la implementación sigue valiendo USD 450 en la fuente única", () => {
  expect(SETUP_FEE_USD).toBe(450);
  expect(SETUP_FEE_NUMBER).toBe("450");
});

test("/planes cobra en secuencia: mes 1 implementación, mes 2 en adelante el plan", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  const precios = page.locator("#precios");
  await expect(precios.getByText("Mes 1 · Implementación").first()).toBeVisible();
  await expect(precios.getByText(`$${SETUP_FEE_NUMBER}`).first()).toBeVisible();
  await expect(precios.getByText("Mes 2 en adelante").first()).toBeVisible();
});

test("los links de pago de /planes son los de pricing.ts, sin copias sueltas", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });

  // /planes abre en semestral: el botón tiene que llevar el link SEMESTRAL.
  // Cruzar los dos (mensual mostrando precio semestral o al revés) es el error
  // que este check existe para atrapar.
  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="semester"]`);
    await expect(boton).toHaveAttribute("href", plan.stripeSemester);
  }

  await page.getByRole("button", { name: /mensual/i }).first().click();
  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="monthly"]`);
    await expect(boton).toHaveAttribute("href", plan.stripe);
  }
});
