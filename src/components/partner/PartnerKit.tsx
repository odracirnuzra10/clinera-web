import type { Partner } from "@/lib/partners";
import { getPartnerKitCopy } from "@/lib/partners";
import { CopyButton } from "@/components/partner/CopyButton";
import { PartnerFooter } from "@/components/partner/PartnerFooter";
import { PartnerNav } from "@/components/partner/PartnerNav";

export function PartnerKit({
  partner,
  url,
  qrDataUrl,
}: {
  partner: Partner;
  url: string;
  qrDataUrl: string;
}) {
  const copy = getPartnerKitCopy(partner);
  const fileName = `clinera-${partner.slug}-qr.png`;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#111111]">
      <PartnerNav />

      <main id="contenido" className="flex-1 px-5 py-10 md:px-8 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="font-[family-name:var(--font-partner-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6B6B]">
            Kit de partner
          </p>
          <h1 className="mt-3 text-[1.75rem] font-semibold tracking-tight md:text-4xl">
            Hola, {partner.name.split(" ")[0]}
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#6B6B6B]">
            Esta página es tuya. No la compartas con prospectos: ellos entran por tu link
            público. Tú solo pegas, subes el QR o dictas tu código.
          </p>

          <section className="mt-10 rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
            <h2 className="text-[16px] font-medium">Tu link</h2>
            <p className="mt-2 break-all font-[family-name:var(--font-partner-mono)] text-[13px] text-[#6B6B6B]">
              {url}
            </p>
            <CopyButton value={url} className="mt-4" />
          </section>

          <section className="mt-6 rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
            <h2 className="text-[16px] font-medium">Tu QR</h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#6B6B6B]">
              Negro sobre blanco, margen amplio. Se lee desde un delantal o una tarjeta.
            </p>
            <div className="mt-5 inline-block border border-[#EAEAEA] bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR del link de ${partner.name}`} width={240} height={240} />
            </div>
            <div className="mt-4">
              <a
                href={qrDataUrl}
                download={fileName}
                className="partner-btn"
              >
                Descargar PNG 1024px
              </a>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
            <h2 className="text-[16px] font-medium">Tu código</h2>
            <p className="mt-2 font-[family-name:var(--font-partner-mono)] text-[22px] font-medium tracking-[0.08em] text-[#111111]">
              {partner.ref}
            </p>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#6B6B6B]">
              Úsalo cuando alguien te pregunte de boca. Ventas lo busca igual que el link.
            </p>
            <CopyButton value={partner.ref} className="mt-4" />
          </section>

          <section className="mt-10">
            <h2 className="text-[1.35rem] font-semibold tracking-tight">Textos listos para copiar</h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#6B6B6B]">
              Tono de colega a colega. Pégalos tal cual.
            </p>

            <article className="mt-6 rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
              <p className="font-[family-name:var(--font-partner-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6B6B]">
                Historia de Instagram
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.6] text-[#111111]">
                {copy.instagram}
              </p>
              <CopyButton value={copy.instagram} className="mt-4" />
            </article>

            <article className="mt-6 rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
              <p className="font-[family-name:var(--font-partner-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6B6B]">
                WhatsApp a una colega
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.6] text-[#111111]">
                {copy.whatsapp}
              </p>
              <CopyButton value={copy.whatsapp} className="mt-4" />
            </article>

            <article className="mt-6 rounded-xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8">
              <p className="font-[family-name:var(--font-partner-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B6B6B]">
                Comentario o DM
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.6] text-[#111111]">
                {copy.comentario}
              </p>
              <CopyButton value={copy.comentario} className="mt-4" />
            </article>
          </section>
        </div>
      </main>

      <PartnerFooter />
    </div>
  );
}
