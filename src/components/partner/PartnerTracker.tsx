"use client";

import { useEffect } from "react";
import type { Partner } from "@/lib/partners";

export const PARTNER_CTX_KEY = "clinera_partner_ctx";

function readUtms(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key.startsWith("utm_") && value) utms[key] = value;
  }
  return utms;
}

export function PartnerTracker({ partner }: { partner: Partner }) {
  useEffect(() => {
    try {
      sessionStorage.setItem(
        PARTNER_CTX_KEY,
        JSON.stringify({
          ref: partner.ref,
          utms: readUtms(),
          ts: Date.now(),
        }),
      );
    } catch {
      // sessionStorage puede fallar en modo privado; el ref igual viaja en WhatsApp.
    }
  }, [partner.ref]);

  return null;
}
