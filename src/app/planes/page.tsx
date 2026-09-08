import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import TrialBanner from "@/components/cro/TrialBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  faqSchema,
  orgSchema,
  productPlansSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { PLANES_FAQ } from "@/content/planes-faq";

const TITLE = "Planes y precios desde USD 279/mes";
const DESCRIPTION =
  "Vortex, Atlas y Summit con bolsa de créditos (28.000 / 37.000 / 46.000) y AURA por WhatsApp 24/7. Plan mensual desde USD 279/mes; el primer cobro incluye implementación USD 450 más el primer mes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/planes" },
  openGraph: {
    url: "https://www.clinera.io/planes",
    title: TITLE,
    description:
      "3 planes con bolsa de créditos para clínicas en LATAM. Mensual desde USD 279/mes; implementación USD 450 con el primer mes.",
    type: "website",
  },
};

export default function PlanesPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          productPlansSchema,
          webPageSchema({
            path: "/planes",
            name: TITLE,
            description: DESCRIPTION,
          }),
          faqSchema(PLANES_FAQ),
        ]}
      />
      <main>
        <TrialBanner />
        <PlanesV3 />
        <PageUpdated path="/planes" />
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
