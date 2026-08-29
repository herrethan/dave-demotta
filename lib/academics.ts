import type { Document } from "@contentful/rich-text-types";
import type { GalleryPhoto } from "@/components/JustifiedGallery";
import { assetToPhoto, getClient, type AcademicsSkeleton } from "@/lib/contentful";

export type AcademicsContent = {
  title: string;
  blurb: Document | null;
  publications: Document | null;
  dissertation: {
    image: GalleryPhoto | null;
    url: string | null;
    blurb: Document | null;
  };
  education: Document | null;
};

/** The Academics singleton from Contentful, or null (missing env, no entry, or error). */
export async function getAcademics(): Promise<AcademicsContent | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const res = await client.getEntries<AcademicsSkeleton>({
      content_type: "academics",
      limit: 1,
      include: 2,
    });
    const entry = res.items[0];
    if (!entry) return null;
    const f = entry.fields;
    return {
      title: f.title,
      blurb: f.blurb ?? null,
      publications: f.publicationsPresentations ?? null,
      dissertation: {
        image: assetToPhoto(f.dissertationImage),
        url: f.dissertationUrl ?? null,
        blurb: f.dissertationBlurb ?? null,
      },
      education: f.education ?? null,
    };
  } catch (err) {
    console.warn("[contentful] academics fetch failed — using local fallback:", err);
    return null;
  }
}
