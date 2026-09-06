"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CtaPrimary, GRAD } from "@/components/brand-v3/Brand";
import {
  PARTNERS_DOCTORS_API,
  PARTNERS_DOCTORS_CONVENIO,
} from "@/content/partners-program";
import {
  errorDelPaso,
  normalizarPostulacion,
  type PostulacionDoctores,
} from "@/lib/convenio-doctores";

type Vista = "cta" | 1 | 2 | 3 | "ok";

const VACIO: PostulacionDoctores = { nombre: "", correo: "", motivo: "" };
const HASHES_DEFAULT = [PARTNERS_DOCTORS_CONVENIO.id] as const;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.16)",
  borderRadius: 12,
  color: "#fff",
  fontFamily: "Inter",
  fontSize: 16,
  padding: "14px 16px",
  outline: "none",
};

export function ConvenioDoctoresWizard({
  hashes = HASHES_DEFAULT,
}: {
  /** Anclas que abren el paso 1 (en `/partners` es #convenio-doctores). */
  hashes?: readonly string[];
} = {}) {
  const offer = PARTNERS_DOCTORS_CONVENIO;
  const [vista, setVista] = useState<Vista>("cta");
  const [valores, setValores] = useState<PostulacionDoctores>(VACIO);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const enviandoRef = useRef(false);
  const campoRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const uid = useId();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const abrir = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (hashes.includes(id)) setVista((v) => (v === "cta" ? 1 : v));
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => window.removeEventListener("hashchange", abrir);
  }, [hashes]);

  useEffect(() => {
    if (vista === 1 || vista === 2 || vista === 3) campoRef.current?.focus();
  }, [vista]);

  function campoDe(paso: 1 | 2 | 3): keyof PostulacionDoctores {
    return offer.wizard.steps[paso - 1].key;
  }

  function avanzar() {
    if (vista === "cta" || vista === "ok") return;
    const key = campoDe(vista);
    const mensaje = errorDelPaso(key, valores[key]);
    if (mensaje) {
      setError(mensaje);
      campoRef.current?.focus();
      return;
    }
    setError(null);
    if (vista === 3) {
      void enviar();
      return;
    }
    setVista((vista + 1) as 2 | 3);
  }

  async function enviar() {
    if (enviandoRef.current) return;
    const payload = normalizarPostulacion(valores);
    enviandoRef.current = true;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(PARTNERS_DOCTORS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; errores?: string[] }
        | null;
      if (!res.ok || !json?.ok) {
        setError(json?.errores?.[0] || offer.wizard.errorEnvio);
        enviandoRef.current = false;
        setEnviando(false);
        return;
      }
      setVista("ok");
      setValores(VACIO);
    } catch {
      setError(offer.wizard.errorEnvio);
    }
    enviandoRef.current = false;
    setEnviando(false);
  }

  if (vista === "cta") {
    return (
      <CtaPrimary
        onClick={() => {
          setError(null);
          setVista(1);
        }}
        style={{ padding: "14px 22px", fontSize: 15 }}
      >
        {offer.cta} <span style={{ marginLeft: 2 }}>→</span>
      </CtaPrimary>
    );
  }

  if (vista === "ok") {
    return (
      <div
        role="status"
        style={{
          maxWidth: 480,
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 16,
          padding: "24px 22px",
        }}
      >
        <h3
          style={{
            fontFamily: "Inter",
            fontSize: 20,
            fontWeight: 700,
            margin: "0 0 8px",
            color: "#fff",
          }}
        >
          {offer.wizard.exitoTitulo}
        </h3>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 15,
            color: "rgba(255,255,255,.72)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {offer.wizard.exito}
        </p>
      </div>
    );
  }

  const paso = offer.wizard.steps[vista - 1];
  const key = paso.key;
  const esMotivo = key === "motivo";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        avanzar();
      }}
      style={{
        maxWidth: 480,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 16,
        padding: "24px 22px",
      }}
    >
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#C4B5FD",
          margin: "0 0 12px",
        }}
      >
        Paso {vista} de 3
      </p>
      <label
        htmlFor={`${uid}-${key}`}
        style={{
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          display: "block",
          marginBottom: 8,
        }}
      >
        {paso.label}
      </label>
      {esMotivo ? (
        <textarea
          id={`${uid}-${key}`}
          ref={(el) => {
            campoRef.current = el;
          }}
          name={key}
          rows={4}
          autoComplete="off"
          placeholder={paso.placeholder}
          value={valores.motivo}
          onChange={(e) => {
            setValores((prev) => ({ ...prev, motivo: e.target.value }));
            setError(null);
          }}
          style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
        />
      ) : (
        <input
          id={`${uid}-${key}`}
          ref={(el) => {
            campoRef.current = el;
          }}
          name={key}
          type={key === "correo" ? "email" : "text"}
          autoComplete={key === "correo" ? "email" : "name"}
          placeholder={paso.placeholder}
          value={valores[key]}
          onChange={(e) => {
            setValores((prev) => ({ ...prev, [key]: e.target.value }));
            setError(null);
          }}
          style={inputStyle}
        />
      )}
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 13,
          color: "rgba(255,255,255,.55)",
          margin: "8px 0 0",
        }}
      >
        {paso.hint}
      </p>
      {error ? (
        <p
          role="alert"
          style={{
            fontFamily: "Inter",
            fontSize: 13,
            color: "#FCA5A5",
            margin: "10px 0 0",
          }}
        >
          {error}
        </p>
      ) : null}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={enviando}
          style={{
            background: GRAD,
            color: "#fff",
            border: 0,
            padding: "14px 22px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
            cursor: enviando ? "wait" : "pointer",
            fontFamily: "Inter",
            boxShadow:
              "0 12px 32px -8px rgba(124,58,237,.35),0 4px 12px -2px rgba(217,70,239,.22)",
            letterSpacing: "-0.005em",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            lineHeight: 1,
            opacity: enviando ? 0.7 : 1,
          }}
        >
          {vista === 3
            ? enviando
              ? "Enviando…"
              : offer.wizard.enviar
            : offer.wizard.continuar}{" "}
          <span style={{ marginLeft: 2 }}>→</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setVista(vista === 1 ? "cta" : ((vista - 1) as 1 | 2));
          }}
          style={{
            background: "none",
            border: 0,
            color: "rgba(255,255,255,.6)",
            fontFamily: "Inter",
            fontSize: 14,
            cursor: "pointer",
            minHeight: 44,
            padding: "0 4px",
          }}
        >
          {offer.wizard.volver}
        </button>
      </div>
    </form>
  );
}
