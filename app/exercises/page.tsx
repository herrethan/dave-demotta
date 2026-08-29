import type { Metadata } from "next";
import Blurb from "@/components/Blurb";
import PageHeader from "@/components/PageHeader";
import PostList from "@/components/PostList";
import { getPage } from "@/lib/pages";

export const metadata: Metadata = { title: "Exercises" };

export default async function ExercisesPage() {
  const page = await getPage("exercises");
  return (
    <>
      <PageHeader title={page.title} lede={<Blurb content={page.blurb} />} />
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <PostList posts={page.posts} />
      </div>
    </>
  );
}
