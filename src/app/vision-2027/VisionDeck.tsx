"use client";

import type { ReactNode } from "react";
import DeckChrome from "./DeckChrome";
import { CircleDiagram, IdentityDiagram } from "./diagrams";
import { SLIDES } from "./slides";
import "./vision.css";

function Slide({
  id,
  kicker,
  children,
  className = "",
}: {
  id: string;
  kicker: string;
  children: ReactNode;
  className?: string;
}) {
  const meta = SLIDES.find((s) => s.id === id);
  return (
    <section id={id} className={`v27-slide ${className}`.trim()} aria-labelledby={`${id}-title`}>
      <div className="v27-inner">
        <div className="v27-kicker">
          <b>{meta?.num}</b>
          <i />
          {kicker}
        </div>
        {children}
      </div>
    </section>
  );
}

const SCREENS: [string, string][] = [
  ["Mis clínicas", "Las que lo dieron de alta. Cambia entre ellas."],
  ["Inicio", "Próxima hora, sesión N de M, mensaje de la semana."],
  ["Avisos", "Push: hora, cambio, recordatorio, cuota por vencer."],
  ["Mi ficha", "Corporal, facial u odontograma. Descargable."],
  ["Mi evolución", "Antes/después por sesión, solo con consentimiento."],
  ["Mis medidas", "Peso, cintura, cadera, índices. Los registra la clínica."],
  ["Agendar", "Mismo motor que AURA."],
  ["Plan", "Contenido de la vertical atado a la sesión o al día post-procedimiento."],
  ["Pagos", "Cuotas, sesiones y tratamientos nuevos."],
  ["Recetas", "QR para farmacia, consentimientos y documentos."],
];

const LAYERS = [
  { n: "01", name: "Software", text: "La clínica opera con Clinera.", state: "done" as const, tag: "Listo" },
  { n: "02", name: "Mi Clinera", text: "El paciente entra a Clinera.", state: "now" as const, tag: "Ahora" },
  { n: "03", name: "Marketplace", text: "El paciente descubre clínicas; las clínicas reciben pacientes.", state: "next" as const, tag: "" },
  { n: "04", name: "Publicidad y buscadores de IA", text: "Las clínicas pagan por mostrarse; los buscadores con IA se conectan a la red.", state: "next" as const, tag: "" },
  { n: "05", name: "Estados Unidos", text: "Entrada con operación propia como caso real.", state: "next" as const, tag: "" },
  { n: "06", name: "Modelos propios", text: "Entrenados con datos de estética LATAM que nadie más tiene.", state: "next" as const, tag: "" },
];

const STEPS_V1 = [
  "Campos de seguimiento en ficha corporal (parte con Hebe).",
  "Usuario Mi Clinera: Google, Apple, correo; teléfono asociado y editable.",
  "Alta con acceso y reconocimiento por teléfono o correo.",
  "Capa de lectura: Mis clínicas, Inicio, Evolución, Medidas, Ficha, Agendar, Recetas con QR.",
  "Mi Clinera en las tiendas con Hebe como piloto (Hebe Los Ángeles).",
  "Notificaciones push; se mide el no-show antes y después.",
  "Configuración por clínica: activar Lumina sin código.",
  "Pagos con descuentos in-app y Plan con contenido base. Cierra la v1.",
];

const STEPS_NEXT = [
  "Compartir ficha con otra clínica.",
  "Difusión con costo y métricas.",
  "Reviews, solo de pacientes con turno asistido.",
  "Marketplace.",
  "Publicidad dentro de Clinera y conexión con buscadores de IA.",
];

const RULES = [
  "Nada se escribe dos veces.",
  "La identidad es el usuario, nunca el teléfono.",
  "La ficha es de la clínica, el acceso es del paciente, el alta los conecta.",
  "Una clínica nunca ve datos de otra.",
  "Notas internas nunca salen, fotos solo con consentimiento.",
  "Dentro de la clínica, Clinera no se nota.",
  "Las acciones del paciente entran por el mismo camino que AURA y recepción.",
  "Toda difusión tiene costo.",
  "Cada decisión se prueba con: si mañana hay 200 clínicas y el paciente quiere descubrir una nueva, ¿esto lo permite o lo bloquea?",
];

