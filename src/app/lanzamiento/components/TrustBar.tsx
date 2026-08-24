import { evento } from "@/config/evento";
import { MetaMark, WhatsAppMark, StripeMark } from "./Icons";

export default function TrustBar() {
  return (
    <section
      aria-label="Respaldo de Clinera"
      className="border-b border-[#EAEAEA] bg-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="mono-eyebrow text-[#6B6B6B]">
          {evento.confianza.metricas.map((m, i) => (
            <span key={m}>
              {i > 0 && <span className="text-[#EAEAEA]"> · </span>}
              {m}
            </span>
          ))}
        </p>

        <div className="flex shrink-0 items-center gap-7 text-[#6B6B6B] opacity-60">
          <MetaMark className="h-4 w-auto" />
          <WhatsAppMark className="h-[18px] w-auto" />
          <StripeMark className="h-4 w-auto" />
        </div>
      </div>
    </section>
  );
}
