"use client";

import { useEffect, useState } from "react";

const WA_URL =
  "https://wa.me/56985581524?text=" +
  encodeURIComponent("Hola, quiero saber más sobre Clinera.");

const SCROLL_THRESHOLD = 0.6;

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setVisible(false);
        return;
      }
      setVisible(window.scrollY / scrollable >= SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const trackClick = () => {
    if (typeof window === "undefined") return;
    type DL = { push: (e: Record<string, unknown>) => void };
    const dl = (window as unknown as { dataLayer?: DL }).dataLayer;
    if (dl) dl.push({ event: "home_whatsapp_float_click", page_path: "/" });
  };

  return (
    <>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackClick}
        className={`home-wa-float${visible ? " is-visible" : ""}`}
        aria-label="Hablar por WhatsApp"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      >
        <span className="home-wa-float-ring" aria-hidden />
        <span className="home-wa-float-icon" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
        <span className="home-wa-float-label">
          <span className="home-wa-float-eyebrow">¿Dudas?</span>
          <span className="home-wa-float-title">WhatsApp</span>
        </span>
      </a>
      <style jsx>{`
        .home-wa-float {
          position: fixed;
          right: max(20px, env(safe-area-inset-right));
          bottom: max(24px, env(safe-area-inset-bottom));
          z-index: 55;
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 10px;
          border-radius: 999px;
          text-decoration: none;
          color: #fff;
          background: linear-gradient(145deg, #25d366 0%, #1ebe57 45%, #128c7e 100%);
          box-shadow:
            0 14px 36px -10px rgba(18, 140, 126, 0.55),
            0 6px 16px -8px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.28);
          opacity: 0;
          pointer-events: none;
          transform: translate3d(0, 28px, 0) scale(0.92);
          transition:
            opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            gap 0.3s ease,
            padding 0.3s ease,
            box-shadow 0.25s ease;
          will-change: transform, opacity;
        }
        .home-wa-float.is-visible {
          opacity: 1;
          pointer-events: auto;
          transform: translate3d(0, 0, 0) scale(1);
        }
        .home-wa-float:hover,
        .home-wa-float:focus-visible {
          gap: 10px;
          padding: 10px 18px 10px 10px;
          box-shadow:
            0 18px 42px -10px rgba(18, 140, 126, 0.65),
            0 8px 20px -8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
          outline: none;
        }
        .home-wa-float:active {
          transform: scale(0.97);
        }
        .home-wa-float-icon {
          position: relative;
          z-index: 1;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.16);
          flex-shrink: 0;
        }
        .home-wa-float-label {
          display: grid;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
          transition:
            max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.25s ease;
        }
        .home-wa-float:hover .home-wa-float-label,
        .home-wa-float:focus-visible .home-wa-float-label {
          max-width: 120px;
          opacity: 1;
        }
        .home-wa-float-eyebrow {
          font-family: Inter, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
          opacity: 0.85;
          line-height: 1.1;
        }
        .home-wa-float-title {
          font-family: Inter, system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .home-wa-float-ring {
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          border: 1.5px solid rgba(37, 211, 102, 0.55);
          opacity: 0;
          pointer-events: none;
        }
        .home-wa-float.is-visible .home-wa-float-ring {
          animation: homeWaPulse 2.4s ease-out infinite;
        }
        @keyframes homeWaPulse {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          70% {
            transform: scale(1.18);
            opacity: 0;
          }
          100% {
            transform: scale(1.18);
            opacity: 0;
          }
        }
        /* Sobre la barra sticky móvil del layout (home). */
        @media (max-width: 768px) {
          .home-wa-float {
            bottom: calc(88px + env(safe-area-inset-bottom));
            right: max(16px, env(safe-area-inset-right));
          }
          .home-wa-float:hover,
          .home-wa-float:focus-visible {
            gap: 0;
            padding: 10px;
          }
          .home-wa-float:hover .home-wa-float-label,
          .home-wa-float:focus-visible .home-wa-float-label {
            max-width: 0;
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-wa-float,
          .home-wa-float-label {
            transition: none;
          }
          .home-wa-float.is-visible .home-wa-float-ring {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
