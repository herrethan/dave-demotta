import Image from "next/image";
import type { CSSProperties } from "react";

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Link target; defaults to the image itself. */
  href?: string;
  /** Filename to download as; when set the link downloads instead of opening. */
  download?: string;
};

// Nominal row heights; the actual row scales up to fill the container.
// Keep in sync with the --row-h values on the <ul> below.
const ROW_H_MOBILE = 120; // 7.5rem
const ROW_H_DESKTOP = 256; // 16rem
const MOBILE_VIEWPORT = 390;
const DESKTOP_MAX = 720; // max-w-3xl minus padding
// A row can grow up to roughly this factor before another item would fit.
const GROW = 1.5;

/** Responsive `sizes` hint estimated purely from aspect ratio. */
function sizesFor(ratio: number) {
  const desktopPx = Math.min(DESKTOP_MAX, Math.round(ratio * ROW_H_DESKTOP * GROW));
  const mobileVw = Math.min(100, Math.round((ratio * ROW_H_MOBILE * GROW) / MOBILE_VIEWPORT * 100));
  return `(min-width: 640px) ${desktopPx}px, ${mobileVw}vw`;
}

/**
 * Justified gallery: rows fill the full container width with nothing cropped.
 * Each item flex-grows in proportion to its aspect ratio; flex-basis (ratio ×
 * row height) decides how many fit per row. Works for any mix of orientations
 * as long as width/height are known.
 */
export default function JustifiedGallery({
  photos,
  className = "",
}: {
  photos: GalleryPhoto[];
  className?: string;
}) {
  return (
    <ul
      className={`flex flex-wrap gap-3 [--row-h:7.5rem] sm:gap-4 sm:[--row-h:16rem] ${className}`.trim()}
    >
      {photos.map((photo) => {
        const ratio = photo.width / photo.height;
        return (
          <li
            key={photo.src}
            style={{ "--ratio": ratio } as CSSProperties}
            className="[flex-basis:calc(var(--ratio)*var(--row-h))] [flex-grow:var(--ratio)]"
          >
            <a
              href={photo.href ?? photo.src}
              download={photo.download}
              target={photo.download ? undefined : "_blank"}
              rel={photo.download ? undefined : "noopener noreferrer"}
              className="block transition-opacity hover:opacity-90"
              aria-label={
                photo.download ? `Download ${photo.alt}` : `Open ${photo.alt}`
              }
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={sizesFor(ratio)}
                className="h-auto w-full"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
