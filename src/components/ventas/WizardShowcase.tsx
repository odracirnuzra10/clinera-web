"use client";

import { AuraFlow, ChatToAgenda } from "./WizardAnimations";
import styles from "./WizardShowcase.module.css";

/* La columna izquierda de /agenda en los pasos 1 y 2.
 *
 * Sólo en esos dos: desde el paso 3 la columna vuelve al carrusel de doctores
 * (ver ReunionHero). La razón es de embudo — en las dos primeras preguntas el
 * visitante todavía está entendiendo qué es Clinera y la animación explica; al
 * llegar a los datos y a la hora lo que falta no es entender sino confiar, y
 * ahí la cara de un colega que ya lo usa pesa más que un diagrama.
 *
 * Las animaciones viven en WizardAnimations.tsx; acá va el escenario oscuro que
 * las enmarca y el copy. El fondo oscuro no es decoración: separa la mitad que
 * sólo se mira de la mitad blanca donde el visitante responde.
 */

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.panel}>
      <span className={styles.badge}>
        <i /> Clinera en funcionamiento
      </span>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}

/* ---------- Paso 1 — la IA recibe datos y responde ---------- */
function PasoSistemaOperativo() {
  return (
    <Panel
      eyebrow="Todo conectado · una sola IA"
      title={
        <>
          Tu clínica entra por un lado. <em>Las respuestas salen por el otro.</em>
        </>
      }
    >
      <AuraFlow />
    </Panel>
  );
}

/* ---------- Paso 2 — del chat a la agenda ---------- */
function PasoMensajeria() {
  return (
    <Panel
      eyebrow="WhatsApp con IA · agenda real"
      title={
        <>
          El paciente escribe. <em>La hora queda tomada.</em>
        </>
      }
    >
      <ChatToAgenda />
    </Panel>
  );
}

export default function WizardShowcase({ step }: { step: number }) {
  return step <= 1 ? <PasoSistemaOperativo /> : <PasoMensajeria />;
}
