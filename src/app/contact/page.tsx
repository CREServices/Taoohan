import type { Metadata } from "next";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { mailtoHref, whatsappHref, hasValue } from "@/config/contact";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: NAV_BY_HREF["/contact"].label };

/**
 * Contact Us page.
 *
 * MILESTONE 2: Address and Office Hours sections are REMOVED per the
 * client's Developer Notes ("Remove the Address section for now" / "Remove
 * the Office Hours section for now"). Social Media stays HIDDEN — links are
 * TBD and the client explicitly asked that no placeholder links be created.
 */
export default function ContactPage() {
  const channels = [
    {
      key: "email",
      label: "Email",
      value: content.contact.channels.email.label,
      note: content.contact.channels.email.note,
      href: mailtoHref(),
    },
    {
      key: "phone",
      label: "Phone",
      value: content.contact.channels.phone.label,
      note: content.contact.channels.phone.note,
      href: `tel:${content.contact.channels.phone.label.replace(/\s+/g, "")}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      value: content.contact.channels.whatsapp.label,
      note: content.contact.channels.whatsapp.note,
      href: whatsappHref(),
      cta: content.contact.channels.whatsapp.ctaLabel,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={content.contact.eyebrow}
        heading={content.contact.heading}
        lead={content.contact.lead}
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-base leading-relaxed text-ink-muted">
            {content.contact.body}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {channels.map((channel) => (
            <li key={channel.key} className="rounded-card border border-hairline p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                {channel.label}
              </h2>
              {channel.href && hasValue(channel.value) ? (
                <a
                  href={channel.href}
                  className="mt-2 block text-lg font-semibold text-ink hover:text-brand-700"
                >
                  {channel.value}
                </a>
              ) : (
                <span
                  data-empty-slot={channel.label.toLowerCase()}
                  className="mt-2 block text-sm italic text-ink-muted"
                >
                  Awaiting client details
                </span>
              )}
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {channel.note}
              </p>
              {channel.cta && channel.href && (
                <Button href={channel.href} size="md" className="mt-4">
                  {channel.cta}
                </Button>
              )}
            </li>
          ))}
        </ul>

        {/*
          Social Media — HIDDEN. Client: "Social media links are TBD ...
          please do not create or add placeholder social media links."
          Re-enable once the client supplies confirmed accounts/links.
        */}

        {/*
          Address and Office Hours — REMOVED per the client's Developer
          Notes ("Remove the Address section for now" / "Remove the Office
          Hours section for now").
        */}
      </Section>

      <Section tone="muted" spacing="tight">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.contact.secondaryHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {content.contact.secondaryBody}
          </p>
        </div>
      </Section>

      <CtaBand heading={content.contact.heading} body={content.contact.lead} />
    </>
  );
}
