"use client";

import { useEffect } from "react";

/**
 * Aparición en cascada de los bloques marcados con data-reveal.
 *
 * El ocultamiento inicial lo aplica el CSS sólo cuando <html> lleva el
 * atributo data-sg-anim, que pone un script inline al principio de la página.
 * Sin JavaScript el atributo nunca aparece y el documento se lee completo: una
 * página de cumplimiento no puede quedar en blanco porque falló un script.
 */
export default function Reveal() {
  useEffect(() => {
    const nodos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (nodos.length === 0) return;

    const mostrar = (el: HTMLElement) => el.setAttribute("data-revealed", "");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      nodos.forEach(mostrar);
      return;
    }

    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            mostrar(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    nodos.forEach((el) => io.observe(el));

    // Red de seguridad: si algo impide que el observer dispare, el documento
    // igual termina visible.
    const t = window.setTimeout(() => nodos.forEach(mostrar), 2500);

    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return null;
}
