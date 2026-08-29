import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JustifiedGallery from "@/components/JustifiedGallery";
import PageHeader from "@/components/PageHeader";
import RichText from "@/components/RichText";
import { getAbout, type AboutContent } from "@/lib/about";
import { about as local } from "@/lib/content";
import { downloadHref } from "@/lib/download";

export const metadata: Metadata = { title: "About" };

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function AboutPage() {
  const cms = await getAbout();
  return cms ? <AboutFromContentful content={cms} /> : <AboutLocal />;
}

// --- Contentful -------------------------------------------------------------

function AboutFromContentful({ content }: { content: AboutContent }) {
  const pressPhotos = content.pressImages.map((photo, i) => ({
    ...photo,
    download: `david-demotta-press-${i + 1}.jpg`,
    href: downloadHref(photo.src, `david-demotta-press-${i + 1}.jpg`),
  }));

  return (
    <>
      <PageHeader
        title={content.title}
        lede={content.blurb && <RichText document={content.blurb} className="space-y-4" />}
      />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        {content.bioImages.length > 0 && (
          <JustifiedGallery photos={content.bioImages} />
        )}

        {content.bio && (
          <section className="mt-12">
            <RichText document={content.bio} className="space-y-5 leading-relaxed" />
          </section>
        )}

        {(content.press || pressPhotos.length > 0) && (
          <Section label="Press">
            {content.press && (
              <RichText document={content.press} className="space-y-4 leading-relaxed text-muted" />
            )}
            {pressPhotos.length > 0 && (
              <JustifiedGallery photos={pressPhotos} className="mt-6" />
            )}
          </Section>
        )}

        {content.universityTeaching && (
          <Section label="University Teaching">
            <RichText document={content.universityTeaching} className="space-y-8" />
          </Section>
        )}
      </div>
    </>
  );
}

// --- Local fallback (until the Contentful entry exists) --------------------

function AboutLocal() {
  return (
    <>
      <PageHeader title="About" lede={<p>{local.lede}</p>} />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <ul className="grid grid-cols-3 gap-3 sm:gap-4">
          {local.photos.map((photo) => (
            <li key={photo.src} className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 240px, 33vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>

        <section className="mt-12 space-y-5 leading-relaxed">
          {local.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="text-sm">
            <Link
              href="/academics"
              className="text-accent transition-colors hover:text-foreground"
            >
              Education, publications, and dissertation
            </Link>
          </p>
        </section>

        <Section label="Press">
          <p className="leading-relaxed text-muted">
            Photos for press and promotional use. Click an image to download
            the full-size file.
          </p>
          <JustifiedGallery
            className="mt-6"
            photos={local.pressPhotos.map((photo, i) => ({
              ...photo,
              download: `david-demotta-press-${i + 1}.jpg`,
            }))}
          />
        </Section>

        <Section label="University Teaching">
          <ul className="space-y-8">
            {local.appointments.map((item) => (
              <li key={item.institution}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h2 className="font-display text-xl">{item.institution}</h2>
                  <p className="text-sm text-muted">{item.years}</p>
                </div>
                <p className="mt-1 text-muted">{item.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.courses.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
