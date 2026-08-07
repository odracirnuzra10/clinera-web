"use client";

import { useSyncExternalStore } from "react";
import styles from "./seguridad.module.css";

// 1 de diciembre de 2026, 00:00 en Chile continental (UTC-3).
const VIGENCIA_UTC = Date.UTC(2026, 11, 1, 3, 0, 0);

// El reloj es una fuente externa a React, así que se lee con
// useSyncExternalStore: la página es estática y un número calculado durante el
// build quedaría congelado en la fecha del deploy. En el servidor devuelve null
// y se muestra la fecha, que ya es información completa por sí sola; el número
// aparece al hidratar, sin desajuste de hidratación.
const diasRestantes = (): number =>
  Math.ceil((VIGENCIA_UTC - Date.now()) / 86_400_000);

// Un recálculo por hora alcanza para que una pestaña abierta todo el día no
// muestre un número viejo al cruzar la medianoche.
const suscribir = (alCambiar: () => void) => {
  const id = window.setInterval(alCambiar, 3_600_000);
  return () => window.clearInterval(id);
};

const enServidor = (): number | null => null;

export default function Countdown() {
  const dias = useSyncExternalStore<number | null>(
    suscribir,
    diasRestantes,
    enServidor
  );

  const vigente = dias !== null && dias <= 0;

  return (
    <div className={styles.counter}>
      <span className={styles.counterNum}>
        {dias === null ? "01.12.26" : vigente ? "Vigente" : dias}
      </span>
      <span className={styles.counterCaption}>
        {dias === null
          ? "Ley 21.719 · entrada en vigencia"
          : vigente
            ? "Ley 21.719 · en vigencia desde el 1 de diciembre de 2026"
            : `${dias === 1 ? "día" : "días"} hasta la entrada en vigencia de la Ley 21.719`}
      </span>
    </div>
  );
}
