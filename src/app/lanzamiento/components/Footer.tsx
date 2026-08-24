import { evento } from "@/config/evento";

export default function Footer() {
  const { legal } = evento;

  return (
    <footer className="bg-[#111111]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 border-t border-white/10 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mono-eyebrow text-[#8A8A8A]">
              {evento.edicion} <span className="text-white/20">·</span>{" "}
              {evento.fechaLarga}
            </p>
            <p className="mt-2 text-[14px] text-[#8A8A8A]">
              © {evento.anio} {legal.razonSocial} · {legal.grupo}
            </p>
          </div>

          <nav
            aria-label="Enlaces legales"
            className="flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            <a
              href={evento.sitio}
              className="text-[14px] text-[#8A8A8A] transition-colors duration-200 hover:text-white"
            >
              clinera.io
            </a>
            <a
              href={legal.terminos}
              className="text-[14px] text-[#8A8A8A] transition-colors duration-200 hover:text-white"
            >
              Términos
            </a>
            <a
              href={legal.privacidad}
              className="text-[14px] text-[#8A8A8A] transition-colors duration-200 hover:text-white"
            >
              Privacidad
            </a>
          </nav>
        </div>
      </div>

      <div aria-hidden="true" className="brand-gradient-rule h-[3px] w-full" />
    </footer>
  );
}
