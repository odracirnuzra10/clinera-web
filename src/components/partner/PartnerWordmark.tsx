import Link from "next/link";

const SPARK =
  "linear-gradient(135deg, #009FE3 0%, #7C3AED 50%, #C850C0 100%)";

export function SparkleMark({ size = 22 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="partner-spark"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.27),
        background: SPARK,
        fontSize: Math.round(size * 0.55),
      }}
    >
      ✦
    </span>
  );
}

export function PartnerWordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="partner-wordmark">
      <SparkleMark />
      clinera.io
    </Link>
  );
}
