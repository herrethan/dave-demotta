import type { NextRequest } from "next/server";

/**
 * Same-origin download proxy for Contentful assets. Browsers ignore the
 * `download` attribute on cross-origin links, so /download?url=…&name=…
 * streams the file back with a Content-Disposition: attachment header.
 */
const ALLOWED_HOSTS = new Set([
  "images.ctfassets.net",
  "assets.ctfassets.net",
  "downloads.ctfassets.net",
]);

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const name = req.nextUrl.searchParams.get("name") ?? "download";
  let target: URL;
  try {
    target = new URL(url ?? "");
  } catch {
    return new Response("Bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("Forbidden", { status: 403 });
  }

  const upstream = await fetch(target);
  if (!upstream.ok || !upstream.body) {
    console.error(`[download] upstream ${upstream.status} for ${target.hostname}${target.pathname}`);
    return new Response("Upstream error", { status: 502 });
  }
  const safeName = name.replace(/[^\w.-]+/g, "-");
  return new Response(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
