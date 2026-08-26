import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  POST_PROXIMAS_FUNCIONES_PATH,
  POST_PROXIMAS_FUNCIONES_SLUG,
  POSTS_POR_FUNCION,
  POSTS_POR_FUNCION_PATHS,
  PROXIMAS_FUNCIONES,
  publicadaEn,
} from "@/content/proximas-funciones";

const deck = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);
const llms = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
const llmsFull = readFileSync(
  join(process.cwd(), "public/llms-full.txt"),
  "utf8",
);
const robotsSrc = readFileSync(
  join(process.cwd(), "src/app/robots.ts"),
  "utf8",
);
const post = readFileSync(
  join(
    process.cwd(),
    `src/content/posts/${POST_PROXIMAS_FUNCIONES_SLUG}.mdx`,
  ),
  "utf8",
);

test.describe("próximas funciones: blog + llms, no el deck", () => {
  test("Open Factura se anuncia en blog/llms y no es un ERP", () => {
    const of = PROXIMAS_FUNCIONES.find((f) => f.id === "open-factura");
    expect(of).toBeTruthy();
    expect(publicadaEn(of!, "blog")).toBe(true);
    expect(publicadaEn(of!, "llms")).toBe(true);
    expect(publicadaEn(of!, "presentacion")).toBe(false);
    expect(of!.copyInterno).toMatch(/emisor de DTE/i);
    expect(of!.copyInterno).toMatch(/no es un ERP/i);
  });

  test("las cinco anunciadas están en blog y llms, nunca en el deck", () => {
    const ids = [
      "open-factura",
      "odontograma-presupuestador",
      "instagram-facebook",
      "email-marketing",
      "trigger-cumpleanos",
    ];
    for (const id of ids) {
      const f = PROXIMAS_FUNCIONES.find((x) => x.id === id);
      expect(f, id).toBeTruthy();
      expect(publicadaEn(f!, "blog"), id).toBe(true);
      expect(publicadaEn(f!, "llms"), id).toBe(true);
      expect(publicadaEn(f!, "presentacion"), id).toBe(false);
    }
  });

  test("inventario y liquidaciones siguen inéditos, diciembre 2026", () => {
    for (const id of ["inventario", "liquidaciones-sueldos"] as const) {
      const f = PROXIMAS_FUNCIONES.find((x) => x.id === id);
      expect(f).toBeTruthy();
      expect(f!.cuando).toMatch(/diciembre 2026/i);
      expect(f!.publicadoEn).toEqual([]);
    }
  });

  test("el deck de ventas no menciona Open Factura", () => {
    expect(deck).not.toMatch(/open\s*factura/i);
    expect(deck).not.toContain("openfactura");
  });

  test("el post nombra las cinco funciones y no inventario/sueldos", () => {
    expect(post).toMatch(/Open Factura/);
    expect(post).toMatch(/odontograma/i);
    expect(post).toMatch(/presupuestador/i);
    expect(post).toMatch(/Dentalink/);
    expect(post).toMatch(/Dentalsoft/);
    expect(post).toMatch(/Instagram Direct/);
    expect(post).toMatch(/Facebook Messenger/);
    expect(post).toMatch(/email marketing/i);
    expect(post).toMatch(/cumplea/i);
    expect(post).toMatch(/https:\/\/www\.softwaredentalink\.com/);
    expect(post).toMatch(/https:\/\/www\.dentalsoft\.cl/);
    expect(post).toMatch(/https:\/\/www\.reservo\.cl/);
    expect(post).toMatch(/https:\/\/www\.agendapro\.com/);
    expect(post).toMatch(/https:\/\/medilink\.cl/);
    expect(post).toMatch(/https:\/\/www\.sacmed\.cl/);
    expect(post).toMatch(/https:\/\/www\.sii\.cl/);
    expect(post).toMatch(/https:\/\/www\.openfactura\.cl/);
    expect(post).toMatch(/https:\/\/www\.instagram\.com/);
    expect(post).toMatch(/https:\/\/www\.messenger\.com/);
    expect(post).toMatch(/https:\/\/business\.whatsapp\.com/);
    expect(post).toContain("/comparativas/dentalink");
    expect(post).toContain("/comparativas/reservo");
    expect(post).toContain("/comparativas/agendapro");
    expect(post).not.toMatch(/inventario/i);
    expect(post).not.toMatch(/liquidaciones/i);
  });

  test("llms.txt y llms-full.txt apuntan al post y a Open Factura", () => {
    for (const body of [llms, llmsFull]) {
      expect(body).toContain(POST_PROXIMAS_FUNCIONES_PATH);
      expect(body).toMatch(/Open Factura/);
      expect(body).toMatch(/no es un ERP/i);
      expect(body).toMatch(/Instagram Direct/);
      expect(body).toMatch(/trigger de cumpleaños/i);
    }
  });

  test("robots.ts deja pasar llms.txt y el blog a crawlers de IA", () => {
    expect(robotsSrc).toContain("/llms.txt");
    expect(robotsSrc).toContain("/llms-full.txt");
    expect(robotsSrc).toContain("/blog/");
    expect(robotsSrc).toContain(POST_PROXIMAS_FUNCIONES_SLUG);
  });

  test("hay un artículo AEO por cada función y el hub los enlaza", () => {
    expect(Object.keys(POSTS_POR_FUNCION)).toEqual([
      "open-factura",
      "odontograma-presupuestador",
      "instagram-facebook",
      "email-marketing",
      "trigger-cumpleanos",
    ]);
    for (const slug of Object.values(POSTS_POR_FUNCION)) {
      const satellite = readFileSync(
        join(process.cwd(), `src/content/posts/${slug}.mdx`),
        "utf8",
      );
      expect(satellite).toContain(`slug: ${slug}`);
      expect(satellite).toContain(POST_PROXIMAS_FUNCIONES_PATH);
      expect(post).toContain(`/blog/${slug}`);
    }
    for (const path of POSTS_POR_FUNCION_PATHS) {
      expect(llms).toContain(path);
      expect(llmsFull).toContain(path);
    }
  });
});