export default function VisionDeck() {
  return (
    <main id="contenido" className="v27">
      <DeckChrome />

      <Slide id="portada" kicker="Visión interna" className="v27-cover is-in">
        <h1 id="portada-title" className="v27-title">
          Clinera <span className="v27-g">2027</span>
        </h1>
        <p className="v27-lead">De software para clínicas a la red de pacientes.</p>
        <p className="v27-foot">Visión interna · Septiembre 2026 · Ricardo Oyarzún</p>
      </Slide>

      <Slide id="donde-estamos" kicker="Hoy">
        <h2 id="donde-estamos-title" className="v27-title">
          Dónde estamos
        </h2>
        <div className="v27-stats">
          <div className="v27-stat">
            <strong>2025</strong>
            <span>Lanzamiento en octubre. Bootstrapped.</span>
          </div>
          <div className="v27-stat">
            <strong>~40</strong>
            <span>Clínicas activas en Chile, México y Perú.</span>
          </div>
          <div className="v27-stat">
            <strong>~0</strong>
            <span>Churn temprano diagnosticado como onboarding; hoy cercano a cero.</span>
          </div>
          <div className="v27-stat">
            <strong className="v27-g">200</strong>
            <span>Meta a 12 meses: clínicas activas.</span>
          </div>
        </div>
        <p className="v27-foot">Objetivo de financiamiento: Seed o Serie A con esta tesis.</p>
      </Slide>

      <Slide id="para-que" kicker="Para qué">
        <h2 id="para-que-title" className="v27-title">
          No estamos creando un software. Estamos creando una nueva forma de{" "}
          <span className="v27-g">atenderse</span>.
        </h2>
        <div className="v27-split">
          <div>
            <h3>Para el paciente</h3>
            <p>
              Accede a todos sus datos, de todas sus clínicas, desde su aplicación, en cualquier
              momento. Es el principal beneficiado.
            </p>
          </div>
          <div>
            <h3>Para la clínica</h3>
            <p>
              Un software moderno con inteligencia artificial que le hace el trabajo, y una app
              para su paciente que siente propia.
            </p>
          </div>
        </div>
        <p className="v27-foot">
          La clínica no está en la red porque se la vendimos. Está porque si no está, pierde
          pacientes referidos, y si no está ahí, no está en ninguna parte.
        </p>
      </Slide>

      <Slide id="tesis" kicker="La tesis">
        <h2 id="tesis-title" className="v27-title">
          Clinera es el <span className="v27-g">Google</span> de las clínicas.
        </h2>
        <div className="v27-claims">
          <p>
            El software para la clínica ya está y seguirá creciendo, pero ya no es el foco.
          </p>
          <p>
            El futuro de Clinera es el paciente: si Clinera le es útil, la tiene en su teléfono, y
            si la tiene, se forma una red de pacientes que cualquier clínica va a querer.
          </p>
          <p>No estar en Clinera va a ser como no estar en Google.</p>
        </div>
      </Slide>

      <Slide id="capas" kicker="Construcción">
        <h2 id="capas-title" className="v27-title">
          Cada capa se abre cuando la anterior se financia <span className="v27-g">sola</span>.
        </h2>
        <div className="v27-layers">
          {LAYERS.map((l) => (
            <div
              key={l.n}
              className={`v27-layer${l.state === "done" ? " is-done" : ""}${l.state === "now" ? " is-now" : ""}`}
            >
              <b>{l.tag || l.n}</b>
              <em>{l.name}</em>
              <span>{l.text}</span>
            </div>
          ))}
        </div>
        <p className="v27-foot">
          Mapeado, no abierto: financiamiento embebido, abastecimiento, academia.
        </p>
      </Slide>

      <Slide id="dos-apps" kicker="Dos roles">
        <h2 id="dos-apps-title" className="v27-title">
          Dos apps, dos <span className="v27-g">roles</span>
        </h2>
        <div className="v27-split">
          <div>
            <h3>Clinera, para la clínica</h3>
            <p>
              Ficha, odontograma, agenda con AURA (WhatsApp), CAMILA (voz), LIA (reportes), pagos,
              marketing, Fonasa, factura electrónica, recetas. Acá vive el WhatsApp.
            </p>
          </div>
          <div>
            <h3>Mi Clinera, para el paciente</h3>
            <p>
              Una sola app en App Store y Play Store. Por dentro es white label: cada clínica se
              ve con su marca. Clinera es el contenedor.
            </p>
          </div>
        </div>
        <p className="v27-foot">
          Son cuentas distintas aunque sea la misma persona. Un dueño de clínica usa Clinera para
          operar la suya y Mi Clinera como paciente de otra.
        </p>
      </Slide>

      <Slide id="usuario" kicker="Identidad">
        <h2 id="usuario-title" className="v27-title">
          Un usuario, todas sus clínicas
        </h2>
        <p className="v27-lead">
          La identidad es el usuario, no el teléfono. El teléfono se asocia después y puede
          cambiar: si en dos años cambia de número, sigue siendo{" "}
          <span className="v27-g">Ricardo21</span> con todo su historial. Teléfono y correo son
          las llaves con las que la red lo encuentra. Cada clínica ve solo lo suyo; el paciente
          ve todo lo suyo.
        </p>
        <IdentityDiagram />
      </Slide>

      <Slide id="alta" kicker="Alta y acceso">
        <h2 id="alta-title" className="v27-title">
          La ficha es de la clínica. El acceso es del paciente. El alta los{" "}
          <span className="v27-g">conecta</span>.
        </h2>
        <p className="v27-lead">
          Cuando alguien se hace paciente, la clínica lo da de alta en Clinera y eso le abre su
          ficha en Mi Clinera. Si alguien escribe por WhatsApp a una clínica nueva y su número o
          correo ya pertenece a un usuario de Mi Clinera, el sistema lo reconoce y lo asocia; no
          crea otro usuario. La clínica nueva no sabe de qué otras clínicas es paciente.
        </p>
      </Slide>

      <Slide id="whatsapp" kicker="Canal">
        <h2 id="whatsapp-title" className="v27-title">
          WhatsApp no <span className="v27-g">cambia</span>
        </h2>
        <p className="v27-lead">
          El paciente sigue usando su WhatsApp de siempre. La clínica le habla desde el WhatsApp
          que vive dentro de Clinera. Mi Clinera no tiene chat, ni ahora ni como objetivo. Es
          otra interfaz: agendar, ver avances, recetas, consentimientos y todo su registro.
        </p>
      </Slide>

      <Slide id="paciente" kicker="La app">
        <h2 id="paciente-title" className="v27-title">
          <span className="v27-g">Nada</span> se escribe dos veces.
        </h2>
        <p className="v27-lead">Si está en la ficha, el paciente lo ve filtrado a lo suyo.</p>
        <div className="v27-screens">
          <ul>
            {SCREENS.slice(0, 5).map(([k, v]) => (
              <li key={k}>
                <b>{k}</b>
                {v}
              </li>
            ))}
          </ul>
          <ul>
            {SCREENS.slice(5).map(([k, v]) => (
              <li key={k}>
                <b>{k}</b>
                {v}
              </li>
            ))}
          </ul>
        </div>
        <p className="v27-foot">Notas internas: nunca.</p>
      </Slide>

      <Slide id="notificaciones" kicker="El motor de la red">
        <h2 id="notificaciones-title" className="v27-title">
          Quienes difunden la app son las <span className="v27-g">clínicas</span>.
        </h2>
        <p className="v27-bigline">
          Mi Clinera avisa por push cuando hay hora agendada, hora cambiada, recordatorio o cuota
          por vencer. Tercer canal junto a WhatsApp y correo. Baja el no-show.
        </p>
        <p className="v27-lead">
          La clínica es la principal beneficiada de que su paciente la tenga: ahí agenda, ahí ve
          su ficha, sus avances, su odontograma, su ficha facial o corporal, ahí paga. Y como
          lleva sus colores y su logo, la clínica no siente que es la app de Clinera: siente que
          es la suya. No tenemos que convencer a nadie de descargarla. Cada clínica va a querer
          que su paciente la descargue, y la red de pacientes se forma sola.
        </p>
      </Slide>

      <Slide id="pagos" kicker="Dinero">
        <h2 id="pagos-title" className="v27-title">
          Pagar desde Mi Clinera es <span className="v27-g">central</span>
        </h2>
        <p className="v27-lead">
          Cuotas, sesiones y tratamientos nuevos. La clínica publica descuentos que solo se
          activan pagando por la app. El paciente quiere pagar ahí; la clínica quiere que la
          tenga. Un paciente contento compra su siguiente tratamiento sin pasar por recepción.
        </p>
      </Slide>

      <Slide id="difusion" kicker="Canal propio">
        <h2 id="difusion-title" className="v27-title">
          Toda difusión tiene <span className="v27-g">costo</span>.
        </h2>
        <p className="v27-lead">
          La clínica puede enviar promociones por Mi Clinera y ver cuántos la recibieron y
          abrieron. Si es gratis se manda y se manda, el paciente desinstala y se cae la red. El
          costo protege el canal.
        </p>
      </Slide>

      <Slide id="ficha" kicker="Propiedad">
        <h2 id="ficha-title" className="v27-title">
          El paciente es <span className="v27-g">dueño</span> de su ficha
        </h2>
        <p className="v27-lead">
          Puede descargar su ficha y compartirla con otra clínica de Clinera. La clínica nueva
          parte con el historial completo. Nuevo estándar del mercado.
        </p>
        <div className="v27-claims">
          <p>Comparte de forma explícita y por partes.</p>
          <p>La clínica de origen no se entera con quién.</p>
          <p>Revisión de privacidad con la Ley 21.719 antes de construirlo.</p>
        </div>
      </Slide>

      <Slide id="circulo" kicker="La red">
        <h2 id="circulo-title" className="v27-title">
          El círculo
        </h2>
        <CircleDiagram />
        <p className="v27-foot">
          Cuando el paciente necesita Mi Clinera para ir a cualquier clínica, Clinera queda
          debajo de la relación entre la clínica y su paciente. Esa es la barrera de entrada.
        </p>
      </Slide>

      <Slide id="reglas" kicker="Contrato">
        <h2 id="reglas-title" className="v27-title">
          Reglas que no se <span className="v27-g">rompen</span>
        </h2>
        <ol className="v27-rules">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </Slide>

      <Slide id="orden" kicker="Hoja de ruta">
        <h2 id="orden-title" className="v27-title">
          Orden de construcción
        </h2>
        <p className="v27-lead" style={{ marginBottom: "1.2rem" }}>
          1 a 8 marcados como <span className="v27-g">v1</span>.
        </p>
        <div className="v27-steps">
          <div>
            {STEPS_V1.map((t, i) => (
              <div className="v27-step" key={t}>
                <i>{String(i + 1).padStart(2, "0")}</i>
                <p>
                  {t}
                  <small>v1</small>
                </p>
              </div>
            ))}
          </div>
          <div>
            {STEPS_NEXT.map((t, i) => (
              <div className="v27-step" key={t}>
                <i>{String(i + 9).padStart(2, "0")}</i>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      <Slide id="cierre" kicker="Cierre" className="v27-cover">
        <h2 id="cierre-title" className="v27-title">
          Que la clínica sienta que si no está en Clinera está{" "}
          <span className="v27-g">perdiendo</span>.
        </h2>
        <p className="v27-foot">Funciones + beneficios al paciente + pacientes que le llegan.</p>
      </Slide>
    </main>
  );
}
