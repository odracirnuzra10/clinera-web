import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Ricardo 28-ago: Meta y Twenty hablan el mismo idioma.
 * Lead = formulario sin cita. MQL = además agendó. SQL/SQL+ = closer a mano.
 */
const agents = readFileSync(join(process.cwd(), "AGENTS.md"), "utf8");
const aplicador = readFileSync(
  join(process.cwd(), "integrations/n8n/aplicar_etapas_lead_mql.py"),
  "utf8",
);
const readme = readFileSync(
  join(process.cwd(), "integrations/n8n/README.md"),
  "utf8",
);

test.describe("embudo Lead / MQL / SQL / SQL+ — mismo idioma Meta y Twenty", () => {
  test("AGENTS.md publica el contrato de las cuatro etapas", () => {
    expect(agents).toContain("`NEW` → Nuevo");
    expect(agents).toContain("`SCREENING` → MQL");
    expect(agents).toContain("`MEETING` → SQL");
    expect(agents).toContain("`PROPOSAL` → SQL+");
    expect(agents).toContain("Sub A (Instant Form) nace en `NEW`");
    expect(agents).not.toMatch(/Todo lead entra como MQL/);
  });

  test("el aplicador de n8n nace en NEW y sube a SCREENING al agendar", () => {
    expect(aplicador).toContain("const etapaDestino = 'NEW'");
    expect(aplicador).toContain("agendo ? 'SCREENING' : 'NEW'");
    expect(aplicador).toContain('"event_name": "Lead"');
    expect(aplicador).toContain('"/reserva-tu-hora"');
  });

  test("el README del wizard ya no dice que todo lead entra como MQL", () => {
    expect(readme).toContain("Mismo idioma que Meta");
    expect(readme).not.toContain("Todo lead entra como MQL");
    expect(readme).not.toMatch(/pasa a PQL en `crm\.oacg\.cl`/);
  });
});
