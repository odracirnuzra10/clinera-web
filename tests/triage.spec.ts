import { test, expect, type Page } from "@playwright/test";

// ============================================================================
// /triage — criterios de aceptación del formulario de reportes
// ----------------------------------------------------------------------------
// Las respuestas de /api/triage se interceptan con page.route: acá se verifica
// el comportamiento de la interfaz, no la conexión real con n8n (que depende
// de TRIAGE_N8N_URL / TRIAGE_FORM_SECRET y del webhook estando arriba).
// ============================================================================

const VALIDO = {
  nombre: "Rebeca Navarro",
  email: "rebeca@oacg.cl",
  clinica: "Método Hebe — Los Ángeles",
  titulo: "La agenda no muestra las horas del martes",
  descripcion:
    "Entré a la agenda de la sucursal, cambié a la vista semanal y el martes aparece vacío. Ayer sí se veían las horas.",
};

const RESPUESTA_OK = {
  ok: true,
  mensaje: "Listo. Tu reporte quedó registrado y el equipo ya fue avisado.",
  issue: "OAC-57",
  url: "https://linear.app/oacg/issue/OAC-57/agenda-martes",
};

async function llenarFormulario(page: Page, campos: Partial<typeof VALIDO> = {}) {
  const v = { ...VALIDO, ...campos };
  await page.getByLabel("Tu nombre").fill(v.nombre);
  await page.getByLabel("Tu correo").fill(v.email);
  await page.getByLabel("Clínica afectada").fill(v.clinica);
  await page.getByLabel("Qué pasa").fill(v.titulo);
  await page.getByLabel("Cuéntalo con detalle").fill(v.descripcion);
}

