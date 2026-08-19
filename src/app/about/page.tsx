import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";
import { EmptySlot } from "@/components/ui/EmptySlot";
import { SiteImage } from "@/components/ui/SiteImage";
import { IMAGES } from "@/config/images";

export const metadata: Metadata = { title: NAV_BY_HREF["/about"].label };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={content.about.eyebrow}
        heading={content.about.heading}
        lead={content.about.lead}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-7">
            {content.about.body.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Photography slot — Developer 2 scope, config-driven. */}
          <div className="lg:col-span-5">
            <SiteImage slot={IMAGES.aboutTeam} />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.home.intro.heading}
        </h2>
        <FeatureGrid items={content.about.values} className="mt-10" />
      </Section>

      <StatsBand />

      <Section spacing="tight">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {content.labels.certifications}
        </h2>
        {content.certifications.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {content.certifications.map((certification) => (
              <li
                key={certification}
                className="rounded-pill border border-hairline px-4 py-2 text-sm"
              >
                {certification}
              </li>
            ))}
          </ul>
        ) : (
          <EmptySlot
            className="mt-6"
            label="certifications and licences"
            note="Not yet supplied by the client."
          />
        )}
      </Section>

      <CtaBand
        heading={content.home.intro.heading}
        body={content.home.intro.lead}
      />
    </>
  );
}
