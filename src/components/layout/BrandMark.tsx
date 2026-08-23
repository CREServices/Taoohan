import { cn } from "@/lib/cn";

/**
 * ⚠️ PLACEHOLDER LOGO MARK.
 *
 * The client confirmed the "infinity" concept and will send the real logo file
 * separately. This is a neutral geometric stand-in at the correct footprint so
 * header and footer spacing can be judged now; it is replaced by the supplied
 * asset once it arrives (blocker tracked in the Milestone 1 report).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      role="img"
      aria-label="Placeholder logo mark"
      className={cn("h-6 w-12", className)}
      fill="none"
    >
      <path
        d="M12 12c0-4 3-7 6-7s6 3 6 7-3 7-6 7-6-3-6-7Zm12 0c0-4 3-7 6-7s6 3 6 7-3 7-6 7-6-3-6-7Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
