import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import styles from "./planes.module.css";

export const metadata: Metadata = {
  title: "Planes y Precios — Clinera.io (desde USD 89/mes)",
  description:
    "Growth USD 89/mes, Conect USD 129/mes, Advanced USD 179/mes. IA que agenda por WhatsApp 24/7. Prueba gratis 7 días sin tarjeta.",
  alternates: { canonical: "https://clinera.io/planes" },
  openGraph: {
    url: "https://clinera.io/planes",
    title: "Planes y Precios — Clinera.io",
    description:
      "3 planes para clínicas en LATAM. Desde USD 89/mes con prueba gratis de 7 días.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io",
  description: "Software de IA para clínicas",
  offers: [
    {
      "@type": "Offer",
      name: "Growth",
      price: "89",
      priceCurrency: "USD",
      url: "https://clinera.io/planes",
    },
    {
      "@type": "Offer",
      name: "Conect",
      price: "129",
      priceCurrency: "USD",
      url: "https://clinera.io/planes",
    },
    {
      "@type": "Offer",
      name: "Advanced",
      price: "179",
      priceCurrency: "USD",
      url: "https://clinera.io/planes",
    },
  ],
};

export default function PlanesPage() {
  return (
    <>
      <NavV3 />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Pricing Header ── */}
        <section className={styles.pricingHero}>
          <div className="container">
            <h2>Elige tu plan. Activa hoy.</h2>
            <p>
              Todos los planes incluyen API completa y sin permanencia. Precios
              en USD.
            </p>
          </div>
        </section>

        {/* ── Plans Grid ── */}
        <section className={styles.plansGrid}>
          {/* Growth */}
          <div className={styles.planCard}>
            <h3 className={styles.planName}>Growth</h3>
            <div className={styles.planPrice}>
              $89<span>/mes</span>
            </div>
            <p className={styles.planDesc}>
              Mensajería IA para clínicas que ya tienen software
            </p>

            <div className={styles.modulePills}>
              <span className={styles.modulePill}>
                <span className={styles.modulePillCheck}>✓</span> Mensajería
                con IA
              </span>
              <span className={styles.modulePill}>
                <span className={styles.modulePillCross}>✕</span> Módulo
                Clínico
              </span>
            </div>

            <hr className={styles.planDivider} />
            <p className={styles.planSectionLabel}>Incluye</p>
            <ul className={styles.featureList}>
              <li>150 conversaciones con IA/mes</li>
              <li>WhatsApp API</li>
              <li>Memoria contextual vía LangChain</li>
              <li>Derivación automática a humano</li>
              <li>Integración vía API y MCP</li>
              <li>3 usuarios incluidos</li>
            </ul>

            <div className={styles.planActions}>
              <Link
                href="/ventas"
                className={`${styles.planCta} ${styles.planCtaPrimary}`}
                data-plan="growth"
                data-plan-value="89"
                data-plan-name="Growth talk-to-sales"
              >
                Hablar con ventas
              </Link>
              <a
                href="https://buy.stripe.com/00wcN79l7bmO9wT6VZ14415"
                target="_blank"
                rel="noopener"
                className={styles.planCta}
                data-plan="growth"
                data-plan-value="89"
                data-plan-name="Growth pay"
              >
                Activar plan
              </a>
            </div>
          </div>

          {/* Conect (Popular) */}
          <div className={`${styles.planCard} ${styles.planCardPopular}`}>
            <span className={styles.popularBadge}>Popular</span>
            <h3 className={styles.planName}>Conect</h3>
            <div className={styles.planPrice}>
              $129<span>/mes</span>
            </div>
            <p className={styles.planDesc}>
              Mensajería + clínica completa sin otro software
            </p>

            <div className={styles.modulePills}>
              <span className={styles.modulePill}>
                <span className={styles.modulePillCheck}>✓</span> Mensajería
                con IA
              </span>
              <span className={styles.modulePill}>
                <span className={styles.modulePillCheck}>✓</span> Módulo
                Clínico
              </span>
            </div>

            <hr className={styles.planDivider} />
            <p className={styles.planSectionLabel}>Todo de Growth, más</p>
            <ul className={styles.featureList}>
              <li>500 conversaciones/mes</li>
              <li>5 usuarios</li>
              <li>Agenda médica</li>
              <li>Fichas clínicas</li>
              <li>Consentimientos informados</li>
              <li>Clinera Vault</li>
              <li>Panel ventas</li>
              <li>Trazabilidad campaña-cita-venta</li>
            </ul>

            <div className={styles.planActions}>
              <Link
                href="/ventas"
                className={`${styles.planCta} ${styles.planCtaPrimary}`}
                data-plan="conect"
                data-plan-value="129"
                data-plan-name="Conect talk-to-sales"
              >
                Hablar con ventas
              </Link>
              <a
                href="https://buy.stripe.com/aFa9AV8h3ez07oL2FJ14416"
                target="_blank"
                rel="noopener"
                className={styles.planCta}
                data-plan="conect"
                data-plan-value="129"
                data-plan-name="Conect pay"
              >
                Activar plan
              </a>
            </div>
          </div>

          {/* Advanced */}
          <div className={styles.planCard}>
            <h3 className={styles.planName}>Advanced</h3>
            <div className={styles.planPrice}>
              $179<span>/mes</span>
            </div>
            <p className={styles.planDesc}>
              Para cadenas clínicas multi-sede
            </p>

            <div className={styles.modulePills}>
              <span className={styles.modulePill}>
                <span className={styles.modulePillCheck}>✓</span> Mensajería
                con IA
              </span>
              <span className={styles.modulePill}>
                <span className={styles.modulePillCheck}>✓</span> Módulo
                Clínico
              </span>
            </div>

            <hr className={styles.planDivider} />
            <p className={styles.planSectionLabel}>Todo de Conect, más</p>
            <ul className={styles.featureList}>
              <li>2000 conversaciones/mes</li>
              <li>15 usuarios</li>
              <li>Multi-sede</li>
              <li>Webhooks avanzados</li>
              <li>Soporte prioritario</li>
              <li>Onboarding dedicado</li>
            </ul>

            <div className={styles.planActions}>
              <Link
                href="/ventas"
                className={`${styles.planCta} ${styles.planCtaPrimary}`}
                data-plan="advanced"
                data-plan-value="179"
                data-plan-name="Advanced talk-to-sales"
              >
                Hablar con ventas
              </Link>
              <a
                href="https://buy.stripe.com/4gM3cxapb9eG4cz1BF1441a"
                target="_blank"
                rel="noopener"
                className={styles.planCta}
                data-plan="advanced"
                data-plan-value="179"
                data-plan-name="Advanced pay"
              >
                Activar plan
              </a>
            </div>
          </div>
        </section>

        {/* ── Add-ons ── */}
        <section className={styles.addonsSection}>
          <h3>Add-ons</h3>
          <div className={styles.addonsGrid}>
            <div className={styles.addonCard}>
              <div className={styles.addonPrice}>
                $15<span>/mes</span>
              </div>
              <p className={styles.addonLabel}>
                +100 conversaciones con IA
              </p>
            </div>
            <div className={styles.addonCard}>
              <div className={styles.addonPrice}>
                $9<span>/mes</span>
              </div>
              <p className={styles.addonLabel}>
                Profesional o usuario extra
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className={styles.faqSection}>
          <h3>Preguntas frecuentes</h3>

          <details className={styles.faqItem}>
            <summary>¿Qué incluye la prueba gratis?</summary>
            <div className={styles.faqAnswer}>
              Acceso completo al plan que elijas durante 7 días, sin necesidad de
              tarjeta de crédito. Puedes probar todas las funcionalidades sin
              restricciones.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary>¿Puedo cambiar de plan después?</summary>
            <div className={styles.faqAnswer}>
              Sí. Puedes subir o bajar de plan en cualquier momento desde tu
              panel. El cambio se aplica en tu próximo ciclo de facturación.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary>¿Hay permanencia o contrato?</summary>
            <div className={styles.faqAnswer}>
              No. Todos los planes son mes a mes. Puedes cancelar en cualquier
              momento sin penalizaciones.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary>¿Qué pasa si supero las conversaciones incluidas?</summary>
            <div className={styles.faqAnswer}>
              Tu servicio no se interrumpe. Te notificamos cuando estés cerca del
              límite y puedes agregar paquetes de +100 conversaciones por
              $15/mes.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary>¿Se integra con mi software actual?</summary>
            <div className={styles.faqAnswer}>
              Sí. Clinera se conecta vía API con Reservo, AgendaPro, Medilink,
              Dentalink, Sacmed y cualquier sistema que exponga una API REST o
              soporte MCP.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary>¿Cómo funciona la IA de mensajería?</summary>
            <div className={styles.faqAnswer}>
              Nuestra IA responde automáticamente por WhatsApp usando LangChain
              con memoria contextual. Agenda, confirma y responde consultas
              24/7. Si necesita un humano, deriva la conversación
              automáticamente.
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary>¿Los precios incluyen IVA?</summary>
            <div className={styles.faqAnswer}>
              Los precios mostrados están en USD y no incluyen impuestos locales.
              El monto final depende de la legislación tributaria de tu país.
            </div>
          </details>
        </section>
      </main>

      <FooterV3 />

      {/* Meta Pixel — InitiateCheckout on CTA click */}
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
