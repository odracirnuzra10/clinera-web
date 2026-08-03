import React from "react";
import SlideHeader from "./SlideHeader";

interface Bloque {
  name: string;
  chip: string;
  desc: string;
  traits: string[];
  accent: string;
  glow: string;
}

const bloques: Bloque[] = [
  {
    name: "Qué hace",
    chip: "Agentic",
    desc: "Agente resolutivo: agenda, re-agenda, cancela y coordina de forma autónoma dentro del chat. No manda links ni depende de sistemas externos — opera contra la agenda de Clinera.",
    traits: ["Autonomía completa", "Sin integraciones externas"],
    accent: "var(--violet)",
    glow: "rgba(184,71,255,0.16)",
  },
  {
    name: "Con qué modelo",
    chip: "Kimi K2.6",
    desc: "Modelo orquestador de tool calling. Decide cuándo llamar qué función, con qué argumentos y en qué orden. Es el único modelo en producción desde la migración.",
    traits: ["Tool calling robusto", "Razonamiento multi-paso"],
    accent: "var(--cyan)",
    glow: "rgba(0,212,255,0.16)",
  },
  {
    name: "Cuánto consume",
    chip: "30 / 195 cr",
    desc: "Una conversación que solo informa consume ~30 créditos. Una que termina en cita creada, re-agendada o cancelada consume ~195. Esa mezcla define el consumo real de cada cuenta.",
    traits: ["~30 cr conversar", "~195 cr agendar"],
    accent: "var(--magenta)",
    glow: "rgba(255,71,217,0.16)",
  },
];

export default function SchedulingModes() {
  return (
    <section id="modos" className="slide">
      <SlideHeader
        num="02"
        eyebrow="Operación · desde el 1 de junio"
        title={
          <>
            Un <span className="gradient-text">solo modo</span> de agendamiento
          </>
        }
        lead="Desde el 1 de junio todas las clínicas operan en modo Agentic sobre Kimi K2.6. Se elimina la elección de modo: la IA siempre razona y siempre puede ejecutar acciones. Lo que varía es si la conversación termina o no en una cita."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bloques.map((b, i) => (
          <div key={b.name} className="card card-hover p-8 flex flex-col relative overflow-hidden">
            {/* glow superior */}
            <div
              className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full"
              style={{ background: `radial-gradient(circle, ${b.glow} 0%, transparent 70%)` }}
            />

            <div className="flex items-center justify-between mb-7">
              <span className="stat-value text-2xl" style={{ color: b.accent }}>
                0{i + 1}
              </span>
              <span
                className="chip"
                style={{
                  borderColor: b.accent,
                  color: b.accent,
                  background: b.glow,
                }}
              >
                {b.chip}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              {b.name}
            </h3>

            <p className="text-[0.95rem] leading-[1.8] mb-8" style={{ color: "var(--ink-soft)" }}>
              {b.desc}
            </p>

            <div className="flex flex-wrap gap-2.5 mt-auto pt-6" style={{ borderTop: "1px solid var(--border)" }}>
              {b.traits.map((t) => (
                <span key={t} className="chip chip-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm mt-8 leading-[1.8]" style={{ color: "var(--ink-faint)" }}>
        Al operar todas las cuentas sobre el mismo modelo, el costo por token es uniforme y el
        límite de consumo depende solo del volumen de cada cuenta (ver{" "}
        <a href="#limites" style={{ color: "var(--cyan)" }}>Política de límites</a>).
      </p>
    </section>
  );
}
