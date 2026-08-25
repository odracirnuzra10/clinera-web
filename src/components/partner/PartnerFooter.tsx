import Link from "next/link";
import { PartnerWordmark } from "@/components/partner/PartnerWordmark";

export function PartnerFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#EAEAEA] bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-col gap-1">
          <PartnerWordmark />
          <p className="text-[13px] text-[#6B6B6B]">© Clinera {year}</p>
        </div>
        <nav className="flex gap-5 text-[13px] text-[#6B6B6B]">
          <Link href="/terminos" className="transition-colors duration-200 hover:text-[#111111]">
            Términos
          </Link>
          <Link href="/privacidad" className="transition-colors duration-200 hover:text-[#111111]">
            Privacidad
          </Link>
        </nav>
      </div>
    </footer>
  );
}
