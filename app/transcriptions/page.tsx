import type { Metadata } from "next";
import Image from "next/image";
import ExternalLink from "@/components/ExternalLink";
import PageHeader from "@/components/PageHeader";
import { transcriptionPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Transcriptions & Exercises",
};

export default function TranscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Transcriptions & Exercises"
        lede={
          <>
            <p>
              Private jazz piano instruction is available from DeMotta&rsquo;s
              home studio in Oradell, New Jersey. Lessons emphasize
              improvisation, harmony and voice leading, rhythm and phrasing,
              ear training, repertoire development, music theory and analysis,
              and preparation for auditions and collegiate study.
            </p>
            <p>
              The transcriptions and exercises below are drawn from that
              teaching — material used in lessons and university courses,
              offered here as PDFs.
            </p>
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <ul className="divide-y divide-line border-y border-line">
          {transcriptionPosts.map((post) => (
            <li key={post.slug} className="py-10">
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
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {post.kind}
                  </p>
                  <h2 className="mt-2 font-display text-2xl">{post.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted">
                    {post.blurb}
                  </p>
                  <ExternalLink href={post.pdf} className="mt-4 inline-block text-sm">
                    Download PDF
                  </ExternalLink>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
