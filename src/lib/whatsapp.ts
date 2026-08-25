import type { Partner } from "@/lib/partners";

export function buildWhatsAppMessage(partner: Partner): string {
  return `Hola ${partner.sales.name}, vengo de parte de ${partner.name} (ref: ${partner.ref}). Quiero saber cómo funciona Clinera en mi clínica.`;
}

export function buildWhatsAppUrl(partner: Partner): string {
  const text = encodeURIComponent(buildWhatsAppMessage(partner));
  return `https://wa.me/${partner.sales.phone}?text=${text}`;
}
