"use client";

// ============================================================================
// /firma/[id] — página pública de firma del cliente
// ----------------------------------------------------------------------------
// Quien recibe el enlace revisa el documento (servido same-origin desde
// /api/firma/[id]/pdf), confirma sus datos, dibuja su firma y acepta la
// declaración de firma electrónica simple. Al firmar se genera el PDF final
// con hoja de firmas y la misma página pasa a modo verificación/descarga.
// ============================================================================

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SignaturePad, { type SignaturePadHandle } from "../SignaturePad";
import styles from "../firma.module.css";
import type { SobrePublico } from "@/lib/firma/tipos";

const formatoUsdCentavos = (centavos: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(centavos / 100);

const formatoFechaLarga = (iso: string) =>
  new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

type Fase = "cargando" | "no-encontrado" | "pendiente" | "enviando" | "firmado";

export default function FirmaCliente({ id }: { id: string }) {
  const [fase, setFase] = useState<Fase>("cargando");
  const [sobre, setSobre] = useState<SobrePublico | null>(null);
  const [recienFirmado, setRecienFirmado] = useState(false);
  const [avisoPago, setAvisoPago] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rut, setRut] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [tieneFirma, setTieneFirma] = useState(false);
  const [error, setError] = useState("");

  const padRef = useRef<SignaturePadHandle>(null);

  const cargar = useCallback(async () => {
    try {
      const respuesta = await fetch(`/api/firma/${id}`);
      const json = (await respuesta.json()) as {
        ok: boolean;
        sobre?: SobrePublico;
        error?: string;
      };
      if (!respuesta.ok || !json.ok || !json.sobre) {
        setFase("no-encontrado");
        return;
      }
      setSobre(json.sobre);
      setNombre((actual) => actual || json.sobre!.cliente.nombre);
      setEmail((actual) => actual || json.sobre!.cliente.email);
      setFase(json.sobre.estado === "firmado" ? "firmado" : "pendiente");
    } catch {
      setFase("no-encontrado");
    }
  }, [id]);

  useEffect(() => {
    // El fetch es asíncrono: los setState corren al resolver, no en el cuerpo
    // del efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargar();
  }, [cargar]);

  useEffect(() => {
    // Stripe vuelve con ?pago=<código> (ok, sin-config, error…): solo se lee
    // en el cliente, por eso va en un efecto.
    const codigo = new URLSearchParams(window.location.search).get("pago");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (codigo) setAvisoPago(codigo);
  }, []);

  const firmar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (fase === "enviando") return;
    setError("");

    const firmaPng = padRef.current?.obtenerPng() ?? null;
    if (!firmaPng) {
      setError("Dibuja tu firma en el recuadro antes de continuar.");
      return;
    }
    if (!acepta) {
      setError("Debes aceptar la declaración de firma electrónica.");
      return;
    }

    setFase("enviando");
    try {
      const respuesta = await fetch(`/api/firma/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          rut: rut.trim(),
          firmaPng,
          acepta,
        }),
      });
      const json = (await respuesta.json()) as {
        ok: boolean;
        sobre?: SobrePublico;
        error?: string;
      };
      if (!respuesta.ok || !json.ok || !json.sobre) {
        // 409 = ya estaba firmado: recargamos para mostrar el estado real.
        if (respuesta.status === 409) {
          await cargar();
          return;
        }
        setError(json.error || "No pudimos registrar tu firma. Inténtalo de nuevo.");
        setFase("pendiente");
        return;
      }
      setSobre(json.sobre);
      setRecienFirmado(true);
      setFase("firmado");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Sin conexión con el servidor. Reintenta en un momento.");
      setFase("pendiente");
    }
  };

  const urlPdf = `/api/firma/${id}/pdf`;

  return (
    <main id="contenido" className={`${styles.page} ${styles.paginaCliente}`}>
      <header className={styles.clienteTopbar}>
        <div className={styles.topbarBrand}>
          <Image
            src="/images/brand/quote-logo.svg"
            width={30}
            height={30}
            alt="Clinera"
            priority
          />
          <span>clinera.io</span>
          <i aria-hidden="true" />
          <strong>Firma electrónica</strong>
        </div>
      </header>

      <div className={styles.clienteContenido}>
        {fase === "cargando" && (
          <div className={styles.clienteSkeleton} aria-label="Cargando documento">
            <span />
            <span />
            <span />
          </div>
        )}

        {fase === "no-encontrado" && (
          <section className={styles.clienteCard}>
            <h1>Solicitud no encontrada</h1>
            <p className={styles.clienteParrafo}>
              Este enlace de firma no existe o fue anulado por el equipo de Clinera.
              Escríbele a tu ejecutivo comercial para que te envíe uno nuevo.
            </p>
          </section>
        )}

        {(fase === "pendiente" || fase === "enviando") && sobre && (
          <>
            <section className={styles.clienteIntro}>
              <span className={styles.clienteKicker}>Te invitaron a firmar</span>
              <h1>{sobre.titulo}</h1>
              <p>
                {(sobre.gestor ?? sobre.closer).nombre} de Clinera te envió este documento
                de {sobre.paginas} página{sobre.paginas === 1 ? "" : "s"} para firma
                electrónica simple.{" "}
                {sobre.pago && !sobre.pagado
                  ? "Revísalo completo, paga tu suscripción y firma al final."
                  : "Revísalo completo y firma al final."}
              </p>
            </section>

            <section className={styles.visor} aria-label="Documento a firmar">
              <div className={styles.visorCabecera}>
                <span>{sobre.nombreArchivo}</span>
                <div>
                  <a href={urlPdf} target="_blank" rel="noopener noreferrer">
                    Abrir en pestaña nueva
                  </a>
                  <a href={`${urlPdf}?descargar=1`}>Descargar</a>
                </div>
              </div>
              <iframe src={`${urlPdf}#toolbar=0`} title={`Documento: ${sobre.titulo}`} />
            </section>

            {avisoPago && avisoPago !== "ok" && (
              <p className={styles.error} role="alert">
                {avisoPago === "sin-config"
                  ? "El pago en línea aún no está habilitado. Tu ejecutivo te enviará las instrucciones."
                  : avisoPago === "ya-pagado"
                    ? "Tu pago ya estaba registrado. Continúa con la firma."
                    : "No pudimos completar el pago. Inténtalo de nuevo o avísale a tu ejecutivo."}
              </p>
            )}

            {sobre.pago && !sobre.pagado ? (
              <section className={styles.clienteCard}>
                <h2>Paso 1 · Paga tu suscripción</h2>
                <div className={styles.pagoResumen}>
                  <div>
                    <span>Suscripción {sobre.pago.periodo}</span>
                    <strong>
                      {formatoUsdCentavos(sobre.pago.totalPeriodo)} /{" "}
                      {sobre.pago.periodo === "semestral" ? "semestre" : "mes"}
                    </strong>
                    {sobre.pago.descuentoPeriodo > 0 && (
                      <small>
                        Incluye {formatoUsdCentavos(sobre.pago.descuentoPeriodo)} de descuento{" "}
                        {sobre.pago.duracionDescuento.tipo === "siempre"
                          ? "permanente"
                          : sobre.pago.duracionDescuento.tipo === "meses"
                            ? `por ${sobre.pago.duracionDescuento.meses} meses`
                            : "en tu primer pago"}
                      </small>
                    )}
                    {sobre.pago.setupUnico > 0 && (
                      <small>
                        + {formatoUsdCentavos(sobre.pago.setupUnico)} de configuración inicial
                        (una sola vez)
                      </small>
                    )}
                  </div>
                  <a className={styles.botonPrimario} href={`/api/firma/${id}/pago`}>
                    Pagar suscripción
                  </a>
                </div>
                <p className={styles.clienteParrafo}>
                  El pago se procesa de forma segura en Stripe. Al completarlo volverás a
                  esta página para el <b>Paso 2: firmar el documento</b>.
                </p>
              </section>
            ) : (
            <form className={styles.clienteCard} onSubmit={firmar}>
              {sobre.pago && sobre.pagado && (
                <p className={styles.avisoPagoOk} role="status">
                  Pago recibido. Ahora completa la firma para dejar el acuerdo suscrito.
                </p>
              )}
              <h2>{sobre.pago ? "Paso 2 · Tus datos de firma" : "Tus datos de firma"}</h2>
              <div className={styles.gridCampos}>
                <label className={styles.campo}>
                  <span>
                    Nombre completo<small>Requerido</small>
                  </span>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    required
                  />
                </label>
                <label className={styles.campo}>
                  <span>
                    Email<small>Requerido</small>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    required
                  />
                </label>
                <label className={styles.campo}>
                  <span>RUT (opcional)</span>
                  <input
                    type="text"
                    value={rut}
                    onChange={(evento) => setRut(evento.target.value)}
                    placeholder="12.345.678-9"
                    inputMode="text"
                  />
                </label>
              </div>

              <div className={styles.padContenedor}>
                <div className={styles.padCabecera}>
                  <span>Dibuja tu firma</span>
                  <button
                    type="button"
                    className={styles.botonFantasma}
                    onClick={() => padRef.current?.limpiar()}
                  >
                    Limpiar
                  </button>
                </div>
                <div className={styles.pad}>
                  <SignaturePad
                    ref={padRef}
                    onCambio={setTieneFirma}
                    etiqueta="Tu firma manuscrita"
                  />
                  {!tieneFirma && <span className={styles.padGuia}>Firma aquí</span>}
                </div>
              </div>

              <label className={styles.consentimiento}>
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(evento) => setAcepta(evento.target.checked)}
                />
                <span>
                  Declaro que soy la persona individualizada arriba, que leí íntegramente el
                  documento y que consiento en suscribirlo mediante <b>firma electrónica
                  simple</b> conforme a la Ley N.º 19.799 de Chile. Acepto que se registre
                  mi nombre, email, fecha, IP y dispositivo como evidencia de esta firma.
                </span>
              </label>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles.botonPrimario}
                disabled={fase === "enviando"}
              >
                {fase === "enviando" ? "Registrando tu firma…" : "Firmar documento"}
              </button>
            </form>
            )}
          </>
        )}

        {fase === "firmado" && sobre && (
          <section className={styles.clienteCard}>
            <div className={styles.selloFirmado} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22">
                <circle cx="11" cy="11" r="10" />
                <path d="m6.5 11.5 3 3 6-6.5" />
              </svg>
            </div>
            <h1>{recienFirmado ? "Documento firmado con éxito" : "Documento ya firmado"}</h1>
            <p className={styles.clienteParrafo}>
              <b>{sobre.titulo}</b> quedó suscrito por ambas partes mediante firma
              electrónica simple
              {sobre.firmadoEn ? ` el ${formatoFechaLarga(sobre.firmadoEn)}` : ""}. Descarga
              tu copia con la hoja de firmas incluida y guárdala como respaldo.
            </p>

            {sobre.pagado ? (
              <p className={styles.avisoPagoOk} role="status">
                Suscripción pagada el {formatoFechaLarga(sobre.pagado.en)}. El equipo de
                Clinera te contactará para coordinar la puesta en marcha.
              </p>
            ) : (
              avisoPago &&
              avisoPago !== "ok" && (
                <p className={styles.error} role="alert">
                  {avisoPago === "sin-config"
                    ? "El pago en línea aún no está habilitado. Tu ejecutivo te enviará las instrucciones de pago."
                    : "No pudimos abrir la página de pago. Inténtalo de nuevo o avísale a tu ejecutivo."}
                </p>
              )
            )}

            {sobre.pago && !sobre.pagado && (
              <div className={styles.pagoResumen}>
                <div>
                  <span>Suscripción {sobre.pago.periodo}</span>
                  <strong>
                    {formatoUsdCentavos(sobre.pago.totalPeriodo)} / {sobre.pago.periodo === "semestral" ? "semestre" : "mes"}
                  </strong>
                  {sobre.pago.descuentoPeriodo > 0 && (
                    <small>
                      Incluye {formatoUsdCentavos(sobre.pago.descuentoPeriodo)} de descuento{" "}
                      {sobre.pago.duracionDescuento.tipo === "siempre"
                        ? "permanente"
                        : sobre.pago.duracionDescuento.tipo === "meses"
                          ? `por ${sobre.pago.duracionDescuento.meses} meses`
                          : "en tu primer pago"}
                    </small>
                  )}
                  {sobre.pago.setupUnico > 0 && (
                    <small>
                      + {formatoUsdCentavos(sobre.pago.setupUnico)} de configuración inicial (una
                      sola vez)
                    </small>
                  )}
                </div>
                <a className={styles.botonPrimario} href={`/api/firma/${id}/pago`}>
                  Continuar al pago
                </a>
              </div>
            )}

            <a
              className={sobre.pago && !sobre.pagado ? styles.botonSecundario : styles.botonPrimario}
              href={`${urlPdf}?version=firmado&descargar=1`}
            >
              Descargar documento firmado
            </a>

            <dl className={styles.verificacion}>
              <div>
                <dt>Folio</dt>
                <dd>{sobre.id}</dd>
              </div>
              <div>
                <dt>Firmado por</dt>
                <dd>
                  {sobre.closer.nombre} (Clinera) y {sobre.cliente.nombre}
                </dd>
              </div>
              {sobre.firmadoSha256 && (
                <div>
                  <dt>SHA-256 del documento firmado</dt>
                  <dd>{sobre.firmadoSha256}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        <footer className={styles.clienteFooter}>
          <span>
            Firma electrónica simple · Ley N.º 19.799 (Chile) · Evidencia resguardada por
            clinera.io
          </span>
        </footer>
      </div>
    </main>
  );
}
