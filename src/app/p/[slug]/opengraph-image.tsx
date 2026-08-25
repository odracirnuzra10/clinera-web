import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPartner, getPartnerInitials } from "@/lib/partners";

export const runtime = "nodejs";
export const alt = "Recomendación Clinera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function PartnerOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
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
          background: "#FFFFFF",
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
          clinera.io
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            style={{ marginLeft: 8 }}
          >
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#009FE3" />
                <stop offset="0.5" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#C850C0" />
              </linearGradient>
            </defs>
            <polygon points="11,1.5 20.5,11 11,20.5 1.5,11" fill="url(#spark)" />
          </svg>
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
              border: "1px solid #EAEAEA",
            }}
          />
        ) : (
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: 999,
              background: "#F7F6F3",
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
      ...size,
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
