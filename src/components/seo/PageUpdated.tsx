import { pageDate } from "@/content/page-dates";

/** Fecha visible de última edición (WebPage.dateModified). No inventar. */
export function PageUpdated({ path }: { path: string }) {
  const { modified } = pageDate(path);
  const formatted = new Date(`${modified}T12:00:00`).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <p
      data-date-modified={modified}
      style={{
        margin: 0,
        padding: "12px 24px 28px",
        textAlign: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        color: "#9CA3AF",
      }}
    >
      Actualizado el {formatted}
    </p>
  );
}
