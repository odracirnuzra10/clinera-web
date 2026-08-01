"use client";

// Pad de firma manuscrita sobre <canvas>, sin dependencias.
// Captura mouse / touch / lápiz con Pointer Events, suaviza el trazo con
// curvas cuadráticas y exporta un PNG recortado al contenido real.

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
} from "react";

export type SignaturePadHandle = {
  /** PNG (data URL) recortado al trazo, o null si no hay firma. */
  obtenerPng: () => string | null;
  limpiar: () => void;
};

type Punto = { x: number; y: number };

const TINTA_FIRMA = "#1b2a6b";
const GROSOR = 2.4;

export default function SignaturePad({
  ref,
  onCambio,
  etiqueta = "Área para dibujar la firma",
}: {
  ref: Ref<SignaturePadHandle>;
  /** Notifica si el pad tiene trazos (para habilitar el submit). */
  onCambio?: (tieneFirma: boolean) => void;
  etiqueta?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dibujando = useRef(false);
  const ultimo = useRef<Punto | null>(null);
  const trazos = useRef(0);
  const limites = useRef({ minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

  const prepararCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    // Redimensionar borra el canvas: solo lo hacemos si cambió el tamaño real.
    if (canvas.width === Math.round(rect.width * dpr)) return;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = TINTA_FIRMA;
    ctx.lineWidth = GROSOR;
  }, []);

  useEffect(() => {
    prepararCanvas();
    const alRedimensionar = () => prepararCanvas();
    window.addEventListener("resize", alRedimensionar);
    return () => window.removeEventListener("resize", alRedimensionar);
  }, [prepararCanvas]);

  const puntoDelEvento = (evento: React.PointerEvent<HTMLCanvasElement>): Punto => {
    const rect = evento.currentTarget.getBoundingClientRect();
    return { x: evento.clientX - rect.left, y: evento.clientY - rect.top };
  };

  const registrarPunto = (p: Punto) => {
    const l = limites.current;
    l.minX = Math.min(l.minX, p.x);
    l.minY = Math.min(l.minY, p.y);
    l.maxX = Math.max(l.maxX, p.x);
    l.maxY = Math.max(l.maxY, p.y);
  };

  const alPresionar = (evento: React.PointerEvent<HTMLCanvasElement>) => {
    evento.preventDefault();
    evento.currentTarget.setPointerCapture(evento.pointerId);
    prepararCanvas();
    dibujando.current = true;
    ultimo.current = puntoDelEvento(evento);
    registrarPunto(ultimo.current);
  };

  const alMover = (evento: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current || !ultimo.current) return;
    const ctx = evento.currentTarget.getContext("2d");
    if (!ctx) return;
    const actual = puntoDelEvento(evento);
    const medio: Punto = {
      x: (ultimo.current.x + actual.x) / 2,
      y: (ultimo.current.y + actual.y) / 2,
    };
    ctx.beginPath();
    ctx.moveTo(ultimo.current.x, ultimo.current.y);
    ctx.quadraticCurveTo(ultimo.current.x, ultimo.current.y, medio.x, medio.y);
    ctx.lineTo(actual.x, actual.y);
    ctx.stroke();
    registrarPunto(actual);
    ultimo.current = actual;
  };

  const alSoltar = () => {
    if (!dibujando.current) return;
    dibujando.current = false;
    ultimo.current = null;
    trazos.current += 1;
    onCambio?.(true);
  };

  const limpiar = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    trazos.current = 0;
    limites.current = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    onCambio?.(false);
  }, [onCambio]);

  useImperativeHandle(ref, () => ({
    limpiar,
    obtenerPng: () => {
      const canvas = canvasRef.current;
      if (!canvas || trazos.current === 0) return null;
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      const margen = 10;
      const l = limites.current;
      const x = Math.max(0, (l.minX - margen) * dpr);
      const y = Math.max(0, (l.minY - margen) * dpr);
      const ancho = Math.min(canvas.width - x, (l.maxX - l.minX + margen * 2) * dpr);
      const alto = Math.min(canvas.height - y, (l.maxY - l.minY + margen * 2) * dpr);
      if (ancho < 8 || alto < 8) return null;

      const recorte = document.createElement("canvas");
      recorte.width = Math.round(ancho);
      recorte.height = Math.round(alto);
      const ctx = recorte.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(canvas, x, y, ancho, alto, 0, 0, ancho, alto);
      return recorte.toDataURL("image/png");
    },
  }), [limpiar]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={etiqueta}
      onPointerDown={alPresionar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerLeave={alSoltar}
      onPointerCancel={alSoltar}
      style={{ touchAction: "none", width: "100%", height: "100%", display: "block" }}
    />
  );
}
