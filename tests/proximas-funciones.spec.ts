import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PROXIMAS_FUNCIONES } from "@/content/proximas-funciones";

const deck = readFileSync(
  join(process.cwd(), "public/presentacion/index.html"),
  "utf8",
);

test.describe("próximas funciones: no publicar hasta que Ricardo lo habilite", () => {
  test("Open Factura sigue inédita y no es un ERP", () => {
    const of = PROXIMAS_FUNCIONES.find((f) => f.id === "open-factura");
    expect(of?.publicado).toBe(false);
    expect(of?.copyInterno).toMatch(/emisor de DTE/i);
    expect(of?.copyInterno).toMatch(/no es un ERP/i);
  });

  test("inventario y liquidaciones son de Clinera, diciembre 2026", () => {
    const ids = PROXIMAS_FUNCIONES.filter((f) => f.donde === "clinera").map(
      (f) => f.id,
    );
    expect(ids).toEqual(["inventario", "liquidaciones-sueldos"]);
    for (const f of PROXIMAS_FUNCIONES.filter((f) => f.donde === "clinera")) {
      expect(f.cuando).toMatch(/diciembre 2026/i);
      expect(f.publicado).toBe(false);
    }
  });

  test("el deck de ventas no menciona Open Factura", () => {
    expect(deck).not.toMatch(/open\s*factura/i);
    expect(deck).not.toContain("openfactura");
  });
});
