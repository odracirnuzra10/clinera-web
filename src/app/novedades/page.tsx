import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import NovedadesV3 from "@/components/interior-v3/NovedadesV3";

export const metadata: Metadata = {
  title: "Novedades y Changelog — Clinera.io",
  description:
    "Últimas novedades, releases y artículos de Clinera: nueva funcionalidad de IA, mejoras de agenda, integraciones y casos de uso.",
  alternates: { canonical: "https://clinera.io/novedades" },
  openGraph: {
    url: "https://clinera.io/novedades",
    title: "Novedades y Changelog — Clinera.io",
    description: "Releases, mejoras y artículos de Clinera.",
    type: "website",
  },
};

const AI_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwJKtkMCOV8nDh3J5ngXzmU39xiB9zXbs6zFm5bTV1rlo6WKzm_XZXFFOzgEjEuIKF-/exec";
const APP_TOKEN = "Clinera_Internal_Secure_Key_2026";

export const revalidate = 60;

type Blog = { title: string; excerpt?: string; category?: string; image?: string; url?: string };
type Faq = { title: string; content: string; icon?: string };

async function getHelpData(): Promise<{ blogs: Blog[]; faqs: Faq[] }> {
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ type: "get_all_help_data", token: APP_TOKEN }),
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    return (await res.json()) as { blogs: Blog[]; faqs: Faq[] };
  } catch (error) {
    console.error("Error fetching data from Google Script", error);
    return { blogs: [], faqs: [] };
  }
}

export default async function NovedadesPage() {
  const data = await getHelpData();
  const faqs = data.faqs ?? [];
  // Show newest first
  const blogs = (data.blogs ?? []).slice().reverse();

  return (
    <>
      <NavV3 />
      <main>
        <NovedadesV3 blogs={blogs} faqs={faqs} />
      </main>
      <FooterV3 />
    </>
  );
}
