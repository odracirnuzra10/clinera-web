"use client";

import type { Partner } from "@/lib/partners";
import { PARTNER_CTA_LABEL } from "@/lib/partners";
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

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.95L2 22l5.38-1.4a10.1 10.1 0 0 0 4.66 1.12h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Z"
        fill="#fff"
        fillOpacity="0.18"
      />
      <path
        d="M16.7 14.33c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.53-.08 1.6-.65 1.83-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
        fill="#fff"
      />
    </svg>
  );
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
    <div className={className} style={{ width: "100%", marginTop: 16 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackPartnerLeadClick(partner)}
        className="partner-cta partner-cta-full"
      >
        <WhatsAppIcon />
        {PARTNER_CTA_LABEL}
      </a>
      <p className="partner-helper">Te responde una persona, no un bot.</p>
    </div>
  );
}
