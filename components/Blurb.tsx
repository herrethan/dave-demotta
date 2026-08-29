import RichText from "@/components/RichText";
import type { Blurb as BlurbContent } from "@/lib/pages";

/** Renders a blurb that is either Contentful rich text or a plain string. */
export default function Blurb({
  content,
  className = "space-y-4 leading-relaxed",
}: {
  content: BlurbContent;
  className?: string;
}) {
  if (!content) return null;
  if (typeof content === "string") {
    return (
      <div className={className}>
        <p>{content}</p>
      </div>
    );
  }
  return <RichText document={content} className={className} />;
}
