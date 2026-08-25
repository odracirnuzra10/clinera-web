import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PartnerClickBody = {
  slug?: unknown;
  ref?: unknown;
  utms?: unknown;
};

export async function POST(request: Request) {
  const raw = await request.text();
  let body: PartnerClickBody = {};
  try {
    body = JSON.parse(raw) as PartnerClickBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const ref = typeof body.ref === "string" ? body.ref : "";
  const utms =
    body.utms && typeof body.utms === "object" && !Array.isArray(body.utms)
      ? body.utms
      : {};

  // TODO: persistir en DB
  console.log(
    JSON.stringify({
      type: "partner_click",
      slug,
      ref,
      utms,
      ts: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
