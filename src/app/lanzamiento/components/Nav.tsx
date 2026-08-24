import { evento } from "@/config/evento";
import { ArrowRight } from "./Icons";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#EAEAEA] bg-white/60 backdrop-blur-xl">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8"
      >
        <a
          href="#inicio"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-[#111111]"
        >
          <span
            aria-hidden="true"
            className="block h-[7px] w-[7px] rounded-full bg-[#7C3AED]"
          />
          <span>clinera.io</span>
        </a>

        <a
          href={evento.sitio}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B6B] transition-colors duration-200 hover:text-[#111111]"
        >
          clinera.io
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </nav>
    </header>
  );
}
