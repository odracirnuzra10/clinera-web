// Teléfono por país — reglas de `/reserva-tu-hora` (y helper compartido).
//
// Funciones puras: sin navegador. Cubre CL (9 + normalizar +56), MX/CO/PE y
// el armado E.164. Guardián de la tabla en `src/lib/telefono.ts`.

import { expect, test } from "@playwright/test";
import {
  aE164,
  formatearTelefono,
  mensajeErrorTelefono,
  normalizarDigitosLocales,
  separarTelefono,
  telefonoLocalValido,
} from "@/lib/telefono";

test.describe("normalizarDigitosLocales — Chile (+56)", () => {
  test("deja 9 dígitos nacionales si pegan +56 o 56", () => {
    expect(normalizarDigitosLocales("+56912345678", "+56")).toBe("912345678");
    expect(normalizarDigitosLocales("56912345678", "+56")).toBe("912345678");
    expect(normalizarDigitosLocales("56 9 1234 5678", "+56")).toBe("912345678");
    expect(normalizarDigitosLocales("912345678", "+56")).toBe("912345678");
  });

  test("no trunca un 9XXXXXXXX a mitad de tipeo", () => {
    expect(normalizarDigitosLocales("9", "+56")).toBe("9");
    expect(normalizarDigitosLocales("91234", "+56")).toBe("91234");
  });
});

test.describe("validación por país", () => {
  test("Chile: exactamente 9, empieza con 9", () => {
    expect(telefonoLocalValido("+56", "912345678")).toBe(true);
    expect(telefonoLocalValido("+56", "812345678")).toBe(false);
    expect(telefonoLocalValido("+56", "91234567")).toBe(false);
    expect(telefonoLocalValido("+56", "9123456789")).toBe(false);
  });

  test("México: 10 dígitos, empieza 2-9", () => {
    expect(telefonoLocalValido("+52", "5512345678")).toBe(true);
    expect(telefonoLocalValido("+52", "1512345678")).toBe(false);
    expect(telefonoLocalValido("+52", "551234567")).toBe(false);
    expect(normalizarDigitosLocales("+525512345678", "+52")).toBe("5512345678");
    expect(normalizarDigitosLocales("+5215512345678", "+52")).toBe("5512345678");
  });

  test("Colombia: 10 dígitos, empieza con 3", () => {
    expect(telefonoLocalValido("+57", "3001234567")).toBe(true);
    expect(telefonoLocalValido("+57", "2001234567")).toBe(false);
    expect(telefonoLocalValido("+57", "300123456")).toBe(false);
    expect(normalizarDigitosLocales("+573001234567", "+57")).toBe("3001234567");
  });

  test("Perú: 9 dígitos, empieza con 9", () => {
    expect(telefonoLocalValido("+51", "912345678")).toBe(true);
    expect(telefonoLocalValido("+51", "812345678")).toBe(false);
    expect(normalizarDigitosLocales("+51912345678", "+51")).toBe("912345678");
  });
});

test.describe("mensajes de error en español", () => {
  test("dice cuántos dígitos faltan o sobran", () => {
    expect(mensajeErrorTelefono("+56", "91234567")).toMatch(/Faltan 1 dígito.*Chile.*9/);
    expect(mensajeErrorTelefono("+52", "551234567")).toMatch(/Faltan 1 dígito.*México.*10/);
    expect(mensajeErrorTelefono("+57", "")).toMatch(/10 dígitos para Colombia/);
    expect(mensajeErrorTelefono("+56", "812345678")).toMatch(/Debe empezar con 9.*Chile/);
  });

  test("null si el número es válido", () => {
    expect(mensajeErrorTelefono("+56", "912345678")).toBeNull();
    expect(mensajeErrorTelefono("+52", "5512345678")).toBeNull();
  });
});

test.describe("E.164", () => {
  test("arma +56 / +52 / +57 / +51", () => {
    expect(aE164("+56", "912345678")).toBe("+56912345678");
    expect(aE164("+52", "55 1234 5678")).toBe("+525512345678");
    expect(aE164("+57", "3001234567")).toBe("+573001234567");
    expect(aE164("+51", "912345678")).toBe("+51912345678");
  });
});

test.describe("separarTelefono + formatear", () => {
  test("parte E.164 y formatea el local", () => {
    expect(separarTelefono("+56912345678")).toEqual({
      prefix: "+56",
      phone: "9 1234 5678",
    });
    expect(separarTelefono("+525512345678")).toEqual({
      prefix: "+52",
      phone: "55 1234 5678",
    });
  });

  test("formatearTelefono normaliza pegado con código país", () => {
    expect(formatearTelefono("+56912345678", "+56")).toBe("9 1234 5678");
    expect(formatearTelefono("56912345678", "+56")).toBe("9 1234 5678");
  });
});
