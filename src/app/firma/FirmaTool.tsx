"use client";

// ============================================================================
// /firma — panel del closer
// ----------------------------------------------------------------------------
// Flujo: el closer entra con la clave del equipo, sube el PDF exportado desde
// /cotizacion y completa los datos del cliente. La firma por Clinera es SIEMPRE
// la del CEO (representante legal) y se estampa server-side: el closer queda
// como gestor de la solicitud y comparte el enlace /firma/<id> con el cliente.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./firma.module.css";
import type { SobreResumen } from "@/lib/firma/tipos";

const CLAVE_STORAGE = "clinera_firma_clave";
const CLOSER_STORAGE = "clinera_firma_closer";
const COTIZACION_STORAGE = "clinera_firma_cotizacion";

/** Configuración que deja el botón "Enviar a firma" de /cotizacion. */
type CotizacionEntrante = {
  numero?: string;
  clienteNombre?: string;
  planId?: string;
  billing?: string;
  extraUsuarios?: number;
  extraPacks?: number;
  incluirSetup?: boolean;
  descuentos?: Record<string, number>;
  resumen?: { totalPeriodo?: number; periodo?: string };
};

const formatoUsd = (valor: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(valor);

const formatoFecha = (iso: string) =>
  new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const formatoKb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

function Campo({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  requerido = false,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  type?: "text" | "email";
  placeholder?: string;
  requerido?: boolean;
}) {
  return (
    <label className={styles.campo}>
      <span>
        {label}
        {requerido && <small>Requerido</small>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={requerido}
        onChange={(evento) => onChange(evento.target.value)}
      />
    </label>
  );
}

export default function FirmaTool() {
  // ── Acceso ────────────────────────────────────────────────────────────────
  const [clave, setClave] = useState<string | null>(null);
  const [sso, setSso] = useState<{ email: string; nombre: string } | null>(null);
  const [ssoDisponible, setSsoDisponible] = useState(false);
  const [avisoSso, setAvisoSso] = useState("");
  const [claveInput, setClaveInput] = useState("");
  const [verificando, setVerificando] = useState(false);
  const [errorAcceso, setErrorAcceso] = useState("");
  const [listo, setListo] = useState(false);

  const autenticado = Boolean(clave || sso);

  // ── Formulario nueva solicitud ────────────────────────────────────────────
  const [archivo, setArchivo] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteClinica, setClienteClinica] = useState("");
  const [gestorNombre, setGestorNombre] = useState("");
  const [gestorEmail, setGestorEmail] = useState("");
  const [cotizacion, setCotizacion] = useState<CotizacionEntrante | null>(null);
  const [duracionTipo, setDuracionTipo] = useState<"primer_pago" | "meses" | "siempre">(
    "primer_pago",
  );
  const [duracionMeses, setDuracionMeses] = useState(6);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [resultado, setResultado] = useState<{ id: string; url: string } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  const inputArchivoRef = useRef<HTMLInputElement>(null);

  // ── Lista de sobres ───────────────────────────────────────────────────────
  const [sobres, setSobres] = useState<SobreResumen[]>([]);
  const [cargandoLista, setCargandoLista] = useState(false);
  const [errorLista, setErrorLista] = useState("");
  const [copiadoSobre, setCopiadoSobre] = useState("");

  useEffect(() => {
    // sessionStorage/localStorage solo existen en el cliente: leerlos en un
    // efecto (y no en el initializer) evita el mismatch de hidratación.
    const guardada = sessionStorage.getItem(CLAVE_STORAGE);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (guardada) setClave(guardada);
    try {
      const gestor = JSON.parse(localStorage.getItem(CLOSER_STORAGE) || "null") as {
        nombre?: string;
        email?: string;
      } | null;
      if (gestor?.nombre) setGestorNombre(gestor.nombre);
      if (gestor?.email) setGestorEmail(gestor.email);
    } catch {
      // localStorage corrupto: se ignora
    }
    try {
      const entrante = JSON.parse(
        sessionStorage.getItem(COTIZACION_STORAGE) || "null",
      ) as CotizacionEntrante | null;
      if (entrante?.planId) {
        setCotizacion(entrante);
        if (entrante.numero) setTitulo(`Cotización ${entrante.numero}`);
        if (entrante.clienteNombre) setClienteClinica(entrante.clienteNombre);
      }
    } catch {
      // payload corrupto: se ignora
    }

    // Resultado del intento de SSO (viene como ?sso=<código> desde el callback).
    const codigoSso = new URLSearchParams(window.location.search).get("sso");
    if (codigoSso) {
      setAvisoSso(codigoSso);
      window.history.replaceState(null, "", "/firma");
    }

    // ¿Hay sesión SSO activa? (la cookie es httpOnly: se consulta al server)
    void fetch("/api/firma/auth")
      .then((r) => r.json())
      .then((json: { ok?: boolean; email?: string; nombre?: string; sso?: boolean }) => {
        setSsoDisponible(json.sso === true);
        if (json.ok && json.email) setSso({ email: json.email, nombre: json.nombre ?? "" });
      })
      .catch(() => undefined)
      .finally(() => setListo(true));
  }, []);

  const descartarCotizacion = () => {
    sessionStorage.removeItem(COTIZACION_STORAGE);
    setCotizacion(null);
  };

  const cargarSobres = useCallback(
    async (claveActiva: string | null) => {
      setCargandoLista(true);
      setErrorLista("");
      try {
        const respuesta = await fetch("/api/firma", {
          headers: claveActiva ? { "x-firma-clave": claveActiva } : {},
        });
        const json = (await respuesta.json()) as {
          ok: boolean;
          sobres?: SobreResumen[];
          error?: string;
        };
        if (!respuesta.ok || !json.ok) {
          if (respuesta.status === 401) {
            sessionStorage.removeItem(CLAVE_STORAGE);
            setClave(null);
            setSso(null);
          }
          setErrorLista(json.error || "No pudimos cargar las solicitudes.");
          return;
        }
        setSobres(json.sobres ?? []);
      } catch {
        setErrorLista("Sin conexión con el servidor. Reintenta en un momento.");
      } finally {
        setCargandoLista(false);
      }
    },
    [],
  );

  useEffect(() => {
    // El fetch es asíncrono: los setState corren al resolver, no en el cuerpo
    // del efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (clave || sso) void cargarSobres(clave);
  }, [clave, sso, cargarSobres]);

  useEffect(() => {
    // Con SSO, prellenar los datos del gestor si están vacíos.
    if (!sso) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGestorEmail((actual) => actual || sso.email);
    setGestorNombre((actual) => actual || sso.nombre);
  }, [sso]);

  const entrar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!claveInput.trim()) return;
    setVerificando(true);
    setErrorAcceso("");
    try {
      const respuesta = await fetch("/api/firma/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clave: claveInput.trim() }),
      });
      const json = (await respuesta.json()) as { ok: boolean; error?: string };
      if (!respuesta.ok || !json.ok) {
        setErrorAcceso(json.error || "Clave incorrecta.");
        return;
      }
      sessionStorage.setItem(CLAVE_STORAGE, claveInput.trim());
      setClave(claveInput.trim());
      setClaveInput("");
    } catch {
      setErrorAcceso("Sin conexión con el servidor. Reintenta en un momento.");
    } finally {
      setVerificando(false);
    }
  };

  const salir = () => {
    sessionStorage.removeItem(CLAVE_STORAGE);
    if (sso) void fetch("/api/firma/auth", { method: "DELETE" });
    setClave(null);
    setSso(null);
    setSobres([]);
  };

  const elegirArchivo = (nuevo: File | null) => {
    setErrorEnvio("");
    if (!nuevo) return;
    if (nuevo.type !== "application/pdf" && !nuevo.name.toLowerCase().endsWith(".pdf")) {
      setErrorEnvio("El archivo debe ser un PDF (expórtalo desde /cotizacion).");
      return;
    }
    if (nuevo.size > 4 * 1024 * 1024) {
      setErrorEnvio("El PDF supera el máximo de 4 MB.");
      return;
    }
    setArchivo(nuevo);
    if (!titulo.trim()) {
      const base = nuevo.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
      setTitulo(base ? `Cotización ${base}` : "Cotización Clinera");
    }
  };

  const crearSolicitud = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!autenticado || enviando) return;
    setErrorEnvio("");

    if (!archivo) {
      setErrorEnvio("Sube el PDF de la cotización.");
      return;
    }

    const datos = new FormData();
    datos.set("archivo", archivo);
    datos.set("titulo", titulo.trim());
    datos.set("clienteNombre", clienteNombre.trim());
    datos.set("clienteEmail", clienteEmail.trim());
    datos.set("clienteClinica", clienteClinica.trim());
    datos.set("gestorNombre", gestorNombre.trim());
    datos.set("gestorEmail", gestorEmail.trim());
    if (cotizacion) {
      datos.set(
        "cotizacion",
        JSON.stringify({
          ...cotizacion,
          duracionDescuento:
            duracionTipo === "meses"
              ? { tipo: "meses", meses: duracionMeses }
              : { tipo: duracionTipo },
        }),
      );
    }

    setEnviando(true);
    try {
      const respuesta = await fetch("/api/firma", {
        method: "POST",
        headers: clave ? { "x-firma-clave": clave } : {},
        body: datos,
      });
      const json = (await respuesta.json()) as {
        ok: boolean;
        id?: string;
        url?: string;
        error?: string;
      };
      if (!respuesta.ok || !json.ok || !json.id || !json.url) {
        setErrorEnvio(json.error || "No pudimos crear la solicitud. Inténtalo de nuevo.");
        return;
      }
      localStorage.setItem(
        CLOSER_STORAGE,
        JSON.stringify({ nombre: gestorNombre.trim(), email: gestorEmail.trim() }),
      );
      setResultado({ id: json.id, url: json.url });
      setArchivo(null);
      setTitulo("");
      setClienteNombre("");
      setClienteEmail("");
      setClienteClinica("");
      sessionStorage.removeItem(COTIZACION_STORAGE);
      setCotizacion(null);
      if (inputArchivoRef.current) inputArchivoRef.current.value = "";
      void cargarSobres(clave);
    } catch {
      setErrorEnvio("Sin conexión con el servidor. Reintenta en un momento.");
    } finally {
      setEnviando(false);
    }
  };

  const copiarEnlace = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    if (resultado?.id === id) {
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    }
    setCopiadoSobre(id);
    window.setTimeout(() => setCopiadoSobre(""), 1800);
  };

  const enlaceWhatsApp = (url: string, nombre: string) => {
    const texto = `Hola ${nombre ? nombre.split(" ")[0] : ""}, te comparto la cotización de Clinera lista para firma electrónica. La puedes revisar y firmar aquí: ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(texto.replace(/\s+/g, " ").trim())}`;
  };

  const anularSobre = async (id: string) => {
    if (!autenticado) return;
    const seguro = window.confirm(
      "¿Anular esta solicitud pendiente? El enlace dejará de funcionar y el documento se eliminará.",
    );
    if (!seguro) return;
    try {
      const respuesta = await fetch(`/api/firma/${id}`, {
        method: "DELETE",
        headers: clave ? { "x-firma-clave": clave } : {},
      });
      const json = (await respuesta.json()) as { ok: boolean; error?: string };
      if (!respuesta.ok || !json.ok) {
        setErrorLista(json.error || "No pudimos anular la solicitud.");
        return;
      }
      void cargarSobres(clave);
    } catch {
      setErrorLista("Sin conexión con el servidor. Reintenta en un momento.");
    }
  };

  if (!listo) return <main className={styles.page} />;

  // ── Puerta de acceso ──────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <main id="contenido" className={styles.page}>
        <div className={styles.gate}>
          <form className={styles.gateCard} onSubmit={entrar}>
            <div className={styles.gateBrand}>
              <Image
                src="/images/brand/quote-logo.svg"
                width={40}
                height={40}
                alt="Clinera"
                priority
              />
              <strong>clinera.io</strong>
              <span>Firma de documentos</span>
            </div>
            <h1>Acceso del equipo comercial</h1>
            <p>
              {ssoDisponible
                ? "Entra con tu cuenta @oacg.cl para enviar cotizaciones a firma electrónica."
                : "Ingresa la clave compartida del equipo para enviar cotizaciones a firma electrónica."}
            </p>

            {avisoSso && (
              <p className={styles.error} role="alert">
                {avisoSso === "dominio"
                  ? "Debes usar tu cuenta Google @oacg.cl."
                  : avisoSso === "sin-config"
                    ? "El acceso con Google aún no está configurado. Usa la clave del equipo."
                    : "No pudimos completar el acceso con Google. Inténtalo de nuevo."}
              </p>
            )}

            {ssoDisponible && (
              <>
                <button
                  type="button"
                  className={styles.botonGoogle}
                  onClick={() => {
                    // Navegación completa: es un redirect OAuth, no una página Next.
                    window.location.href = "/api/firma/auth/google";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Continuar con Google
                </button>
                <div className={styles.gateDivisor}>
                  <span>o con la clave del equipo</span>
                </div>
              </>
            )}

            <label className={styles.campo}>
              <span>Clave de acceso</span>
              <input
                type="password"
                value={claveInput}
                onChange={(evento) => setClaveInput(evento.target.value)}
                autoComplete="current-password"
              />
            </label>
            {errorAcceso && (
              <p className={styles.error} role="alert">
                {errorAcceso}
              </p>
            )}
            <button type="submit" className={styles.botonPrimario} disabled={verificando}>
              {verificando ? "Verificando…" : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Panel ─────────────────────────────────────────────────────────────────
  return (
    <main id="contenido" className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <Image
            src="/images/brand/quote-logo.svg"
            width={32}
            height={32}
            alt="Clinera"
            priority
          />
          <span>clinera.io</span>
          <i aria-hidden="true" />
          <strong>Firmas</strong>
        </div>
        <div className={styles.topbarActions}>
          {sso && <span className={styles.topbarUsuario}>{sso.email}</span>}
          <Link href="/cotizacion" className={styles.botonFantasma}>
            Ir al cotizador
          </Link>
          <button type="button" className={styles.botonFantasma} onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <form className={styles.editor} onSubmit={crearSolicitud}>
          <div className={styles.editorIntro}>
            <span>Firma electrónica simple</span>
            <h1>Envía una cotización a firma.</h1>
            <p>
              Sube el PDF exportado desde el cotizador, firma como Clinera y comparte el
              enlace con tu cliente.
            </p>
          </div>

          <section className={styles.seccion}>
            <div className={styles.seccionTitulo}>
              <span>01</span>
              <div>
                <h2>Documento</h2>
                <p>El PDF que descargaste desde /cotizacion (máx. 4 MB).</p>
              </div>
            </div>

            <div
              className={`${styles.dropzone} ${arrastrando ? styles.dropzoneActiva : ""} ${
                archivo ? styles.dropzoneConArchivo : ""
              }`}
              onDragOver={(evento) => {
                evento.preventDefault();
                setArrastrando(true);
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={(evento) => {
                evento.preventDefault();
                setArrastrando(false);
                elegirArchivo(evento.dataTransfer.files?.[0] ?? null);
              }}
            >
              <input
                ref={inputArchivoRef}
                id="firma-archivo"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(evento) => elegirArchivo(evento.target.files?.[0] ?? null)}
              />
              {archivo ? (
                <div className={styles.archivoElegido}>
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 2.5h7l3.5 3.5v11a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1v-13.5a1 1 0 0 1 1-1Z" />
                    <path d="M12 2.5V6h3.5" />
                  </svg>
                  <div>
                    <strong>{archivo.name}</strong>
                    <small>{formatoKb(archivo.size)} · listo para enviar</small>
                  </div>
                  <label htmlFor="firma-archivo">Cambiar</label>
                </div>
              ) : (
                <label htmlFor="firma-archivo" className={styles.dropzoneVacia}>
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 15.5v-11M7.5 9 12 4.5 16.5 9" />
                    <path d="M4.5 15.5v3a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
                  </svg>
                  <strong>Arrastra el PDF aquí o haz clic para elegirlo</strong>
                  <small>Solo PDF · máximo 4 MB</small>
                </label>
              )}
            </div>

            <Campo
              label="Título del documento"
              value={titulo}
              onChange={setTitulo}
              placeholder="Cotización CLI-20260801-001 — Clínica Aurora"
              requerido
            />
          </section>

          <section className={styles.seccion}>
            <div className={styles.seccionTitulo}>
              <span>02</span>
              <div>
                <h2>Quién firma por el cliente</h2>
                <p>El enlace de firma es personal: se envía a esta persona.</p>
              </div>
            </div>
            <div className={styles.gridCampos}>
              <Campo
                label="Nombre y apellido"
                value={clienteNombre}
                onChange={setClienteNombre}
                placeholder="Dra. Carla Mendieta"
                requerido
              />
              <Campo
                label="Email"
                type="email"
                value={clienteEmail}
                onChange={setClienteEmail}
                placeholder="nombre@clinica.cl"
                requerido
              />
              <Campo
                label="Clínica (opcional)"
                value={clienteClinica}
                onChange={setClienteClinica}
                placeholder="Clínica Estética Aurora"
              />
            </div>
          </section>

          <section className={styles.seccion}>
            <div className={styles.seccionTitulo}>
              <span>03</span>
              <div>
                <h2>Gestión de la solicitud</h2>
                <p>Quedas registrado como gestor y contacto comercial del documento.</p>
              </div>
            </div>
            <div className={styles.gridCampos}>
              <Campo
                label="Tu nombre"
                value={gestorNombre}
                onChange={setGestorNombre}
                placeholder="Nombre y apellido"
                requerido
              />
              <Campo
                label="Tu email"
                type="email"
                value={gestorEmail}
                onChange={setGestorEmail}
                placeholder="nombre@oacg.cl"
                requerido
              />
            </div>

            <div className={styles.notaCeo}>
              <strong>Firma por Clinera: Ricardo Oyarzún, CEO</strong>
              <p>
                El documento se firma automáticamente con la firma registrada del
                representante legal de Clinera. No necesitas dibujar nada.
              </p>
            </div>
          </section>

          {cotizacion && (
            <section className={styles.seccion}>
              <div className={styles.seccionTitulo}>
                <span>04</span>
                <div>
                  <h2>Suscripción y pago</h2>
                  <p>Al firmar, el cliente recibe el link de pago con estos valores.</p>
                </div>
              </div>

              <div className={styles.resumenPago}>
                <div>
                  <strong>
                    Cotización {cotizacion.numero || "Clinera"} · Plan{" "}
                    {cotizacion.planId
                      ? cotizacion.planId.charAt(0).toUpperCase() + cotizacion.planId.slice(1)
                      : ""}
                  </strong>
                  <small>
                    {typeof cotizacion.resumen?.totalPeriodo === "number"
                      ? `${formatoUsd(cotizacion.resumen.totalPeriodo)} por período ${
                          cotizacion.resumen?.periodo ?? ""
                        }`
                      : "Los montos se calculan del catálogo al crear la solicitud."}
                    {cotizacion.incluirSetup ? " · incluye configuración inicial" : ""}
                  </small>
                </div>
                <button type="button" className={styles.botonFantasma} onClick={descartarCotizacion}>
                  Quitar pago
                </button>
              </div>

              <div className={styles.duracionDescuento}>
                <span>Duración de los descuentos en la suscripción</span>
                <div className={styles.duracionOpciones}>
                  <label className={duracionTipo === "primer_pago" ? styles.duracionActiva : ""}>
                    <input
                      type="radio"
                      name="duracion"
                      checked={duracionTipo === "primer_pago"}
                      onChange={() => setDuracionTipo("primer_pago")}
                    />
                    <strong>Solo el primer pago</strong>
                    <small>Después vuelve a precio de lista</small>
                  </label>
                  <label className={duracionTipo === "meses" ? styles.duracionActiva : ""}>
                    <input
                      type="radio"
                      name="duracion"
                      checked={duracionTipo === "meses"}
                      onChange={() => setDuracionTipo("meses")}
                    />
                    <strong>Por meses</strong>
                    <small>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={duracionMeses}
                        onClick={() => setDuracionTipo("meses")}
                        onChange={(evento) =>
                          setDuracionMeses(
                            Math.min(60, Math.max(1, Number(evento.target.value) || 1)),
                          )
                        }
                        aria-label="Meses de descuento"
                      />{" "}
                      meses{cotizacion.billing === "semester" ? " (múltiplo de 6)" : ""}
                    </small>
                  </label>
                  <label className={duracionTipo === "siempre" ? styles.duracionActiva : ""}>
                    <input
                      type="radio"
                      name="duracion"
                      checked={duracionTipo === "siempre"}
                      onChange={() => setDuracionTipo("siempre")}
                    />
                    <strong>Para siempre</strong>
                    <small>Personalización perpetua</small>
                  </label>
                </div>
              </div>
            </section>
          )}

          {errorEnvio && (
            <p className={styles.error} role="alert">
              {errorEnvio}
            </p>
          )}

          <button type="submit" className={styles.botonPrimario} disabled={enviando}>
            {enviando ? "Creando solicitud…" : "Firmar por Clinera y generar enlace"}
          </button>

          {resultado && (
            <div className={styles.resultado} aria-live="polite">
              <strong>Solicitud creada. Comparte el enlace con tu cliente:</strong>
              <code>{resultado.url}</code>
              <div className={styles.resultadoAcciones}>
                <button
                  type="button"
                  className={styles.botonSecundario}
                  onClick={() => copiarEnlace(resultado.url, resultado.id)}
                >
                  {copiado ? "Enlace copiado" : "Copiar enlace"}
                </button>
                <a
                  className={styles.botonSecundario}
                  href={enlaceWhatsApp(resultado.url, clienteNombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </form>

        <section className={styles.lista} aria-label="Solicitudes de firma">
          <div className={styles.listaCabecera}>
            <div>
              <h2>Solicitudes</h2>
              <p>Estado de cada documento enviado a firma.</p>
            </div>
            <button
              type="button"
              className={styles.botonSecundario}
              onClick={() => clave && cargarSobres(clave)}
              disabled={cargandoLista}
            >
              {cargandoLista ? "Actualizando…" : "Actualizar"}
            </button>
          </div>

          {errorLista && (
            <p className={styles.error} role="alert">
              {errorLista}
            </p>
          )}

          {cargandoLista && sobres.length === 0 ? (
            <div className={styles.listaSkeleton} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          ) : sobres.length === 0 ? (
            <div className={styles.listaVacia}>
              <p>Todavía no hay solicitudes de firma.</p>
              <small>Crea la primera con el formulario de la izquierda.</small>
            </div>
          ) : (
            <ul className={styles.sobres}>
              {sobres.map((sobre) => {
                const url = `${window.location.origin}/firma/${sobre.id}`;
                return (
                  <li key={sobre.id} className={styles.sobre}>
                    <div className={styles.sobreCabecera}>
                      <span
                        className={`${styles.estado} ${
                          sobre.estado === "firmado" ? styles.estadoFirmado : styles.estadoPendiente
                        }`}
                      >
                        {sobre.estado === "firmado" ? "Firmado" : "Pendiente"}
                      </span>
                      <small>{formatoFecha(sobre.creadoEn)}</small>
                    </div>
                    <strong className={styles.sobreTitulo}>{sobre.titulo}</strong>
                    <small className={styles.sobreCliente}>
                      {sobre.cliente.nombre}
                      {sobre.cliente.clinica ? ` · ${sobre.cliente.clinica}` : ""} ·{" "}
                      {sobre.cliente.email}
                    </small>
                    {sobre.estado === "firmado" && sobre.firmadoEn && (
                      <small className={styles.sobreFirmadoEn}>
                        Firmado el {formatoFecha(sobre.firmadoEn)}
                      </small>
                    )}
                    <div className={styles.sobreAcciones}>
                      {sobre.estado === "firmado" ? (
                        <>
                          <a
                            className={styles.botonSecundario}
                            href={`/api/firma/${sobre.id}/pdf?version=firmado&descargar=1`}
                          >
                            Descargar firmado
                          </a>
                          {sobre.pago && (
                            <button
                              type="button"
                              className={styles.botonSecundario}
                              onClick={() =>
                                copiarEnlace(
                                  `${window.location.origin}/api/firma/${sobre.id}/pago`,
                                  `${sobre.id}:pago`,
                                )
                              }
                            >
                              {copiadoSobre === `${sobre.id}:pago`
                                ? "Copiado"
                                : "Link de pago"}
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.botonSecundario}
                            onClick={() => copiarEnlace(url, sobre.id)}
                          >
                            {copiadoSobre === sobre.id ? "Copiado" : "Copiar enlace"}
                          </button>
                          <a
                            className={styles.botonSecundario}
                            href={enlaceWhatsApp(url, sobre.cliente.nombre)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </>
                      )}
                      <a
                        className={styles.botonFantasma}
                        href={`/api/firma/${sobre.id}/pdf?descargar=1`}
                      >
                        Original
                      </a>
                      {sobre.estado === "pendiente" && (
                        <button
                          type="button"
                          className={styles.botonPeligro}
                          onClick={() => anularSobre(sobre.id)}
                        >
                          Anular
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
