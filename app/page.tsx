import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import RichText from "@/components/RichText";
import { album } from "@/lib/content";
import { getHome } from "@/lib/home";

const highlights = [
  {
    href: "/about",
    title: "Performance",
    body: "Solo, trio, and ensemble settings throughout the New York metropolitan area, rooted in the bebop tradition and contemporary jazz piano.",
  },
  {
    href: "/exercises",
    title: "Teaching",
    body: "University instruction and private lessons in improvisation, harmony, ear training, and repertoire — from his home studio in Oradell, New Jersey.",
  },
  {
    href: "/academics",
    title: "Scholarship",
    body: "Ph.D. in Ethnomusicology from the CUNY Graduate Center, with published research on Bud Powell and the aesthetics of bebop rhythm.",
  },
];

export default async function Home() {
  const cms = await getHome();
  const hero = cms?.hero ?? {
    src: "/hero.jpg",
    alt: "David DeMotta leaning against a grand piano",
  };

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-6">
        <div className="relative h-[70vh] min-h-[420px] w-full">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="(min-width: 1152px) 1104px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        {cms?.blurb ? (
          <RichText document={cms.blurb} className="space-y-6 leading-relaxed text-muted" />
        ) : (
          <>
            <p className="font-display text-2xl leading-snug text-foreground sm:text-[1.7rem]">
              David DeMotta is a jazz pianist, educator, and music scholar based in
              the New York City area.
            </p>
            <p className="mt-6 leading-relaxed text-muted">
              He maintains an active career as a performer, university instructor,
              and private teacher, with extensive experience teaching jazz
              performance, jazz history, music theory, world music, improvisation,
              and applied piano.
            </p>
          </>
        )}
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Recent album
          </p>
          <h2 className="mt-4 font-display text-4xl italic sm:text-5xl">
            {album.title}
          </h2>
          <p className="mt-4 text-muted">{album.personnel}</p>
          <Link
            href={album.href}
            className="mx-auto mt-8 block w-full max-w-sm transition-opacity hover:opacity-90"
            aria-label={`Listen to ${album.title}`}
          >
            <Image
              src={album.cover.src}
              alt={`${album.title} album cover`}
              width={album.cover.width}
              height={album.cover.height}
              sizes="(min-width: 640px) 384px, 100vw"
              className="h-auto w-full"
            />
          </Link>
          <p className="mt-4 flex justify-center gap-6 text-sm">
            {album.streaming.map((service) => (
              <ExternalLink key={service.url} href={service.url}>
                {service.label}
              </ExternalLink>
            ))}
          </p>
          <p className="mx-auto mt-8 max-w-xl leading-relaxed">
            A program of standards and original compositions shaped by a
            contemporary approach to the jazz tradition.
          </p>
          <ButtonLink href={album.href} className="mt-8">
            Listen
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          {highlights.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-block text-sm text-accent transition-colors hover:text-foreground"
              >
                More
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
