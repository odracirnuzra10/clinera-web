import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { Check, Minus } from "./Icons";

export default function Audiencia() {
  return (
    <section
      id="para-quien"
      className="border-b border-[#EAEAEA] bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mono-eyebrow text-[#6B6B6B]">Para quién es</p>
          <h2 className="mt-4 max-w-2xl text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-[#111111] sm:text-[40px]">
            Una mesa de {evento.cupos.total}, no un auditorio.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal delay={60}>
            <div className="h-full rounded-xl border border-[#EAEAEA] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-9">
              <h3 className="mono-eyebrow text-[#111111]">Es para ti si</h3>
              <ul className="mt-6 space-y-4">
                {evento.audiencia.si.map((linea) => (
                  <li key={linea} className="flex gap-3">
                    <Check className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#7C3AED]" />
                    <span className="text-[16px] leading-[1.6] text-[#111111]">
                      {linea}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={130}>
            <div className="h-full rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-9">
              <h3 className="mono-eyebrow text-[#6B6B6B]">No es para ti si</h3>
              <ul className="mt-6 space-y-4">
                {evento.audiencia.no.map((linea) => (
                  <li key={linea} className="flex gap-3">
                    <Minus className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#6B6B6B]" />
                    <span className="text-[16px] leading-[1.6] text-[#6B6B6B]">
                      {linea}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
