import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { MANPOWER_CATEGORIES } from "@/config/manpower";
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
        {/* Data-driven from the same config the Request Manpower selector
            reads, so filling in that one file lights up both surfaces.
            BLOCKED ON CLIENT: the list is promised as a separate file. */}
        {MANPOWER_CATEGORIES.length > 0 ? (
          <ul
            data-testid="manpower-categories"
            className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {MANPOWER_CATEGORIES.map((category) => (
              <li
                key={category.key}
                className="rounded-card border border-hairline bg-surface px-5 py-4 text-sm font-medium"
              >
                {category.label}
              </li>
            ))}
          </ul>
        ) : (
          <EmptySlot
            className="mt-6"
            label="manpower categories list"
            note="Client is sending this as a separate file. The Request Manpower selector reads the same config and falls back to a free-text field until it arrives."
          />
        )}
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
