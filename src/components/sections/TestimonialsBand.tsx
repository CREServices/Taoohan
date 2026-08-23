import { content } from "@/content";
import { Section } from "@/components/ui/Section";
import { EmptySlot } from "@/components/ui/EmptySlot";

/**
 * Renders entirely from `content.testimonials` — no hardcoded quotes.
 * Empty until the client sends real reviews ("TBD, please remind me").
 */
export function TestimonialsBand({ heading }: { heading: string }) {
  return (
    <Section spacing="tight">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {heading}
      </h2>

      {content.testimonials.length > 0 ? (
        <ul
          data-testid="testimonials"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
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
      ) : (
        <EmptySlot
          className="mt-8"
          label="testimonials"
          note="Sir Jerome answered “TBD, please remind me” — no reviews invented."
        />
      )}
    </Section>
  );
}
