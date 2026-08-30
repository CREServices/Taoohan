import { content } from "@/content";
import { Section } from "@/components/ui/Section";
import { EmptySlot } from "@/components/ui/EmptySlot";

/**
 * Renders entirely from `content.testimonials` — no hardcoded quotes.
 *
 * ⚠️ REAL QUOTES ARE STILL BLOCKED. The client's brief is explicit: "we will
 * provide genuine testimonials once available ... do not create placeholder
 * reviews." So the empty state NEVER invents one. What it can do is show the
 * card design, which is what `preview` is for: the cards render with their
 * copy visibly marked as placeholder and with no name, role or company
 * attached to anything. Nothing on screen can be read as a review a real
 * person gave — there is no person on it — while the layout, spacing and card
 * treatment are all reviewable ahead of the real quotes landing.
 *
 * The moment `content.testimonials` has entries, both empty states disappear
 * and the real quotes render. Populating the content array is the only change
 * needed; nothing here has to be touched.
 */

/**
 * Placeholder card bodies. Deliberately DESCRIBE the slot rather than
 * imitating a review — no first person, no praise, no attributable claim.
 * Three of them because three is the widest row the grid lays out, so the
 * preview shows the layout at full width.
 */
const PREVIEW_SLOTS = [
  {
    key: "preview-1",
    body: "Placeholder text. The client's first approved testimonial will sit here, at roughly this length.",
  },
  {
    key: "preview-2",
    body: "Placeholder text, shown only to preview the card layout. No review has been written or supplied.",
  },
  {
    key: "preview-3",
    body: "Placeholder text. Attribution — name, role and company — appears beneath each quote once supplied.",
  },
] as const;

export function TestimonialsBand({
  heading,
  /**
   * Show the card design with placeholder copy instead of the dashed
   * awaiting-content box, for pages where the point is to review the visual.
   * Ignored entirely once real testimonials exist.
   */
  preview = false,
}: {
  heading: string;
  preview?: boolean;
}) {
  const grid = "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section spacing="tight">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {heading}
      </h2>

      {content.testimonials.length > 0 ? (
        <ul data-testid="testimonials" className={grid}>
          {content.testimonials.map((testimonial) => (
            <li
              key={testimonial.key}
              className="rounded-card border border-hairline p-6"
            >
              <blockquote className="text-sm leading-relaxed text-ink-muted">
                “{testimonial.quote}”
              </blockquote>
              <footer className="mt-4 text-sm">
                <span className="font-medium">{testimonial.author}</span>
                <span className="block text-ink-muted">{testimonial.role}</span>
              </footer>
            </li>
          ))}
        </ul>
      ) : preview ? (
        <>
          {/* Carries the same `data-empty-slot` hook as the dashed box, so the
              blocked-content sweep still counts this section as awaiting the
              client — showing the layout must not make the gap invisible to
              the gate. */}
          <ul
            data-empty-slot="testimonials"
            data-testid="testimonials-preview"
            className={grid}
          >
            {PREVIEW_SLOTS.map((slot) => (
              <li
                key={slot.key}
                className="flex flex-col rounded-card border border-dashed border-hairline bg-surface-muted/60 p-6"
              >
                <span
                  aria-hidden="true"
                  className="text-3xl leading-none font-semibold text-brand-300"
                >
                  “
                </span>
                <p className="mt-2 text-sm italic leading-relaxed text-ink-muted">
                  {slot.body}
                </p>
                {/* The attribution line is a shape, not a name. Two muted bars
                    stand in for "author" and "role" so the card's proportions
                    are honest, without a fabricated person on it. */}
                <div aria-hidden="true" className="mt-5 space-y-2">
                  <span className="block h-2.5 w-28 rounded-pill bg-hairline" />
                  <span className="block h-2.5 w-36 rounded-pill bg-hairline" />
                </div>
              </li>
            ))}
          </ul>
          <p data-preview-note className="mt-4 text-xs text-ink-muted">
            Layout preview only — awaiting the client&rsquo;s genuine testimonials. No
            review has been written or invented.
          </p>
        </>
      ) : (
        <EmptySlot
          className="mt-8"
          label="testimonials"
          note="Not yet supplied by the client — no reviews invented."
        />
      )}
    </Section>
  );
}
