import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import TrialBanner from "@/components/cro/TrialBanner";
import { PLANES_FAQ } from "@/content/planes-faq";
import { ANNUAL_DISCOUNT_PERCENT, CLINERA_PLANS } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Planes y Precios — Clinera.io (desde USD 223/mes con plan anual)",
  description:
    "Vortex, Atlas y Summit con bolsa de créditos (28.000 / 37.000 / 46.000) y AURA por WhatsApp 24/7. Tres modalidades: anual con 20% OFF e implementación gratis (desde USD 2.678/año), semestral con 20% OFF, o mensual desde USD 279/mes. Configuración inicial USD 450, gratis si pagas el año.",
  alternates: { canonical: "https://www.clinera.io/planes" },
  openGraph: {
    url: "https://www.clinera.io/planes",
    title: "Planes y Precios — Clinera.io",
    description:
      "3 planes con bolsa de créditos para clínicas en LATAM. Anual con 20% OFF e implementación gratis (ahorras hasta USD 1.600 el primer año), semestral con 20% OFF o mensual desde USD 279/mes.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io",
  description: "Software de IA para clínicas",
  offers: [
    // El anual va primero también acá: es la oferta que queremos que citen
    // los buscadores y los motores de IA cuando resuman los precios.
    ...CLINERA_PLANS.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} · Anual`,
      price: String(plan.annualTotal),
      priceCurrency: "USD",
      url: "https://www.clinera.io/planes",
      description: `Pago anual: ${ANNUAL_DISCOUNT_PERCENT}% OFF e implementación gratis (equivale a USD ${plan.annualMonthly}/mes).`,
    })),
    ...CLINERA_PLANS.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: String(plan.monthlyPrice),
      priceCurrency: "USD",
      url: "https://www.clinera.io/planes",
    })),
    { "@type": "Offer", name: "Corporativo", price: "1900", priceCurrency: "USD", url: "https://www.clinera.io/planes", availability: "https://schema.org/PreOrder", description: "Plan personalizado desde USD 1.900/mes" },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PLANES_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function PlanesPage() {
  return (
    <>
      <NavV3 />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main>
        <TrialBanner />
        <PlanesV3 />
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
                  lead_source: 'planes_landing',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/planes'
                });
                if (typeof fbq === 'function') {
                  fbq('track', 'InitiateCheckout', {
                    content_name: name,
                    content_category: 'landing_register',
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
