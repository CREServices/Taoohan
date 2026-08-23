import { Container } from "@/components/ui/Container";
import type { PageIntro } from "@/content";

/**
 * Standard header band for the six inner pages. The home page uses its own
 * larger hero. Keeping this shared means every inner page has identical
 * vertical rhythm and the H1 is always the page heading from the content layer.
 */
export function PageHero({ eyebrow, heading, lead }: PageIntro) {
  return (
    <div className="border-b border-hairline bg-surface-muted">
      <Container>
        {/* Above the fold, so these use the load-triggered `data-hero`
            entrance rather than a scroll reveal that would never fire. The
            three lines rise in sequence, reading top to bottom. */}
        <div className="max-w-3xl py-14 sm:py-16 lg:py-20">
          <p
            data-hero
            className="text-sm font-medium uppercase tracking-wide text-brand-700"
          >
            {eyebrow}
          </p>
          <h1
            data-hero
            style={{ "--hero-delay": "90ms" } as React.CSSProperties}
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {heading}
          </h1>
          <p
            data-hero
            style={{ "--hero-delay": "180ms" } as React.CSSProperties}
            className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            {lead}
          </p>
        </div>
      </Container>
    </div>
  );
}
