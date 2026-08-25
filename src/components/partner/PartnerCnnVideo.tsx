import { CnnLogo } from "@/components/brand-v3/Brand";
import { PARTNER_CNN_VIMEO_SRC } from "@/lib/partners";

export function PartnerCnnVideo() {
  return (
    <section className="partner-card" aria-labelledby="partner-cnn-title">
      <div className="partner-cnn-head">
        <CnnLogo height={22} color="#F03A47" />
        <p className="partner-eyebrow" style={{ margin: 0 }}>
          Clinera en CNN
        </p>
      </div>
      <h2 id="partner-cnn-title" className="partner-section-title" style={{ marginTop: 8 }}>
        Un gran paso para Clinera.
      </h2>
      <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.5 }}>
        CNN conoció cómo Clinera ayuda a las clínicas de LATAM a operar con más
        control.
      </p>
      <div className="partner-video">
        <iframe
          src={PARTNER_CNN_VIMEO_SRC}
          title="Reportaje de CNN sobre Clinera"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
