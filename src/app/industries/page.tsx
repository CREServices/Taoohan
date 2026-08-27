import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureIcon } from "@/components/sections/FeatureIcon";

export const metadata: Metadata = { title: NAV_BY_HREF["/industries"].label };

/**
 * TEMPORARY letter placeholders for the Partners & Clients logo row — the one
 * exception the client explicitly authorised to the "no invented names/logos"
 * rule ("please use A, B, C, X, Y, and Z as temporary placeholder logos ...
 * these will be replaced with the confirmed company names and approved logos
 * once provided"). This is decorative UI, not client-supplied data, so it is
 * a local constant rather than a `content.partners` entry — `content.partners`
 * stays a real empty slot like every other blocked field until real logos
 * are supplied.
 */
const PARTNER_PLACEHOLDER_LABELS = ["A", "B", "C", "X", "Y", "Z"] as const;

/**
 * Industries We Serve page.
 *
 * Partners & Clients uses TEMPORARY letter placeholders (A, B, C, X, Y, Z)
 * for logos — the one exception the client explicitly authorised to the
 * "no invented names/logos" rule. Real company names and logos stay on hold
 * until supplied.
 */
export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow={content.industries.eyebrow}
        heading={content.industries.heading}
        lead={content.industries.lead}
      />

      <Section>
        {/* 4 columns: 16 industries divide evenly into 4 full rows, so no
            card is ever left alone on a trailing row. Same glass-card
            treatment as FeatureGrid, kept local since Industry has a
            `name`/`blurb` shape rather than Feature's `title`/`body`. The
            grid breaks out of the page's standard max-w-7xl container (up to
            the 1600px `wide` cap used elsewhere for the header/hero) so each
            card gets more width — height is kept tight (original padding)
            rather than growing along with it. */}
        <ul className="relative left-1/2 grid w-screen max-w-[1600px] -translate-x-1/2 items-stretch gap-6 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {content.industries.items.map((industry, index) => (
            <li
              key={industry.key}
              data-reveal
              style={
                {
                  "--reveal-delay": `${Math.min(index, 5) * 70}ms`,
                } as React.CSSProperties
              }
              className="group relative flex flex-col overflow-hidden rounded-card border border-white/60 bg-white/55 p-7 shadow-[0_1px_2px_rgba(38,51,42,0.04),0_12px_28px_-16px_rgba(38,51,42,0.18)] backdrop-blur-md transition-all duration-300 ease-out supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:backdrop-blur-md hover:-translate-y-1 hover:border-brand-300/70 hover:bg-white/70 hover:shadow-[0_1px_2px_rgba(38,51,42,0.06),0_20px_40px_-16px_rgba(38,51,42,0.24)] sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-200/70 bg-brand-50/80 text-brand-700 transition-colors duration-300 group-hover:border-brand-300 group-hover:bg-brand-100/80">
                <FeatureIcon itemKey={industry.key} className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-lg font-semibold leading-snug text-ink">
                {industry.name}
              </h2>
              <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
                {industry.blurb}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" spacing="tight">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          {content.industries.partners.eyebrow}
        </h2>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.industries.partners.heading}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          {content.industries.partners.body}
        </p>

        {/* Temporary placeholder logos — client-authorised A, B, C, X, Y, Z,
            clearly marked as temporary. Swapped for real logos once approved. */}
        <ul className="mt-8 flex flex-wrap justify-center gap-4" aria-label="Temporary placeholder partner logos">
          {PARTNER_PLACEHOLDER_LABELS.map((label) => (
            <li
              key={label}
              data-placeholder-logo={label}
              className="flex h-16 w-16 items-center justify-center rounded-card border border-dashed border-hairline bg-surface text-xl font-semibold text-ink-muted"
              title="Temporary placeholder — real logo to be supplied"
            >
              {label}
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        heading={content.industries.ctaHeading}
        body={content.industries.ctaBody}
        only="employer"
      />
    </>
  );
}
