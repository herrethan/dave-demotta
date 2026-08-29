import Image from "next/image";
import ExternalLink from "@/components/ExternalLink";
import type { ScorePost } from "@/lib/content";

/** List of downloadable scores (transcriptions, exercises): thumbnail + blurb. */
export default function ScoreList({ posts }: { posts: ScorePost[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {posts.map((post) => (
        <li key={post.slug} id={post.slug} className="scroll-mt-24 py-10">
          <article className="flex flex-col gap-6 sm:flex-row sm:gap-8">
            <a
              href={post.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-40 shrink-0 self-start border border-line bg-white transition-opacity hover:opacity-90"
              aria-label={`Open ${post.title} (PDF)`}
            >
              <Image
                src={post.thumbnail.src}
                alt=""
                width={post.thumbnail.width}
                height={post.thumbnail.height}
                sizes="160px"
                className="block h-auto w-full"
              />
            </a>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl">
                <a href={`#${post.slug}`} className="hover:text-accent">
                  {post.title}
                </a>
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{post.blurb}</p>
              <ExternalLink href={post.pdf} className="mt-4 inline-block text-sm">
                Download PDF
              </ExternalLink>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
