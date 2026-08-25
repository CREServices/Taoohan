import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { CONTACT, hasValue, whatsappHref } from "@/config/contact";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CtaBand } from "@/components/sections/CtaBand";
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
        <FeatureGrid items={content.jobSeekers.steps} numbered columns={2} className="mt-10" />
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
