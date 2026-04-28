"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const HIDDEN_PATHS = ["/gracias"];

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sticky-cta-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      setShow(ratio > 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden =
    dismissed ||
    !show ||
    HIDDEN_PATHS.some((p) => pathname?.startsWith(p)) ||
    pathname?.startsWith("/planes") === true;

  if (hidden) return null;

  const trackClick = (cta: "sales" | "plans") => {
    if (typeof window === "undefined") return;
    type DL = { push: (e: Record<string, unknown>) => void };
    const dl = (window as unknown as { dataLayer?: DL }).dataLayer;
    if (dl) dl.push({ event: "sticky_cta_click", cta, page_path: pathname });
  };

  const dismiss = () => {
    sessionStorage.setItem("sticky-cta-dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      <div className="sticky-mobile-cta" role="region" aria-label="Acción rápida Clinera">
        <Link
          href="/hablar-con-ventas"
          onClick={() => trackClick("sales")}
          className="sticky-secondary"
        >
          Hablar con ventas
        </Link>
        <Link
          href="/planes"
          onClick={() => trackClick("plans")}
          className="sticky-primary"
        >
          Activar Conect →
        </Link>
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="sticky-dismiss"
        >
          ×
        </button>
      </div>
      <style jsx global>{`
        .sticky-mobile-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px 12px env(safe-area-inset-bottom) 12px;
          background: rgba(10, 10, 10, 0.96);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          gap: 8px;
          align-items: center;
          z-index: 50;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          animation: stickyUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes stickyUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .sticky-secondary,
        .sticky-primary {
          flex: 1;
          text-align: center;
          padding: 12px 14px;
          border-radius: 10px;
          font-family: Inter, system-ui, sans-serif;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          line-height: 1.2;
        }
        .sticky-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }
        .sticky-primary {
          background: linear-gradient(135deg, #7C3AED 0%, #D946EF 100%);
          color: #fff;
          box-shadow: 0 8px 22px -6px rgba(124, 58, 237, 0.5);
        }
        .sticky-dismiss {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.85);
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
        }
        @media (min-width: 769px) {
          .sticky-mobile-cta { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sticky-mobile-cta { animation: none; }
        }
      `}</style>
    </>
  );
}
