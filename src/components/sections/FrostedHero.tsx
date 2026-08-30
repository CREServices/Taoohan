import { content } from "@/content";
import { Container } from "@/components/ui/Container";
import { PartnerCta } from "@/components/cta/PartnerCta";

/**
 * Home page hero — frosted-glass (glassmorphism) overlay panel over the
 * background video.
 *
 * The headline, subheadline and CTA sit inside a translucent panel built on
 * `backdrop-filter: blur(...)`, a semi-transparent frost background, a thin
 * light border and a soft shadow — legible over the video regardless of what
 * is playing behind it.
 *
 * Background video is decorative only (muted, looping, no controls), so it
 * carries `aria-hidden` and nothing here is announced to screen readers —
 * the same content is already in the text column. `poster` paints the first
 * frame instantly so there is never a blank flash while the video buffers.
 * Two encodes (1080/540, WebM before MP4) are served from `public/video/`;
 * see the source master in `raw-assets/` (gitignored) if these ever need
 * re-encoding.
 *
 * ACCESSIBILITY: `supports-[backdrop-filter]` gates the translucent look; a
 * browser without `backdrop-filter` support falls back to a solid frost
 * background on the panel, so text contrast is never at the mercy of the
 * blur rendering.
 */
export function FrostedHero() {
  return (
    <div className="relative isolate overflow-hidden border-b border-hairline bg-brand-900">
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        poster="/manpower-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source media="(max-width: 640px)" src="/video/hero-540.webm" type="video/webm" />
        <source media="(max-width: 640px)" src="/video/hero-540.mp4" type="video/mp4" />
        <source src="/video/hero-1080.webm" type="video/webm" />
        <source src="/video/hero-1080.mp4" type="video/mp4" />
      </video>
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
            "max-w-3xl rounded-card border border-white/30 p-8 shadow-xl sm:p-10 lg:p-12 " +
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
          <h1
            data-hero
            style={{ "--hero-delay": "90ms" } as React.CSSProperties}
            className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {content.home.headline}
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
