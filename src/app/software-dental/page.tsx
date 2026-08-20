import type { Metadata } from "next";
import { DENTAL } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-dental";

export const metadata: Metadata = {
  title: DENTAL.meta.title,
  description: DENTAL.meta.description,
  keywords: [...DENTAL.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: DENTAL.meta.title,
    description: DENTAL.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: DENTAL.meta.title,
    description: DENTAL.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={DENTAL} />;
}
