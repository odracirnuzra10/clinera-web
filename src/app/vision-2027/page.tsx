import type { Metadata } from "next";
import VisionDeck from "./VisionDeck";

export const metadata: Metadata = {
  title: "Clinera 2027",
  description: "Visión interna: de software para clínicas a la red de pacientes.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function Vision2027Page() {
  return <VisionDeck />;
}
