"use client";

import { useState } from "react";
import type { Partner } from "@/lib/partners";
import { getPartnerInitials } from "@/lib/partners";

export function PartnerPhoto({
  partner,
  src,
}: {
  partner: Partner;
  src: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const initials = getPartnerInitials(partner.name);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div className="partner-photo">
      <span aria-hidden={showPhoto}>{initials}</span>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={partner.name}
          width={88}
          height={88}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
