import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { TestimonialsBand } from "@/components/sections/TestimonialsBand";
import { CtaBand } from "@/components/sections/CtaBand";
import { EmptySlot } from "@/components/ui/EmptySlot";

export const metadata: Metadata = { title: NAV_BY_HREF["/for-employers"].label };

/**
 * Employer-facing page.
 *
 * ⚠️ SCOPE: Developer 1 builds this page's layout and copy slots and PLACES the
 * "Request Staffing & Manpower" button. The request-manpower flow logic itself
 * (category selector, submission handling) is Developer 2's work and is not
 * implemented here.
 */
export default function ForEmployersPage() {
  return (
    <>
      <PageHero
        eyebrow={content.employers.eyebrow}
        heading={content.employers.heading}
        lead={content.employers.lead}
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-base leading-relaxed text-ink-muted">
            {content.employers.body}
          </p>
        </div>
        <FeatureGrid items={content.employers.steps} numbered className="mt-10" />
      </Section>

      <Section tone="muted">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.services.heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {content.services.lead}
          </p>
        </div>
        <FeatureGrid items={content.services.items.slice(0, 6)} className="mt-10" />
      </Section>

      <Section spacing="tight">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {content.labels.manpowerCategories}
        </h2>
        {/* BLOCKED ON CLIENT: the categories list is sent as a separate file.
            The employer selector that consumes it is Developer 2's scope. */}
        <EmptySlot
          className="mt-6"
          label="manpower categories list"
          note="Client is sending this as a separate file. The employer selector built on it is Developer 2's scope."
        />
      </Section>

      <TestimonialsBand heading={content.labels.testimonialsEmployers} />

      <CtaBand
        heading={content.employers.heading}
        body={content.employers.lead}
        only="employer"
      />
    </>
  );
}
