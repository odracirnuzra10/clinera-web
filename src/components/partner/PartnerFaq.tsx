"use client";

import { useId, useState } from "react";
import type { Partner } from "@/lib/partners";

function faqsFor(partner: Partner) {
  return [
    {
      q: "¿Sirve si tengo una sola sucursal?",
      a: "Sí. Clinera está pensado para clínicas de una sucursal y también para las que tienen varias. Empiezas con lo que tienes hoy.",
    },
    {
      q: "¿Tengo que cambiar mi número de WhatsApp?",
      a: "No. AURA trabaja con el número que ya usa tu clínica. Tus pacientes te escriben al mismo WhatsApp de siempre.",
    },
    {
      q: "¿Cuánto demora tenerlo andando?",
      a: `La implementación toma unos días, no meses. ${partner.sales.name} te arma el encendido con lo que hay que migrar y cuándo queda en vivo.`,
    },
  ] as const;
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PartnerFaq({ partner }: { partner: Partner }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  const faqs = faqsFor(partner);

  return (
    <div>
      {faqs.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.q} className="border-b border-[#EAEAEA]">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[16px] font-medium text-[#111111]">{item.q}</span>
              <span className="shrink-0 text-[#6B6B6B]">
                {isOpen ? <MinusIcon /> : <PlusIcon />}
              </span>
            </button>
            {isOpen && (
              <p
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="pb-5 text-[15px] leading-[1.6] text-[#6B6B6B]"
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
