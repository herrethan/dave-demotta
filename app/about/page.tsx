import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JustifiedGallery from "@/components/JustifiedGallery";
import PageHeader from "@/components/PageHeader";
import { about } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About" lede={<p>{about.lede}</p>} />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        {/* Photos */}
        <ul className="grid grid-cols-3 gap-3 sm:gap-4">
          {about.photos.map((photo) => (
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

        {/* Bio */}
        <section className="mt-12 space-y-5 leading-relaxed">
          {about.bio.map((paragraph) => (
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

        {/* Press */}
        <section className="mt-16 border-t border-line pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Press</p>
          <p className="mt-6 leading-relaxed text-muted">
            Photos for press and promotional use. Click an image to download
            the full-size file.
          </p>
          <JustifiedGallery
            className="mt-6"
            photos={about.pressPhotos.map((photo, i) => ({
              ...photo,
              download: `david-demotta-press-${i + 1}.jpg`,
            }))}
          />
        </section>

        {/* University teaching */}
        <section className="mt-16 border-t border-line pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            University Teaching
          </p>
          <ul className="mt-6 space-y-8">
            {about.appointments.map((item) => (
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
        </section>
      </div>
    </>
  );
}
