import type { Metadata } from "next";
import Image from "next/image";
import ExternalLink from "@/components/ExternalLink";
import PageHeader from "@/components/PageHeader";
import { dissertation, education, publications } from "@/lib/content";

export const metadata: Metadata = { title: "Academics" };

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        title="Academics"
        lede={
          <p>
            Research and university teaching in jazz history and analysis,
            music theory, world music, and the Black music of the Americas.
          </p>
        }
      />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        {/* Publications & presentations */}
        <section className="border-t border-line pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Publications &amp; Presentations
          </p>
          <ul className="mt-6 space-y-6">
            {publications.map((pub) => (
              <li key={pub.citation}>
                <p className="leading-relaxed">{pub.citation}</p>
                <p className="mt-1 text-sm text-muted">
                  {pub.kind}
                  {pub.url && (
                    <>
                      {" · "}
                      <ExternalLink href={pub.url}>
                        {pub.linkLabel ?? "Read"}
                      </ExternalLink>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Dissertation */}
        <section className="mt-16 border-t border-line pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Dissertation
          </p>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:gap-10">
            <a
              href={dissertation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-44 shrink-0 self-start border border-line bg-white transition-opacity hover:opacity-90"
              aria-label={`Read ${dissertation.title} at CUNY Academic Works`}
            >
              <Image
                src={dissertation.cover.src}
                alt=""
                width={dissertation.cover.width}
                height={dissertation.cover.height}
                sizes="176px"
                className="block h-auto w-full"
              />
            </a>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl leading-snug">
                {dissertation.title}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {dissertation.degree}, {dissertation.institution},{" "}
                {dissertation.year}
              </p>
              <p className="mt-5 leading-relaxed text-muted">
                {dissertation.description}
              </p>
              <ExternalLink href={dissertation.url} className="mt-5 inline-block text-sm">
                Read at CUNY Academic Works
              </ExternalLink>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mt-16 border-t border-line pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Education
          </p>
          <ul className="mt-6 space-y-6">
            {education.map((item) => (
              <li key={item.degree}>
                <p className="font-display text-xl">{item.degree}</p>
                <p className="mt-1 text-muted">{item.institution}</p>
                {item.notes.map((note) => (
                  <p key={note} className="mt-1 text-sm text-muted">
                    {note}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
