import "./evento.css";

export default function LanzamientoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="evento-page">{children}</div>;
}
