"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "./slides";

function slideEls() {
  return SLIDES.map((s) => document.getElementById(s.id)).filter(
    (el): el is HTMLElement => Boolean(el),
  );
}

function goTo(index: number) {
  const el = slideEls()[index];
  el?.classList.add("is-in");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function DeckChrome() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const onKey = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.key === " " && tag === "A") return;
    const nextKeys = e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ";
    const prevKeys = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!nextKeys && !prevKeys) return;
    e.preventDefault();
    const cur = activeRef.current;
    const next = nextKeys
      ? Math.min(SLIDES.length - 1, cur + 1)
      : Math.max(0, cur - 1);
    activeRef.current = next;
    setActive(next);
    goTo(next);
  }, []);

  useEffect(() => {
    const els = slideEls();
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        const idx = SLIDES.findIndex((s) => s.id === visible.target.id);
        if (idx >= 0) {
          activeRef.current = idx;
          setActive(idx);
          visible.target.classList.add("is-in");
        }
      },
      { threshold: [0.45, 0.6] },
    );
    els.forEach((el) => io.observe(el));

    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [onKey]);

  return (
    <nav className="v27-rail" aria-label="Progreso de la presentación">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-label={s.label}
          aria-current={i === active ? "true" : undefined}
          onClick={() => {
            activeRef.current = i;
            setActive(i);
            goTo(i);
          }}
        />
      ))}
    </nav>
  );
}
