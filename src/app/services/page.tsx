import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: NAV_BY_HREF["/services"].label,
  description: content.services.lead,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={content.services.eyebrow}
        heading={content.services.heading}
        lead={content.services.lead}
      />

      {/* The full list renders from the content layer — the card count follows
          the data, so adding or removing a service needs no layout change. */}
      <Section>
        <FeatureGrid items={content.services.items} />
      </Section>

      <Section tone="muted">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.employers.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {content.employers.body}
          </p>
        </div>
        <FeatureGrid items={content.employers.steps} numbered className="mt-10" />
      </Section>

      <CtaBand
        heading={content.services.heading}
        body={content.services.lead}
      />
    </>
  );
}
