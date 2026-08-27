import type { Feature } from "@/content";
import { cn } from "@/lib/cn";
import { FeatureIcon } from "./FeatureIcon";

type FeatureGridProps = {
  items: readonly Feature[];
  /** Show a 01/02/03 counter — used for the "how it works" step lists. */
  numbered?: boolean;
  columns?: 2 | 3;
  className?: string;
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
}: FeatureGridProps) {
  return (
    <ul
      data-testid="feature-grid"
      className={cn(
        "grid items-stretch gap-6 sm:grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        className,
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
            "border-white/60 bg-white/55 supports-[backdrop-filter]:bg-white/40",
            "backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md",
            "shadow-[0_1px_2px_rgba(38,51,42,0.04),0_12px_28px_-16px_rgba(38,51,42,0.18)]",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:border-brand-300/70 hover:bg-white/70",
            "hover:shadow-[0_1px_2px_rgba(38,51,42,0.06),0_20px_40px_-16px_rgba(38,51,42,0.24)]",
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
              carrying invented copy. See the note on `Feature` in content/types. */}
          {item.body && (
            <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
              {item.body}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
