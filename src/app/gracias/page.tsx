import type { Metadata } from "next";
import { Suspense } from "react";
import { ThanksContent } from "./ThanksContent";
import { tokenValido } from "./token";

export const metadata: Metadata = {
  title: "¡Gracias! Te contactamos en menos de 2 horas — Clinera",
  description:
    "Recibimos tu solicitud. Catalina o Nohelymar te contactará por WhatsApp para coordinar la demo o resolver tus dudas.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/gracias" },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// El token se valida ACÁ, server-side, antes de decirle a ThanksContent si
// puede disparar el Pixel — así la firma nunca depende de nada que corra en
// el navegador. Ver ./token.ts.
export default async function GraciasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const eventId = uno(sp.event_id);
  const source = uno(sp.source);
  const token = uno(sp.token);
  const pixelVerified = tokenValido(eventId, source, token);

  return (
    <Suspense fallback={null}>
      <ThanksContent pixelVerified={pixelVerified} />
    </Suspense>
  );
}
