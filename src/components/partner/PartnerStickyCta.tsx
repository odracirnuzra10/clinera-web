"use client";

import { useEffect, useState } from "react";
import type { Partner } from "@/lib/partners";
import { PARTNER_CTA_LABEL } from "@/lib/partners";
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
    <div className={`partner-sticky ${visible ? "is-visible" : ""}`}>
      <div style={{ padding: "12px 16px max(12px, env(safe-area-inset-bottom))" }}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPartnerLeadClick(partner)}
          className="partner-cta partner-cta-full"
        >
          {PARTNER_CTA_LABEL}
        </a>
      </div>
    </div>
  );
}
