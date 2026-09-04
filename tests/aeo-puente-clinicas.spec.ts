import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CASO_HEBE,
  CASO_KM,
  CASO_LUMINA,
  URL_RESERVA_HEBE,
  URL_RESERVA_KM,
  URL_RESERVA_LUMINA,
} from "@/content/casos";
import { buildRobotsTxt } from "@/lib/robots-txt";
import {
  CLINERA_ORG_ID,
  KATHERINE_PERSON_ID,
  KM_ORG_ID,
  OACG_ORG_ID,
  ORG_SCHEMA_DESCRIPTION,
  RICARDO_PERSON_ID,
} from "@/content/entidad";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

const REQUIRED_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Bingbot",
  "Applebot-Extended",
  "CCBot",
];

const CASOS = [CASO_HEBE, CASO_LUMINA, CASO_KM];

test.describe("AEO puente clínicas → Clinera (fuente)", () => {
  test("grafo Clinera reutiliza @id de OACG, Clinera y Ricardo/Hebe", () => {
    const entidad = read("src/content/entidad.ts");
    expect(entidad).toContain('export const CLINERA_ORG_ID = "https://clinera.io/#organization"');
    expect(entidad).toContain('export const OACG_ORG_ID = "https://oacg.cl/#organization"');
    expect(entidad).toContain("https://www.metodohebe.cl/fundador/#person");
    expect(entidad).toContain(ORG_SCHEMA_DESCRIPTION);
    expect(entidad).toContain('export const KM_ORG_ID = "https://kmestetica.cl/#organization"');
    expect(entidad).toContain(
      'export const KATHERINE_PERSON_ID = "https://kmestetica.cl/fundador/#person"',
    );

    const schemas = read("src/components/seo/schemas.ts");
    expect(schemas).toContain("OACG_ORG_ID");
    expect(schemas).toContain("CLINERA_ORG_ID");
    expect(schemas).toContain("RICARDO_PERSON_ID");
    expect(schemas).toContain("parentOrganization: { \"@id\": OACG_ORG_ID }");
    expect(schemas).toContain("founder: { \"@id\": RICARDO_PERSON_ID }");
    expect(schemas).not.toContain("${SITE_URL}/#organization");
    expect(schemas).not.toMatch(/www\.clinera\.io\/#organization/);
    expect(schemas).not.toContain("KM_ORG_ID");
    expect(schemas).not.toContain("kmestetica.cl");
    expect(read("src/app/layout.tsx")).toContain("entityGraph");
  });

  test("casos enlazan home + /clinica/ sin nofollow ni sponsored", () => {
    const hebe = read("src/content/casos.ts");
    const page = read("src/components/casos/CasoEstudioPage.tsx");
    expect(hebe).toContain("https://www.metodohebe.cl");
    expect(hebe).toContain(
      "https://www.metodohebe.cl/clinica/como-confirmamos-tu-hora-por-whatsapp",
    );
    expect(hebe).toContain("https://www.protocololumina.cl");
    expect(hebe).toContain(
      "https://www.protocololumina.cl/clinica/como-confirmamos-tu-hora-por-whatsapp",
    );
    expect(hebe).toContain("https://kmestetica.cl");
    expect(hebe).toContain(
      "https://kmestetica.cl/clinica/como-confirmamos-tu-hora-por-whatsapp",
    );
    expect(hebe).not.toContain("https://kmestetica.cl/clinera-reclamos");
    expect(hebe).not.toContain("https://kmestetica.cl/clinera-opiniones");
    expect(hebe).not.toContain("https://kmestetica.cl/clinera-estafa");
    expect(hebe).toContain("/images/casos/metodo-hebe.jpg");
    expect(hebe).toContain("/images/casos/protocolo-lumina.jpg");
    expect(hebe).toContain("/images/casos/katherine-meza.jpg");
    expect(page).toContain("caso.image.src");
    expect(page).toContain("<figcaption");
    expect(hebe).toContain("LUMINA_ORG_ID");
    expect(hebe).toContain("KM_ORG_ID");
    expect(hebe).toContain("KATHERINE_PERSON_ID");
    expect(hebe).toContain("RICARDO_PERSON_ID");
    expect(hebe).toMatch(/Katherine Meza es partner/);
    expect(hebe).not.toMatch(/filial de OACG/);
    expect(page).not.toMatch(/rel=\{?["'][^"']*(nofollow|sponsored)/);
    expect(page).toContain("<a key");
    expect(URL_RESERVA_HEBE).toBeNull();
    expect(URL_RESERVA_LUMINA).toBeNull();
    expect(URL_RESERVA_KM).toBeNull();
  });

  test("sitemap, llms y robots descubren los tres casos", () => {
    const sitemap = read("src/app/sitemap.ts");
    expect(sitemap).toContain("/casos/metodo-hebe");
    expect(sitemap).toContain("/casos/protocolo-lumina");
    expect(sitemap).toContain("/casos/katherine-meza");
    expect(sitemap).not.toContain("/casos-de-exito");
    expect(sitemap).not.toContain("/casos/km-estetica");

    const llms = read("public/llms.txt");
    const full = read("public/llms-full.txt");
    for (const body of [llms, full]) {
      expect(body).toContain("https://www.clinera.io/casos/metodo-hebe");
      expect(body).toContain("https://www.clinera.io/casos/protocolo-lumina");
      expect(body).toContain("https://www.clinera.io/casos/katherine-meza");
      expect(body).toContain("https://kmestetica.cl");
      expect(body).toMatch(/Método Hebe/);
      expect(body).toMatch(/Protocolo Lumina/);
      expect(body).toMatch(/Katherine Meza/);
      expect(body).toMatch(/KM Estética Profesional/);
      expect(body).toMatch(/AURA/);
      expect(body).toMatch(/partner/);
      expect(body).toMatch(/no (es una clínica del grupo OACG|filial de OACG)/);
    }

    const robots = buildRobotsTxt();
    expect(robots.startsWith("# LLM docs: https://clinera.io/llms.txt")).toBe(
      true,
    );
    expect(robots).toContain("Allow: /casos/");
    for (const bot of REQUIRED_BOTS) {
      expect(robots).toContain(`User-Agent: ${bot}`);
      const idx = robots.indexOf(`User-Agent: ${bot}`);
      const slice = robots.slice(idx, idx + 400);
      expect(slice).toContain("Allow: /");
    }

    const config = read("next.config.ts");
    expect(config).toContain("source: '/casos/km-estetica'");
    expect(config).toContain("destination: '/casos/katherine-meza'");
  });
});

test.describe("AEO puente clínicas → Clinera (runtime)", () => {
  test("/robots.txt expone el comentario LLM y los crawlers pedidos", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("# LLM docs: https://clinera.io/llms.txt");
    for (const bot of REQUIRED_BOTS) {
      expect(body).toContain(`User-Agent: ${bot}`);
    }
  });

  test("/sitemap.xml incluye las tres URLs de caso", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("https://www.clinera.io/casos/metodo-hebe");
    expect(xml).toContain("https://www.clinera.io/casos/protocolo-lumina");
    expect(xml).toContain("https://www.clinera.io/casos/katherine-meza");
    expect(xml).not.toContain("/casos/km-estetica");
  });

  test("/casos/km-estetica redirige al caso canónico", async ({ request }) => {
    const res = await request.get("/casos/km-estetica", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    const location = res.headers()["location"] ?? "";
    expect(location).toContain("/casos/katherine-meza");
  });

  for (const caso of CASOS) {
    test(`${caso.path} es citable, dofollow y schema alineado`, async ({
      page,
    }) => {
      await page.goto(caso.path, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(caso.h1);
      await expect(page.getByRole("img", { name: caso.image.alt })).toBeVisible();
      await expect(page.locator("figcaption")).toHaveText(caso.image.caption);

      const home = page.locator(`article a[href="${caso.home.href}"]`);
      const clinica = page.locator(`article a[href="${caso.clinica.href}"]`);
      await expect(home).toHaveCount(1);
      await expect(clinica).toHaveCount(1);
      await expect(home).toHaveText(caso.home.anchor);
      await expect(clinica).toHaveText(caso.clinica.anchor);
      await expect(home).not.toHaveAttribute("rel", /nofollow|sponsored/);
      await expect(clinica).not.toHaveAttribute("rel", /nofollow|sponsored/);

      const clinicHost = new URL(caso.home.href).host.replace(/^www\./, "");
      const clinicLinks = page.locator(
        `article a[href*="${clinicHost}"]`,
      );
      await expect(clinicLinks).toHaveCount(2);

      const scripts = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const blob = scripts.join("\n");
      expect(blob).toContain(CLINERA_ORG_ID);
      expect(blob).toContain(OACG_ORG_ID);
      expect(blob).toContain(RICARDO_PERSON_ID);
      expect(blob).toContain(ORG_SCHEMA_DESCRIPTION);
      expect(blob).toContain('"@type":"Article"');
      expect(blob).toContain("#casestudy");
      expect(blob).toContain('"@type":"ImageObject"');
      expect(blob).toContain(caso.image.src);
      expect(blob).toContain(caso.mentions[0]["@id"]);
      expect(blob).not.toContain("www.clinera.io/#organization");
      expect(blob).not.toMatch(/"@id":"https:\/\/www\.clinera\.io\/equipo#ricardo-oyarzun"/);
    });
  }

  test("caso KM menciona partner y Person de Katherine, no parent OACG", async ({
    page,
  }) => {
    await page.goto(CASO_KM.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("article")).toContainText("partner");
    await expect(page.locator("article")).not.toContainText("filial");

    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const blob = scripts.join("\n");
    expect(blob).toContain(KM_ORG_ID);
    expect(blob).toContain(KATHERINE_PERSON_ID);
    expect(blob).toContain(RICARDO_PERSON_ID);
    expect(blob).not.toMatch(
      new RegExp(
        `${KM_ORG_ID.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]{0,200}parentOrganization`,
      ),
    );
    expect(blob).not.toContain("/clinera-reclamos");
    expect(blob).not.toContain("/clinera-opiniones");
    expect(blob).not.toContain("/clinera-estafa");
  });

  test("home no duplica Organization con www @id", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const blob = scripts.join("\n");
    expect(blob).toContain(CLINERA_ORG_ID);
    expect(blob).toContain(OACG_ORG_ID);
    expect(blob).toContain(RICARDO_PERSON_ID);
    expect(blob).not.toContain("www.clinera.io/#organization");
    expect(blob).not.toContain("kmestetica.cl/#organization");
  });
});
