"use client";

// ============================================================================
// Triage — formulario de reporte de incidencias del equipo OACG
// ----------------------------------------------------------------------------
// Una sola pantalla, sin wizard. Quien lo usa no es técnico y muchas veces
// reporta desde el celular entre atenciones: cada campo extra es un reporte
// que no se envía.
//
// El POST va a /api/triage (nuestro backend), nunca directo a n8n — el token
// del webhook vive sólo en el servidor.
//
// Las reglas de validación viven en ./validation y las comparte el endpoint.
// ============================================================================

import { useId, useRef, useState } from "react";
import {
  hayErrores,
  normalizarTriage,
  validarTriage,
  type CampoTriage,
  type ErroresCampo,
  type TriagePayload,
} from "./validation";
import styles from "./triage.module.css";

const VACIO: TriagePayload = {
  reportante_nombre: "",
  reportante_email: "",
  clinica: "",
  tipo: "bug",
  titulo: "",
  descripcion: "",
  url_captura: "",
};

type Estado = "inicial" | "enviando" | "exito" | "error";

type RespuestaExito = {
  ok: true;
  mensaje?: string;
  issue?: string;
  url?: string;
};

/** Orden de foco cuando la validación falla: el primer campo con error. */
const ORDEN_CAMPOS: CampoTriage[] = [
  "reportante_nombre",
  "reportante_email",
  "clinica",
  "tipo",
  "titulo",
  "descripcion",
  "url_captura",
];

