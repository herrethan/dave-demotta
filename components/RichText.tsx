import Link from "next/link";
import Image from "next/image";
import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  MARKS,
  type Block,
  type Document,
  type Inline,
  type Text,
  type TopLevelBlock,
} from "@contentful/rich-text-types";
import ExternalLink from "@/components/ExternalLink";
import JustifiedGallery, { type GalleryPhoto } from "@/components/JustifiedGallery";
import { assetToPhoto } from "@/lib/contentful";

type Node = Block | Inline | Text;

// Hosts treated as "this site" when Contentful links use absolute URLs.
const INTERNAL_HOSTS = new Set(["localhost", "127.0.0.1", "daviddemotta.netlify.app"]);
const DATE_RE = /^\s*\d{4}\s*(?:[–—-]\s*(?:\d{4}|present))?\s*$/i;

// --- helpers ---------------------------------------------------------------

function isText(n: Node): n is Text {
  return n.nodeType === "text";
}

function textOf(n: Node): string {
  if (isText(n)) return n.value;
  return n.content.map(textOf).join("");
}

function isEmptyParagraph(n: Node) {
  return n.nodeType === BLOCKS.PARAGRAPH && textOf(n).trim() === "";
}

function isHeading(n: Node) {
  return typeof n.nodeType === "string" && n.nodeType.startsWith("heading-");
}

/** A list item with more than one block is an "entry", not a bullet. */
function isEntryItem(li: Node) {
  return li.nodeType === BLOCKS.LIST_ITEM && li.content.length > 1;
}

function isEntryList(ul: Node) {
  return (
    ul.nodeType === BLOCKS.UL_LIST &&
    ul.content.length > 0 &&
    ul.content.every((li) => isEntryItem(li) || (li.nodeType === BLOCKS.LIST_ITEM && isEmptyParagraph(li.content[0])))
  );
}

/** Internal path for own-site links (relative, or absolute to a known host). */
function internalPath(uri: string): string | null {
  if (uri.startsWith("/") && !uri.startsWith("//")) return uri;
  try {
    const u = new URL(uri);
    if (INTERNAL_HOSTS.has(u.hostname)) return u.pathname + u.search + u.hash;
  } catch {}
  return null;
}

/**
 * Collapse runs of consecutive embedded images (ignoring blank paragraphs
 * between them) into one synthetic `gallery` node, so they render as a row.
 * Single images stay full-width. Also drops leading/trailing blank paragraphs.
 */
function groupGalleries(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let run: GalleryPhoto[] = [];
  const flush = () => {
    if (run.length === 0) return;
    out.push({
      nodeType: "gallery",
      data: { photos: run },
      content: [],
    } as unknown as Block);
    run = [];
  };
  nodes.forEach((n, i) => {
    if (n.nodeType === BLOCKS.EMBEDDED_ASSET) {
      const photo = assetToPhoto(n.data.target);
      if (photo) {
        run.push(photo);
        return;
      }
    }
    if (isEmptyParagraph(n)) {
      // blank line between two images: keep the run going
      const next = nodes.slice(i + 1).find((m) => !isEmptyParagraph(m));
      if (run.length && next?.nodeType === BLOCKS.EMBEDDED_ASSET) return;
      if (run.length || out.length === 0 || i === nodes.length - 1) {
        flush();
        return; // drop the blank paragraph
      }
    }
    flush();
    out.push(n);
  });
  flush();
  // drop trailing blank paragraphs
  while (out.length && isEmptyParagraph(out[out.length - 1])) out.pop();
  return out;
}

