import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-colors duration-200 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  // Never let a long label blow out a narrow phone.
  "text-center whitespace-normal sm:whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand-900 text-ink-inverse hover:bg-brand-800",
  secondary: "border border-hairline bg-surface text-ink hover:bg-surface-muted",
  inverse: "bg-surface text-ink hover:bg-surface-muted",
  quiet: "text-ink hover:bg-surface-muted",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = CommonProps & { href: string };

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
