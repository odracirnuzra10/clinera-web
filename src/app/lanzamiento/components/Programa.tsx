import { evento } from "@/config/evento";
import Reveal from "./Reveal";

export default function Programa() {
  return (
    <section
      id="programa"
      className="border-b border-[#EAEAEA] bg-[#F7F6F3] py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[34fr_66fr] lg:gap-20">
        <Reveal>
          <p className="mono-eyebrow text-[#6B6B6B]">Programa de la noche</p>
          <h2 className="mt-4 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-[#111111] sm:text-[40px]">
            De 19:00 a 22:30.
          </h2>
          <p className="mt-5 max-w-sm text-[16px] leading-[1.65] text-[#6B6B6B]">
            Puntual. La demo parte a las 19:45 y no se repite.
          </p>
        </Reveal>

        <ol className="border-l border-[#EAEAEA]">
          {evento.programa.map((item, i) => (
            <Reveal key={item.hora} delay={60 * i} as="li" className="block">
              <div className="relative pb-10 pl-7 last:pb-0 sm:pl-9">
                <span
                  aria-hidden="true"
                  className="absolute top-[7px] -left-[4px] block h-[7px] w-[7px] rounded-full bg-[#111111] ring-4 ring-[#F7F6F3]"
                />
                <p className="mono-eyebrow text-[#7C3AED]">{item.hora}</p>
                <p className="mt-2 text-[18px] leading-[1.35] font-medium tracking-[-0.015em] text-[#111111] sm:text-[20px]">
                  {item.titulo}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
