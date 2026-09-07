import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildRobotsTxt } from "@/lib/robots-txt";
import { SLIDES } from "@/app/vision-2027/slides";

const deckCss = readFileSync(
  join(process.cwd(), "src/app/vision-2027/vision.css"),
  "utf8",
);
const deckTsx = readFileSync(
  join(process.cwd(), "src/app/vision-2027/VisionDeck.tsx"),
  "utf8",
);

test.describe("/vision-2027 — deck interno", () => {
  test("es interno: noindex, fuera de sitemap y de robots", async ({
    page,
    request,
  }) => {
    const res = await page.goto("/vision-2027", { waitUntil: "domcontentloaded" });
    expect(res?.ok()).toBeTruthy();
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
    await expect(robots).toHaveAttribute("content", /nofollow/);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("/vision-2027");

    const robotsTxt = buildRobotsTxt();
    expect(robotsTxt).toContain("Disallow: /vision-2027");
  });

  test("no aparece en la navegación pública", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nav = await page.locator("header").innerText();
    expect(nav.toLowerCase()).not.toContain("vision-2027");
    expect(nav.toLowerCase()).not.toContain("visión 2027");
  });

  test("trae las 18 slides del brief, sin voseo ni Inter", async ({ page }) => {
    expect(SLIDES).toHaveLength(18);
    expect(deckCss).not.toMatch(/font-family:\s*['"]?Inter/);
    expect(deckTsx).not.toMatch(/\b(hacé|agendá|confirmá|volvé|mostrá|tenés|sos |podés)\b/i);

    await page.goto("/vision-2027", { waitUntil: "domcontentloaded" });
    for (const slide of SLIDES) {
      await expect(page.locator(`#${slide.id}`)).toBeAttached();
    }

    await expect(page.locator("#portada-title")).toContainText("2027");
    await expect(page.locator("#portada")).toContainText(
      "De software para clínicas a la red de pacientes",
    );
    await expect(page.locator("#portada")).toContainText(
      "Visión interna · Septiembre 2026 · Ricardo Oyarzún",
    );
    await expect(page.locator("#tesis")).toContainText("Google de las clínicas");
    await expect(page.locator("#notificaciones")).toContainText(
      "Quienes difunden la app son las",
    );
    await expect(page.locator("#cierre")).toContainText(
      "si no está en Clinera está",
    );
    await expect(page.locator("#paciente")).toContainText("Notas internas: nunca");
    await expect(page.locator("#difusion")).toContainText("Toda difusión tiene");
  });

  test("navega de slide en slide con el teclado", async ({ page }) => {
    await page.goto("/vision-2027", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#portada")).toBeInViewport();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#donde-estamos")).toBeInViewport();

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#portada")).toBeInViewport();
  });
});

test.describe("anexo Mi Clinera", () => {
  test("especificación y mockup son internos", async ({ page }) => {
    const spec = await page.goto("/internal/mi-clinera/especificacion", {
      waitUntil: "domcontentloaded",
    });
    expect(spec?.ok()).toBeTruthy();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.getByRole("heading", { name: /Mi Clinera, versión 1/ })).toBeVisible();

    const mock = await page.goto("/internal/mi-clinera/mockup", {
      waitUntil: "domcontentloaded",
    });
    expect(mock?.ok()).toBeTruthy();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(
      page.getByRole("heading", { name: /Un usuario, todas sus clínicas/ }),
    ).toBeVisible();
  });
});
