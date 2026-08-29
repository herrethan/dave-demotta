import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ScoreList from "@/components/ScoreList";
import { transcriptionPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Transcriptions" };

export default function TranscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Transcriptions"
        lede={
          <p>
            Solos transcribed note for note from the recordings — pianists
            first, but not only. Transcription is the core of how jazz
            vocabulary is passed on: learn the solo by ear, then use the page
            to check your hearing and study what the player is doing.
          </p>
        }
      />
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <ScoreList posts={transcriptionPosts} />
      </div>
    </>
  );
}
