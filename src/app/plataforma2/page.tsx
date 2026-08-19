import type { Metadata } from "next";
import PlataformaLanding2, { FAQ } from "@/components/plataforma2/PlataformaLanding2";

// Versión corta de /plataforma para revisión interna: noindex mientras
// convive con la original, para no duplicar contenido ni competir en SERP.
export const metadata: Metadata = {
  title: "Clinera O.S. — El sistema operativo de tu clínica",
  description:
    "Todas las operaciones de tu clínica bajo un mismo sistema operativo con IA: agenda, fichas, tratamientos, pagos, marketing y WhatsApp. Migramos tus datos, configuramos la operación y capacitamos a tu equipo.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/plataforma" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Plataforma2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PlataformaLanding2 />
    </>
  );
}
