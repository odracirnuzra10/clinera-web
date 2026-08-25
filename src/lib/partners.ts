export type Partner = {
  slug: string;
  /** Vanity corta para la URL pública (`/partner/{vanity}`). */
  vanity?: string;
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
 * Si el partner tiene `vanity`, la URL pública es `/partner/{vanity}`
 * y `/p/{slug}` redirige ahí (ver `next.config.ts`).
 */
export const PARTNERS: Record<string, Partner> = {
  katherine: {
    slug: "katherine",
    vanity: "km",
    ref: "KATHE01",
    name: "Katherine Meza",
    role: "", // TODO: confirmar
    photo: "/partners/katherine.jpg",
    intro:
      "Te lo recomiendo si la agenda, los cobros y el seguimiento de pacientes te están comiendo el día.",
    sales: { name: "Rebeca", phone: "56965810649" },
  },
  yasna: {
    slug: "yasna",
    vanity: "yv",
    ref: "YASNA01",
    name: "Yasna Vásquez",
    role: "Estética Facial · Talca",
    photo: "/partners/yasna.jpg",
    intro:
      "Para que las campañas y la agenda no dependan de más secretarias. Si el WhatsApp de la clínica te está comiendo el día, míralo.",
    sales: { name: "Rebeca", phone: "56965810649" },
  },
};

export const PARTNER_SITE_ORIGIN = "https://www.clinera.io";

/** Label del CTA público. El href sigue siendo WhatsApp con `ref` en el mensaje. */
export const PARTNER_CTA_LABEL = "Coordinar reunión con Clinera";

/** El mismo clip de Ricardo en CNN que usa `/plataforma` (PressCNN). */
export const PARTNER_CNN_VIMEO_SRC =
  "https://player.vimeo.com/video/1205127087?badge=0&autopause=0&player_id=0&app_id=58479";

export function getPartner(slug: string): Partner | undefined {
  return PARTNERS[slug];
}

export function listPartners(): Partner[] {
  return Object.values(PARTNERS);
}

export function getPartnerByVanity(code: string): Partner | undefined {
  const normalized = code.trim().toLowerCase();
  return listPartners().find((partner) => partner.vanity === normalized);
}

export function getPartnerPublicPath(partner: Partner): string {
  return partner.vanity ? `/partner/${partner.vanity}` : `/p/${partner.slug}`;
}

export function getPartnerPublicUrl(slug: string): string {
  const partner = getPartner(slug);
  const path = partner ? getPartnerPublicPath(partner) : `/p/${slug}`;
  return `${PARTNER_SITE_ORIGIN}${path}`;
}

export function getPartnerKitPath(partner: Partner): string {
  return `${getPartnerPublicPath(partner)}/kit`;
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
