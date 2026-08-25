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
  const [loaded, setLoaded] = useState(false);
  const initials = getPartnerInitials(partner.name);

  return (
    <div className="partner-photo">
      <span aria-hidden={Boolean(src && loaded)}>{initials}</span>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
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
      ) : null}
    </div>
  );
}
