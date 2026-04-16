import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap de Desarrollo",
  description:
    "Conoce el roadmap de desarrollo de Clinera.io. Descubre que hemos construido y que viene proximamente para tu clinica.",
};

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
