export type Partner = {
  slug: string;
  ref: string;
  name: string;
  role: string;
  photo: string;
  intro: string;
  sales: { name: string; phone: string };
};

/**
 * Fuente única de partners. Agregar uno = una entrada acá.
 * La landing, el OG, el kit y el mensaje de WhatsApp se arman solos.
 */
export const PARTNERS: Record<string, Partner> = {
  katherine: {
    slug: "katherine",
    ref: "KATHE01",
    name: "Katherine Meza",
    role: "", // TODO: confirmar
    photo: "/partners/katherine.jpg",
    intro:
      "Te lo recomiendo si la agenda, los cobros y el seguimiento de pacientes te están comiendo el día.",
    sales: { name: "Rebeca", phone: "56965810649" },
  },
};

export const PARTNER_SITE_ORIGIN = "https://www.clinera.io";

export function getPartner(slug: string): Partner | undefined {
  return PARTNERS[slug];
}

export function listPartners(): Partner[] {
  return Object.values(PARTNERS);
}

export function getPartnerPublicUrl(slug: string): string {
  return `${PARTNER_SITE_ORIGIN}/p/${slug}`;
}

export function getPartnerInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export type PartnerKitCopy = {
  instagram: string;
  whatsapp: string;
  comentario: string;
};

export function getPartnerKitCopy(partner: Partner): PartnerKitCopy {
  const url = getPartnerPublicUrl(partner.slug);
  return {
    instagram:
      "Colegas, esto es lo que uso para que la agenda y el WhatsApp de la clínica no se me vayan de las manos. Desliza y mira cómo funciona.",
    whatsapp: `Hola, te paso el link de Clinera. Lo uso para agenda, cobros y seguimiento por WhatsApp — si te está pesando el día a día de la clínica, vale la pena que lo mires. Te responde una persona, no un bot.\n\n${url}`,
    comentario: `Me pasaba lo mismo con las confirmaciones y los que no llegan. Lo resolví con esto. Te dejo el link, una persona te cuenta cómo queda en una clínica como la tuya.\n\n${url}`,
  };
}
