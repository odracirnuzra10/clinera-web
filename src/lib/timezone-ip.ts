import { headers } from "next/headers";
import { zonaIanaOVacia } from "./timezone";

/** Zona IANA de la IP del request (`x-vercel-ip-timezone`). Vacío en local. */
export async function timezoneIpDelRequest(): Promise<string> {
  const h = await headers();
  return zonaIanaOVacia(h.get("x-vercel-ip-timezone"));
}
