"use client";

import { CSSProperties, ElementType, ReactNode } from "react";

/* ============================================================
   Brand primitives — Clinera v3 (blue → purple → pink gradient)
   ============================================================ */

export const GRAD =
  "linear-gradient(135deg,#3B82F6 0%,#7C3AED 50%,#D946EF 100%)";

export function Isotipo({ size = 32, radius = 8 }: { size?: number; radius?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: GRAD,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: Math.round(size * 0.55),
        fontFamily: "Inter",
        letterSpacing: "-0.02em",
        boxShadow: "0 6px 16px -6px rgba(124,58,237,.45)",
      }}
    >
      c
    </div>
  );
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Isotipo size={Math.round(size * 1.45)} radius={Math.round(size * 0.36)} />
      <div
        style={{
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#0A0A0A",
          fontFamily: "Inter",
        }}
      >
        clinera<span style={{ color: "#10B981" }}>.</span>io
      </div>
    </div>
  );
}

export function Mono({
  children,
  color = "#6B7280",
  size = 12,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#10B981",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type CtaProps<As extends ElementType = "button"> = {
  as?: As;
  children: ReactNode;
  href?: string;
  style?: CSSProperties;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

export function CtaPrimary({
  children,
  as,
  style,
  ...rest
}: CtaProps<ElementType>) {
  const Cmp = (as || "button") as ElementType;
  return (
    <Cmp
      {...rest}
      style={{
        background: GRAD,
        color: "#fff",
        border: 0,
        padding: "13px 22px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        fontFamily: "Inter",
        boxShadow:
          "0 12px 32px -8px rgba(124,58,237,.35),0 4px 12px -2px rgba(217,70,239,.22)",
        letterSpacing: "-0.005em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </Cmp>
  );
}

export function CtaSecondary({
  children,
  as,
  style,
  ...rest
}: CtaProps<ElementType>) {
  const Cmp = (as || "button") as ElementType;
  return (
    <Cmp
      {...rest}
      style={{
        background: "#fff",
        color: "#0A0A0A",
        border: "1px solid #E5E7EB",
        padding: "13px 22px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        fontFamily: "Inter",
        letterSpacing: "-0.005em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </Cmp>
  );
}
