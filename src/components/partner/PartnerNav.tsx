import { PartnerWordmark } from "@/components/partner/PartnerWordmark";

export function PartnerNav() {
  return (
    <header className="border-b border-[#EAEAEA] bg-white">
      <div className="mx-auto flex h-12 max-w-5xl items-center px-5 md:h-14 md:px-8">
        <PartnerWordmark />
      </div>
    </header>
  );
}
