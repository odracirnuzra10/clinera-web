import type { Metadata } from "next";
import { evento } from "@/config/evento";
import QrCode from "./QrCode";
import PrintButton from "./PrintButton";

const TITULO = "Invitación digital · Lanzamiento Los Ángeles | Clinera.io";
const DESCRIPCION =
  "Invitación con código QR a la cena de lanzamiento de las nuevas funciones de IA de Clinera. Viernes 11 de septiembre de 2026, 19:00 hrs, Los Ángeles.";

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: "https://www.clinera.io/qr" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://clinera.io/qr",
    siteName: "Clinera.io",
    title: TITULO,
    description: DESCRIPCION,
    images: [{ url: "/og-evento.png", width: 1200, height: 630, alt: TITULO }],
  },
  robots: { index: false, follow: true },
};

export default function QrPage() {
  const url = evento.urlCanonica.replace(/^https?:\/\//, "");

  return (
    <main className="min-h-[100dvh] bg-[#F7F6F3] px-5 py-12 sm:px-8 sm:py-16 print:bg-white print:p-0">
      <article
        id="invitacion"
        className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-[#EAEAEA] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] print:max-w-none print:rounded-none print:border-0 print:shadow-none"
      >
        <div className="px-8 pt-10 pb-8 sm:px-12 sm:pt-14">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="block h-[7px] w-[7px] rounded-full bg-[#7C3AED]"
              />
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#111111]">
                clinera.io
              </span>
            </div>
            <span className="mono-eyebrow rounded-md bg-[#111111] px-2 py-1 text-white">
              Solo {evento.cupos.total} cupos
            </span>
          </div>

          <p className="mono-eyebrow mt-10 text-[#6B6B6B]">
            Invitación · {evento.edicion}
          </p>

          <h1 className="mt-4 text-[30px] leading-[1.08] font-extrabold tracking-[-0.035em] text-[#111111] sm:text-[38px]">
            Una cena en{" "}
            <span className="brand-gradient-text">Los Ángeles</span> para ver la
            IA que ya opera clínicas.
          </h1>

          <p className="mt-5 text-[16px] leading-[1.6] text-[#6B6B6B]">
            Lanzamiento privado de las nuevas funciones de Clinera. Cena, vino y
            demo en vivo, solo para doctores y dueños de clínica.
          </p>
        </div>

        <dl className="grid grid-cols-2 divide-x divide-[#EAEAEA] border-y border-[#EAEAEA]">
          <div className="px-8 py-5 sm:px-12">
            <dt className="mono-eyebrow text-[#6B6B6B]">Fecha</dt>
            <dd className="mt-2 text-[15px] leading-[1.4] font-medium text-[#111111]">
              Viernes 11 de septiembre
              <span className="block text-[13px] font-normal text-[#6B6B6B]">
                {evento.hora}
              </span>
            </dd>
          </div>
          <div className="px-8 py-5 sm:px-12">
            <dt className="mono-eyebrow text-[#6B6B6B]">Lugar</dt>
            <dd className="mt-2 text-[15px] leading-[1.4] font-medium text-[#111111]">
              {evento.lugar.nombre}
              <span className="block text-[13px] font-normal text-[#6B6B6B]">
                {evento.ciudad}, {evento.pais}
              </span>
            </dd>
          </div>
        </dl>

        <div className="flex flex-col items-center gap-6 px-8 py-10 sm:flex-row sm:items-center sm:gap-9 sm:px-12">
          <div className="shrink-0 rounded-xl border border-[#EAEAEA] bg-white p-2">
            <QrCode className="h-[168px] w-[168px]" />
          </div>

          <div className="text-center sm:text-left">
            <p className="text-[18px] leading-[1.35] font-semibold tracking-[-0.02em] text-[#111111]">
              Escanea y postula a tu cupo
            </p>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#6B6B6B]">
              No es agendamiento: postulas y el equipo de Clinera te confirma por
              WhatsApp en menos de 24 hrs.
            </p>
            <p className="mono-eyebrow mt-4 text-[#111111]">{url}</p>
          </div>
        </div>

        <div aria-hidden="true" className="brand-gradient-rule h-[3px] w-full" />
      </article>

      <div className="mx-auto mt-8 flex w-full max-w-[560px] flex-col gap-3 sm:flex-row sm:items-center print:hidden">
        <PrintButton />
        <a
          href={evento.ruta}
          className="inline-flex items-center justify-center rounded-lg border border-[#EAEAEA] bg-white px-5 py-3 text-[15px] font-medium text-[#111111] transition-colors duration-200 hover:bg-white/70 active:scale-[0.98]"
        >
          Ver la landing
        </a>
      </div>

      <p className="mx-auto mt-4 w-full max-w-[560px] text-[13px] leading-[1.6] text-[#6B6B6B] print:hidden">
        Para compartir por WhatsApp: imprime en PDF o toma una captura de la
        tarjeta. El QR apunta a {url}.
      </p>
    </main>
  );
}
