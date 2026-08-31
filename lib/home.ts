import type { Document } from "@contentful/rich-text-types";
import type { GalleryPhoto } from "@/components/JustifiedGallery";
import { assetToPhoto, getClient, type HomeSkeleton } from "@/lib/contentful";

export type HomeContent = {
  hero: GalleryPhoto | null;
  blurb: Document | null;
  /** Card bodies; titles and links are fixed in code. */
  highlights: {
    performance: Document | null;
    teaching: Document | null;
    scholarship: Document | null;
  };
};

/** The Home singleton from Contentful, or null (missing env, no entry, or error). */
export async function getHome(): Promise<HomeContent | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const res = await client.getEntries<HomeSkeleton>({
      content_type: "home",
      limit: 1,
      include: 1,
    });
    const entry = res.items[0];
    if (!entry) return null;
    return {
      hero: assetToPhoto(entry.fields.heroImage),
      blurb: entry.fields.blurb ?? null,
      highlights: {
        performance: entry.fields.performance ?? null,
        teaching: entry.fields.teaching ?? null,
        scholarship: entry.fields.scholarship ?? null,
      },
    };
  } catch (err) {
    console.warn("[contentful] home fetch failed — using local fallback:", err);
    return null;
  }
}
