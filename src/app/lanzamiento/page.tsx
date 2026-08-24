import type { Metadata } from "next";
import { evento } from "@/config/evento";
import LanzamientoHebeLanding from "./LanzamientoHebeLanding";

const TITULO = "Cena de lanzamiento IA · Los Ángeles | Clinera.io";
const DESCRIPCION =
  "Cena privada en Los Ángeles para 20 doctores y dueños de clínica: demo en vivo de AURA, CAMILA y Clinera Intelligence. Viernes 11 de septiembre de 2026, 19:00 hrs. Postula a tu cupo.";

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: "https://www.clinera.io/lanzamiento" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: evento.urlCanonica,
    siteName: "Clinera.io",
    title: TITULO,
    description: DESCRIPCION,
    images: [
      {
        url: "/og-evento.png",
        width: 1200,
        height: 630,
        alt: "Cena de lanzamiento IA de Clinera en Los Ángeles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/og-evento.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${evento.nombre} · ${evento.ciudad}`,
  startDate: evento.fechaISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  description: DESCRIPCION,
  url: evento.urlCanonica,
  image: ["https://clinera.io/og-evento.png"],
  maximumAttendeeCapacity: evento.cupos.total,
  location: {
    "@type": "Place",
    name: evento.lugar.nombre,
    address: {
      "@type": "PostalAddress",
      streetAddress: evento.lugar.direccion,
      addressLocality: evento.ciudad,
      addressCountry: "CL",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Clinera",
    url: evento.sitio,
  },
};

export default function LanzamientoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LanzamientoHebeLanding />
    </>
  );
}
