import Image from "next/image";
import Blurb from "@/components/Blurb";
import ExternalLink from "@/components/ExternalLink";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import type { PostItem, ScoreItem, VideoItem } from "@/lib/pages";

/** Mixed list of video and score posts; each item is an #anchor target. */
export default function PostList({ posts }: { posts: PostItem[] }) {
  if (posts.length === 0) return null;
  const allVideos = posts.every((p) => p.kind === "video");
  return (
    <ul
      className={
        allVideos ? "space-y-16" : "divide-y divide-line border-y border-line"
      }
    >
      {posts.map((post) => (
        // scroll-mt clears the sticky header when jumping to #anchors
        <li key={post.slug} id={post.slug} className="scroll-mt-24">
          {post.kind === "video" ? (
            <VideoPost post={post} />
          ) : (
            <ScorePost post={post} />
          )}
        </li>
      ))}
    </ul>
  );
}

function Title({ slug, title }: { slug: string; title: string }) {
  return (
    <h2 className="font-display text-2xl">
      <a href={`#${slug}`} className="hover:text-accent">
        {title}
      </a>
    </h2>
  );
}

function VideoPost({ post }: { post: VideoItem }) {
  return (
    <article>
      <YouTubeEmbed
        id={post.youtubeId}
        title={post.title}
        playlistId={post.playlistId}
      />
      <div className="mt-6">
        <Title slug={post.slug} title={post.title} />
      </div>
      <Blurb content={post.blurb} className="mt-3 space-y-3 leading-relaxed text-muted" />
      {post.playlist && (
        <ExternalLink href={post.playlist.url} className="mt-3 inline-block text-sm">
          {post.playlist.label}
        </ExternalLink>
      )}
    </article>
  );
}

function ScorePost({ post }: { post: ScoreItem }) {
  const thumb = post.thumbnail;
  return (
    <article className="flex flex-col gap-6 py-10 sm:flex-row sm:gap-8">
      <a
        href={post.pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="w-40 shrink-0 self-start border border-line bg-white transition-opacity hover:opacity-90"
        aria-label={`Open ${post.title} (PDF)`}
      >
        {thumb ? (
          thumb.src.startsWith("data:") ? (
            // Build-time render of the PDF's first page; already sized.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb.src}
              alt=""
              width={thumb.width}
              height={thumb.height}
              className="block h-auto w-full"
            />
          ) : (
            <Image
              src={thumb.src}
              alt=""
              width={thumb.width}
              height={thumb.height}
              sizes="160px"
              className="block h-auto w-full"
            />
          )
        ) : (
          <div className="flex aspect-[17/22] items-center justify-center text-xs uppercase tracking-widest text-muted">
            PDF
          </div>
        )}
      </a>
      <div className="min-w-0 flex-1">
        <Title slug={post.slug} title={post.title} />
        <Blurb content={post.blurb} className="mt-3 space-y-3 leading-relaxed text-muted" />
        <ExternalLink href={post.download} className="mt-4 inline-block text-sm">
          Download PDF
        </ExternalLink>
      </div>
    </article>
  );
}
