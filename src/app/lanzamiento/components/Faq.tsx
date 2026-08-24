"use client";

import { useId, useState } from "react";
import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { Minus, Plus } from "./Icons";

export default function Faq() {
  const uid = useId();
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[34fr_66fr] lg:gap-20">
        <Reveal>
          <p className="mono-eyebrow text-[#6B6B6B]">Preguntas</p>
          <h2 className="mt-4 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-[#111111] sm:text-[40px]">
            Lo que se pregunta siempre.
          </h2>
        </Reveal>

        <div className="border-t border-[#EAEAEA]">
          {evento.faq.map((item, i) => {
            const abierto = abierta === i;
            const panelId = `${uid}-panel-${i}`;
            const btnId = `${uid}-btn-${i}`;

            return (
              <Reveal key={item.pregunta} delay={50 * i}>
                <div className="border-b border-[#EAEAEA]">
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={abierto}
                      aria-controls={panelId}
                      onClick={() => setAbierta(abierto ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-200 hover:text-[#7C3AED]"
                    >
                      <span className="text-[17px] leading-[1.4] font-medium tracking-[-0.015em] text-[#111111] sm:text-[18px]">
                        {item.pregunta}
                      </span>
                      <span className="shrink-0 text-[#6B6B6B]">
                        {abierto ? (
                          <Minus className="h-[18px] w-[18px]" />
                        ) : (
                          <Plus className="h-[18px] w-[18px]" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!abierto}
                    className="pb-6"
                  >
                    <p className="max-w-2xl text-[16px] leading-[1.65] text-[#6B6B6B]">
                      {item.respuesta}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
