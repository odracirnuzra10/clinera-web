"use client";

import Link from "next/link";
import { track } from "@/lib/tracking";

type Props = {
  href: string;
  id: string;
  location: string;
  className?: string;
  children: React.ReactNode;
};

/* Todos los CTAs de /plataforma pasan por aquí: sin esto no hay forma de
   saber qué bloque de la página convierte. */
export default function CtaLink({ href, id, location, className, children }: Props) {
  return (
    <Link
      href={href}
      className={className}
      data-cta={id}
      onClick={() => track("cta_click", { cta_id: id, cta_location: location, page: "plataforma" })}
    >
      {children}
    </Link>
  );
}