// --- renderer --------------------------------------------------------------

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    [MARKS.CODE]: (text) => <code className="font-mono text-sm">{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => <p>{children}</p>,
    // H1 is the "intro line" style (pages get their real h1 from PageHeader).
    [BLOCKS.HEADING_1]: (_node, children) => (
      <p className="font-display text-2xl leading-snug text-foreground sm:text-[1.7rem]">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="font-display text-2xl leading-snug text-foreground">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="font-display text-xl text-foreground">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <h4 className="text-xs uppercase tracking-[0.2em] text-muted">{children}</h4>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="border-l-2 border-accent pl-4 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-line" />,
    [BLOCKS.UL_LIST]: (node, children) => {
      // Items with several blocks each (heading + lines, or citation + label)
      // are a list of entries, not bullet points.
      return isEntryList(node) ? (
        <ul className="space-y-8">{children}</ul>
      ) : (
        <ul className="list-disc space-y-1 pl-5">{children}</ul>
      );
    },
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="list-decimal space-y-1 pl-5">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => {
      const blocks = node.content as Node[];
      if (!isEntryItem(node)) {
        // Plain bullet: unwrap the paragraph Contentful puts inside list items.
        return <li className="[&>p]:inline">{children}</li>;
      }
      const [first, second, ...rest] = blocks;
      // Entry whose heading is followed by a date-looking line (e.g. a
      // university appointment): heading row with the date flexed right.
      if (isHeading(first) && second && DATE_RE.test(textOf(second))) {
        return (
          <li>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              {renderNodes([first])}
              <p className="text-sm text-muted">{textOf(second).trim()}</p>
            </div>
            <div className="mt-1 space-y-2 text-muted [&>p:not(:first-child)]:text-sm [&>p:not(:first-child)]:leading-relaxed">
              {renderNodes(rest)}
            </div>
          </li>
        );
      }
      // Entry led by a heading: heading, then muted detail lines.
      if (isHeading(first)) {
        return (
          <li>
            {renderNodes([first])}
            <div className="mt-1 space-y-2 text-muted">
              {renderNodes([second, ...rest].filter(Boolean))}
            </div>
          </li>
        );
      }
      // Entry of plain lines (e.g. a citation + label, or degree lines):
      // first line normal, the rest small and muted.
      return (
        <li>
          <div className="leading-relaxed">{renderNodes([first])}</div>
          <div className="mt-1 space-y-1 text-sm text-muted">
            {renderNodes([second, ...rest].filter(Boolean), { meta: true })}
          </div>
        </li>
      );
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const photo = assetToPhoto(node.data.target);
      if (!photo) return null;
      return (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full"
        />
      );
    },
    gallery: (node) => (
      <JustifiedGallery photos={(node.data as { photos: GalleryPhoto[] }).photos} />
    ),
    [INLINES.HYPERLINK]: (node, children) => {
      const uri = String(node.data.uri ?? "");
      const path = internalPath(uri);
      if (path) {
        return (
          <Link href={path} className="text-accent transition-colors hover:text-foreground">
            {children}
          </Link>
        );
      }
      if (uri.startsWith("mailto:") || uri.startsWith("tel:")) {
        return (
          <a href={uri} className="text-accent transition-colors hover:text-foreground">
            {children}
          </a>
        );
      }
      return <ExternalLink href={uri}>{children}</ExternalLink>;
    },
    [INLINES.ASSET_HYPERLINK]: (node, children) => {
      const url = node.data.target?.fields?.file?.url as string | undefined;
      if (!url) return <>{children}</>;
      return <ExternalLink href={url.startsWith("//") ? `https:${url}` : url}>{children}</ExternalLink>;
    },
  },
  renderText: (text) =>
    text.split("\n").flatMap((line, i) => (i === 0 ? [line] : [<br key={i} />, line])),
};

const metaHeading = (_node: Block | Inline, children: React.ReactNode) => (
  <p className="text-sm text-muted">{children}</p>
);

// Inside entry detail lines, a heading can only sensibly be a label
// (e.g. "Peer-reviewed article"), so render it as small muted text.
const metaOptions: Options = {
  ...options,
  renderNode: {
    ...options.renderNode,
    [BLOCKS.HEADING_1]: metaHeading,
    [BLOCKS.HEADING_2]: metaHeading,
    [BLOCKS.HEADING_3]: metaHeading,
    [BLOCKS.HEADING_4]: metaHeading,
    [BLOCKS.HEADING_5]: metaHeading,
    [BLOCKS.HEADING_6]: metaHeading,
  },
};

function renderNodes(nodes: Node[], { meta = false } = {}) {
  return documentToReactComponents(
    {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: nodes as unknown as TopLevelBlock[],
    },
    meta ? metaOptions : options,
  );
}

/**
 * Renders a Contentful rich text document with the site's typography.
 * Consecutive embedded images become a justified gallery row; hyperlinks to
 * this site navigate internally, everything else opens externally with an icon.
 */
export default function RichText({
  document,
  className = "space-y-4 leading-relaxed",
}: {
  document: Document;
  className?: string;
}) {
  const content = groupGalleries(document.content as Node[]);
  return <div className={className}>{renderNodes(content)}</div>;
}
