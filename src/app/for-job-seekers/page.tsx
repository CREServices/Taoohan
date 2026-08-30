import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { CONTACT, hasValue, whatsappHref } from "@/config/contact";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { RecruitmentProcessLoop } from "@/components/sections/RecruitmentProcessLoop";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: NAV_BY_HREF["/for-job-seekers"].label,
};

export default function ForJobSeekersPage() {
  const whatsappLink = whatsappHref("Hi, I'd like to submit my CV.");

  return (
    <>
      <PageHero
        eyebrow={content.jobSeekers.eyebrow}
        heading={content.jobSeekers.heading}
        lead={content.jobSeekers.lead}
      />

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.jobSeekers.journeyHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {content.jobSeekers.journeyLead}
          </p>
        </div>
        {/*
          The journey, twice over and deliberately so: the cards on the left
          say what happens to a candidate, and the loop on the right shows the
          recruitment process those steps run through. They are different
          lists — four candidate-facing steps against the client's six
          approved process steps — so neither restates the other.

          The cards run TWO ACROSS, so the four of them are two rows rather
          than four — a single stacked column made this one section taller
          than the rest of the page put together.

          The split is an EVEN half, and deliberately the same
          `lg:grid-cols-2 lg:gap-16` the About page uses, because the loop has
          to come out the same size on both pages. It is the same drawing of
          the same process; rendering it smaller here would read as a lesser
          version of it rather than the same thing seen again. Matching the
          structure rather than hand-tuning a width means the two stay equal
          at every viewport, not just the one they were checked at.
        */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <FeatureGrid items={content.jobSeekers.steps} numbered columns={2} />
          </div>
          <div>
            {/*
              `start="left"` — step one sits at the loop's leftmost point and
              the sequence drops to the bottom of the ring before rising
              through the crossing. The About page keeps the default centre
              start; the two pages differ on purpose.
            */}
            <RecruitmentProcessLoop
              steps={content.services.steps}
              start="left"
              className="mx-auto max-w-md lg:max-w-none"
            />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              {content.jobSeekers.applyHeading}
            </h2>
            <ol className="mt-6 space-y-6">
              {content.jobSeekers.applySteps.map((step, index) => (
                <li key={step.key} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-brand-700 text-sm font-semibold text-ink-inverse">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-hairline bg-surface p-8 lg:sticky lg:top-28">
              <h2 className="text-xl font-semibold tracking-tight">
                {content.jobSeekers.applySidebarHeading}
              </h2>
              {hasValue(CONTACT.whatsapp) ? (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    Send your CV directly to our official WhatsApp number: {CONTACT.whatsapp}.
                  </p>
                  <Button href={whatsappLink!} size="lg" className="mt-6 w-full">
                    Message Us on WhatsApp
                  </Button>
                </>
              ) : (
                <p
                  data-empty-slot="whatsapp"
                  className="mt-3 text-sm italic text-ink-muted"
                >
                  Awaiting client details
                </p>
              )}
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand
        heading={content.jobSeekers.ctaHeading}
        body={content.jobSeekers.ctaBody}
        only="jobSeeker"
      />
    </>
  );
}
