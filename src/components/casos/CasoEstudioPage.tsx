import type { ReactNode } from "react";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  caseStudySchema,
  orgSchema,
} from "@/components/seo/schemas";
import type { CasoEstudio } from "@/content/casos";
import s from "@/app/casos/casos.module.css";

function injectClinicLinks(
  text: string,
  caso: CasoEstudio,
  used: Set<string>,
): ReactNode[] {
  const needles = [
    { needle: caso.clinica.anchor, href: caso.clinica.href },
    { needle: caso.home.anchor, href: caso.home.href },
  ];
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    let earliest = -1;
    let hit: (typeof needles)[number] | null = null;
    for (const n of needles) {
      if (used.has(n.href)) continue;
      const i = rest.indexOf(n.needle);
      if (i !== -1 && (earliest === -1 || i < earliest)) {
        earliest = i;
        hit = n;
      }
    }
    if (!hit || earliest < 0) {
      nodes.push(rest);
      break;
    }
    if (earliest > 0) nodes.push(rest.slice(0, earliest));
    used.add(hit.href);
    nodes.push(
      <a key={`${hit.href}-${key++}`} href={hit.href}>
        {hit.needle}
      </a>,
    );
    rest = rest.slice(earliest + hit.needle.length);
  }
  return nodes;
}

function CasoBody({ caso }: { caso: CasoEstudio }) {
  const used = new Set<string>();
  return caso.sections.map((sec) => (
    <section key={sec.h2}>
      <h2>{sec.h2}</h2>
      {sec.body.map((p) => (
        <p key={p.slice(0, 48)}>{injectClinicLinks(p, caso, used)}</p>
      ))}
    </section>
  ));
}

export function CasoEstudioPage({ caso }: { caso: CasoEstudio }) {
  const articleLd = caseStudySchema({
    path: caso.path,
    headline: caso.h1,
    description: caso.description,
    datePublished: caso.datePublished,
    dateModified: caso.dateModified,
    mentions: caso.mentions,
  });

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          articleLd,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io/" },
            { name: "Casos", url: "https://www.clinera.io/clinicas" },
            { name: caso.home.anchor, url: caso.url },
          ]),
        ]}
      />
      <NavV3 />
      <main className={s.page}>
        <header className={s.hero}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>{caso.eyebrow}</p>
            <div className={s.rule} aria-hidden="true" />
            <h1 className={s.h1}>{caso.h1}</h1>
            <p className={s.lede}>{caso.lede}</p>
            <p className={s.stamp}>
              Publicado el{" "}
              {new Date(`${caso.datePublished}T12:00:00`).toLocaleDateString(
                "es-CL",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </p>
          </div>
        </header>
        <article className={s.prose}>
          <div className={s.wrap}>
            <CasoBody caso={caso} />
            <p>{caso.cierra}</p>
          </div>
        </article>
        <div className={s.cta}>
          <div className={s.wrap}>
            <Link href="/agenda" className={s.ctaLink}>
              Agendar una reunión con Clinera <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <PageUpdated path={caso.path} />
      </main>
      <FooterV3 />
    </>
  );
}
