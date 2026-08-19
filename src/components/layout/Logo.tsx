import Image from "next/image";
import { LOGOS } from "@/config/images";
import { content } from "@/content";
import { cn } from "@/lib/cn";

/**
 * The Taoohan wordmark — the client's real logo, replacing the geometric
 * placeholder that stood in until the file arrived.
 *
 * SVG rather than PNG: 3.5KB against 13KB, and it stays sharp at any size and
 * on any pixel density. `unoptimized` serves it straight from `public/` — an
 * SVG is already resolution-independent, so running it through the image
 * optimiser only adds a round trip.
 *
 * TWO VARIANTS, because the wordmark's text colour is baked into the file:
 *   `onLight` — dark text, for the white header
 *   `onDark`  — white text, for the inverse footer band
 * The infinity mark is the brand green in both.
 *
 * ACCESSIBILITY: the artwork contains the company name as pixels, so `alt`
 * carries it as text. That is also why neither the header nor the footer
 * repeats "Taoohan" in a <span> beside it — that read out twice.
 */
export function Logo({
  variant = "onLight",
  className,
  priority = false,
}: {
  variant?: "onLight" | "onDark";
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "onDark" ? LOGOS.wordmarkOnDark : LOGOS.wordmarkOnLight;

  return (
    <Image
      src={src}
      alt={content.brand.name}
      width={LOGOS.wordmarkWidth}
      height={LOGOS.wordmarkHeight}
      priority={priority}
      unoptimized
      // Height-constrained so the header row height governs it; width follows
      // the intrinsic ratio so the mark never distorts.
      className={cn("h-8 w-auto lg:h-9", className)}
    />
  );
}
