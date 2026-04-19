import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand column */}
          <div className={styles.footerBrand}>
            <Image
              src="/images/clinera-logo-white.svg"
              alt="Clinera Logo"
              width={120}
              height={32}
              className={styles.footerLogo}
            />
            <p>
              Inteligencia Artificial para potenciar el flujo de ventas de tu
              clínica.
            </p>
            <div className={styles.appBadgesContainer}>
              <p className={styles.appBadgesLabel}>Descarga nuestra App:</p>
              <div className={styles.appBadges}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.clinera.mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.appBadge}
                >
                  <Image
                    src="/images/Google_Play.svg"
                    alt="Google Play"
                    width={135}
                    height={40}
                  />
                </a>
                <a
                  href="https://apps.apple.com/app/clinera/id6759620693"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.appBadge}
                >
                  <Image
                    src="/images/AppStore.svg"
                    alt="App Store"
                    width={120}
                    height={40}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Producto */}
          <div className={styles.footerLinks}>
            <h4>Producto</h4>
            <Link href="/software">Funcionalidades</Link>
            <Link href="/planes">Planes</Link>
            <Link href="/novedades">Novedades</Link>
          </div>

          {/* Comienza gratis */}
          <div className={styles.footerLinks}>
            <h4>Comienza gratis</h4>
            <Link href="/demo">Ver demo</Link>
            <a href="https://app.clinera.io/auth/register?lang=es">Prueba gratis 7 días</a>
            <Link href="/reunion">Reunión comercial</Link>
          </div>

          {/* Comunicaciones */}
          <div className={styles.footerLinks}>
            <h4>Comunicaciones</h4>
            <a
              href="https://www.instagram.com/clinera.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <a
              href="https://cl.linkedin.com/company/clinera-io"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>

          {/* Soporte */}
          <div className={styles.footerLinks}>
            <h4>Soporte</h4>
            <Link href="/ayuda">Centro de Ayuda</Link>
            <Link href="/reunion">Contacto</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; 2026 Clinera.io. Todos los derechos reservados. &middot;{" "}
            <Link href="/privacidad">Privacidad</Link> &middot;{" "}
            <Link href="/terminos">T&eacute;rminos</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
