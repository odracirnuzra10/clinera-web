import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * La vista de Negocios en Twenty muestra el teléfono del contacto en la
 * Opportunity (`telefonoContacto`). Twenty no proyecta el de la Persona
 * como columna de la tabla: si el JSON del Meet o el README vuelven a
 * decir que el negocio no lleva teléfono, el tablero queda mudo otra vez.
 */
const meet = readFileSync(
  join(process.cwd(), "integrations/n8n/clinera-meet-por-profesional.workflow.json"),
  "utf8",
);
const readme = readFileSync(
  join(process.cwd(), "integrations/n8n/README.md"),
  "utf8",
);
const aplicador = readFileSync(
  join(process.cwd(), "integrations/n8n/aplicar_telefono_contacto.py"),
  "utf8",
);

test.describe("teléfono del contacto en la Opportunity", () => {
  test("el Meet escribe telefonoContacto al refrescar y al crear", () => {
    const wf = JSON.parse(meet);
    const node = wf.nodes.find(
      (n: { name: string }) => n.name === "Twenty - Agendó (Meet)",
    );
    expect(node).toBeTruthy();
    const code: string = node.parameters.jsCode;
    expect(code).toContain("patch.telefonoContacto");
    expect(code).toContain("negocioNuevo.telefonoContacto");
    expect(code).toContain("primaryPhoneCallingCode");
  });

  test("el README ya no dice que la oportunidad no lleva teléfono", () => {
    expect(readme).toContain("telefonoContacto");
    expect(readme).not.toMatch(
      /La oportunidad de Twenty no lleva email ni teléfono encima/,
    );
    expect(aplicador).toContain("telefonoContacto");
  });
});
