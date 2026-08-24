"use client";

import { useEffect, useState } from "react";
import { evento } from "@/config/evento";
import styles from "@/components/ventas/AgendaHebeLanding.module.css";

const TOTAL = 5;

const SLIDES = [
  {
    img: "/images/lanzamiento/cuadrado.jpg",
    caption: `${evento.lugar.nombre} · ${evento.ciudad}`,
    name: evento.nombre,
    uses: `${evento.fechaLarga} · ${evento.hora}`,
  },
  {
    img: "/images/lanzamiento/feed.jpg",
    caption: "Cena privada · Solo doctores y dueños de clínica",
    name: "Lanzamiento IA",
    uses: "AURA · CAMILA · Clinera Intelligence en vivo",
  },
  {
    img: "/images/lanzamiento/horizontal.jpg",
    caption: evento.metadataMono,
    name: `${evento.cupos.total} cupos`,
    uses: "Postula y confirmamos por WhatsApp",
  },
];

const DEMOS = [
  { id: "aura", label: "AURA en vivo", hint: "IA agendando por WhatsApp, en tiempo real" },
  { id: "camila", label: "CAMILA", hint: "Agente de voz que llama y agenda por teléfono" },
  { id: "intelligence", label: "Clinera Intelligence", hint: "Pregúntale a tu clínica y responde con números" },
  { id: "roadmap", label: "Lo que viene", hint: "El roadmap que aún no está en el sitio" },
];

const ROLES = [
  { id: "dueno", label: "Dueño / Fundador", hint: "Tomas la decisión" },
  { id: "director", label: "Director / Gerente", hint: "Operas la clínica" },
  { id: "medico", label: "Médico o especialista", hint: "Atiendes pacientes" },
  { id: "otro", label: "Otro rol", hint: "Administración o socios" },
];

const TIPOS = [
  { id: "medica", label: "Médica" },
  { id: "dental", label: "Dental" },
  { id: "estetica", label: "Estética" },
  { id: "otra", label: "Otra" },
];

const TICKER = [
  { name: "AURA", price: "WhatsApp" },
  { name: "CAMILA", price: "voz" },
  { name: "Intelligence", price: "números" },
  { name: "Roadmap", price: "en vivo" },
];

const PHONES: Record<
  string,
  { flag: string; label: string; len: number; pattern: RegExp; placeholder: string; hint: string }
> = {
  "+56": { flag: "🇨🇱", label: "Chile", len: 9, pattern: /^9\d{8}$/, placeholder: "9 1234 5678", hint: "9 dígitos, empieza con 9" },
  "+51": { flag: "🇵🇪", label: "Perú", len: 9, pattern: /^9\d{8}$/, placeholder: "912 345 678", hint: "9 dígitos, empieza con 9" },
  "+57": { flag: "🇨🇴", label: "Colombia", len: 10, pattern: /^3\d{9}$/, placeholder: "300 123 4567", hint: "10 dígitos, empieza con 3" },
  "+52": { flag: "🇲🇽", label: "México", len: 10, pattern: /^[2-9]\d{9}$/, placeholder: "55 1234 5678", hint: "10 dígitos" },
  "+54": { flag: "🇦🇷", label: "Argentina", len: 10, pattern: /^[1-9]\d{9}$/, placeholder: "11 1234 5678", hint: "10 dígitos" },
};

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const RE_HANDLE = /^@[a-z0-9._]{2,30}$/i;
const RE_URL = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

function Check() {
  return (
    <span className={styles.check} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.back} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Volver
    </button>
  );
}

function TickerTrack() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className={styles.tickerTrack}>
      {items.map((t, i) => (
        <span key={`${t.name}-${i}`}>
          <span className={styles.tickerItem}>
            <span>{t.name}</span>
            <span className={styles.tickerPrice}>{t.price}</span>
          </span>
          <span className={styles.tickerSep}>◆</span>
        </span>
      ))}
    </div>
  );
}

