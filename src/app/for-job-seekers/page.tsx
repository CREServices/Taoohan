import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { CtaGroup } from "@/components/cta/CtaGroup";

export const metadata: Metadata = {
  title: NAV_BY_HREF["/for-job-seekers"].label,
};

/**
 * Job-seeker page.
 *
 * ⚠️ MILESTONE 1: the "Submit Your CV" button here is a PLACEHOLDER. The real
 * two-step Apply Now modal (details → WhatsApp or Email via Nodemailer) is
 * built in Milestone 3. The instruction list below is already data-driven so
 * Milestone 3 only has to supply real strings.
 */
export default function ForJobSeekersPage() {
  return (
    <>
      <PageHero
        eyebrow={content.jobSeekers.eyebrow}
        heading={content.jobSeekers.heading}
        lead={content.jobSeekers.lead}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-ink-muted">
              {content.jobSeekers.body}
            </p>
            <FeatureGrid
              items={content.jobSeekers.steps}
              numbered
              columns={2}
              className="mt-10"
            />
          </div>

          {/* How to apply — instructions come from the content layer. */}
          <aside className="lg:col-span-5">
            <div className="rounded-card border border-hairline bg-surface-muted p-8 lg:sticky lg:top-28">
              <h2 className="text-xl font-semibold tracking-tight">
                How to apply
              </h2>
              <ol className="mt-5 space-y-4">
                {content.jobSeekers.applyInstructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-brand-900 text-xs font-semibold text-ink-inverse">
                      {index + 1}
                    </span>
                    <span className="text-ink-muted">{instruction}</span>
                  </li>
                ))}
              </ol>
              <CtaGroup className="mt-7" size="lg" only="jobSeeker" />
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand
        heading={content.jobSeekers.heading}
        body={content.jobSeekers.lead}
        only="jobSeeker"
      />
    </>
  );
}
