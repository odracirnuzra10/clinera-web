import { evento } from "@/config/evento";
import Reveal from "./Reveal";

export default function Host() {
  const { host } = evento;

  return (
    <section
      id="host"
      className="border-b border-[#EAEAEA] bg-white py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 sm:px-8 md:grid-cols-2 md:gap-14">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#F7F6F3]">
            <div className="absolute inset-0 flex items-end p-6">
              <p className="mono-eyebrow text-[#A8A8A8]">
                Retrato — {host.foto}
              </p>
            </div>
            <svg
              viewBox="0 0 100 125"
              aria-hidden="true"
              focusable="false"
              className="h-full w-full text-[#E4E2DD]"
            >
              <circle cx="50" cy="46" r="17" fill="currentColor" />
              <path
                d="M18 108c0-17.7 14.3-32 32-32s32 14.3 32 32Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <span className="mono-eyebrow inline-block rounded-md bg-[#111111] px-2 py-1 text-white">
            {host.badge}
          </span>

          <h2 className="mt-6 text-[30px] leading-[1.15] font-bold tracking-[-0.03em] text-[#111111] sm:text-[38px]">
            Te recibe {host.nombre}
          </h2>

          <p className="mt-4 text-[17px] leading-[1.6] text-[#6B6B6B]">
            {host.rol}. {host.bajada}
          </p>

          <p className="mt-6 border-l-2 border-[#7C3AED] pl-5 text-[16px] leading-[1.65] text-[#111111]">
            Esa noche no hay presentación de ventas. Hay una mesa de{" "}
            {evento.cupos.total} y las preguntas que quieras hacer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
