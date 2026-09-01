"use client";

import { useEffect, useState } from "react";

/** True once the visitor has scrolled past `threshold` % of the page. */
export function useScrollPastPercent(threshold: number, enabled = true) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setPast(false);
      return;
    }

    const check = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setPast(false);
        return;
      }
      const pct = (window.scrollY / maxScroll) * 100;
      setPast(pct >= threshold);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [enabled, threshold]);

  return past;
}
