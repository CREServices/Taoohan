import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";

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
            card is ever left alone on a trailing row. */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.industries.items.map((industry) => (
            <li
              key={industry.key}
              className="rounded-card border border-hairline p-6 transition-colors hover:border-brand-300"
            >
              <h2 className="text-lg font-semibold">{industry.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
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
