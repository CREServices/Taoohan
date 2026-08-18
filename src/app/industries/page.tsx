import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { EmptySlot } from "@/components/ui/EmptySlot";

export const metadata: Metadata = { title: NAV_BY_HREF["/industries"].label };

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow={content.industries.eyebrow}
        heading={content.industries.heading}
        lead={content.industries.lead}
      />

      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Partners and clients
        </h2>
        {content.partners.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {content.partners.map((partner) => (
              <li
                key={partner.key}
                className="rounded-pill border border-hairline bg-surface px-4 py-2 text-sm"
              >
                {partner.name}
              </li>
            ))}
          </ul>
        ) : (
          <EmptySlot
            className="mt-6 bg-surface"
            label="partner and client names"
            note="Client answered “TBD, please remind me to send this.”"
          />
        )}
      </Section>

      <CtaBand
        heading={content.industries.heading}
        body={content.industries.lead}
      />
    </>
  );
}
