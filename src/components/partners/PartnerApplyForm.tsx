"use client";

import { useId, useState, type FormEvent } from "react";
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

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500/30 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 disabled:opacity-60";

export function PartnerApplyForm() {
  const baseId = useId();
  const [nombre, setNombre] = useState("");
  const [prefix, setPrefix] = useState<PartnerApplyPrefix>(DEFAULT_PREFIX);
  const [local, setLocal] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

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
        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center"
        role="status"
      >
        <p className="text-lg font-semibold text-emerald-900">
          {PARTNERS_APPLY.successTitle}
        </p>
        <p className="mt-2 text-sm text-emerald-800">{PARTNERS_APPLY.success}</p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      noValidate
      aria-describedby={error ? `${baseId}-error` : undefined}
    >
      <div>
        <label
          htmlFor={`${baseId}-nombre`}
          className="block text-sm font-medium text-slate-700"
        >
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
          placeholder={PARTNERS_APPLY.fields.nombre.placeholder}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor={`${baseId}-telefono`}
          className="block text-sm font-medium text-slate-700"
        >
          {PARTNERS_APPLY.fields.celular.label}
        </label>
        <p className="mt-0.5 text-xs text-slate-500">
          {PARTNERS_APPLY.fields.celular.hint}
        </p>
        <div className="mt-1.5 flex gap-2">
          <label className="sr-only" htmlFor={`${baseId}-prefix`}>
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
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500/30 focus:border-emerald-400 focus:ring-2 disabled:opacity-60"
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
            placeholder="Número sin código de país"
            className={`min-w-0 flex-1 ${inputClass} mt-0`}
          />
        </div>
      </div>

      {error ? (
        <p id={`${baseId}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: GRAD }}
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
      className="partners-section scroll-mt-24 border-t border-slate-100 bg-slate-50/80"
      style={{ padding: "72px 80px" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          {PARTNERS_APPLY.eyebrow}
        </p>
        <h2
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {PARTNERS_APPLY.h2Before}{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {PARTNERS_APPLY.h2Accent}
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {PARTNERS_APPLY.lead}
        </p>
        <div className="mt-8 text-left">
          <PartnerApplyForm />
        </div>
      </div>
    </section>
  );
}
