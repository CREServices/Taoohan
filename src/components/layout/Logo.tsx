import Image from "next/image";
import { LOGOS } from "@/config/images";
import { content } from "@/content";
import { cn } from "@/lib/cn";

/**
 * The Taoohan wordmark — the client's real logo, replacing the geometric
 * placeholder that stood in until the file arrived.
 *
 * TWO VARIANTS, because the wordmark's text colour is baked into the file:
 *   `onLight` — dark text, for the white header
 *   `onDark`  — white text, for the inverse footer band
 * The infinity mark is the brand green in both. The two source files have
 * different intrinsic ratios, so each variant carries its own width/height
 * rather than sharing one — `next/image` needs the real ratio to avoid
 * distorting the artwork.
 *
 * ACCESSIBILITY: the artwork contains the company name as pixels, so `alt`
 * carries it as text. That is also why neither the header nor the footer
 * repeats "Taoohan" in a <span> beside it — that read out twice.
 *
 * SIZE is caller-controlled via `size`, not baked in: `cn()` in this project
 * is a plain string joiner (no tailwind-merge), so a conflicting height class
 * passed through `className` would sit next to the default in the DOM and
 * the winner would depend on Tailwind's internal stylesheet order rather
 * than which one the caller intended. `size` replaces the default outright
 * instead of colliding with it.
 */
export function Logo({
  variant = "onLight",
  size = "h-8 w-auto lg:h-9",
  className,
  priority = false,
}: {
  variant?: "onLight" | "onDark";
  /** Height (and width: auto) classes — replaces the default, never merges with it. */
  size?: string;
  className?: string;
  priority?: boolean;
}) {
  const wordmark =
    variant === "onDark" ? LOGOS.wordmarkOnDark : LOGOS.wordmarkOnLight;

  return (
    <Image
      src={wordmark.src}
      alt={content.brand.name}
      width={wordmark.width}
      height={wordmark.height}
      priority={priority}
      unoptimized
      className={cn(size, className)}
    />
  );
}
