import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPartner, getPartnerInitials } from "@/lib/partners";

export const PARTNER_OG_SIZE = { width: 1200, height: 630 };

async function loadFont(): Promise<ArrayBuffer | null> {
  const file = join(process.cwd(), "src/app/p/fonts/Outfit-600.ttf");
  if (!existsSync(file)) return null;
  try {
    const buf = await readFile(file);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch {
    return null;
  }
}

async function loadPhotoDataUrl(photo: string): Promise<string | null> {
  const path = join(process.cwd(), "public", photo.replace(/^\//, ""));
  if (!existsSync(path)) return null;
  try {
    const buf = await readFile(path);
    const mime = path.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderPartnerOpengraphImage(slug?: string) {
  const partner = slug ? getPartner(slug) : undefined;
  const name = partner?.name ?? "Clinera";
  const initials = getPartnerInitials(name);
  const photo = partner ? await loadPhotoDataUrl(partner.photo) : null;
  const fontData = await loadFont();
  const fontFamily = fontData ? "Outfit" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F6F3",
          color: "#111111",
          fontFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 48,
            left: 64,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg,#009FE3 0%,#7C3AED 50%,#C850C0 100%)",
              marginRight: 10,
            }}
          />
          clinera.io
        </div>

        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={168}
            height={168}
            style={{
              width: 168,
              height: 168,
              borderRadius: 999,
              objectFit: "cover",
              border: "3px solid #FFFFFF",
            }}
          />
        ) : (
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: 999,
              background: "#FFFFFF",
              border: "1px solid #EAEAEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            {initials}
          </div>
        )}

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 32,
            fontWeight: 500,
            color: "#6B6B6B",
            letterSpacing: "-0.02em",
          }}
        >
          te recomienda Clinera
        </div>
      </div>
    ),
    {
      ...PARTNER_OG_SIZE,
      fonts: fontData
        ? [
            {
              name: "Outfit",
              data: fontData,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    },
  );
}
