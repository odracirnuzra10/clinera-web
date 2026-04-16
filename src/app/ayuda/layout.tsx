import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda",
  description:
    "Necesitas ayuda? Explora nuestra base de conocimiento, video tutoriales y preguntas frecuentes para dominar Clinera IA.",
  openGraph: {
    url: "https://clinera.io/ayuda",
  },
};

export default function AyudaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
