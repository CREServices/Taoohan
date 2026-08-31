import Link from "next/link";
import { content } from "@/content";
import { Section } from "@/components/ui/Section";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { FrostedHero } from "@/components/sections/FrostedHero";
import { Button } from "@/components/ui/Button";

/**
 * Home page.
 *
 * MILESTONE 2: rebuilt against the approved "Taoohan Website Content & Copy"
 * document. Structural changes from Milestone 1:
 *   - Hero collapses to a SINGLE CTA ("Become Our Partner") behind a
 *     frosted-glass panel, replacing the old two-button video hero.
 *   - Company Statistics and Testimonials are HIDDEN — both are explicitly
 *     on hold per the client ("do not add or invent any figures" /
 *     "do not create placeholder reviews"). Re-enable by importing
 *     `StatsBand` / `TestimonialsBand` again once real data lands in
 *     `content.stats` / `content.testimonials`.
 *
 * "What We Do", the Services preview and the Industries preview carry
 * forward from the Milestone 1 / 3 section structure (see those branches) —
 * only their copy source changed, to the approved content layer. Nothing
 * here is invented: all three read from `content.about` / `content.services`
 * / `content.industries`, the same real copy used on their own pages.
 */
export default function HomePage() {
  return (
    <>
      <FrostedHero />

      {/* -------------------------------------------------------- WHY TAOOHAN */}
      <Section reveal={false}>
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
        <FeatureGrid items={content.home.features} backdrop="full-image" className="mt-10" />
      </Section>

      {/* ------------------------------------------------------------ WHAT WE DO */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.about.heading}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {content.about.body.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- SERVICES */}
      <Section reveal={false}>
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
            {content.services.coreHeading}
          </Link>
        </div>
        <FeatureGrid items={content.services.items} numbered backdrop className="mt-10" />
      </Section>

      {/* ------------------------------------------------------------ INDUSTRIES */}
      <Section tone="muted" reveal={false}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.industries.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              {content.industries.lead}
            </p>
          </div>
          <Link
            href="/industries"
            className="text-sm font-medium text-brand-700 underline underline-offset-4"
          >
            {content.industries.eyebrow}
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
      <Section reveal={false}>
        <div className="grid gap-5 lg:grid-cols-2">
          {[content.home.employerCard, content.home.jobSeekerCard].map((card) => (
            <div
              key={card.heading}
              className="flex flex-col rounded-card border border-hairline bg-surface p-8"
            >
              <h2 className="text-2xl font-semibold tracking-tight">{card.heading}</h2>
              <p className="mt-3 flex-1 text-base leading-relaxed text-ink-muted">
                {card.body}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href={card.ctaHref} size="md">
                  {card.ctaLabel}
                </Button>
                <a
                  href={card.linkHref}
                  className="text-sm font-medium text-brand-700 underline underline-offset-4"
                >
                  {card.linkLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/*
        Company Statistics — HIDDEN. Client: "do not add or invent any
        figures." Re-enable <StatsBand /> once content.stats is populated.
      */}
      {/*
        Testimonials — HIDDEN. Client: "we will provide genuine testimonials
        once available ... do not create placeholder reviews." Re-enable
        <TestimonialsBand /> once content.testimonials is populated.
      */}

      <CtaBand
        heading={content.home.finalCta.heading}
        body={content.home.finalCta.body}
      />
    </>
  );
}
