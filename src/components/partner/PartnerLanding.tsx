import type { Partner } from "@/lib/partners";
import { PartnerFaq } from "@/components/partner/PartnerFaq";
import { PartnerFooter } from "@/components/partner/PartnerFooter";
import { PartnerNav } from "@/components/partner/PartnerNav";
import { PartnerPhoto } from "@/components/partner/PartnerPhoto";
import { PartnerReveal } from "@/components/partner/PartnerReveal";
import { PartnerStickyCta } from "@/components/partner/PartnerStickyCta";
import { PartnerTracker } from "@/components/partner/PartnerTracker";
import { WhatsAppCta } from "@/components/partner/WhatsAppCta";

const FEATURES = [
  {
    title: "AURA responde y agenda por WhatsApp, 24/7",
    body: "Contesta consultas, agenda, confirma y reagenda sin que nadie del equipo esté conectado.",
  },
  {
    title: "Ficha, agenda y pacientes en un solo lugar",
    body: "Historial, tratamientos y consentimientos donde los necesitas, no en tres planillas distintas.",
  },
  {
    title: "Cobros y recordatorios automáticos",
    body: "Menos no-shows, menos plata que se pierde en el seguimiento manual.",
  },
] as const;

const PROOF = [
  "+52 clínicas activas",
  "+500 profesionales",
  "Meta Business Partner",
  "WhatsApp Business API",
] as const;

export function PartnerLanding({
  partner,
  whatsappUrl,
}: {
  partner: Partner;
  whatsappUrl: string;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#111111]">
      <PartnerTracker partner={partner} />
      <PartnerNav />

      <main id="contenido" className="flex-1 pb-24 md:pb-0">
        <section className="px-5 pt-6 pb-8 md:px-8 md:pt-12 md:pb-14">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="font-[family-name:var(--font-partner-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6B6B]">
              Recomendación verificada
            </p>
            <PartnerPhoto partner={partner} className="mt-3" />
            <h1 className="mt-3 text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[#111111] md:mt-5 md:text-4xl">
              <span className="block">{partner.name}</span>
              <span className="block">te recomienda Clinera</span>
            </h1>
            {partner.role ? (
              <p className="mt-2 text-[13px] text-[#6B6B6B]">{partner.role}</p>
            ) : null}
            <p className="mt-3 max-w-md text-[15px] leading-[1.6] text-[#6B6B6B] md:mt-4">
              &ldquo;{partner.intro}&rdquo;
            </p>
            <WhatsAppCta partner={partner} href={whatsappUrl} className="mt-5 w-full md:mt-6" />
          </div>
        </section>

        <section className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-2xl">
            <PartnerReveal>
              <h2 className="text-[1.35rem] font-semibold tracking-tight md:text-2xl">
                Qué hace Clinera
              </h2>
            </PartnerReveal>
            <ul className="mt-8">
              {FEATURES.map((item, index) => (
                <PartnerReveal key={item.title} delayMs={index * 60}>
                  <li className="border-t border-[#EAEAEA] py-6 first:border-t last:pb-0">
                    <h3 className="text-[16px] font-medium text-[#111111]">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-[#6B6B6B]">{item.body}</p>
                  </li>
                </PartnerReveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#F7F6F3] px-5 py-10 md:px-8 md:py-12">
          <PartnerReveal>
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
              {PROOF.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-6 text-[13px] text-[#6B6B6B]">
                  {index > 0 ? (
                    <span aria-hidden="true" className="hidden text-[#EAEAEA] sm:inline">
                      ·
                    </span>
                  ) : null}
                  <span
                    className={
                      item.startsWith("+")
                        ? "font-[family-name:var(--font-partner-mono)] font-medium tracking-tight text-[#111111]"
                        : ""
                    }
                  >
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </PartnerReveal>
        </section>

        <section className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-2xl">
            <PartnerReveal>
              <h2 className="text-[1.35rem] font-semibold tracking-tight md:text-2xl">
                Preguntas cortas
              </h2>
            </PartnerReveal>
            <PartnerReveal delayMs={60} className="mt-6">
              <PartnerFaq partner={partner} />
            </PartnerReveal>
          </div>
        </section>

        <section className="border-t border-[#EAEAEA] px-5 py-16 md:px-8 md:py-24">
          <PartnerReveal>
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <h2 className="text-[1.35rem] font-semibold tracking-tight md:text-2xl">
                {partner.name} te lo recomienda. Conversa con {partner.sales.name}.
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-[1.6] text-[#6B6B6B]">
                En quince minutos ves si Clinera calza con tu clínica. Sin compromiso de contratar.
              </p>
              <WhatsAppCta partner={partner} href={whatsappUrl} className="mt-6 w-full" />
            </div>
          </PartnerReveal>
        </section>
      </main>

      <PartnerFooter />
      <PartnerStickyCta partner={partner} href={whatsappUrl} />
    </div>
  );
}
