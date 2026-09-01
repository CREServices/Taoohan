import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = { title: NAV_BY_HREF["/services"].label };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={content.services.eyebrow}
        heading={content.services.heading}
        lead={content.services.lead}
      />

      <Section reveal={false} className="services-core-section">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          {content.services.coreHeading}
        </h2>
        <FeatureGrid items={content.services.items} numbered backdrop className="mt-6" />
      </Section>

      <Section tone="muted" reveal={false}>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            {content.services.processHeading}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.services.processTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {content.services.processLead}
          </p>
        </div>
        <FeatureGrid items={content.services.steps} numbered className="mt-10" />
      </Section>

      <CtaBand
        heading={content.services.ctaHeading}
        body={content.services.ctaBody}
      />
    </>
  );
}
