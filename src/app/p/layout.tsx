import { Outfit, JetBrains_Mono } from "next/font/google";
import "./partners.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-partner-mono",
  display: "swap",
});

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${outfit.className} ${jetbrainsMono.variable} bg-white text-[#111111] antialiased`}
      style={{ lineHeight: 1.6 }}
    >
      {children}
    </div>
  );
}
