import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ScoreList from "@/components/ScoreList";
import { exercisePosts } from "@/lib/content";

export const metadata: Metadata = { title: "Exercises" };

export default function ExercisesPage() {
  return (
    <>
      <PageHeader
        title="Exercises"
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
              The exercises below are drawn from that teaching — voicing
              studies and written lines used in lessons and university
              courses, offered here as PDFs.
            </p>
          </>
        }
      />
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <ScoreList posts={exercisePosts} />
      </div>
    </>
  );
}
