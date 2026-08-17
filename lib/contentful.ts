import { createClient, type Entry, type EntrySkeletonType } from "contentful";

// Content types currently defined in the space:
//   post, about, listen, academics, transcriptionsAndExercises, contact

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const deliveryClient = createClient({
  space: requireEnv("CONTENTFUL_SPACE_ID"),
  accessToken: requireEnv("CONTENTFUL_DELIVERY_TOKEN"),
});

const previewClient = createClient({
  space: requireEnv("CONTENTFUL_SPACE_ID"),
  accessToken: requireEnv("CONTENTFUL_PREVIEW_TOKEN"),
  host: "preview.contentful.com",
});

export function getClient(preview = false) {
  return preview ? previewClient : deliveryClient;
}

/** First entry of a content type — for singleton page entries like `about`. */
export async function getSingleton<T extends EntrySkeletonType>(
  contentType: T["contentTypeId"],
  preview = false,
): Promise<Entry<T> | null> {
  const entries = await getClient(preview).getEntries<T>({
    content_type: contentType,
    limit: 1,
  });
  return entries.items[0] ?? null;
}

/** All entries of a content type — for collections like `post`. */
export async function getAll<T extends EntrySkeletonType>(
  contentType: T["contentTypeId"],
  preview = false,
): Promise<Entry<T>[]> {
  const entries = await getClient(preview).getEntries<T>({
    content_type: contentType,
  });
  return entries.items;
}

/** Contentful asset URLs are protocol-relative; normalize for next/image. */
export function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}
