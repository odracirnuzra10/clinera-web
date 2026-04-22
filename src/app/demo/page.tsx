import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import DemoV3 from "@/components/interior-v3/DemoV3";

export const metadata: Metadata = {
  title: "Demo Clinera — Software clínico con IA en acción",
  description:
    "Mira cómo AURA agenda pacientes por WhatsApp 24/7. Demo completo de Clinera.io: agenda, ficha clínica, confirmaciones automáticas y analytics.",
  alternates: { canonical: "https://clinera.io/demo" },
  openGraph: {
    url: "https://clinera.io/demo",
    title: "Demo Clinera — Software clínico con IA en acción",
    description: "AURA atiende WhatsApp 24/7 y llena tu agenda sola. Mira el demo.",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <>
      <NavV3 />
      <main>
        <DemoV3 />
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
                var name = a.getAttribute('data-plan-name') || (plan + ' trial');
                var value = parseFloat(a.getAttribute('data-plan-value') || '0');
                window.dataLayer.push({
                  event: 'initiate_checkout',
                  lead_source: 'demo_landing',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/demo'
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
