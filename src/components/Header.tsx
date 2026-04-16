'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={styles.siteHeaderWrapper}>
      {/* ── Micro Header ── */}
      <div className={styles.microHeader}>
        <div className={styles.microHeaderInner}>
          <div className={styles.microHeaderLeft}>
            <Link href="/ayuda" className={styles.microLink}>
              <span className={styles.microLinkIcon}>💬</span> Ayuda y soporte
            </Link>
          </div>
          <div className={styles.microHeaderRight}>
            <a
              href="https://app.clinera.io/"
              className={`${styles.microLink} ${styles.fontMedium}`}
            >
              Iniciar sesión
            </a>
            <Link
              href="/demo"
              className={`${styles.microLink} ${styles.fontMedium}`}
            >
              Ver demo
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header className={styles.mainHeader}>
        <div className={styles.mainHeaderInner}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/clinera-logo.svg"
              alt="Clinera Logo"
              width={120}
              height={34}
              priority
            />
          </Link>

          <nav className={styles.navLinks}>
            <Link href="/software">Funcionalidades</Link>
            <Link href="/planes">Planes</Link>
            <Link href="/novedades">Novedades</Link>
          </nav>

          <div className={styles.headerActions}>
            <Link href="/planes" className={styles.btnPrimary}>
              Prueba Gratis
            </Link>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            className={styles.mobileMenuToggle}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <div
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuActive : ''}`}
      >
        <div className={styles.navLinksMobile}>
          <Link href="/software" onClick={closeMobileMenu}>
            Funcionalidades
          </Link>
          <Link href="/planes" onClick={closeMobileMenu}>
            Planes
          </Link>
          <Link href="/novedades" onClick={closeMobileMenu}>
            Novedades
          </Link>
        </div>

        <div className={styles.microLinksMobile}>
          <Link href="/ayuda" className={styles.microLinkMobile} onClick={closeMobileMenu}>
            💬 Ayuda y soporte
          </Link>
          <a
            href="https://app.clinera.io/"
            className={styles.microLinkMobile}
            onClick={closeMobileMenu}
          >
            Iniciar sesión
          </a>
          <Link href="/demo" className={styles.microLinkMobile} onClick={closeMobileMenu}>
            Ver demo
          </Link>
        </div>

        <div className={styles.headerActionsMobile}>
          <Link href="/planes" className={styles.btnPrimary} onClick={closeMobileMenu}>
            Prueba Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
