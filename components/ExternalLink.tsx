import type { ComponentProps } from "react";

/** Arrow-up-right glyph, sized to the surrounding text. */
export function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block h-[0.8em] w-[0.8em] shrink-0 align-[-0.05em] ${className}`.trim()}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/**
 * Link that opens in a new tab, with an arrow-up-right icon after the label.
 * Icon is decorative; the new-tab behavior is announced via sr-only text.
 */
export default function ExternalLink({
  children,
  className = "",
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={`text-accent transition-colors hover:text-foreground ${className}`.trim()}
    >
      {children}
      <ExternalIcon className="ml-1" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
