import "server-only";

/**
 * Render page 1 of a PDF to a small JPEG data URL, for posts that have a PDF
 * but no uploaded thumbnail. Runs at build time; memoized per URL for the
 * life of the build.
 */

const WIDTH = 480; // displayed at ~160px; 3x covers high-DPI screens
const cache = new Map<string, Promise<Thumb | null>>();

export type Thumb = { src: string; width: number; height: number };

export function pdfThumbnail(pdfUrl: string): Promise<Thumb | null> {
  let pending = cache.get(pdfUrl);
  if (!pending) {
    pending = render(pdfUrl).catch((err) => {
      console.warn(`[thumbnails] failed for ${pdfUrl}:`, err);
      return null;
    });
    cache.set(pdfUrl, pending);
  }
  return pending;
}

async function render(pdfUrl: string): Promise<Thumb | null> {
  const [{ pdf }, sharp] = await Promise.all([
    import("pdf-to-img"),
    import("sharp").then((m) => m.default),
  ]);
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const bytes = new Uint8Array(await res.arrayBuffer());

  const document = await pdf(bytes, { scale: 1.5 });
  let firstPage: Buffer | undefined;
  for await (const page of document) {
    firstPage = page;
    break;
  }
  if (!firstPage) return null;

  const { data, info } = await sharp(firstPage)
    .flatten({ background: "#ffffff" })
    .resize({ width: WIDTH })
    .jpeg({ quality: 72 })
    .toBuffer({ resolveWithObject: true });
  return {
    src: `data:image/jpeg;base64,${data.toString("base64")}`,
    width: info.width,
    height: info.height,
  };
}
