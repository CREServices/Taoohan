import { content } from "@/content";
import { Section } from "@/components/ui/Section";
import { EmptySlot } from "@/components/ui/EmptySlot";

/**
 * Renders entirely from `content.stats` — no hardcoded numbers.
 * The client answered "TBD" for the figures they want to show, so the array is
 * empty and a marked slot renders instead. The moment real stats are added to
 * the content layer this band fills itself in.
 */
export function StatsBand() {
  return (
    <Section tone="muted" spacing="tight">
      {content.stats.length > 0 ? (
        <dl
          data-testid="stats"
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {content.stats.map((stat) => (
            <div key={stat.key}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-3xl font-semibold tracking-tight sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <EmptySlot
          label="company statistics"
          note="Client answered “TBD” on the intake form — no figures invented."
        />
      )}
    </Section>
  );
}
