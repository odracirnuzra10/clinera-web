// ============================================================================
// Firma simple — tipos compartidos entre API, storage y certificado
// ----------------------------------------------------------------------------
// Un "sobre" es una solicitud de firma: el PDF de la cotización + los datos de
// las dos partes. Vive en Vercel Blob bajo el prefijo firma/<id>/ y su estado
// completo está en meta.json (no hay base de datos).
// ============================================================================

import type { CotizacionSnapshot, DescuentoDuracion } from "./cotizacion";

export type SobreEstado = "pendiente" | "firmado";

/** Evidencia mínima de una firma electrónica simple (Ley 19.799). */
export type Firmante = {
  nombre: string;
  email: string;
  rut?: string;
  /** ISO-8601 UTC del momento exacto de la firma. */
  firmadoEn: string;
  ip: string;
  userAgent: string;
  /** Firma manuscrita capturada en canvas, como data URL image/png. */
  firmaPng: string;
};

export type DocumentoMeta = {
  /** Nombre original del archivo subido por el closer. */
  nombreArchivo: string;
  /** Título visible, ej. "Cotización CLI-20260801-001 — Clínica Aurora". */
  titulo: string;
  paginas: number;
  bytes: number;
  /** SHA-256 (hex) del PDF original, calculado al adjuntarlo. */
  sha256: string;
};

export type SobreMeta = {
  version: 1;
  id: string;
  creadoEn: string;
  estado: SobreEstado;
  /** Título visible del sobre (existe aunque aún no haya documento). */
  titulo: string;
  /**
   * Contrato a firmar. Puede ser null cuando el sobre nace como "link de
   * pago" desde /cotizacion: el closer lo adjunta después del pago, como
   * paso secundario, y recién ahí se habilita la firma.
   */
  documento: DocumentoMeta | null;
  cliente: {
    nombre: string;
    /** Puede faltar cuando el sobre nace desde /cotizacion (link de pago). */
    email?: string;
    clinica?: string;
  };
  /**
   * Parte Clinera: siempre el representante legal (CEO) con su firma
   * registrada. La evidencia (ip/userAgent) corresponde a la creación del
   * sobre por parte del gestor.
   */
  closer: Firmante & { cargo?: string };
  /** Closer que gestiona la solicitud (no firma: la firma es del CEO). */
  gestor?: {
    nombre: string;
    email: string;
  };
  /**
   * Snapshot de la cotización (config + montos recalculados del catálogo).
   * Presente solo cuando el sobre se creó desde "Enviar a firma" en
   * /cotizacion: habilita el checkout de Stripe, que es requisito previo a
   * la firma del cliente.
   */
  cotizacion?: CotizacionSnapshot;
  /**
   * Pago verificado contra Stripe (checkout session con payment_status paid).
   * Cuando hay cotización, el cliente debe pagar ANTES de poder firmar.
   */
  pagoRealizado?: {
    checkoutSessionId: string;
    pagadoEn: string;
  };
  /** Presente solo cuando estado === "firmado". */
  firmaCliente?: Firmante;
  /** SHA-256 (hex) del PDF final con hoja de firmas. */
  firmadoSha256?: string;
  firmadoBytes?: number;
};

/** Proyección pública del sobre — lo único que ve quien tiene el enlace. */
export type SobrePublico = {
  id: string;
  estado: SobreEstado;
  titulo: string;
  /** false mientras el contrato no haya sido adjuntado (la firma espera). */
  tieneDocumento: boolean;
  nombreArchivo?: string;
  paginas?: number;
  bytes?: number;
  creadoEn: string;
  cliente: { nombre: string; email?: string; clinica?: string };
  closer: { nombre: string; email: string };
  gestor?: { nombre: string; email: string };
  sha256?: string;
  firmadoEn?: string;
  firmadoSha256?: string;
  /** Presente si el sobre tiene cotización asociada (habilita el pago). */
  pago?: {
    totalPeriodo: number;
    descuentoPeriodo: number;
    setupUnico: number;
    periodo: "mensual" | "semestral";
    moneda: "USD";
    duracionDescuento: DescuentoDuracion;
  };
  /** Presente cuando el pago ya fue verificado contra Stripe. */
  pagado?: { en: string };
};

/** Resumen para la lista del closer. */
export type SobreResumen = SobrePublico;

export function proyectarSobre(meta: SobreMeta): SobrePublico {
  return {
    id: meta.id,
    estado: meta.estado,
    titulo: meta.titulo,
    tieneDocumento: meta.documento !== null,
    ...(meta.documento
      ? {
          nombreArchivo: meta.documento.nombreArchivo,
          paginas: meta.documento.paginas,
          bytes: meta.documento.bytes,
          sha256: meta.documento.sha256,
        }
      : {}),
    creadoEn: meta.creadoEn,
    cliente: {
      nombre: meta.cliente.nombre,
      ...(meta.cliente.email ? { email: meta.cliente.email } : {}),
      ...(meta.cliente.clinica ? { clinica: meta.cliente.clinica } : {}),
    },
    closer: { nombre: meta.closer.nombre, email: meta.closer.email },
    ...(meta.gestor ? { gestor: { nombre: meta.gestor.nombre, email: meta.gestor.email } } : {}),
    ...(meta.firmaCliente ? { firmadoEn: meta.firmaCliente.firmadoEn } : {}),
    ...(meta.firmadoSha256 ? { firmadoSha256: meta.firmadoSha256 } : {}),
    ...(meta.cotizacion
      ? {
          pago: {
            totalPeriodo: meta.cotizacion.centavos.recurrenteFinal,
            descuentoPeriodo: meta.cotizacion.centavos.descuentoRecurrente,
            setupUnico: meta.cotizacion.centavos.setupFinal,
            periodo: meta.cotizacion.periodoMeses === 6 ? ("semestral" as const) : ("mensual" as const),
            moneda: "USD" as const,
            duracionDescuento: meta.cotizacion.duracionDescuento,
          },
        }
      : {}),
    ...(meta.pagoRealizado ? { pagado: { en: meta.pagoRealizado.pagadoEn } } : {}),
  };
}
