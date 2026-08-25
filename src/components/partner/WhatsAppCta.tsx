"use client";

import type { Partner } from "@/lib/partners";
import { PARTNER_CTX_KEY } from "@/components/partner/PartnerTracker";

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

function readStoredUtms(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(PARTNER_CTX_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { utms?: Record<string, string> };
    return parsed.utms ?? {};
  } catch {
    return {};
  }
}

export function trackPartnerLeadClick(partner: Partner) {
  const w = window as DataLayerWindow;
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({
      event: "partner_lead_click",
      partner_slug: partner.slug,
      partner_ref: partner.ref,
    });
  }

  const payload = JSON.stringify({
    slug: partner.slug,
    ref: partner.ref,
    utms: readStoredUtms(),
  });
  const blob = new Blob([payload], { type: "application/json" });
  const sent = navigator.sendBeacon("/api/partner-click", blob);
  if (!sent) {
    void fetch("/api/partner-click", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
  }
}

export function WhatsAppCta({
  partner,
  href,
  className = "",
}: {
  partner: Partner;
  href: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackPartnerLeadClick(partner)}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#111111] px-5 py-3.5 text-center text-[15px] font-medium text-white transition-transform duration-150 active:scale-[0.98] md:w-auto md:min-w-[280px]"
      >
        Hablar con {partner.sales.name} por WhatsApp
      </a>
      <p className="mt-2.5 text-center text-[13px] text-[#6B6B6B] md:text-left">
        Te responde una persona, no un bot.
      </p>
    </div>
  );
}