export default function LanzamientoHebeLanding() {
  const [step, setStep] = useState(1);
  const [slide, setSlide] = useState(0);
  const [demos, setDemos] = useState<string[]>([]);
  const [rol, setRol] = useState("");
  const [clinica, setClinica] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [tipo, setTipo] = useState("");
  const [nombre, setNombre] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("+56");
  const [attempted, setAttempted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 4200);
    return () => window.clearInterval(t);
  }, []);

  const rule = PHONES[prefix];
  const digits = phone.replace(/\D/g, "");
  const phoneOk = digits.length === rule.len && rule.pattern.test(digits);
  const profileOk = RE_HANDLE.test(website.trim()) || RE_URL.test(website.trim());
  const clinicOk =
    clinica.trim().length >= 2 && website.trim().length >= 3 && profileOk && city.trim().length >= 2 && tipo !== "";
  const personOk =
    nombre.trim().length >= 3 && nombre.trim().includes(" ") && phoneOk && RE_EMAIL.test(email.trim());

  function go(n: number) {
    setAttempted(false);
    setErrorEnvio(false);
    setStep(n);
  }

  async function enviar() {
    if (!personOk) {
      setAttempted(true);
      return;
    }
    if (!evento.webhookUrl) {
      setErrorEnvio(true);
      return;
    }

    setEnviando(true);
    setErrorEnvio(false);

    const especialidad =
      ROLES.find((r) => r.id === rol)?.label ??
      DEMOS.filter((d) => demos.includes(d.id))
        .map((d) => d.label)
        .join(", ");

    try {
      const res = await fetch(evento.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evento: "lanzamiento-los-angeles",
          fecha_evento: evento.fechaISO,
          nombre: nombre.trim(),
          especialidad,
          clinica: clinica.trim(),
          whatsapp: `${prefix}${digits}`,
          codigo_pais: prefix,
          email: email.trim().toLowerCase(),
          perfil: website.trim(),
          ciudad: city.trim(),
          tipo_clinica: tipo,
          demos,
          enviado_en: new Date().toISOString(),
          origen: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      go(5);
    } catch {
      setErrorEnvio(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={`${styles.page} lanzamiento-hebe`}>
      <h1 className={styles.srOnly}>
        Postula a la cena de lanzamiento IA de Clinera en Los Ángeles
      </h1>

      <aside className={styles.left}>
        <div className={styles.carouselWrap}>
          <div className={styles.carousel}>
            {SLIDES.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.img}
                src={s.img}
                alt={s.caption}
                className={`${styles.carouselImg} ${i === slide ? styles.carouselImgOn : ""}`}
              />
            ))}
          </div>
          <div className={styles.caption}>{SLIDES[slide].caption}</div>
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Foto ${i + 1}`}
                className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>
        <div className={styles.priceBadge}>
          <div className={styles.priceLabel}>Cena privada · {evento.cupos.total} cupos</div>
          <div className={styles.priceNew}>
            {evento.diaSemana} {evento.fechaCorta} {evento.mesCorto} · {evento.hora} · {evento.ciudad}
          </div>
        </div>
        <div className={styles.spots}>
          <span className={styles.pulse} />
          Solo dueños y gerentes de clínicas
        </div>
        <div className={styles.ticker}>
          <div className={styles.tickerBadge}>
            Esa
            <br />
            noche
          </div>
          <div className={styles.tickerArea}>
            <TickerTrack />
          </div>
        </div>
      </aside>

      <section className={styles.right}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileHero}>
            <div
              className={styles.mobileCarousel}
              style={{ backgroundImage: `url(${SLIDES[slide].img})` }}
            />
            <div className={styles.mobileInfo}>
              <div className={styles.doctorName}>{SLIDES[slide].name}</div>
              <div className={styles.doctorUses}>{SLIDES[slide].uses}</div>
              <div className={styles.mobileSpots}>
                <span className={styles.pulse} /> {evento.cupos.restantes} cupos · {evento.ciudad}
              </div>
            </div>
          </div>
          <div className={styles.mobileTicker}>
            <div className={styles.tickerBadge}>
              Esa
              <br />
              noche
            </div>
            <div className={styles.tickerArea}>
              <TickerTrack />
            </div>
          </div>
        </div>

        <div className={styles.inner}>
          <div className={styles.progress}>
            {Array.from({ length: TOTAL }, (_, i) => {
              const n = i + 1;
              return (
                <div
                  key={n}
                  className={`${styles.seg} ${n < step ? styles.segDone : ""} ${n === step ? styles.segActive : ""}`}
                />
              );
            })}
          </div>

          <div className={styles.viewport}>
            <div className={`${styles.step} ${step === 1 ? styles.stepActive : ""}`} aria-hidden={step !== 1}>
              <div className={styles.viewers}>
                Cena privada en Los Ángeles. {evento.cupos.total} sillas. Demo en vivo, no un webinar.
              </div>
              <div className={styles.reviews}>
                <span className={styles.stars}>★★★★★</span>
                <span>Dueños y gerentes de clínicas</span>
              </div>
              <div className={styles.label}>Paso 1 de {TOTAL}</div>
              <h2 className={styles.title}>
                Qué quieres <em>ver</em> esa noche
              </h2>
              <p className={styles.sub}>Elige lo que te interesa. Puedes marcar más de una.</p>
              <div className={styles.cards}>
                {DEMOS.map((c) => {
                  const on = demos.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.card} ${on ? styles.cardSelected : ""}`}
                      onClick={() =>
                        setDemos((prev) =>
                          prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                        )
                      }
                    >
                      <span className={styles.icon} aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3v18M3 12h18" />
                        </svg>
                      </span>
                      <span className={styles.info}>
                        <h3>{c.label}</h3>
                        <p>{c.hint}</p>
                      </span>
                      <Check />
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className={styles.cta}
                disabled={demos.length === 0}
                onClick={() => demos.length && go(2)}
              >
                Continuar
              </button>
            </div>

            <div className={`${styles.step} ${step === 2 ? styles.stepActive : ""}`} aria-hidden={step !== 2}>
              <Back onClick={() => go(1)} />
              <div className={styles.label}>Paso 2 de {TOTAL}</div>
              <h2 className={styles.title}>
                Tu <em>rol</em> en la clínica
              </h2>
              <p className={styles.sub}>La mesa es para quien decide o opera. Un cupo por persona.</p>
              <div className={styles.cards}>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`${styles.card} ${rol === r.id ? styles.cardSelected : ""}`}
                    onClick={() => {
                      setRol(r.id);
                      window.setTimeout(() => go(3), 280);
                    }}
                  >
                    <span className={styles.icon} aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="3.2" />
                        <path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5" />
                      </svg>
                    </span>
                    <span className={styles.info}>
                      <h3>{r.label}</h3>
                      <p>{r.hint}</p>
                    </span>
                    <Check />
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.step} ${step === 3 ? styles.stepActive : ""}`} aria-hidden={step !== 3}>
              <Back onClick={() => go(2)} />
              <div className={styles.label}>Paso 3 de {TOTAL}</div>
              <h2 className={styles.title}>
                Hablemos de tu <em>clínica</em>
              </h2>
              <p className={styles.sub}>Nombre, web o redes y dónde opera.</p>
              <div className={styles.group}>
                <label>Nombre de la clínica</label>
                <input
                  className={attempted && clinica.trim().length < 2 ? styles.err : undefined}
                  value={clinica}
                  onChange={(e) => setClinica(e.target.value)}
                  placeholder="Ej: Clínica Sonríe"
                />
              </div>
              <div className={styles.group}>
                <label>Sitio web o Instagram</label>
                <input
                  className={attempted && !profileOk ? styles.err : undefined}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.tuclinica.cl o @tuclinica"
                />
              </div>
              <div className={styles.group}>
                <label>Ciudad</label>
                <input
                  className={attempted && city.trim().length < 2 ? styles.err : undefined}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Ángeles"
                />
              </div>
              <div className={styles.group}>
                <label>Tipo de clínica</label>
                <div className={styles.types}>
                  {TIPOS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`${styles.typeBtn} ${tipo === t.id ? styles.typeOn : ""}`}
                      onClick={() => setTipo(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={styles.cta}
                onClick={() => {
                  if (!clinicOk) {
                    setAttempted(true);
                    return;
                  }
                  go(4);
                }}
              >
                Continuar
              </button>
            </div>

            <div className={`${styles.step} ${step === 4 ? styles.stepActive : ""}`} aria-hidden={step !== 4}>
              <Back onClick={() => go(3)} />
              <div className={styles.label}>Paso 4 de {TOTAL}</div>
              <h2 className={styles.title}>
                Tus datos de <em>contacto</em>
              </h2>
              <p className={styles.sub}>Te confirmamos el cupo por WhatsApp. No queda reservado al enviar.</p>
              <div className={styles.group}>
                <label>Nombre y apellido</label>
                <input
                  className={attempted && (nombre.trim().length < 3 || !nombre.trim().includes(" ")) ? styles.err : undefined}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                />
              </div>
              <div className={styles.group}>
                <label>WhatsApp personal</label>
                <div className={styles.phone}>
                  <select
                    className={styles.prefixSelect}
                    value={prefix}
                    onChange={(e) => {
                      setPrefix(e.target.value);
                      setPhone("");
                    }}
                  >
                    {Object.entries(PHONES).map(([code, c]) => (
                      <option key={code} value={code}>
                        {c.flag} {code}
                      </option>
                    ))}
                  </select>
                  <input
                    className={attempted && !phoneOk ? styles.err : undefined}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, rule.len))}
                    placeholder={rule.placeholder}
                    inputMode="numeric"
                    autoComplete="tel-national"
                  />
                </div>
                <div className={styles.hint}>
                  {digits.length === 0
                    ? rule.hint
                    : digits.length < rule.len
                      ? `Faltan ${rule.len - digits.length} dígito${rule.len - digits.length === 1 ? "" : "s"} (${rule.label})`
                      : phoneOk
                        ? `Número válido para ${rule.label}`
                        : rule.hint}
                </div>
              </div>
              <div className={styles.group}>
                <label>Email</label>
                <input
                  className={attempted && !RE_EMAIL.test(email.trim()) ? styles.err : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@clinica.cl"
                  type="email"
                  autoComplete="email"
                />
              </div>
              <button type="button" className={styles.cta} disabled={enviando} onClick={() => void enviar()}>
                {enviando ? "Enviando…" : "Postular a mi cupo"}
              </button>
              {errorEnvio ? (
                <p className={styles.note}>No se pudo enviar. Reintenta o escríbenos por WhatsApp.</p>
              ) : (
                <p className={styles.note}>
                  {evento.lugar.nombre} · {evento.fechaLarga}
                </p>
              )}
            </div>

            <div className={`${styles.step} ${step === 5 ? styles.stepActive : ""}`} aria-hidden={step !== 5}>
              <div className={styles.success}>
                <div className={styles.successMark} aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Postulación recibida</h2>
                <p className={styles.sub}>
                  Te escribimos por WhatsApp para confirmar el cupo. No queda reservado hasta esa confirmación.
                </p>
                <div className={styles.successWhen}>{evento.metadataMono}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
