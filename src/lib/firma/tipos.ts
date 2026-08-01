// ============================================================================
// Firma simple — tipos compartidos entre API, storage y certificado
// ----------------------------------------------------------------------------
// Un "sobre" es una solicitud de firma: el PDF de la cotización + los datos de
// las dos partes. Vive en Vercel Blob bajo el prefijo firma/<id>/ y su estado
// completo está en meta.json (no hay base de datos).
// ============================================================================

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

export type SobreMeta = {
  version: 1;
  id: string;
  creadoEn: string;
  estado: SobreEstado;
  documento: {
    /** Nombre original del archivo subido por el closer. */
    nombreArchivo: string;
    /** Título visible, ej. "Cotización CLI-20260801-001 — Clínica Aurora". */
    titulo: string;
    paginas: number;
    bytes: number;
    /** SHA-256 (hex) del PDF original, calculado al crear el sobre. */
    sha256: string;
  };
  cliente: {
    nombre: string;
    email: string;
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
  nombreArchivo: string;
  paginas: number;
  bytes: number;
  creadoEn: string;
  cliente: { nombre: string; email: string; clinica?: string };
  closer: { nombre: string; email: string };
  gestor?: { nombre: string; email: string };
  sha256: string;
  firmadoEn?: string;
  firmadoSha256?: string;
};

/** Resumen para la lista del closer. */
export type SobreResumen = SobrePublico;

export function proyectarSobre(meta: SobreMeta): SobrePublico {
  return {
    id: meta.id,
    estado: meta.estado,
    titulo: meta.documento.titulo,
    nombreArchivo: meta.documento.nombreArchivo,
    paginas: meta.documento.paginas,
    bytes: meta.documento.bytes,
    creadoEn: meta.creadoEn,
    cliente: {
      nombre: meta.cliente.nombre,
      email: meta.cliente.email,
      ...(meta.cliente.clinica ? { clinica: meta.cliente.clinica } : {}),
    },
    closer: { nombre: meta.closer.nombre, email: meta.closer.email },
    ...(meta.gestor ? { gestor: { nombre: meta.gestor.nombre, email: meta.gestor.email } } : {}),
    sha256: meta.documento.sha256,
    ...(meta.firmaCliente ? { firmadoEn: meta.firmaCliente.firmadoEn } : {}),
    ...(meta.firmadoSha256 ? { firmadoSha256: meta.firmadoSha256 } : {}),
  };
}
