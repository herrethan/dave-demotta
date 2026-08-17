import type { Metadata } from "next";
import ExternalLink from "@/components/ExternalLink";
import PageHeader from "@/components/PageHeader";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { listenPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Listen" };

export default function ListenPage() {
  return (
    <>
      <PageHeader
        title="Listen"
        lede={
          <p>
            Recordings and performances in solo, trio, and ensemble settings.
          </p>
        }
      />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <ul className="space-y-16">
          {listenPosts.map((post) => (
            // scroll-mt clears the sticky header when jumping to #anchors
            <li key={post.slug} id={post.slug} className="scroll-mt-24">
              <article>
                <YouTubeEmbed
                  id={post.youtubeId}
                  title={post.title}
                  playlistId={post.playlistId}
                />
                <h2 className="mt-6 font-display text-2xl">
                  <a href={`#${post.slug}`} className="hover:text-accent">
                    {post.title}
                  </a>
                </h2>
                <p className="mt-3 leading-relaxed text-muted">{post.blurb}</p>
                {post.playlist && (
                  <ExternalLink
                    href={post.playlist.url}
                    className="mt-3 inline-block text-sm"
                  >
                    {post.playlist.label}
                  </ExternalLink>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
