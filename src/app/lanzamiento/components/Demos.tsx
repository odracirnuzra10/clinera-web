import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { ChatDots, Waveform, ChartBars, Compass } from "./Icons";

const ICONOS = [ChatDots, Waveform, ChartBars, Compass];

export default function Demos() {
  return (
    <section
      id="que-veras"
      className="border-b border-[#EAEAEA] bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[38fr_62fr] lg:items-end">
          <Reveal>
            <p className="mono-eyebrow text-[#6B6B6B]">Qué verás esa noche</p>
            <h2 className="mt-4 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-[#111111] sm:text-[40px]">
              Cuatro demos. Ninguna grabada.
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="max-w-lg text-[16px] leading-[1.65] text-[#6B6B6B] lg:pb-2">
              Todo se muestra en vivo, sobre la mesa, con la agenda corriendo.
              Si algo falla, lo vas a ver igual que nosotros.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {evento.demos.map((demo, i) => {
            const Icono = ICONOS[i] ?? ChatDots;
            return (
              <Reveal
                key={demo.numero}
                delay={60 * (i + 1)}
                className={demo.destacada ? "lg:col-span-2" : ""}
              >
                <article className="flex h-full flex-col rounded-xl border border-[#EAEAEA] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-300 hover:bg-[#FBFBFA] sm:p-9">
                  <div className="flex items-center justify-between gap-4">
                    <p className="mono-eyebrow text-[#6B6B6B]">
                      {demo.numero}
                    </p>
                    <Icono className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <h3 className="mt-6 text-[22px] leading-[1.2] font-semibold tracking-[-0.02em] text-[#111111]">
                    {demo.titulo}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-[1.6] text-[#6B6B6B]">
                    {demo.descripcion}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
