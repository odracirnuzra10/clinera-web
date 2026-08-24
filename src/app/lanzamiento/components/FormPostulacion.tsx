"use client";

import { useId, useState, type FormEvent } from "react";
import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { ArrowRight, Check, Spinner, WarningCircle } from "./Icons";

type Campos = {
  nombre: string;
  especialidad: string;
  clinica: string;
  codigoPais: string;
  whatsapp: string;
  email: string;
  perfil: string;
};

type Errores = Partial<Record<keyof Campos, string>>;

const INICIAL: Campos = {
  nombre: "",
  especialidad: "",
  clinica: "",
  codigoPais: evento.codigosPais[0].codigo,
  whatsapp: "",
  email: "",
  perfil: "",
};

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const RE_HANDLE = /^@[a-z0-9._]{2,30}$/i;
const RE_URL =
  /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

function validar(campos: Campos): Errores {
  const e: Errores = {};

  if (campos.nombre.trim().length < 3) {
    e.nombre = "Escribe tu nombre y apellido.";
  } else if (!campos.nombre.trim().includes(" ")) {
    e.nombre = "Falta el apellido.";
  }

  if (!campos.especialidad) {
    e.especialidad = "Elige tu especialidad o rol.";
  }

  if (campos.clinica.trim().length < 2) {
    e.clinica = "Escribe el nombre de tu clínica.";
  }

  const soloDigitos = campos.whatsapp.replace(/\D/g, "");
  if (soloDigitos.length < 8) {
    e.whatsapp = "Escribe tu número de WhatsApp sin el código de país.";
  } else if (soloDigitos.length > 12) {
    e.whatsapp = "Revisa el número: tiene demasiados dígitos.";
  }

  if (!RE_EMAIL.test(campos.email.trim())) {
    e.email = "Revisa tu correo — no parece válido.";
  }

  const perfil = campos.perfil.trim();
  if (!perfil) {
    e.perfil = "Necesitamos tu Instagram o sitio web.";
  } else if (!RE_HANDLE.test(perfil) && !RE_URL.test(perfil)) {
    e.perfil = "Usa un handle como @tuclinica o una URL como tuclinica.cl";
  }

  return e;
}

