"use client";

import { useState } from "react";
import type { Partner } from "@/lib/partners";
import { getPartnerInitials } from "@/lib/partners";

type PartnerPhotoProps = {
  partner: Partner;
  size?: "hero" | "og";
  className?: string;
};

export function PartnerPhoto({
  partner,
  size = "hero",
  className = "",
}: PartnerPhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const initials = getPartnerInitials(partner.name);
  const box =
    size === "hero"
      ? "h-[88px] w-[88px] text-[1.35rem] md:h-[104px] md:w-[104px] md:text-[1.5rem]"
      : "h-24 w-24 text-2xl";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-[#F7F6F3] ring-1 ring-[#EAEAEA] ${box} ${className}`}
    >
      <span
        aria-hidden={loaded}
        className="flex h-full w-full items-center justify-center font-semibold tracking-tight text-[#111111]"
      >
        {initials}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.photo}
        alt={partner.name}
        width={104}
        height={104}
        onLoad={() => setLoaded(true)}
        onError={(event) => {
          setLoaded(false);
          event.currentTarget.style.display = "none";
        }}
        className={`absolute inset-0 h-full w-full rounded-full object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
