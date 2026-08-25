"use client";

import { useState } from "react";
import type { Partner } from "@/lib/partners";
import { getPartnerInitials } from "@/lib/partners";

export function PartnerPhoto({
  partner,
}: {
  partner: Partner;
}) {
  const [loaded, setLoaded] = useState(false);
  const initials = getPartnerInitials(partner.name);

  return (
    <div className="partner-photo" aria-hidden={loaded ? undefined : true}>
      <span aria-hidden={loaded}>{initials}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.photo}
        alt={partner.name}
        width={88}
        height={88}
        onLoad={() => setLoaded(true)}
        onError={(event) => {
          setLoaded(false);
          event.currentTarget.style.display = "none";
        }}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
