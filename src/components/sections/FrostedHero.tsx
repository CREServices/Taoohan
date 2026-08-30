import { content } from "@/content";
import { Container } from "@/components/ui/Container";
import { PartnerCta } from "@/components/cta/PartnerCta";
import { HeroVideo } from "./HeroVideo";

/**
 * Home page hero — frosted-glass (glassmorphism) overlay panel over the
 * background video.
 *
 * The headline, subheadline and CTA sit inside a translucent panel built on
 * `backdrop-filter: blur(...)`, a semi-transparent frost background, a thin
 * light border and a soft shadow — legible over the video regardless of what
 * is playing behind it.
 *
 * The footage itself lives in HeroVideo, which is a client component only
 * because the loop is played back fast (see the note there).
 *
 * ACCESSIBILITY: `supports-[backdrop-filter]` gates the translucent look; a
 * browser without `backdrop-filter` support falls back to a solid frost
 * background on the panel, so text contrast is never at the mercy of the
 * blur rendering.
 */
export function FrostedHero() {
  return (
    <div className="relative isolate overflow-hidden border-b border-hairline bg-brand-900">
      <HeroVideo />
      {/* Darkens the footage so the white text in the (now low-opacity)
          frosted panel keeps consistent contrast regardless of what's
          playing behind it. */}
      <div className="absolute inset-0 -z-10 bg-ink/45" />

      <Container
        size="wide"
        className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16 sm:py-20 lg:min-h-[calc(100svh-5rem)] lg:py-24"
      >
        <div
          data-hero
          className={
            // `@container` makes the panel a container-query context, which is
            // what lets the headline below size itself from the PANEL's width
            // rather than the viewport's — see the note on the h1.
            "@container max-w-2xl rounded-card border border-white/30 p-8 shadow-xl sm:p-10 lg:p-12 " +
            // Frosted glass: a LOW-opacity translucent fill + blur, so the
            // video reads clearly through the panel rather than being
            // mostly hidden behind it. The plain `bg-white/15` is the
            // fallback for browsers without backdrop-filter support; text
            // is white throughout (not dark ink) since the fill is now too
            // light to carry dark-on-light contrast on its own — the blur
            // + darkening layer behind the panel is what keeps it readable.
            "bg-white/15 supports-[backdrop-filter]:bg-white/10 " +
            "backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl"
          }
        >
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">
            {content.home.eyebrow}
          </p>
          {/*
            TWO LINES, ALWAYS — "Bringing Great People" / "to Great
            Businesses." The break is client-specified, so it is set in the
            content layer (`headlineLines`) and each line is `whitespace-nowrap`
            rather than left to wrap wherever the column happens to run out.

            Sizing is `cqw`, not a breakpoint ladder: 1cqw is 1% of the PANEL's
            content box, so the type scales with the box that has to hold it.
            That is what makes the two-line promise hold at any width AND at
            any browser zoom — zoom changes the CSS pixel width of the panel,
            the font size follows it, and the ratio between the two never
            moves. A breakpoint ladder cannot do this: it steps at fixed
            viewport widths and says nothing about the widths in between,
            which is exactly where the third line used to appear.

            8.2cqw is measured, not guessed — it is the largest ratio at which
            the longer of the two lines still clears the panel's content box
            with margin to spare. The clamp floor keeps the headline readable
            in a very narrow panel; the ceiling stops it outgrowing the
            supporting copy on a wide desktop.

            The space between the lines is a REAL text node, not decoration.
            Two adjacent block spans concatenate with nothing between them, so
            the heading's text content came out as "Bringing Great Peopleto
            Great Businesses." — which is what a screen reader announces, what
            a search engine indexes, and what lands on the clipboard. The
            space collapses to nothing visually at the start of a block line,
            so it costs no layout and fixes all three.
          */}
          <h1
            data-hero
            style={{ "--hero-delay": "90ms" } as React.CSSProperties}
            className="mt-4 text-[clamp(1.125rem,8.2cqw,3.5rem)] font-semibold leading-[1.15] tracking-tight text-white"
          >
            {content.home.headlineLines.map((line, index) => (
              <span key={line} className="block whitespace-nowrap">
                {index > 0 && " "}
                {line}
              </span>
            ))}
          </h1>
          <p
            data-hero
            style={{ "--hero-delay": "180ms" } as React.CSSProperties}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
          >
            {content.home.supporting}
          </p>
          <div
            data-hero
            style={{ "--hero-delay": "270ms" } as React.CSSProperties}
            className="mt-8"
          >
            <PartnerCta size="lg" />
          </div>
        </div>
      </Container>
    </div>
  );
}
