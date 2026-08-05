"use client";

import { Pricing, useReveal } from "@/components/home-v3/sections";

// Tarjetas de planes canónicas — las mismas de home, /planes y /planes-pro.
// PlataformaLanding es un componente de servidor, así que el reveal-on-scroll
// y el padding móvil que en esas páginas define el contenedor de la landing
// se inyectan aquí.
export default function PlanesSection() {
  useReveal();
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .reveal{opacity:0;transform:translateY(12px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1);}
          .reveal.in{opacity:1;transform:none;}
          @media (prefers-reduced-motion: reduce){*{animation-duration:0ms!important;transition-duration:0ms!important;}}
          @media (max-width:720px){#precios{padding-left:32px!important;padding-right:32px!important;}}
        `,
        }}
      />
      <Pricing />
    </>
  );
}
