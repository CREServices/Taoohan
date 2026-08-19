import Link from "next/link";
import { content } from "@/content";
import { NAV } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { StatsBand } from "@/components/sections/StatsBand";
import { TestimonialsBand } from "@/components/sections/TestimonialsBand";
import { CtaGroup } from "@/components/cta/CtaGroup";

/**
 * Home page.
 *
 * Layout follows the "warm, people-focused" brief: a split hero with room for a
 * real workforce photograph on the right, a proof band, then the two audience
 * paths (employers / job seekers) surfaced early so neither has to hunt.
 *
 * Image areas are marked placeholders — photography is Developer 2's scope and
 * the client has not sent assets yet.
 */
export default function HomePage() {
  const employersNav = NAV.find((item) => item.key === "employers");
  const jobSeekersNav = NAV.find((item) => item.key === "jobseekers");

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <div className="border-b border-hairline bg-surface-muted">
        <Container>
          <div className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
            {/* Landing hero entrance — Developer 2 scope (Milestone 1).
                Load-triggered, not scroll-triggered: this is above the fold on
                every breakpoint, so a scroll reveal would never fire. Each line
                is offset ~90ms so the eye is led down the hero in reading
                order and lands on the buttons last. */}
            <div>
              <p
                data-hero
                className="text-sm font-medium uppercase tracking-wide text-brand-700"
              >
                {content.brand.tagline}
              </p>
              <h1
                data-hero
                style={{ "--hero-delay": "90ms" } as React.CSSProperties}
                className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              >
                {content.home.headline}
              </h1>
              <p
                data-hero
                style={{ "--hero-delay": "180ms" } as React.CSSProperties}
                className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
              >
                {content.home.supporting}
              </p>
              {/* Deliberately NOT wrapped in `data-hero`: CtaGroup renders the
                  Apply Now dialog as its own child, and an animating ancestor
                  would drag the open dialog through the hero's fade. The
                  buttons arrive with the supporting line instead. */}
              <CtaGroup size="lg" className="mt-8" />
              <p
                data-hero
                style={{ "--hero-delay": "270ms" } as React.CSSProperties}
                className="mt-6 text-sm text-ink-muted"
              >
                {content.home.trustLine}
              </p>
            </div>

            {/* Photography slot — Developer 2 scope, asset not yet supplied. */}
            <div
              data-hero
              style={{ "--hero-delay": "180ms" } as React.CSSProperties}
              data-empty-slot="hero photograph"
              className="flex aspect-4/3 items-center justify-center rounded-card border border-dashed border-hairline bg-surface"
            >
              <p className="px-6 text-center text-sm text-ink-muted">
                Awaiting client content: hero photograph
                <span className="mt-1 block text-xs text-ink-muted">
                  Real workforce imagery — supplied separately by the client.
                </span>
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* -------------------------------------------------------- WHY CHOOSE US */}
      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-brand-700">
            {content.home.intro.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.home.intro.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {content.home.intro.lead}
          </p>
        </div>
        <FeatureGrid items={content.differentiators} className="mt-10" />
      </Section>

      {/* ------------------------------------------------------------ WHAT WE DO */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.about.heading}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-ink-muted">
              {content.home.introBody}
            </p>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- SERVICES */}
      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.services.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              {content.services.lead}
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-brand-700 underline underline-offset-4"
          >
            {content.labels.viewAllServices}
          </Link>
        </div>
        {/* Preview of the first six; the full list lives on /services. */}
        <FeatureGrid items={content.services.items.slice(0, 6)} className="mt-10" />
      </Section>

      {/* ------------------------------------------------------------ INDUSTRIES */}
      <Section tone="muted">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.industries.heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {content.industries.lead}
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.industries.items.map((industry) => (
            <li
              key={industry.key}
              className="rounded-card border border-hairline bg-surface px-5 py-4 text-sm font-medium"
            >
              {industry.name}
            </li>
          ))}
        </ul>
      </Section>

      {/* ----------------------------------------------------------- TWO PATHWAYS */}
      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            {
              nav: employersNav,
              heading: content.employers.heading,
              lead: content.employers.lead,
              only: "employer" as const,
            },
            {
              nav: jobSeekersNav,
              heading: content.jobSeekers.heading,
              lead: content.jobSeekers.lead,
              only: "jobSeeker" as const,
            },
          ].map((path) => (
            <div
              key={path.nav?.key ?? path.heading}
              className="flex flex-col rounded-card border border-hairline p-8"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                {path.heading}
              </h2>
              <p className="mt-3 flex-1 text-base leading-relaxed text-ink-muted">
                {path.lead}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <CtaGroup only={path.only} />
                {path.nav && (
                  <Link
                    href={path.nav.href}
                    className="text-sm font-medium text-brand-700 underline underline-offset-4"
                  >
                    {path.nav.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <StatsBand />
      <TestimonialsBand heading={content.labels.testimonialsGeneral} />

      <CtaBand
        heading={content.home.intro.heading}
        body={content.home.intro.lead}
      />
    </>
  );
}
