export function SparkleMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-gradient-to-br from-[#009FE3] via-[#7C3AED] to-[#C850C0] bg-clip-text text-transparent ${className}`}
    >
      ✦
    </span>
  );
}

export function PartnerWordmark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 text-[15px] font-semibold tracking-tight text-[#111111] ${className}`}
    >
      clinera.io
      <SparkleMark className="text-[13px]" />
    </span>
  );
}
