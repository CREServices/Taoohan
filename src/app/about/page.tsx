import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { RecruitmentProcessLoop } from "@/components/sections/RecruitmentProcessLoop";

export const metadata: Metadata = { title: NAV_BY_HREF["/about"].label };

/**
 * About Us page.
 *
 * MILESTONE 2: Company Statistics, Certifications & Licences, and the Team
 * Photograph section are all removed. The Team Photograph section carries no
 * stock photography as a stand-in ("we currently do not have an official
 * company/team photograph ... please do not use stock photography as a
 * temporary replacement").
 *
 * "Trusted By" briefly stood in for those three sections and has since been
 * removed at the client's request — it was an empty partner-logo slot with
 * nothing confirmed to put in it. Partner names and logos are still awaited;
 * the Industries page carries the client-authorised temporary letter tiles.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={content.about.eyebrow}
        heading={content.about.heading}
        lead={content.about.lead}
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-3xl space-y-5">
            {content.about.body.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
          {/* The client's approved recruitment process, drawn as a loop.
              Steps come from the content layer (the same six the Services
              page lists in full) so the process is stated in one place. */}
          <RecruitmentProcessLoop
            steps={content.services.steps}
            className="mx-auto max-w-md lg:max-w-none"
          />
        </div>
      </Section>

      <Section tone="muted">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.about.approachHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {content.about.approachLead}
          </p>
        </div>
        <FeatureGrid items={content.about.values} className="mt-10" />
      </Section>

      {/*
        Team Photograph — REMOVED ENTIRELY per the client's instruction.
        No stock photography is used as a stand-in. Add back once an
        official company/team photograph is supplied.
      */}

      <CtaBand
        heading={content.home.intro.heading}
        body={content.home.intro.lead}
      />
    </>
  );
}
