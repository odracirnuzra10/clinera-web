import type { Metadata } from "next";
import { MEDICO } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-medico";

export const metadata: Metadata = {
  title: MEDICO.meta.title,
  description: MEDICO.meta.description,
  keywords: [...MEDICO.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: MEDICO.meta.title,
    description: MEDICO.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: MEDICO.meta.title,
    description: MEDICO.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={MEDICO} />;
}
