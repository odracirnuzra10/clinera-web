"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildLeadPayload, track, trackPixel } from "@/lib/tracking";

const N8N_LEAD_WEBHOOK =
  "https://clinerasoftware.app.n8n.cloud/webhook/clinera-contrata-lead";

const CURRENCY_BY_PREFIX: Record<string, { code: string; symbol: string }> = {
  "+56": { code: "CLP", symbol: "$" },
  "+51": { code: "PEN", symbol: "S/." },
  "+57": { code: "COP", symbol: "$" },
  "+52": { code: "MXN", symbol: "$" },
  "+54": { code: "ARS", symbol: "$" },
  "+593": { code: "USD", symbol: "$" },
  "+598": { code: "UYU", symbol: "$" },
  "+506": { code: "CRC", symbol: "₡" },
  "+507": { code: "USD", symbol: "$" },
};

function formatMoney(value: number, locale = "es-CL") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value,
  );
}

export default function RoiCalculator() {
  const [pacientesMes, setPacientesMes] = useState(200);
  const [precioPromedio, setPrecioPromedio] = useState(50000);
  const [noShowsRate, setNoShowsRate] = useState(25);
  const [prefix, setPrefix] = useState("+56");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced "roi_calc_used" — un solo evento por sesión de uso de sliders
  const usedFiredRef = useRef(false);
  useEffect(() => {
    if (usedFiredRef.current) return;
    const t = setTimeout(() => {
      track("roi_calc_used", {
        pacientes_mes: pacientesMes,
        precio_promedio: precioPromedio,
        no_shows_rate: noShowsRate,
        page_path: "/recursos/calculadora-roi",
      });
      usedFiredRef.current = true;
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacientesMes, precioPromedio, noShowsRate]);

  const calc = useMemo(() => {
    const noShowsHoy = Math.round(pacientesMes * (noShowsRate / 100));
    const perdidaHoy = noShowsHoy * precioPromedio;
    // Reducción promedio observada con Clinera: ~73% en no-shows.
    const noShowsConClinera = Math.round(noShowsHoy * 0.27);
    const perdidaConClinera = noShowsConClinera * precioPromedio;
    const ahorroMensual = Math.max(0, perdidaHoy - perdidaConClinera);
    const ahorroAnual = ahorroMensual * 12;
    return {
      noShowsHoy,
      perdidaHoy,
      noShowsConClinera,
      perdidaConClinera,
      ahorroMensual,
      ahorroAnual,
    };
  }, [pacientesMes, precioPromedio, noShowsRate]);

  const currency = CURRENCY_BY_PREFIX[prefix] ?? CURRENCY_BY_PREFIX["+56"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const tamano =
      pacientesMes < 100 ? "pequena" : pacientesMes < 300 ? "mediana" : "grande";

    const payload = await buildLeadPayload({
      nombre: String(fd.get("nombre") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      celular_prefix: prefix,
      celular_digits: String(fd.get("celular_digits") ?? "").trim(),
      nombre_clinica: String(fd.get("nombre_clinica") ?? "").trim(),
      lead_source: "organico",
      fuente: "calculadora-roi",
      challenge_id: "no-shows",
      challenge_label: "Reducir no-shows",
      tamano_clinica: tamano,
      roi_data: {
        pacientes_mes: pacientesMes,
        precio_promedio: precioPromedio,
        no_shows_rate: noShowsRate,
        currency: currency.code,
        ahorro_mensual: calc.ahorroMensual,
        ahorro_anual: calc.ahorroAnual,
      },
    });

    try {
      const res = await fetch(N8N_LEAD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      track("roi_calc_submit", {
        pacientes_mes: pacientesMes,
        ahorro_mensual: calc.ahorroMensual,
        currency: currency.code,
        page_path: "/recursos/calculadora-roi",
      });
      track("generate_lead", {
        lead_source: "calculadora-roi",
        page_path: "/recursos/calculadora-roi",
      });
      trackPixel(
        "Lead",
        { content_name: "roi_calculator" },
        String(payload.event_id),
      );

      const params = new URLSearchParams({
        source: "calculadora-roi",
        event_id: String(payload.event_id ?? ""),
      });
      window.location.href = `/gracias?${params.toString()}`;
    } catch (err) {
      setSubmitting(false);
      setError(
        "No pudimos enviar tus datos. Inténtalo de nuevo en un momento o escríbenos por WhatsApp.",
      );
      console.error("[RoiCalculator] webhook failed", err);
    }
  }

  return (
    <section
      style={{
        padding: "72px 24px 48px",
        background: "#FAFAFA",
        borderBottom: "1px solid #EEECEA",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 36 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#7C3AED",
              background: "rgba(124,58,237,0.08)",
              padding: "5px 12px",
              borderRadius: 999,
            }}
          >
            Calculadora de ROI
          </span>
          <h1
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "16px 0 12px",
              color: "#0A0A0A",
            }}
          >
            ¿Cuánto pierdes por no-shows? Calcúlalo en 30 segundos.
          </h1>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 17,
              color: "#4B5563",
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Mete 3 datos básicos de tu clínica. Te calculamos el ahorro anual
            estimado con Clinera y te enviamos el reporte por WhatsApp.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <SliderField
            label="Pacientes al mes"
            value={pacientesMes}
            min={20}
            max={1500}
            step={10}
            onChange={setPacientesMes}
            display={pacientesMes.toString()}
          />
          <SliderField
            label={`Ticket promedio (${currency.code})`}
            value={precioPromedio}
            min={5000}
            max={500000}
            step={1000}
            onChange={setPrecioPromedio}
            display={`${currency.symbol}${formatMoney(precioPromedio)}`}
          />
          <SliderField
            label="% de no-shows actual"
            value={noShowsRate}
            min={0}
            max={50}
            step={1}
            onChange={setNoShowsRate}
            display={`${noShowsRate}%`}
          />
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #EEECEA",
            borderRadius: 18,
            padding: "28px 32px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            <Stat
              label="Pierdes hoy"
              value={`${currency.symbol}${formatMoney(calc.perdidaHoy)} ${currency.code}/mes`}
              sub={`${calc.noShowsHoy} pacientes/mes`}
              tone="loss"
            />
            <Stat
              label="Con Clinera (-73%)"
              value={`${currency.symbol}${formatMoney(calc.perdidaConClinera)} ${currency.code}/mes`}
              sub={`${calc.noShowsConClinera} pacientes/mes`}
              tone="neutral"
            />
            <Stat
              label="Ahorro anual estimado"
              value={`${currency.symbol}${formatMoney(calc.ahorroAnual)} ${currency.code}`}
              sub="365 días con AURA atendiendo 24/7"
              tone="win"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 36,
            background: "#0A0A0A",
            color: "#fff",
            borderRadius: 20,
            padding: "32px 32px",
            backgroundImage:
              "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(217,70,239,.22), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.20), transparent 60%)",
          }}
        >
          <h2
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Recibe el reporte completo por WhatsApp
          </h2>
          <p
            style={{
              fontSize: 14.5,
              color: "rgba(255,255,255,0.72)",
              margin: "0 0 22px",
            }}
          >
            Te llega un PDF con tu cálculo + un mensaje de Catalina (ejecutiva)
            para resolver dudas. Sin spam, sin tarjeta.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <DarkInput name="nombre" placeholder="Tu nombre" required />
            <DarkInput
              name="email"
              type="email"
              placeholder="Tu email"
              required
            />
            <DarkInput
              name="nombre_clinica"
              placeholder="Nombre de tu clínica"
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              style={selectStyle}
              aria-label="País"
            >
              <option value="+56">🇨🇱 +56</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+51">🇵🇪 +51</option>
              <option value="+57">🇨🇴 +57</option>
              <option value="+54">🇦🇷 +54</option>
              <option value="+593">🇪🇨 +593</option>
              <option value="+598">🇺🇾 +598</option>
              <option value="+506">🇨🇷 +506</option>
              <option value="+507">🇵🇦 +507</option>
            </select>
            <DarkInput
              name="celular_digits"
              inputMode="numeric"
              pattern="[0-9 ]+"
              placeholder="Tu WhatsApp"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              background: submitting
                ? "rgba(255,255,255,0.18)"
                : "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
              color: "#fff",
              padding: "14px 22px",
              borderRadius: 12,
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: submitting ? "wait" : "pointer",
              boxShadow: submitting
                ? "none"
                : "0 14px 36px -10px rgba(124,58,237,0.5)",
              transition: "transform 0.15s",
            }}
          >
            {submitting
              ? "Enviando..."
              : "Recibir reporte completo por WhatsApp →"}
          </button>

          {error && (
            <p
              role="alert"
              style={{
                marginTop: 14,
                color: "#FCA5A5",
                fontSize: 13.5,
              }}
            >
              {error}
            </p>
          )}

          <p
            style={{
              marginTop: 18,
              fontSize: 12.5,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              letterSpacing: "0.02em",
            }}
          >
            Métrica base: −73% no-shows promedio en clínicas con Clinera
            (clientes activos abril 2026). Tu ahorro real puede variar según
            ticket, vertical y tasa de captación de cancelaciones.
          </p>
        </form>
      </div>
    </section>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label
      style={{
        background: "#fff",
        border: "1px solid #EEECEA",
        borderRadius: 14,
        padding: "16px 18px",
        display: "block",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          {label}
        </span>
        <strong
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 17,
            color: "#0A0A0A",
            letterSpacing: "-0.01em",
          }}
        >
          {display}
        </strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: "#7C3AED",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#9CA3AF",
          marginTop: 4,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        }}
      >
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </label>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "loss" | "neutral" | "win";
}) {
  const accent =
    tone === "loss" ? "#DC2626" : tone === "win" ? "#7C3AED" : "#374151";
  return (
    <div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#6B7280",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: tone === "win" ? 26 : 22,
          fontWeight: 700,
          color: accent,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          margin: "0 0 6px",
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 13.5, color: "#6B7280", margin: 0, lineHeight: 1.4 }}>
        {sub}
      </p>
    </div>
  );
}

function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.14)",
        color: "#fff",
        padding: "12px 14px",
        borderRadius: 10,
        fontSize: 14.5,
        outline: "none",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    />
  );
}

const selectStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 10,
  fontSize: 14.5,
  outline: "none",
  fontFamily: "Inter, system-ui, sans-serif",
};
