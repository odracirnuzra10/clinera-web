"use client";

import Link from "next/link";
import { Pricing, useReveal } from "@/components/home-v3/sections";
import { track } from "@/lib/tracking";
import styles from "./PlataformaLanding.module.css";

/* En esta página el comprador tiene varias sedes y compra con migración
   gestionada: necesita un carril de ventas, no una tarjeta de crédito. Por eso
   las tarjetas canónicas no van al checkout de Stripe acá — el CTA de cada plan
   apunta a /agenda, porque el objetivo de /plataforma es la reunión. */
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
          @media (max-width:720px){#precios{padding-left:24px!important;padding-right:24px!important;}}
        `,
        }}
      />
      <Pricing ctaHref="/agenda" />
      <div className={styles.salesLane}>
        <p>
          ¿Varias sedes, migración desde otro sistema o facturación a empresa? Lo vemos antes de
          contratar.
        </p>
        <Link
          href="/agenda"
          className={styles.ghostCta}
          data-cta="planes-ventas"
          onClick={() =>
            track("cta_click", { cta_id: "planes-ventas", cta_location: "precios", page: "plataforma" })
          }
        >
          Hablar con ventas
        </Link>
      </div>
    </>
  );
}
