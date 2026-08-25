"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

export function PartnerReveal({
  children,
  delayMs = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      setMounted(true);
      return;
    }
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visible = !mounted || shown;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(1rem)",
        transition: shown
          ? `opacity 600ms ease-out ${delayMs}ms, transform 600ms ease-out ${delayMs}ms`
          : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
