"use client";

import { useId, useState, type CSSProperties, type FormEvent } from "react";
import { GRAD } from "@/components/brand-v3/Brand";
import {
  PARTNERS_APPLY,
  PARTNERS_APPLY_API,
} from "@/content/partners-program";
import {
  errorNombrePartner,
  errorTelefonoPartner,
  esPrefijoPartner,
  type PartnerApplyPrefix,
} from "@/lib/partner-apply";
import {
  digitosTelefono,
  formatearTelefono,
  PARTNERS_APPLY_PHONE_PREFIXES,
} from "@/lib/telefono";

type Status = "idle" | "sending" | "ok" | "error";

const DEFAULT_PREFIX: PartnerApplyPrefix = "+56";
const VIOLET = "#7C3AED";

const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 8,
  letterSpacing: "-0.01em",
};

const hintStyle: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 12,
  color: "#6B7280",
  margin: "0 0 10px",
  lineHeight: 1.45,
};

const fieldBase: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 15,
  color: "#0A0A0A",
  background: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  padding: "14px 16px",
  outline: "none",
  lineHeight: 1.3,
};

const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export function PartnerApplyForm() {
  const baseId = useId();
  const [nombre, setNombre] = useState("");
  const [prefix, setPrefix] = useState<PartnerApplyPrefix>(DEFAULT_PREFIX);
  const [local, setLocal] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<"nombre" | "prefix" | "tel" | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const errNombre = errorNombrePartner(nombre);
    if (errNombre) {
      setError(errNombre);
      return;
    }
    const errTel = errorTelefonoPartner(prefix, local);
    if (errTel) {
      setError(errTel);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(PARTNERS_APPLY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          prefix,
          telefono: digitosTelefono(local),
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        errores?: string[];
      } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.errores?.[0] || data?.error || PARTNERS_APPLY.errorSend,
        );
      }
      setStatus("ok");
      setNombre("");
      setLocal("");
      setPrefix(DEFAULT_PREFIX);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : PARTNERS_APPLY.errorSend,
      );
    }
  }

  if (status === "ok") {
    return (
      <div
        role="status"
        style={{
          borderRadius: 20,
          border: "1px solid #A7F3D0",
          background: "linear-gradient(180deg, #ECFDF5 0%, #F0FDF4 100%)",
          padding: "36px 28px",
          textAlign: "center",
          boxShadow: "0 18px 40px -28px rgba(16,185,129,.45)",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            margin: "0 auto 16px",
            display: "grid",
            placeItems: "center",
            background: GRAD,
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            boxShadow: "0 10px 24px -8px rgba(124,58,237,.5)",
          }}
        >
          ✓
        </div>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#064E3B",
            margin: "0 0 8px",
          }}
        >
          {PARTNERS_APPLY.successTitle}
        </p>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 15,
            color: "#047857",
            lineHeight: 1.55,
            margin: "0 auto",
            maxWidth: 360,
          }}
        >
          {PARTNERS_APPLY.success}
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  function ring(which: "nombre" | "prefix" | "tel"): CSSProperties {
    return focus === which
      ? {
          borderColor: "#A78BFA",
          boxShadow: "0 0 0 4px rgba(124,58,237,.12)",
        }
      : {};
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={error ? `${baseId}-error` : undefined}
      style={{
        maxWidth: 480,
        margin: "0 auto",
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 24,
        padding: "28px 28px 24px",
        boxShadow:
          "0 24px 60px -28px rgba(15,23,42,.18), 0 8px 20px -12px rgba(124,58,237,.12)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div>
        <label htmlFor={`${baseId}-nombre`} style={labelStyle}>
          {PARTNERS_APPLY.fields.nombre.label}
        </label>
        <input
          id={`${baseId}-nombre`}
          name="nombre"
          type="text"
          autoComplete="name"
          required
          disabled={sending}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onFocus={() => setFocus("nombre")}
          onBlur={() => setFocus(null)}
          placeholder={PARTNERS_APPLY.fields.nombre.placeholder}
          style={{
            ...fieldBase,
            ...ring("nombre"),
            opacity: sending ? 0.65 : 1,
          }}
        />
      </div>

      <div>
        <label htmlFor={`${baseId}-telefono`} style={labelStyle}>
          {PARTNERS_APPLY.fields.celular.label}
        </label>
        <p style={hintStyle}>{PARTNERS_APPLY.fields.celular.hint}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <label htmlFor={`${baseId}-prefix`} style={srOnly}>
            Código de país
          </label>
          <select
            id={`${baseId}-prefix`}
            name="prefix"
            disabled={sending}
            value={prefix}
            onChange={(e) => {
              const v = e.target.value;
              if (esPrefijoPartner(v)) {
                setPrefix(v);
                setLocal("");
              }
            }}
            onFocus={() => setFocus("prefix")}
            onBlur={() => setFocus(null)}
            style={{
              ...fieldBase,
              ...ring("prefix"),
              width: "auto",
              minWidth: 148,
              flexShrink: 0,
              cursor: sending ? "not-allowed" : "pointer",
              opacity: sending ? 0.65 : 1,
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage:
                "linear-gradient(45deg, transparent 50%, #6B7280 50%), linear-gradient(135deg, #6B7280 50%, transparent 50%)",
              backgroundPosition:
                "calc(100% - 18px) calc(50% - 3px), calc(100% - 12px) calc(50% - 3px)",
              backgroundSize: "6px 6px, 6px 6px",
              backgroundRepeat: "no-repeat",
              paddingRight: 32,
            }}
          >
            {PARTNERS_APPLY_PHONE_PREFIXES.map((p) => (
              <option key={p.prefix} value={p.prefix}>
                {p.flag} {p.label} {p.prefix}
              </option>
            ))}
          </select>
          <input
            id={`${baseId}-telefono`}
            name="telefono"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            disabled={sending}
            value={local}
            onChange={(e) =>
              setLocal(
                formatearTelefono(digitosTelefono(e.target.value), prefix),
              )
            }
            onFocus={() => setFocus("tel")}
            onBlur={() => setFocus(null)}
            placeholder="9 1234 5678"
            style={{
              ...fieldBase,
              ...ring("tel"),
              flex: 1,
              minWidth: 0,
              opacity: sending ? 0.65 : 1,
            }}
          />
        </div>
      </div>

      {error ? (
        <p
          id={`${baseId}-error`}
          role="alert"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            color: "#DC2626",
            margin: 0,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        style={{
          width: "100%",
          border: 0,
          borderRadius: 12,
          padding: "15px 22px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#fff",
          background: GRAD,
          cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.7 : 1,
          boxShadow:
            "0 14px 34px -10px rgba(124,58,237,.45), 0 4px 12px -2px rgba(217,70,239,.25)",
        }}
      >
        {sending ? PARTNERS_APPLY.sending : PARTNERS_APPLY.submit}
      </button>
    </form>
  );
}

export function PartnerApplySection() {
  return (
    <section
      id={PARTNERS_APPLY.id}
      className="partners-section"
      style={{
        padding: "96px 80px",
        background:
          "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,.06), transparent 55%), #FAFAFA",
        borderTop: "1px solid #F0F0F0",
        scrollMarginTop: 96,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: VIOLET,
            margin: 0,
          }}
        >
          {PARTNERS_APPLY.eyebrow}
        </p>
        <h2
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
          }}
        >
          {PARTNERS_APPLY.h2Before}{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {PARTNERS_APPLY.h2Accent}
          </span>
        </h2>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 auto 36px",
            maxWidth: 480,
          }}
        >
          {PARTNERS_APPLY.lead}
        </p>
        <div style={{ textAlign: "left" }}>
          <PartnerApplyForm />
        </div>
      </div>
    </section>
  );
}