export default function TriageForm({ clinicas }: { clinicas: string[] }) {
  const [valores, setValores] = useState<TriagePayload>(VACIO);
  const [errores, setErrores] = useState<ErroresCampo>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [erroresServidor, setErroresServidor] = useState<string[]>([]);
  const [estado, setEstado] = useState<Estado>("inicial");
  const [exito, setExito] = useState<RespuestaExito | null>(null);

  // Guard de doble envío. El `disabled` del botón sólo aplica tras el
  // re-render; el ref bloquea el segundo click en el mismo tick. Sin esto, un
  // doble clic rápido puede crear dos issues.
  const enviandoRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const exitoRef = useRef<HTMLHeadingElement>(null);

  const uid = useId();
  const idDe = (campo: string) => `${uid}-${campo}`;

  function actualizar(campo: CampoTriage, valor: string) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    // Limpiamos el error del campo apenas la persona lo edita: mantener el
    // rojo mientras corrige se siente como un reproche.
    setErrores((prev) => {
      if (!prev[campo]) return prev;
      const siguiente = { ...prev };
      delete siguiente[campo];
      return siguiente;
    });
  }

  function enfocar(campo: CampoTriage) {
    const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(idDe(campo))}`);
    el?.focus();
  }

  async function enviar() {
    if (enviandoRef.current) return;

    const payload = normalizarTriage(valores);
    const resultado = validarTriage(payload);

    setErrores(resultado.errores);
    setAviso(resultado.aviso);
    setErroresServidor([]);

    if (hayErrores(resultado)) {
      setEstado("inicial");
      const primero = ORDEN_CAMPOS.find((c) => resultado.errores[c]);
      if (primero) enfocar(primero);
      else if (resultado.aviso) enfocar("descripcion");
      return;
    }

    enviandoRef.current = true;
    setEstado("enviando");

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => null)) as
        | (RespuestaExito & { errores?: string[] })
        | null;

      if (res.ok && json?.ok) {
        setExito(json);
        setEstado("exito");
        // El formulario desaparece: llevamos el foco a la confirmación para
        // que un lector de pantalla no quede leyendo en el vacío.
        requestAnimationFrame(() => exitoRef.current?.focus());
        return;
      }

      if (json?.errores?.length) {
        // Errores de validación del servidor o de n8n: se muestran en pantalla
        // y el formulario conserva todo lo escrito.
        setErroresServidor(json.errores);
        setEstado("inicial");
        return;
      }

      setEstado("error");
    } catch {
      // Sin red o el servidor no respondió.
      setEstado("error");
    } finally {
      enviandoRef.current = false;
    }
  }

  function reiniciar() {
    setValores(VACIO);
    setErrores({});
    setAviso(null);
    setErroresServidor([]);
    setExito(null);
    setEstado("inicial");
  }

  // ── Estado: éxito ─────────────────────────────────────────────────────────
  if (estado === "exito") {
    return (
      <main className={styles.pagina}>
        <div className={styles.marco}>
          <section className={styles.exito} aria-labelledby={idDe("exito-titulo")}>
            <span className={styles.exitoIcono} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5l5.5 5.5L20 7" />
              </svg>
            </span>

            <h1 className={styles.exitoTitulo} id={idDe("exito-titulo")} ref={exitoRef} tabIndex={-1}>
              Reporte enviado
            </h1>

            {exito?.issue && (
              <p className={styles.exitoIssue}>
                <span className={styles.exitoIssueEtiqueta}>Identificador</span>
                <span className={styles.exitoIssueId}>{exito.issue}</span>
              </p>
            )}

            <p className={styles.exitoTexto}>
              {exito?.mensaje ??
                "Listo. Tu reporte quedó registrado y el equipo ya fue avisado."}{" "}
              Jorge lo va a revisar y te avisamos por correo.
            </p>

            {exito?.url && (
              <a
                className={styles.exitoEnlace}
                href={exito.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver el reporte en Linear
              </a>
            )}

            <button type="button" className={styles.botonSecundario} onClick={reiniciar}>
              Reportar otra cosa
            </button>
          </section>
        </div>
      </main>
    );
  }

  // ── Estado: formulario ────────────────────────────────────────────────────
  const enviando = estado === "enviando";

  /** Arma `aria-describedby` con la ayuda y el error que sí existen. */
  const describedBy = (campo: CampoTriage, conAyuda: boolean) => {
    const ids: string[] = [];
    if (conAyuda) ids.push(idDe(`${campo}-ayuda`));
    if (errores[campo]) ids.push(idDe(`${campo}-error`));
    return ids.length ? ids.join(" ") : undefined;
  };

  /* Función de render, no un componente: declarar un componente acá lo
     recrearía en cada render y le reiniciaría el estado. */
  const renderError = (campo: CampoTriage) =>
    errores[campo] ? (
      <p className={styles.error} id={idDe(`${campo}-error`)}>
        {errores[campo]}
      </p>
    ) : null;

  return (
    <main className={styles.pagina}>
      <div className={styles.marco}>
        <header className={styles.encabezado}>
          <p className={styles.eyebrow}>Equipo OACG</p>
          <h1 className={styles.titulo}>Reportar una incidencia</h1>
          <p className={styles.bajada}>
            Cuéntanos qué pasó y lo convertimos en un ticket. Lo revisa el equipo
            técnico y te avisamos por correo.
          </p>
        </header>

        {/* Bloqueo por datos de pacientes — no es un error de formato. */}
        {aviso && (
          <div className={styles.avisoPii} role="alert">
            <strong className={styles.avisoPiiTitulo}>No incluyas datos de pacientes.</strong>
            <span>{aviso.replace("No incluyas datos de pacientes. ", "")}</span>
          </div>
        )}

        {/* Errores devueltos por el servidor o por n8n. */}
        {erroresServidor.length > 0 && (
          <div className={styles.bloqueError} role="alert">
            <ul className={styles.listaErrores}>
              {erroresServidor.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Error de red o del servidor — con reintento, sin perder lo escrito. */}
        {estado === "error" && (
          <div className={styles.bloqueError} role="alert">
            <p className={styles.bloqueErrorTexto}>
              No pudimos enviar tu reporte. Revisa tu conexión e inténtalo de nuevo.
            </p>
            <button type="button" className={styles.botonReintentar} onClick={enviar}>
              Reintentar
            </button>
          </div>
        )}

        <form
          ref={formRef}
          className={styles.formulario}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void enviar();
          }}
        >
          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("reportante_nombre")}>
              Tu nombre
            </label>
            <input
              className={styles.input}
              id={idDe("reportante_nombre")}
              name="reportante_nombre"
              type="text"
              autoComplete="name"
              value={valores.reportante_nombre}
              onChange={(e) => actualizar("reportante_nombre", e.target.value)}
              aria-invalid={errores.reportante_nombre ? true : undefined}
              aria-describedby={describedBy("reportante_nombre", false)}
              disabled={enviando}
            />
            {renderError("reportante_nombre")}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("reportante_email")}>
              Tu correo
            </label>
            <input
              className={styles.input}
              id={idDe("reportante_email")}
              name="reportante_email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@oacg.cl"
              value={valores.reportante_email}
              onChange={(e) => actualizar("reportante_email", e.target.value)}
              aria-invalid={errores.reportante_email ? true : undefined}
              aria-describedby={describedBy("reportante_email", true)}
              disabled={enviando}
            />
            <p className={styles.ayuda} id={idDe("reportante_email-ayuda")}>
              Tiene que ser tu correo @oacg.cl.
            </p>
            {renderError("reportante_email")}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("clinica")}>
              Clínica afectada
            </label>
            <input
              className={styles.input}
              id={idDe("clinica")}
              name="clinica"
              type="text"
              list={idDe("clinica-opciones")}
              autoComplete="off"
              placeholder="Escribe o elige de la lista"
              value={valores.clinica}
              onChange={(e) => actualizar("clinica", e.target.value)}
              aria-invalid={errores.clinica ? true : undefined}
              aria-describedby={describedBy("clinica", false)}
              disabled={enviando}
            />
            {/* Sugerencias, no una jaula: si la clínica no está en la lista,
                se puede escribir igual. */}
            <datalist id={idDe("clinica-opciones")}>
              {clinicas.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {renderError("clinica")}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("tipo")}>
              Tipo
            </label>
            <div className={styles.selectEnvoltorio}>
              <select
                className={styles.select}
                id={idDe("tipo")}
                name="tipo"
                value={valores.tipo}
                onChange={(e) => actualizar("tipo", e.target.value)}
                aria-invalid={errores.tipo ? true : undefined}
                aria-describedby={describedBy("tipo", false)}
                disabled={enviando}
              >
                <option value="bug">Bug — algo dejó de funcionar</option>
                <option value="solicitud">Solicitud — necesito algo nuevo</option>
                <option value="consulta">Consulta — tengo una duda</option>
              </select>
              <span className={styles.selectFlecha} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>
            {renderError("tipo")}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("titulo")}>
              Qué pasa
            </label>
            <input
              className={styles.input}
              id={idDe("titulo")}
              name="titulo"
              type="text"
              placeholder="La agenda no muestra las horas del martes"
              value={valores.titulo}
              onChange={(e) => actualizar("titulo", e.target.value)}
              aria-invalid={errores.titulo ? true : undefined}
              aria-describedby={describedBy("titulo", false)}
              disabled={enviando}
            />
            {renderError("titulo")}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("descripcion")}>
              Cuéntalo con detalle
            </label>
            <textarea
              className={styles.textarea}
              id={idDe("descripcion")}
              name="descripcion"
              rows={6}
              placeholder={
                "¿Qué estabas haciendo?\n¿Qué esperabas que pasara?\n¿Qué pasó en vez?"
              }
              value={valores.descripcion}
              onChange={(e) => actualizar("descripcion", e.target.value)}
              aria-invalid={errores.descripcion ? true : undefined}
              aria-describedby={describedBy("descripcion", true)}
              disabled={enviando}
            />
            {/* Nota permanente, no sólo cuando se dispara la detección. */}
            <p className={styles.ayudaPermanente} id={idDe("descripcion-ayuda")}>
              No escribas nombres, RUT ni teléfonos de pacientes. Usa el ID de ficha.
            </p>
            {renderError("descripcion")}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor={idDe("url_captura")}>
              Link de captura{" "}
              <span className={styles.opcional}>opcional</span>
            </label>
            <input
              className={styles.input}
              id={idDe("url_captura")}
              name="url_captura"
              type="url"
              inputMode="url"
              placeholder="https://drive.google.com/..."
              value={valores.url_captura}
              onChange={(e) => actualizar("url_captura", e.target.value)}
              aria-invalid={errores.url_captura ? true : undefined}
              aria-describedby={describedBy("url_captura", true)}
              disabled={enviando}
            />
            <p className={styles.ayuda} id={idDe("url_captura-ayuda")}>
              Súbela a Drive y pega el link.
            </p>
            {renderError("url_captura")}
          </div>

          <button type="submit" className={styles.botonEnviar} disabled={enviando}>
            {enviando ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Enviando…
              </>
            ) : (
              "Enviar reporte"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
