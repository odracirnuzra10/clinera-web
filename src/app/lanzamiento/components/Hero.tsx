import { evento } from "@/config/evento";
import Reveal from "./Reveal";
import { ArrowRight } from "./Icons";

export default function Hero() {
  const { cupos, lugar } = evento;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#EAEAEA] bg-white pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <p className="mono-eyebrow text-[#6B6B6B]">
              Clinera.io <span className="text-[#EAEAEA]">·</span> Evento
              exclusivo <span className="text-[#EAEAEA]">·</span>{" "}
              <span className="text-[#7C3AED]">Solo {cupos.total} cupos</span>
            </p>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-6 text-[38px] leading-[1.05] font-extrabold tracking-[-0.035em] text-[#111111] sm:text-[52px] lg:text-[60px]">
              Una cena en{" "}
              <span className="brand-gradient-text">Los Ángeles</span> para ver
              la IA que ya opera clínicas.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[#6B6B6B] sm:text-[18px]">
              Lanzamiento privado de las nuevas funciones de Clinera. Solo
              doctores y dueños de clínica. Cena, vino y demo en vivo.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p className="mono-eyebrow mt-8 border-t border-[#EAEAEA] pt-5 text-[#111111]">
              {evento.metadataMono}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#postular"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-3 text-[15px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-150 hover:bg-[#000000] active:scale-[0.98]"
              >
                Postular a mi cupo
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#programa"
                className="inline-flex items-center justify-center rounded-lg border border-[#EAEAEA] bg-white px-5 py-3 text-[15px] font-medium text-[#111111] transition-colors duration-200 hover:bg-[#F7F6F3] active:scale-[0.98]"
              >
                Ver el programa
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300} className="lg:pl-4">
          <div className="relative rounded-xl border border-[#EAEAEA] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <span
              aria-hidden="true"
              className="absolute top-[132px] -left-[7px] hidden h-3.5 w-3.5 rounded-full border-r border-[#EAEAEA] bg-white sm:block"
            />
            <span
              aria-hidden="true"
              className="absolute top-[132px] -right-[7px] hidden h-3.5 w-3.5 rounded-full border-l border-[#EAEAEA] bg-white sm:block"
            />

            <div className="p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <p className="mono-eyebrow text-[#6B6B6B]">
                  Invitación personal
                </p>
                <span className="mono-eyebrow rounded-md bg-[#111111] px-2 py-1 text-white">
                  {cupos.total} cupos
                </span>
              </div>

              <div className="mt-7 flex items-end gap-4">
                <p className="text-[64px] leading-[0.85] font-extrabold tracking-[-0.05em] text-[#111111]">
                  {evento.fechaCorta}
                </p>
                <div className="pb-1">
                  <p className="mono-eyebrow text-[#111111]">
                    {evento.mesCorto} {evento.anio}
                  </p>
                  <p className="mono-eyebrow mt-1 text-[#6B6B6B]">
                    {evento.diaSemana}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-[#EAEAEA]" />

            <dl className="divide-y divide-[#EAEAEA] px-7 sm:px-9">
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="mono-eyebrow text-[#6B6B6B]">Hora</dt>
                <dd className="text-right text-[15px] font-medium text-[#111111]">
                  {evento.hora}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="mono-eyebrow shrink-0 text-[#6B6B6B]">Lugar</dt>
                <dd className="text-right text-[15px] font-medium text-[#111111]">
                  {lugar.nombre}
                  <span className="block text-[13px] font-normal text-[#6B6B6B]">
                    {evento.ciudad}, {evento.pais}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="mono-eyebrow text-[#6B6B6B]">Disponibles</dt>
                <dd className="text-right">
                  <span className="text-[15px] font-semibold text-[#111111]">
                    {cupos.restantes}
                  </span>
                  <span className="text-[15px] text-[#6B6B6B]">
                    {" "}
                    de {cupos.total}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="px-7 pb-7 sm:px-9 sm:pb-9">
              <div
                className="h-1.5 w-full overflow-hidden rounded-md bg-[#F7F6F3]"
                role="img"
                aria-label={`Quedan ${cupos.restantes} de ${cupos.total} cupos`}
              >
                <span
                  className="block h-full rounded-md bg-[#7C3AED]"
                  style={{
                    width: `${Math.round(((cupos.total - cupos.restantes) / cupos.total) * 100)}%`,
                  }}
                />
              </div>
              <p className="mono-eyebrow mt-3 text-[#6B6B6B]">
                No es agendamiento — postulas y confirmamos por WhatsApp
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
