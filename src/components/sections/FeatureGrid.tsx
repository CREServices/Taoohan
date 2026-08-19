import type { Feature } from "@/content";
import { cn } from "@/lib/cn";

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
        "grid gap-5 sm:grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        className,
      )}
    >
      {items.map((item, index) => (
        <li
          key={item.key}
          data-reveal
          // Cards cascade rather than appearing as one slab. Capped so a long
          // list (11 services) never leaves the last card lagging seconds
          // behind the first.
          style={
            {
              "--reveal-delay": `${Math.min(index, 5) * 70}ms`,
            } as React.CSSProperties
          }
          className="rounded-card border border-hairline bg-surface p-6 transition-colors hover:border-brand-300"
        >
          {numbered && (
            <span className="text-sm font-semibold text-brand-700">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className={cn("text-lg font-semibold", numbered && "mt-2")}>
            {item.title}
          </h3>
          {/* Description is optional — cards stay title-only rather than
              carrying invented copy. See the note on `Feature` in content/types. */}
          {item.body && (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {item.body}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