test.describe("/triage", () => {
  test("carga en móvil con todos los campos y sin campo de prioridad", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/triage");

    await expect(page.getByRole("heading", { name: "Reportar una incidencia" })).toBeVisible();
    await expect(page.getByLabel("Tu nombre")).toBeVisible();
    await expect(page.getByLabel("Tu correo")).toBeVisible();
    await expect(page.getByLabel("Clínica afectada")).toBeVisible();
    await expect(page.getByLabel("Tipo")).toBeVisible();
    await expect(page.getByLabel("Qué pasa")).toBeVisible();
    await expect(page.getByLabel("Cuéntalo con detalle")).toBeVisible();
    await expect(page.getByLabel(/Link de captura/)).toBeVisible();

    // La severidad la decide el CTO en Linear, no quien reporta.
    await expect(page.getByLabel(/prioridad|severidad/i)).toHaveCount(0);

    // `bug` es el tipo por defecto.
    await expect(page.getByLabel("Tipo")).toHaveValue("bug");

    // Nota permanente de datos de pacientes, sin necesidad de disparar nada.
    await expect(page.getByText(/No escribas nombres, RUT ni teléfonos/)).toBeVisible();

    // 16px mínimo en los campos: evita el zoom involuntario de iOS.
    const fontSize = await page
      .getByLabel("Qué pasa")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test("se puede completar y enviar sólo con el teclado", async ({ page }) => {
    let enviado = false;
    await page.route("**/api/triage", async (route) => {
      enviado = true;
      await route.fulfill({ json: RESPUESTA_OK });
    });

    await page.goto("/triage");

    await page.getByLabel("Tu nombre").focus();
    await page.keyboard.type(VALIDO.nombre);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALIDO.email);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALIDO.clinica);
    await page.keyboard.press("Tab");
    // Tipo: se deja el valor por defecto.
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALIDO.titulo);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALIDO.descripcion);
    await page.keyboard.press("Tab"); // url_captura
    await page.keyboard.press("Tab"); // botón enviar

    await expect(page.getByRole("button", { name: "Enviar reporte" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { name: "Reporte enviado" })).toBeVisible();
    expect(enviado).toBe(true);
  });

  test("un envío válido muestra el identificador de la issue y permite reportar otra cosa", async ({
    page,
  }) => {
    await page.route("**/api/triage", (route) => route.fulfill({ json: RESPUESTA_OK }));

    await page.goto("/triage");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    await expect(page.getByRole("heading", { name: "Reporte enviado" })).toBeVisible();
    await expect(page.getByText("OAC-57")).toBeVisible();
    await expect(page.getByText(/Jorge lo va a revisar/)).toBeVisible();

    // Vuelve al formulario limpio.
    await page.getByRole("button", { name: "Reportar otra cosa" }).click();
    await expect(page.getByLabel("Qué pasa")).toHaveValue("");
    await expect(page.getByLabel("Tu nombre")).toHaveValue("");
  });

  test("un RUT en el texto bloquea el envío y muestra el aviso de datos de pacientes", async ({
    page,
  }) => {
    let llamadas = 0;
    await page.route("**/api/triage", (route) => {
      llamadas += 1;
      return route.fulfill({ json: RESPUESTA_OK });
    });

    await page.goto("/triage");
    await llenarFormulario(page, {
      descripcion:
        "La paciente 12.345.678-9 no aparece en la agenda de la sucursal desde ayer por la tarde.",
    });
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    await expect(page.locator("main").getByRole("alert")).toContainText("No incluyas datos de pacientes");
    await expect(page.locator("main").getByRole("alert")).toContainText("RUT");

    // Bloqueado de verdad: el dato nunca sale del navegador.
    expect(llamadas).toBe(0);
    await expect(page.getByRole("heading", { name: "Reporte enviado" })).toHaveCount(0);
  });

  test("una descripción corta muestra el error bajo el campo y conserva lo escrito", async ({
    page,
  }) => {
    await page.goto("/triage");
    await llenarFormulario(page, { descripcion: "no anda" });
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    const descripcion = page.getByLabel("Cuéntalo con detalle");
    await expect(descripcion).toHaveAttribute("aria-invalid", "true");

    // El error está enlazado por aria-describedby y visible bajo el campo.
    const describedBy = await descripcion.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const idError = describedBy!.split(" ").find((id) => id.endsWith("-error"))!;
    await expect(page.locator(`[id="${idError}"]`)).toContainText("30 caracteres");

    // Nunca se borra lo que la persona escribió.
    await expect(descripcion).toHaveValue("no anda");
    await expect(page.getByLabel("Tu nombre")).toHaveValue(VALIDO.nombre);
    await expect(page.getByLabel("Qué pasa")).toHaveValue(VALIDO.titulo);
  });

  test("un correo fuera de @oacg.cl muestra el error bajo el campo", async ({ page }) => {
    await page.goto("/triage");
    await llenarFormulario(page, { email: "rebeca@gmail.com" });
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    await expect(page.getByLabel("Tu correo")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Usa tu correo @oacg.cl.")).toBeVisible();
  });

  test("doble clic en enviar dispara una sola petición", async ({ page }) => {
    let llamadas = 0;
    await page.route("**/api/triage", async (route) => {
      llamadas += 1;
      // Respuesta lenta: el segundo clic ocurre con la primera en vuelo.
      await new Promise((r) => setTimeout(r, 1200));
      await route.fulfill({ json: RESPUESTA_OK });
    });

    await page.goto("/triage");
    await llenarFormulario(page);

    const boton = page.getByRole("button", { name: "Enviar reporte" });
    await boton.dblclick();

    await expect(page.getByRole("heading", { name: "Reporte enviado" })).toBeVisible();
    expect(llamadas).toBe(1);
  });

  test("muestra 'Enviando…' y deshabilita el botón mientras envía", async ({ page }) => {
    await page.route("**/api/triage", async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({ json: RESPUESTA_OK });
    });

    await page.goto("/triage");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    const enviando = page.getByRole("button", { name: /Enviando/ });
    await expect(enviando).toBeVisible();
    await expect(enviando).toBeDisabled();
  });

  test("si n8n está caído se ve un error entendible, se reintenta y no se pierde lo escrito", async ({
    page,
  }) => {
    let intentos = 0;
    await page.route("**/api/triage", async (route) => {
      intentos += 1;
      if (intentos === 1) return route.abort("failed");
      return route.fulfill({ json: RESPUESTA_OK });
    });

    await page.goto("/triage");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    await expect(page.locator("main").getByRole("alert")).toContainText("No pudimos enviar tu reporte");

    // Lo escrito sigue ahí.
    await expect(page.getByLabel("Cuéntalo con detalle")).toHaveValue(VALIDO.descripcion);
    await expect(page.getByLabel("Tu nombre")).toHaveValue(VALIDO.nombre);

    // El reintento funciona sin volver a escribir nada.
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.getByRole("heading", { name: "Reporte enviado" })).toBeVisible();
  });

  test("los errores que devuelve el servidor se muestran en pantalla", async ({ page }) => {
    await page.route("**/api/triage", (route) =>
      route.fulfill({
        status: 400,
        json: {
          ok: false,
          errores: [
            "La descripcion debe tener al menos 30 caracteres.",
            "Detectamos un RUT en el texto.",
          ],
        },
      }),
    );

    await page.goto("/triage");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Enviar reporte" }).click();

    await expect(page.getByText("La descripcion debe tener al menos 30 caracteres.")).toBeVisible();
    await expect(page.getByText("Detectamos un RUT en el texto.")).toBeVisible();
    // Conserva lo escrito.
    await expect(page.getByLabel("Cuéntalo con detalle")).toHaveValue(VALIDO.descripcion);
  });
});

test.describe("/api/triage", () => {
  test("rechaza un reporte inválido sin llegar a n8n y nunca filtra el token", async ({
    request,
  }) => {
    const res = await request.post("/api/triage", {
      data: {
        reportante_nombre: "Rebeca",
        reportante_email: "rebeca@gmail.com",
        clinica: "Clínica X",
        tipo: "bug",
        titulo: "corto",
        descripcion: "muy corto",
        url_captura: "",
      },
    });

    // 400 por validación, o 503 si el webhook aún no está configurado.
    expect([400, 503]).toContain(res.status());

    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(Array.isArray(json.errores)).toBe(true);
    expect(json.errores.length).toBeGreaterThan(0);

    // Ninguna respuesta de error puede incluir el secreto ni el header.
    const cuerpo = JSON.stringify(json);
    expect(cuerpo).not.toContain("X-Triage-Token");
    expect(cuerpo).not.toContain("TRIAGE_FORM_SECRET");
  });

  test("la página no expone el token ni la URL del webhook al cliente", async ({ page }) => {
    const scripts: string[] = [];
    page.on("response", async (res) => {
      const url = res.url();
      if (url.includes("/_next/") && url.endsWith(".js")) {
        scripts.push(await res.text().catch(() => ""));
      }
    });

    await page.goto("/triage");
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    const todo = html + scripts.join("\n");

    expect(todo).not.toContain("TRIAGE_FORM_SECRET");
    expect(todo).not.toContain("X-Triage-Token");
    expect(todo).not.toContain("n8n.oacg.cl");
  });
});
