import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = { title: NAV_BY_HREF["/for-employers"].label };

/**
 * Employer-facing page.
 *
 * ⚠️ SCOPE: this page's layout and copy is Milestone 2 / Developer 1 work.
 * "MANPOWER CATEGORIES YOU CAN REQUEST" is explicitly Developer 2's scope
 * per the client's Developer Note, AND the client asked that it stay hidden
 * from the live site until Developer 2 builds it ("please hide" rather than
 * show an awaiting-content placeholder to visitors). The section is left
 * commented out below — a labeled anchor for Developer 2 to find and build
 * on, with `id="manpower-categories"` preserved for any nav link that
 * already points at it — but nothing renders until it's uncommented.
 */
export default function ForEmployersPage() {
  return (
    <>
      <PageHero
        eyebrow={content.employers.eyebrow}
        heading={content.employers.heading}
        lead={content.employers.lead}
      />

      <Section reveal={false}>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.employers.processHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {content.employers.processLead}
          </p>
        </div>
        <FeatureGrid items={content.employers.steps} numbered backdrop className="mt-10" />
      </Section>

      <Section tone="muted" reveal={false}>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.employers.solutionsHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {content.employers.solutionsLead}
          </p>
        </div>
        <FeatureGrid items={content.employers.solutions} className="mt-10" />
      </Section>

      {/*
        MANPOWER CATEGORIES YOU CAN REQUEST — HIDDEN per the client's
        instruction. Developer 2's scope: the manpower categories list will
        be supplied separately, and the selector built on it. Uncomment this
        section (and re-add `import { EmptySlot } from
        "@/components/ui/EmptySlot";` above) once that work starts —
        `id="manpower-categories"` is preserved here so any nav anchor
        already pointing at it keeps working the moment it's restored.

        <Section id="manpower-categories" spacing="tight">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.labels.manpowerCategories}
          </h2>
          <EmptySlot
            className="mt-6"
            label="manpower categories selector"
            note="Developer Note: the manpower categories list will be supplied separately. This section and selector are Developer 2's scope."
          />
        </Section>
      */}

      <CtaBand
        heading={content.employers.ctaHeading}
        body={content.employers.ctaBody}
        only="employer"
      />
    </>
  );
}
