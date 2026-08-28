import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * `createdAt` de sistema en Twenty se muestra relativo («hace 3 horas») y
 * no se puede cambiar (403). El negocio lleva `horaRegistro` con hora
 * exacta, y cada lead / agendamiento avisa al Google Chat del Wizard.
 * El webhook no se versiona: el JSON del Meet lleva placeholder y el
 * aplicador lo clona del nodo vivo.
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
  join(process.cwd(), "integrations/n8n/aplicar_hora_registro_aviso_chat.py"),
  "utf8",
);
const agents = readFileSync(join(process.cwd(), "AGENTS.md"), "utf8");

test.describe("hora de registro y aviso a Google Chat", () => {
  test("el Meet escribe horaRegistro solo al crear el negocio", () => {
    const wf = JSON.parse(meet);
    const node = wf.nodes.find(
      (n: { name: string }) => n.name === "Twenty - Agendó (Meet)",
    );
    expect(node).toBeTruthy();
    const code: string = node.parameters.jsCode;
    expect(code).toContain("negocioNuevo.horaRegistro");
    expect(code).not.toContain("patch.horaRegistro");
  });

  test("el Meet avisa a Chat después de crear el evento, con placeholder", () => {
    const wf = JSON.parse(meet);
    const prep = wf.nodes.find(
      (n: { name: string }) => n.name === "Preparar aviso Chat",
    );
    const chat = wf.nodes.find(
      (n: { name: string }) => n.name === "Notify Google Chat",
    );
    expect(prep).toBeTruthy();
    expect(chat).toBeTruthy();
    expect(prep.parameters.jsCode).toContain("esPrueba");
    expect(prep.parameters.jsCode).toContain("textoChat");
    expect(chat.parameters.url).toBe("__GOOGLE_CHAT_WEBHOOK__");
    expect(meet).not.toMatch(/chat\.googleapis\.com\/v1\/spaces\/.*key=/);

    const fromMeet = wf.connections["Crear Evento + Meet"].main[0].map(
      (d: { node: string }) => d.node,
    );
    expect(fromMeet).toContain("Preparar aviso Chat");
    const fromPrep = wf.connections["Preparar aviso Chat"].main[0].map(
      (d: { node: string }) => d.node,
    );
    expect(fromPrep).toContain("Notify Google Chat");
  });

  test("el aplicador clona el webhook y no lo imprime", () => {
    expect(aplicador).toContain("negocio.horaRegistro");
    expect(aplicador).toContain("negocioNuevo.horaRegistro");
    expect(aplicador).toContain("refresco.horaRegistro");
    expect(aplicador).toContain("Ya había cotizado");
    expect(aplicador).toContain("horaRegistro IS_TODAY");
    expect(aplicador).toContain("webhook_del_wizard");
    expect(aplicador).toContain("Prepare Lead Data");
    expect(aplicador).toContain("Solo etapa de contacto");
    expect(aplicador).toContain("spaces/AAQAY5jOsuA");
    expect(aplicador).not.toMatch(/key=[A-Za-z0-9_\-]{8,}/);
    expect(aplicador).not.toContain("setTimeout");
    expect(aplicador).not.toMatch(/print\(.*url/);
  });

  test("README y AGENTS apuntan a horaRegistro y a los dos avisos", () => {
    expect(readme).toContain("horaRegistro");
    expect(readme).toContain("aplicar_hora_registro_aviso_chat.py");
    expect(readme).toContain("Instant Form");
    expect(readme).toContain("Ya había cotizado");
    expect(agents).toContain("horaRegistro");
    expect(agents).toContain("USER_SETTINGS");
    expect(agents).toContain("IS_TODAY");
    expect(agents).toContain("Ya había cotizado");
    expect(agents).toMatch(/Leads del día[\s\S]*horaRegistro` IS_TODAY/);
    expect(agents).not.toMatch(
      /n8n corta el envío de la reserva y manda \*\*un solo aviso\*\*, después de esperar/,
    );
  });
});
