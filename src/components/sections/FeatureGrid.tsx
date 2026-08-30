import type { Feature } from "@/content";
import { cn } from "@/lib/cn";
import { FeatureIcon } from "./FeatureIcon";

type FeatureGridProps = {
  items: readonly Feature[];
  /** Show a 01/02/03 counter — used for the "how it works" step lists. */
  numbered?: boolean;
  /**
   * 1 keeps the cards in one stacked column at every width — for a card list
   * sitting in one half of a split layout, where two columns would squeeze
   * each card past readability.
   */
  columns?: 1 | 2 | 3;
  className?: string;
  /**
   * Places a large, faint brand wordmark behind the grid so the cards'
   * frosted glass is actually visible.
   *
   * `backdrop-filter` blurs what is BEHIND an element — over a flat white
   * page there is nothing to blur, so the frosted fill renders as a plain
   * white box. The mark gives the glass something to refract: covered by a
   * card it goes soft and pale, uncovered it stays crisp, and that contrast
   * along the card edge is the effect. Cards also thin their fill when this
   * is on, so the mark reads through them.
   *
   * See `.frosted-backdrop` in globals.css.
   */
  backdrop?: boolean;
};

/**
 * Data-driven card grid. Used for services, value props, differentiators and
 * numbered process steps — all fed from the content layer, never hardcoded JSX.
 *
 * Cards use a restrained glassmorphism treatment (translucent fill + blur +
 * hairline border) matching the frosted panel established in FrostedHero, so
 * the effect reads as one deliberate system rather than two different looks.
 * Height is intentionally NOT fixed — long copy expands the card naturally.
 */
export function FeatureGrid({
  items,
  numbered = false,
  columns = 3,
  className,
  backdrop = false,
}: FeatureGridProps) {
  const grid = (
    <ul
      data-testid="feature-grid"
      className={cn(
        "grid items-stretch gap-6",
        columns === 1
          ? "grid-cols-1"
          : columns === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 lg:grid-cols-2",
        // With a backdrop the wrapper carries the outer spacing so the mark
        // centres on the cards, not on the margin above them.
        backdrop ? "relative" : className,
      )}
    >
      {items.map((item, index) => (
        <li
          key={item.key}
          data-reveal
          // Cards cascade rather than appearing as one slab. Capped so a long
          // list (16 industries) never leaves the last card lagging seconds
          // behind the first.
          style={
            {
              "--reveal-delay": `${Math.min(index, 5) * 70}ms`,
            } as React.CSSProperties
          }
          className={cn(
            "group relative flex flex-col overflow-hidden rounded-card border p-7 sm:p-8",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:border-brand-300/70",
            // Over a backdrop the fill has to stay thin enough for the mark to
            // read through the glass, and the inner top highlight gives the
            // pane its lit edge. Without one there is nothing behind to
            // refract, so the original heavier card stands unchanged.
            backdrop
              ? cn(
                  "border-white/70 bg-white/45 supports-[backdrop-filter]:bg-white/30",
                  "backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-lg",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(38,51,42,0.04),0_16px_36px_-18px_rgba(38,51,42,0.22)]",
                  "hover:bg-white/55",
                  "hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(38,51,42,0.06),0_26px_50px_-18px_rgba(38,51,42,0.3)]",
                )
              : cn(
                  "border-white/60 bg-white/55 supports-[backdrop-filter]:bg-white/40",
                  "backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md",
                  "shadow-[0_1px_2px_rgba(38,51,42,0.04),0_12px_28px_-16px_rgba(38,51,42,0.18)]",
                  "hover:bg-white/70",
                  "hover:shadow-[0_1px_2px_rgba(38,51,42,0.06),0_20px_40px_-16px_rgba(38,51,42,0.24)]",
                ),
          )}
        >
          {/* Top accent line — fills in on hover/entry as a restrained
              "progress" motif rather than a literal loading bar. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
          />

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-200/70 bg-brand-50/80 text-brand-700 transition-colors duration-300 group-hover:border-brand-300 group-hover:bg-brand-100/80">
              <FeatureIcon itemKey={item.key} className="h-6 w-6" />
            </span>
            {numbered && (
              <span className="text-sm font-semibold tracking-wide text-brand-700">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>

          <h3 className="mt-5 text-lg font-semibold leading-snug text-ink">
            {item.title}
          </h3>

          {/* Description is optional — cards stay title-only rather than
              carrying invented copy. See the note on `Feature` in content/types.

              0.875rem, a step down from 0.95: at the narrower card widths this
              grid now runs to (two across inside half a split layout) the
              larger size was breaking short descriptions over five and six
              lines. Held above the leading so the block does not tighten up
              as it shrinks. */}
          {item.body && (
            <p className="mt-3 max-w-prose text-[0.875rem] leading-relaxed text-ink-muted">
              {item.body}
            </p>
          )}
        </li>
      ))}
    </ul>
  );

  if (!backdrop) return grid;

  return (
    <div className={cn("relative", className)}>
      {/* Decorative: the marks carry no meaning the headings do not already
          give, and exist so the cards in front of them have something to
          refract. Two variants because the grid itself reflows at the same
          breakpoint the cards do — see the comment in globals.css. */}
      <span aria-hidden="true" className="frosted-backdrop" />
      <span aria-hidden="true" className="frosted-backdrop-mobile" />
      {grid}
    </div>
  );
}
