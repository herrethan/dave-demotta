import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  assetUrl,
  getClient,
  type PageSkeleton,
  type PostSkeleton,
  type VideoSkeleton,
} from "@/lib/contentful";
import {
  exercisePosts,
  listenPosts,
  transcriptionPosts,
  type ScorePost,
  type VideoPost,
} from "@/lib/content";
import { slugify } from "@/lib/slug";
import { pdfThumbnail, type Thumb } from "@/lib/thumbnails";
import { parseYouTubeUrl } from "@/lib/youtube";

// --- View models -----------------------------------------------------------

/** Rich text from Contentful, or a plain string from local fallback content. */
export type Blurb = Document | string | null;

export type VideoItem = {
  kind: "video";
  slug: string;
  title: string;
  youtubeId: string;
  playlistId?: string;
  blurb: Blurb;
  /** Local-content only; Contentful puts this link in the blurb. */
  playlist?: { url: string; label: string };
};

export type ScoreItem = {
  kind: "score";
  slug: string;
  title: string;
  /** PDF URL, opened in a new tab. */
  pdf: string;
  thumbnail: Thumb | null;
  blurb: Blurb;
};

export type PostItem = VideoItem | ScoreItem;

export type ListPage = {
  title: string;
  blurb: Blurb;
  posts: PostItem[];
};

// --- Contentful --------------------------------------------------------------

type ResolvedEntry<T extends PostSkeleton | VideoSkeleton> = Entry<
  T,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

async function fromVideo(
  entry: ResolvedEntry<VideoSkeleton>,
): Promise<VideoItem | null> {
  const parsed = parseYouTubeUrl(entry.fields.youTubeUrl ?? "");
  if (!parsed) {
    console.warn(`[contentful] video "${entry.fields.title}": unrecognized YouTube URL`);
    return null;
  }
  return {
    kind: "video",
    slug: slugify(entry.fields.title),
    title: entry.fields.title,
    youtubeId: parsed.videoId,
    playlistId: parsed.playlistId,
    blurb: entry.fields.blurb ?? null,
  };
}

async function fromPost(
  entry: ResolvedEntry<PostSkeleton>,
): Promise<ScoreItem | null> {
  const pdf = assetUrl(entry.fields.pdf?.fields.file?.url);
  if (!pdf) {
    console.warn(`[contentful] post "${entry.fields.title}": missing PDF asset`);
    return null;
  }
  const slug = slugify(entry.fields.title);
  // No thumbnail field in the model: page 1 of the PDF is rendered at build.
  const thumbnail = await pdfThumbnail(pdf);
  return {
    kind: "score",
    slug,
    title: entry.fields.title,
    pdf,
    thumbnail,
    blurb: entry.fields.blurb ?? null,
  };
}

async function fetchPage(slug: string): Promise<ListPage | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const res = await client.getEntries<PageSkeleton>({
      content_type: "page",
      "fields.slug": slug,
      limit: 1,
      include: 2,
    });
    const page = res.items[0];
    if (!page) return null;

    const posts = await Promise.all(
      (page.fields.posts ?? []).map((entry) => {
        if (!entry) return null; // unpublished link
        const type = entry.sys.contentType.sys.id;
        if (type === "video") return fromVideo(entry as ResolvedEntry<VideoSkeleton>);
        if (type === "post") return fromPost(entry as ResolvedEntry<PostSkeleton>);
        return null;
      }),
    );
    return {
      title: page.fields.title,
      blurb: page.fields.blurb ?? null,
      posts: posts.filter((p): p is PostItem => p !== null),
    };
  } catch (err) {
    console.warn(`[contentful] page "${slug}" fetch failed — using local fallback:`, err);
    return null;
  }
}

// --- Local fallback ----------------------------------------------------------

function localVideo(p: VideoPost): VideoItem {
  return {
    kind: "video",
    slug: p.slug,
    title: p.title,
    youtubeId: p.youtubeId,
    playlistId: p.playlistId,
    blurb: p.blurb,
    playlist: p.playlist,
  };
}

function localScore(p: ScorePost): ScoreItem {
  return {
    kind: "score",
    slug: p.slug,
    title: p.title,
    pdf: p.pdf,
    thumbnail: p.thumbnail,
    blurb: p.blurb,
  };
}

const LOCAL: Record<string, ListPage> = {
  listen: {
    title: "Listen",
    blurb: "Recordings and performances in solo, trio, and ensemble settings.",
    posts: listenPosts.map(localVideo),
  },
  transcriptions: {
    title: "Transcriptions",
    blurb:
      "Solos transcribed note for note from the recordings — pianists first, but not only. Transcription is the core of how jazz vocabulary is passed on: learn the solo by ear, then use the page to check your hearing and study what the player is doing.",
    posts: transcriptionPosts.map(localScore),
  },
  exercises: {
    title: "Exercises",
    blurb:
      "Voicing studies and written lines used in lessons and university courses, offered here as PDFs.",
    posts: exercisePosts.map(localScore),
  },
  contact: {
    title: "Contact",
    blurb: "For lessons, performances, collaborations, or academic inquiries.",
    posts: [],
  },
};

/** A list page by slug: Contentful if published, else the local stand-in. */
export async function getPage(slug: string): Promise<ListPage> {
  const cms = await fetchPage(slug);
  if (cms) return cms;
  const local = LOCAL[slug];
  if (!local) throw new Error(`No content for page "${slug}"`);
  return local;
}
