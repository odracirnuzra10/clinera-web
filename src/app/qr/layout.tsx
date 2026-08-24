import "../lanzamiento/evento.css";

export default function QrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="evento-page">{children}</div>;
}
