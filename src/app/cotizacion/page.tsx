import type { Metadata } from "next";
import { connection } from "next/server";
import QuoteBuilder from "./QuoteBuilder";

export const metadata: Metadata = {
  title: "Constructor de cotizaciones",
  description: "Crea cotizaciones comerciales de Clinera con planes, extras y descuentos.",
  robots: {
    index: false,
    follow: false,
  },
};

function getSantiagoIsoDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export default async function QuotePage() {
  await connection();

  const today = getSantiagoIsoDate(new Date());
  const validUntil = new Date(`${today}T12:00:00Z`);
  validUntil.setUTCDate(validUntil.getUTCDate() + 7);
  const validUntilIso = validUntil.toISOString().slice(0, 10);

  const dateCode = today.replaceAll("-", "");

  return (
    <QuoteBuilder
      initialDate={today}
      initialValidUntil={validUntilIso}
      initialQuoteNumber={`CLI-${dateCode}-001`}
    />
  );
}
