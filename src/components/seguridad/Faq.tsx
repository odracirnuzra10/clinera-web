"use client";

import { useState } from "react";
import type { FaqItem } from "@/content/seguridad";
import Pendiente from "./Pendiente";
import styles from "./seguridad.module.css";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <div className={styles.faqList}>
      {items.map((item, i) => {
        const open = abierta === i;
        const panelId = `seguridad-faq-panel-${i}`;
        const btnId = `seguridad-faq-btn-${i}`;

        return (
          <div key={item.q} className={styles.faqItem}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={btnId}
                className={styles.faqButton}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setAbierta(open ? null : i)}
              >
                {item.q}
                <svg
                  className={styles.faqIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <path d="M2.5 8h11" />
                  {!open && <path d="M8 2.5v11" />}
                </svg>
              </button>
            </h3>

            {open && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={styles.faqPanel}
              >
                {item.pendiente ? (
                  <Pendiente texto={item.pendiente} />
                ) : (
                  <p className={styles.bodyTight}>{item.a}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
