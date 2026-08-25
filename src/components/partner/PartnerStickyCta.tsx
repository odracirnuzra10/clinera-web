"use client";

import { useEffect, useState } from "react";
import type { Partner } from "@/lib/partners";
import { trackPartnerLeadClick } from "@/components/partner/WhatsAppCta";

export function PartnerStickyCta({
  partner,
  href,
}: {
  partner: Partner;
  href: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#EAEAEA] bg-white/80 backdrop-blur-xl md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      } motion-safe:transition-[transform,opacity] motion-safe:duration-[400ms] motion-safe:ease-out`}
    >
      <div className="px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPartnerLeadClick(partner)}
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#111111] px-5 py-3.5 text-center text-[15px] font-medium text-white transition-transform duration-150 active:scale-[0.98]"
        >
          Hablar con {partner.sales.name} por WhatsApp
        </a>
      </div>
    </div>
  );
}
