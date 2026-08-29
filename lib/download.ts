/** Href for the same-origin download proxy (see app/download/route.ts). */
export function downloadHref(assetSrc: string, filename: string) {
  return `/download?url=${encodeURIComponent(assetSrc)}&name=${encodeURIComponent(filename)}`;
}
