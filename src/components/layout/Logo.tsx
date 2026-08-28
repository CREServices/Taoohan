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
 * The two-person mark inside the wordmark keeps its greens in both; only the
 * lettering and the left ring flip to white. Both variants are cut from the
 * same source at the same crop, so they share one intrinsic ratio and a
 * single CSS height renders header and footer at matching sizes — see the
 * note on LOGOS in src/config/images.ts.
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
 *
 * The default is deliberately modest. This wordmark is a wide lockup
 * (~5.5:1), so height buys width fast — every 4px of height adds ~22px of
 * width. At h-6 it lands at ~133px, which sits at a normal 2:1 against the
 * nav cap height without crowding the 14px nav links.
 */
export function Logo({
  variant = "onLight",
  size = "h-5 w-auto lg:h-6",
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
