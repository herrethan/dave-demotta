import type { Document } from "@contentful/rich-text-types";
import type { GalleryPhoto } from "@/components/JustifiedGallery";
import { assetToPhoto, getClient, type AboutSkeleton } from "@/lib/contentful";

export type AboutContent = {
  title: string;
  blurb: Document | null;
  bioImages: GalleryPhoto[];
  bio: Document | null;
  universityTeaching: Document | null;
  press: Document | null;
  pressImages: GalleryPhoto[];
};

/** The About singleton from Contentful, or null (missing env, no entry, or error). */
export async function getAbout(): Promise<AboutContent | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const res = await client.getEntries<AboutSkeleton>({
      content_type: "about",
      limit: 1,
      include: 2,
    });
    const entry = res.items[0];
    if (!entry) return null;
    const f = entry.fields;
    return {
      title: f.title,
      blurb: f.blurb ?? null,
      bioImages: (f.bioImages ?? []).map(assetToPhoto).filter((p) => p !== null),
      bio: f.bio ?? null,
      universityTeaching: f.universityTeaching ?? null,
      press: f.press ?? null,
      pressImages: (f.pressImages ?? []).map(assetToPhoto).filter((p) => p !== null),
    };
  } catch (err) {
    console.warn("[contentful] about fetch failed — using local fallback:", err);
    return null;
  }
}
