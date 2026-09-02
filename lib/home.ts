import type { Entry } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import type { GalleryPhoto } from "@/components/JustifiedGallery";
import {
  assetToPhoto,
  getClient,
  type AlbumSkeleton,
  type HomeSkeleton,
} from "@/lib/contentful";

export type AlbumContent = {
  title: string;
  personnel: string | null;
  cover: GalleryPhoto | null;
  description: Document | null;
  /** Target for the cover and Listen button (e.g. /listen#everything-i-love). */
  href: string;
  streaming: { label: string; url: string }[];
};

export type HomeContent = {
  hero: GalleryPhoto | null;
  blurb: Document | null;
  /** Albums picked via the home entry's featuredAlbums references, in order. */
  albums: AlbumContent[];
  /** Card bodies; titles and links are fixed in code. */
  highlights: {
    performance: Document | null;
    teaching: Document | null;
    scholarship: Document | null;
  };
};

function toAlbum(
  entry: Entry<AlbumSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>,
): AlbumContent {
  const f = entry.fields;
  const streaming: AlbumContent["streaming"] = [];
  if (f.appleMusicLink) streaming.push({ label: "Apple Music", url: f.appleMusicLink });
  if (f.spotifyLink) streaming.push({ label: "Spotify", url: f.spotifyLink });
  return {
    title: f.title ?? "",
    personnel: f.personnel ?? null,
    cover: assetToPhoto(f.cover),
    description: f.description ?? null,
    href: f.listenLink ?? "/listen",
    streaming,
  };
}

/** The Home singleton from Contentful, or null (missing env, no entry, or error). */
export async function getHome(): Promise<HomeContent | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const res = await client.getEntries<HomeSkeleton>({
      content_type: "home",
      limit: 1,
      include: 2, // home → album entries → cover assets
    });
    const entry = res.items[0];
    if (!entry) return null;
    return {
      hero: assetToPhoto(entry.fields.heroImage),
      blurb: entry.fields.blurb ?? null,
      albums: (entry.fields.featuredAlbums ?? []).flatMap((album) =>
        album ? [toAlbum(album)] : [],
      ),
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