export default function FormPostulacion() {
  const uid = useId();
  const [campos, setCampos] = useState<Campos>(INICIAL);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">(
    "idle",
  );

  const id = (campo: string) => `${uid}-${campo}`;
  const errorId = (campo: string) => `${uid}-${campo}-error`;

  function actualizar<K extends keyof Campos>(campo: K, valor: Campos[K]) {
    setCampos((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nuevos = validar(campos);
    setErrores(nuevos);

    const primero = Object.keys(nuevos)[0];
    if (primero) {
      document.getElementById(id(primero))?.focus();
      return;
    }

    if (!evento.webhookUrl) {
      setEstado("error");
      return;
    }

    setEstado("enviando");

    try {
      const respuesta = await fetch(evento.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evento: "lanzamiento-los-angeles",
          fecha_evento: evento.fechaISO,
          nombre: campos.nombre.trim(),
          especialidad: campos.especialidad,
          clinica: campos.clinica.trim(),
          whatsapp: `${campos.codigoPais}${campos.whatsapp.replace(/\D/g, "")}`,
          codigo_pais: campos.codigoPais,
          email: campos.email.trim().toLowerCase(),
          perfil: campos.perfil.trim(),
          enviado_en: new Date().toISOString(),
          origen: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      setEstado("ok");
      setCampos(INICIAL);
    } catch {
      setEstado("error");
    }
  }

  const enviando = estado === "enviando";

  const inputBase =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors duration-200 placeholder:text-[#A8A8A8] focus:border-[#111111] focus:outline-none disabled:opacity-60";
  const borde = (campo: keyof Campos) =>
    errores[campo] ? "border-[#D1495B]" : "border-[#EAEAEA]";

  return (
    <section
      id="postular"
      className="scroll-mt-20 border-b border-[#EAEAEA] bg-[#F7F6F3] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="mono-eyebrow text-[#6B6B6B]">Postulación</p>
          <h2 className="mt-4 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-[#111111] sm:text-[40px]">
            Postula a uno de los {evento.cupos.total} cupos
          </h2>
          <p className="mt-5 text-[16px] leading-[1.65] text-[#6B6B6B]">
            Revisamos cada postulación para cuidar la mesa. Te confirmamos tu
            cupo por WhatsApp.
          </p>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-10 max-w-xl">
          <div className="rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-9">
            {estado === "ok" ? (
              <div className="py-6 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-[#F1EDFD]">
                  <Check className="h-5 w-5 text-[#7C3AED]" />
                </span>
                <p
                  role="status"
                  className="mt-5 text-[20px] leading-[1.35] font-semibold tracking-[-0.02em] text-[#111111]"
                >
                  Postulación recibida.
                </p>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#6B6B6B]">
                  Te escribimos por WhatsApp para confirmar tu cupo.
                </p>
                <button
                  type="button"
                  onClick={() => setEstado("idle")}
                  className="mono-eyebrow mt-7 rounded-lg border border-[#EAEAEA] bg-white px-4 py-2.5 text-[#111111] transition-colors duration-200 hover:bg-[#F7F6F3] active:scale-[0.98]"
                >
                  Postular a otra persona
                </button>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor={id("nombre")}
                    className="block text-[13px] font-medium text-[#111111]"
                  >
                    Nombre y apellido
                  </label>
                  <input
                    id={id("nombre")}
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={enviando}
                    value={campos.nombre}
                    onChange={(e) => actualizar("nombre", e.target.value)}
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={
                      errores.nombre ? errorId("nombre") : undefined
                    }
                    className={`mt-2 ${inputBase} ${borde("nombre")}`}
                  />
                  {errores.nombre && (
                    <p
                      id={errorId("nombre")}
                      className="mt-1.5 text-[13px] text-[#B3374A]"
                    >
                      {errores.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={id("especialidad")}
                    className="block text-[13px] font-medium text-[#111111]"
                  >
                    Especialidad o rol
                  </label>
                  <select
                    id={id("especialidad")}
                    name="especialidad"
                    required
                    disabled={enviando}
                    value={campos.especialidad}
                    onChange={(e) => actualizar("especialidad", e.target.value)}
                    aria-invalid={Boolean(errores.especialidad)}
                    aria-describedby={
                      errores.especialidad
                        ? errorId("especialidad")
                        : undefined
                    }
                    className={`mt-2 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B6B6B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px_18px] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${inputBase} ${borde("especialidad")}`}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {evento.especialidades.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                  {errores.especialidad && (
                    <p
                      id={errorId("especialidad")}
                      className="mt-1.5 text-[13px] text-[#B3374A]"
                    >
                      {errores.especialidad}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={id("clinica")}
                    className="block text-[13px] font-medium text-[#111111]"
                  >
                    Nombre de la clínica
                  </label>
                  <input
                    id={id("clinica")}
                    name="clinica"
                    type="text"
                    autoComplete="organization"
                    required
                    disabled={enviando}
                    value={campos.clinica}
                    onChange={(e) => actualizar("clinica", e.target.value)}
                    aria-invalid={Boolean(errores.clinica)}
                    aria-describedby={
                      errores.clinica ? errorId("clinica") : undefined
                    }
                    className={`mt-2 ${inputBase} ${borde("clinica")}`}
                  />
                  {errores.clinica && (
                    <p
                      id={errorId("clinica")}
                      className="mt-1.5 text-[13px] text-[#B3374A]"
                    >
                      {errores.clinica}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={id("whatsapp")}
                    className="block text-[13px] font-medium text-[#111111]"
                  >
                    WhatsApp
                  </label>
                  <div
                    className={`mt-2 flex overflow-hidden rounded-lg border bg-white transition-colors duration-200 focus-within:border-[#111111] ${borde("whatsapp")}`}
                  >
                    <label htmlFor={id("codigoPais")} className="sr-only">
                      Código de país
                    </label>
                    <select
                      id={id("codigoPais")}
                      name="codigoPais"
                      disabled={enviando}
                      value={campos.codigoPais}
                      onChange={(e) => actualizar("codigoPais", e.target.value)}
                      className="shrink-0 appearance-none border-r border-[#EAEAEA] bg-[#FBFBFA] py-2.5 pr-8 pl-3 text-[15px] text-[#111111] focus:outline-none disabled:opacity-60"
                    >
                      {evento.codigosPais.map((p) => (
                        <option key={p.codigo} value={p.codigo}>
                          {p.codigo} {p.pais}
                        </option>
                      ))}
                    </select>
                    <input
                      id={id("whatsapp")}
                      name="whatsapp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      required
                      disabled={enviando}
                      value={campos.whatsapp}
                      onChange={(e) => actualizar("whatsapp", e.target.value)}
                      aria-invalid={Boolean(errores.whatsapp)}
                      aria-describedby={
                        errores.whatsapp ? errorId("whatsapp") : undefined
                      }
                      className="w-full min-w-0 bg-white px-3 py-2.5 text-[15px] text-[#111111] focus:outline-none disabled:opacity-60"
                    />
                  </div>
                  {errores.whatsapp && (
                    <p
                      id={errorId("whatsapp")}
                      className="mt-1.5 text-[13px] text-[#B3374A]"
                    >
                      {errores.whatsapp}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={id("email")}
                    className="block text-[13px] font-medium text-[#111111]"
                  >
                    Email
                  </label>
                  <input
                    id={id("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={enviando}
                    value={campos.email}
                    onChange={(e) => actualizar("email", e.target.value)}
                    aria-invalid={Boolean(errores.email)}
                    aria-describedby={
                      errores.email ? errorId("email") : undefined
                    }
                    className={`mt-2 ${inputBase} ${borde("email")}`}
                  />
                  {errores.email && (
                    <p
                      id={errorId("email")}
                      className="mt-1.5 text-[13px] text-[#B3374A]"
                    >
                      {errores.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={id("perfil")}
                    className="block text-[13px] font-medium text-[#111111]"
                  >
                    Instagram o sitio web de tu clínica
                  </label>
                  <input
                    id={id("perfil")}
                    name="perfil"
                    type="text"
                    autoComplete="url"
                    required
                    disabled={enviando}
                    value={campos.perfil}
                    onChange={(e) => actualizar("perfil", e.target.value)}
                    aria-invalid={Boolean(errores.perfil)}
                    aria-describedby={`${id("perfil")}-ayuda${
                      errores.perfil ? ` ${errorId("perfil")}` : ""
                    }`}
                    className={`mt-2 ${inputBase} ${borde("perfil")}`}
                  />
                  <p
                    id={`${id("perfil")}-ayuda`}
                    className="mt-1.5 text-[13px] text-[#6B6B6B]"
                  >
                    Lo usamos para confirmar tu perfil profesional
                  </p>
                  {errores.perfil && (
                    <p
                      id={errorId("perfil")}
                      className="mt-1.5 text-[13px] text-[#B3374A]"
                    >
                      {errores.perfil}
                    </p>
                  )}
                </div>

                {estado === "error" && (
                  <div
                    role="alert"
                    className="flex gap-3 rounded-lg border border-[#F3D3D8] bg-[#FDEBEC] px-4 py-3"
                  >
                    <WarningCircle className="mt-[2px] h-[18px] w-[18px] shrink-0 text-[#B3374A]" />
                    <p className="text-[14px] leading-[1.55] text-[#8A2A3A]">
                      No pudimos enviar tu postulación. Revisa tu conexión y
                      vuelve a intentarlo — si sigue fallando, escríbenos por
                      WhatsApp.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-3 text-[15px] font-medium text-white transition-transform duration-150 hover:bg-[#000000] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#3A3A3A]"
                >
                  {enviando ? (
                    <>
                      <Spinner className="h-4 w-4 animate-spin" />
                      Enviando
                    </>
                  ) : (
                    <>
                      {estado === "error"
                        ? "Reintentar envío"
                        : "Enviar postulación"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                {enviando ? (
                  <div
                    aria-hidden="true"
                    className="h-[15px] w-3/4 animate-pulse rounded bg-[#EAEAEA]"
                  />
                ) : (
                  <p className="mono-eyebrow text-[#6B6B6B]">
                    Cupos limitados · Confirmación por WhatsApp en menos de 24
                    hrs
                  </p>
                )}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
