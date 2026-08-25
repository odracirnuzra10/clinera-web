import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EmpleadoDigitalLanding from "@/components/empleado-digital/EmpleadoDigitalLanding";
import { faqSchema } from "@/components/seo/schemas";
import { EMPLEADO_DIGITAL_FAQ } from "@/content/empleado-digital-faq";
import {
  EMPLEADO_DIGITAL_DEFINICION,
} from "@/content/empleado-digital-definicion";
import styles from "./empleado-digital.module.css";

export const metadata: Metadata = {
  title: "Empleado Digital IA para Clínicas — CAMILA, AURA y LIA | Clinera.io",
  description:
    "Empleados digitales CAMILA (voz), AURA (WhatsApp) y LIA (orquestación) que ejecutan sobre la agenda de tu clínica 24/7: agendan, confirman, cobran y recuperan pacientes. Desde USD 279/mes hasta USD 479/mes.",
  alternates: { canonical: "https://www.clinera.io/empleado-digital" },
  openGraph: {
    url: "https://www.clinera.io/empleado-digital",
    title: "Empleado Digital IA para Clínicas — CAMILA, AURA y LIA | Clinera.io",
    description:
      "CAMILA llama, AURA atiende WhatsApp y LIA orquesta la operación. Tres empleados digitales con una sola memoria del paciente. Desde USD 279/mes.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Empleado digital IA para clínicas",
      },
    ],
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io — Empleado digital IA para clínicas",
  description:
    "Plataforma con IA para clínicas con volumen y grupos multi-sede. Empleados digitales que agendan, confirman, cobran y recuperan pacientes por WhatsApp y voz 24/7. Planes desde USD 279/mes hasta USD 479/mes.",
  brand: { "@type": "Brand", name: "Clinera.io" },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "279",
    highPrice: "479",
    priceCurrency: "USD",
    offerCount: 3,
    availability: "https://schema.org/InStock",
    url: "https://www.clinera.io/empleado-digital",
    seller: { "@type": "Organization", name: "Clinera.io" },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://www.clinera.io/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Empleado digital",
      item: "https://www.clinera.io/empleado-digital",
    },
  ],
};

const faqJsonLd = faqSchema(EMPLEADO_DIGITAL_FAQ);

const definedTermJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Empleado digital",
  description: EMPLEADO_DIGITAL_DEFINICION,
  url: "https://www.clinera.io/empleado-digital",
};

export default function EmpleadoDigitalPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <main className={styles.page}>
        <EmpleadoDigitalLanding />
      </main>
      <FooterV3 />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              window.dataLayer = window.dataLayer || [];
              document.addEventListener('click', function(ev){
                var a = ev.target.closest('a[data-plan]');
                if (!a) return;
                var plan = a.getAttribute('data-plan');
                var name = a.getAttribute('data-plan-name') || (plan + ' signup');
                var value = parseFloat(a.getAttribute('data-plan-value') || '0');
                window.dataLayer.push({
                  event: 'initiate_checkout',
                  lead_source: 'empleado_digital_landing',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/empleado-digital'
                });
                if (typeof fbq === 'function') {
                  fbq('track', 'InitiateCheckout', {
                    content_name: name,
                    content_category: 'landing_empleado_digital',
                    content_type: 'product',
                    currency: 'USD',
                    value: value
                  });
                }
              }, { capture: true });
            })();
          `,
        }}
      />
    </>
  );
}
