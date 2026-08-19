import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { CONTACT, SOCIALS, hasValue } from "@/config/contact";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { CtaGroup } from "@/components/cta/CtaGroup";
import { EmptySlot } from "@/components/ui/EmptySlot";

export const metadata: Metadata = {
  title: NAV_BY_HREF["/contact"].label,
  description: content.contact.lead,
};

/** One row of contact detail, or a marked empty slot when still blocked. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-hairline py-4 last:border-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="mt-1 text-base">
        {hasValue(value) ? (
          value
        ) : (
          <span
            data-empty-slot={label.toLowerCase()}
            className="italic text-ink-muted"
          >
            Awaiting client details
          </span>
        )}
      </dd>
    </div>
  );
}

export default function ContactPage() {
  const socialsPending = SOCIALS.every((social) => !hasValue(social.href));

  return (
    <>
      <PageHero
        eyebrow={content.contact.eyebrow}
        heading={content.contact.heading}
        lead={content.contact.lead}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-ink-muted">
              {content.contact.body}
            </p>

            {/* Every value below is an empty typed slot — client marked all
                contact fields "TBD" on the intake form. Nothing invented. */}
            <dl className="mt-8">
              <DetailRow label="Email" value={CONTACT.email} />
              <DetailRow label="Phone" value={CONTACT.phone} />
              <DetailRow label="WhatsApp" value={CONTACT.whatsapp} />
              <DetailRow label="Address" value={CONTACT.address} />
              <DetailRow label="Office hours" value={CONTACT.hours} />
            </dl>

            {socialsPending && (
              <EmptySlot
                className="mt-8"
                label="social media links"
                note="Not yet supplied by the client."
              />
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-hairline bg-surface-muted p-8">
              <h2 className="text-xl font-semibold tracking-tight">
                {content.home.intro.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {content.home.intro.lead}
              </p>
              <CtaGroup className="mt-6" size="lg" />
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand heading={content.contact.heading} body={content.contact.lead} />
    </>
  );
}
