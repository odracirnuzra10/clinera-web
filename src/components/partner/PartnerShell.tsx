import { Outfit, JetBrains_Mono } from "next/font/google";
import "@/app/p/partners.css";

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

export function PartnerShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${outfit.className} ${jetbrainsMono.variable} partner-page`}
      style={{ minHeight: "100dvh", lineHeight: 1.55 }}
    >
      {children}
    </div>
  );
}
