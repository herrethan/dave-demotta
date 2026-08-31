import { createClient, type Asset, type EntryFieldTypes } from "contentful";
import type { GalleryPhoto } from "@/components/JustifiedGallery";

// --- Content model (mirrors the Contentful space) --------------------------

export type PostSkeleton = {
  contentTypeId: "post";
  fields: {
    title: EntryFieldTypes.Symbol;
    pdf: EntryFieldTypes.AssetLink;
    blurb?: EntryFieldTypes.RichText;
  };
};

export type VideoSkeleton = {
  contentTypeId: "video";
  fields: {
    title: EntryFieldTypes.Symbol;
    youTubeUrl: EntryFieldTypes.Symbol;
    blurb?: EntryFieldTypes.RichText;
  };
};

export type PageSkeleton = {
  contentTypeId: "page";
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    blurb?: EntryFieldTypes.RichText;
    posts?: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<PostSkeleton | VideoSkeleton>
    >;
  };
};

export type HomeSkeleton = {
  contentTypeId: "home";
  fields: {
    heroImage?: EntryFieldTypes.AssetLink;
    blurb?: EntryFieldTypes.RichText;
    performance?: EntryFieldTypes.RichText;
    teaching?: EntryFieldTypes.RichText;
    scholarship?: EntryFieldTypes.RichText;
  };
};

export type AcademicsSkeleton = {
  contentTypeId: "academics";
  fields: {
    title: EntryFieldTypes.Symbol;
    blurb?: EntryFieldTypes.RichText;
    publicationsPresentations?: EntryFieldTypes.RichText;
    dissertationImage?: EntryFieldTypes.AssetLink;
    dissertationUrl?: EntryFieldTypes.Symbol;
    dissertationBlurb?: EntryFieldTypes.RichText;
    education?: EntryFieldTypes.RichText;
  };
};

export type AboutSkeleton = {
  contentTypeId: "about";
  fields: {
    title: EntryFieldTypes.Symbol;
    blurb?: EntryFieldTypes.RichText;
    bioImages?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    bio?: EntryFieldTypes.RichText;
    universityTeaching?: EntryFieldTypes.RichText;
    press?: EntryFieldTypes.RichText;
    pressImages?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  };
};

// --- Client ----------------------------------------------------------------

function makeClient() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  if (!space || !accessToken) {
    console.warn(
      "[contentful] CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN not set — using local fallback content",
    );
    return null;
  }
  // withoutUnresolvableLinks: linked entries/assets come back inline (or
  // undefined if unpublished) instead of as bare link objects.
  return createClient({ space, accessToken }).withoutUnresolvableLinks;
}

let client: ReturnType<typeof makeClient> | undefined;

/** Delivery client, or null when env vars are missing. */
export function getClient() {
  if (client === undefined) client = makeClient();
  return client;
}

// --- Assets ----------------------------------------------------------------

export type ResolvedAsset = Asset<"WITHOUT_UNRESOLVABLE_LINKS", string>;

/** Contentful asset URLs are protocol-relative; normalize for next/image. */
export function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

/** Image asset → gallery photo (null if the asset is missing or not an image). */
export function assetToPhoto(
  asset: ResolvedAsset | undefined,
): GalleryPhoto | null {
  const file = asset?.fields.file;
  const image = file?.details?.image;
  const src = assetUrl(file?.url);
  if (!src || !image?.width || !image.height) return null;
  return {
    src,
    width: image.width,
    height: image.height,
    alt: String(asset?.fields.description ?? asset?.fields.title ?? ""),
  };
}
