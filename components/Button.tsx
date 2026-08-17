import Link from "next/link";
import type { ComponentProps } from "react";

const buttonClasses =
  "inline-block border border-accent px-6 py-3 text-sm uppercase tracking-widest text-accent transition-colors hover:bg-accent/10";

type ButtonLinkProps = ComponentProps<typeof Link> & { className?: string };

/** Primary call-to-action, rendered as a link. */
export function ButtonLink({ className = "", ...props }: ButtonLinkProps) {
  return <Link {...props} className={`${buttonClasses} ${className}`.trim()} />;
}

type ButtonProps = ComponentProps<"button"> & { className?: string };

/** Primary call-to-action, rendered as a native button. */
export function Button({ className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button {...props} type={type} className={`${buttonClasses} ${className}`.trim()} />
  );
}
