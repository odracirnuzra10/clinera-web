import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import s from "./ley20584.module.css";

export const metadata: Metadata = {
  title: "Seguridad de datos clínicos — cifrado y trazabilidad de la ficha",
  description:
    "Cómo Clinera protege la ficha clínica: cifrado en reposo AES-256-GCM, una llave por clínica, trazabilidad de acceso y respaldo continuo, sobre los requisitos técnicos de la normativa de ficha clínica de Chile, México, Perú y Colombia.",
  alternates: { canonical: "https://www.clinera.io/ley20584" },
  openGraph: {
    url: "https://www.clinera.io/ley20584",
    title: "Tus datos clínicos, cifrados y trazables — Clinera.io",
    description:
      "Cifrado en reposo AES-256-GCM, una llave por clínica, trazabilidad de acceso a la ficha y respaldo continuo.",
    type: "article",
  },
};

const PUBLISHED = "2026-07-22";
const MODIFIED = "2026-08-12";
const LAST_UPDATED = "12 de agosto de 2026";

const MEDIDAS = [
  {
    title: "Cifrado en reposo",
    text: "Todo el contenido clínico, AES-256-GCM.",
  },
  {
    title: "Una llave por clínica",
    text: "Los datos de una clínica no se descifran con la de otra.",
  },
  {
    title: "Trazabilidad de la ficha",
    text: "Queda registrado quién accede a qué, y cuándo.",
  },
  {
    title: "Respaldo continuo",
    text: "Copias automáticas y restauración a un instante exacto.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.clinera.io/ley20584#article",
  headline: "Tus datos clínicos, cifrados y trazables",
  description:
    "Medidas técnicas de protección de la ficha clínica en Clinera: cifrado en reposo AES-256-GCM, una llave de cifrado por clínica, trazabilidad de acceso y respaldo continuo con restauración punto en el tiempo.",
  url: "https://www.clinera.io/ley20584",
  inLanguage: "es",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  author: { "@id": "https://clinera.io/#organization" },
  publisher: { "@id": "https://clinera.io/#organization" },
  isPartOf: { "@id": "https://www.clinera.io/acreditacion#article" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.clinera.io/ley20584",
  },
};

export default function Ley20584Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <NavV3 />
      <main className={s.page}>
        {/* Bloque 0 — Hero */}
        <section className={s.hero}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>Seguridad de datos</p>
            <div className={s.rule} aria-hidden="true" />
            <h1 className={s.h1}>Tus datos clínicos, cifrados y trazables.</h1>
            <p className={s.lede}>
              La ficha clínica es el dato más sensible que existe. Así la protegemos.
            </p>
            <p className={s.stamp}>Última actualización — {LAST_UPDATED}</p>
          </div>
        </section>

        {/* Bloque 1 — Cuatro medidas */}
        <section aria-label="Medidas activas">
          <div className={s.wrap}>
            <div className={s.cards}>
              {MEDIDAS.map((m, i) => (
                <article key={m.title} className={s.card}>
                  <p className={s.cardIdx}>{String(i + 1).padStart(2, "0")}</p>
                  <h2 className={s.cardTitle}>{m.title}</h2>
                  <p className={s.cardText}>{m.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bloque 2 — Envelope encryption */}
        <section className={s.envelope}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>Envelope encryption, en una frase</p>
            <p className={s.envSentence}>
              Cada ficha se cifra con una llave única por clínica, esa llave se guarda cifrada
              por una llave maestra en un servicio de custodia especializado, y un robo de la
              base de datos expone solo texto ilegible.
            </p>
          </div>
        </section>

        {/* Bloque 3 — Franja de países */}
        <section className={s.strip} aria-label="Países donde opera Clinera">
          <div className={s.wrap}>
            <div className={s.stripInner}>
              <p className={s.codes}>CL · MX · PE · CO</p>
              <p className={s.stripText}>
                Clinera está diseñado sobre los requisitos técnicos de la normativa de ficha
                clínica de cada país donde operamos.
              </p>
            </div>
          </div>
        </section>

        {/* Bloque 4 — Derivación */}
        <section className={s.cta}>
          <div className={s.wrap}>
            <Link href="/acreditacion" className={s.ctaLink}>
              Ver la normativa de cada país en detalle
              <span className={s.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Bloque 5 — Legal */}
        <section className={s.legal}>
          <div className={s.wrap}>
            <p className={s.legalText}>
              Esta página es informativa y no constituye asesoría legal. Lo que describe son las
              medidas técnicas activas en la plataforma, auditables en una revisión de due
              diligence. Qué exige cada marco normativo y quién lo valida está detallado en{" "}
              <Link href="/acreditacion">normativa y acreditación en LATAM</Link>. Para una
              revisión técnica con nuestro equipo,{" "}
              <Link href="/agenda">agenda una reunión</Link>.
            </p>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
