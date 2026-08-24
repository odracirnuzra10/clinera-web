import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { ArrowUpRight, PinMap } from "./Icons";

export default function Ubicacion() {
  const { lugar } = evento;

  return (
    <section
      id="ubicacion"
      className="border-b border-[#EAEAEA] bg-[#F7F6F3] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mono-eyebrow text-[#6B6B6B]">Ubicación</p>
          <h2 className="mt-4 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-[#111111] sm:text-[40px]">
            {lugar.nombre}
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-xl border border-[#EAEAEA] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="aspect-[16/10] w-full sm:aspect-[21/9]">
              <iframe
                title={`Mapa de ${lugar.nombre}`}
                src={lugar.mapaEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 grayscale-[35%]"
              />
            </div>

            <div className="flex flex-col gap-5 border-t border-[#EAEAEA] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex gap-3">
                <PinMap className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#7C3AED]" />
                <p className="mono-eyebrow text-[#111111]">{lugar.direccion}</p>
              </div>

              <a
                href={lugar.mapaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#EAEAEA] bg-white px-4 py-2.5 text-[14px] font-medium text-[#111111] transition-colors duration-200 hover:bg-[#F7F6F3] active:scale-[0.98]"
              >
                Cómo llegar
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
