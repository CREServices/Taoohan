import type { Metadata } from "next";
import Image from "next/image";
import { content } from "@/content";
import { NAV_BY_HREF } from "@/config/site.config";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureIcon } from "@/components/sections/FeatureIcon";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: NAV_BY_HREF["/industries"].label };

const PARTNERS = [
  { name: "CarvibeDubai", logo: "/logo/carvibedubai.jpg", href: "https://carvibedubai.com" },
  { name: "Zero Sixty Three", logo: "/logo/zero60.jpg", href: "https://zerosixtythree.com" },
  { name: "The Startup Zone", logo: "/logo/startup.jpg", href: "https://thestartupzone.ae" },
  { name: "Defendoor", logo: "/logo/defendoor.jpg", href: "https://www.defendoor.ae" },
  { name: "FOSS Consultancy", logo: "/logo/fossconsultancy.jpg", href: "https://fossconsultancy.com" },
  { name: "Matech Payment", logo: "/logo/matech.jpg", href: "https://matechpayment.com" },
  { name: "BioTech", logo: "/logo/biotech.jpg", href: "https://biotechae.com" },
  { name: "Get Rome AI", logo: "/logo/ROME AI.jpg", href: "https://getromeai.com" },
  { name: "JDC Prints & Beyond", logo: "/logo/JDC.jpg", href: "https://jdcprintsandbeyond.com" },
  { name: "DP Navigator", logo: "/logo/DP NAVIGATOR.jpg", href: "https://dpnavigator.ae" },
  { name: "Arbab Consultancy", logo: "/logo/ARBAB.jpg", href: "https://arbabconsultancy.com" },
  { name: "Scaform Engineering Services", logo: "/logo/SCAFORM.jpg", href: "https://www.facebook.com/ScaformEngineeringServices/" },
  { name: "Oncall Roadside Assistance", logo: "/logo/Oncall.jpg", href: "https://oncallrsa.com" },
  { name: "Axle Group", logo: "/logo/AXLE.jpg", href: "https://axlegroup.ae" },
] as const;

/**
 * Industries We Serve page.
 *
 * Partners & Clients uses the client-supplied company names, logos, and
 * approved destinations.
 */
export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow={content.industries.eyebrow}
        heading={content.industries.heading}
        lead={content.industries.lead}
      />

      <Section reveal={false}>
        {/* 4 columns: 16 industries divide evenly into 4 full rows, so no
            card is ever left alone on a trailing row. Same glass-card
            treatment as FeatureGrid, kept local since Industry has a
            `name`/`blurb` shape rather than Feature's `title`/`body`. The
            grid breaks out of the page's standard max-w-7xl container (up to
            the 1600px `wide` cap used elsewhere for the header/hero) so each
            card gets more width — height is kept tight (original padding)
            rather than growing along with it. */}
        {/* Split into two groups of 8 (two rows of four each at desktop).
            First group (Facilities → Administration) uses the circular
            two-ring mark; second group (Construction → Retail) uses the
            wide wordmark so the two blocks do not share one backdrop.
            Both boxes are shaped to their source artwork's own aspect
            ratio so `background-size: contain` never crops or squashes
            the PNG. */}
        {(
          [
            { items: content.industries.items.slice(0, 8), className: "industry-rings-behind" },
            { items: content.industries.items.slice(8, 16), className: "industry-mark-behind" },
          ] as const
        ).map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={cn(
              "relative left-1/2 w-screen max-w-[1600px] -translate-x-1/2 px-5 sm:px-6 lg:px-8",
              groupIndex > 0 && "mt-6",
            )}
          >
            <span aria-hidden="true" className={group.className} />
            <ul className="relative grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((industry, indexInGroup) => {
                const index = groupIndex * 8 + indexInGroup;
                return (
                  // A plain relative wrapper, not the card itself: the glow
                  // panel and the frosted card are SIBLINGS here.
                  // `backdrop-filter` only picks up what renders behind an
                  // element's own box, never its own descendants — so the
                  // glow has to sit next to the card, one level up, or the
                  // card would never blur it.
                  <li key={industry.key} className="relative">
                    <span
                      aria-hidden="true"
                      className="industry-glow"
                      style={
                        {
                          "--glow-delay": `${(index % 6) * -1.1}s`,
                        } as React.CSSProperties
                      }
                    />
                    {/* Restored to the site's original glassmorphism
                        treatment — the same one FeatureGrid's default
                        (non-backdrop) cards use. */}
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-card border border-white/60 bg-white/55 p-7 shadow-[0_1px_2px_rgba(38,51,42,0.04),0_12px_28px_-16px_rgba(38,51,42,0.18)] backdrop-blur-md transition-all duration-300 ease-out supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:backdrop-blur-md hover:-translate-y-1 hover:border-brand-300/70 hover:bg-white/70 hover:shadow-[0_1px_2px_rgba(38,51,42,0.06),0_20px_40px_-16px_rgba(38,51,42,0.24)] sm:p-8">
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
                      />
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-200/70 bg-brand-50/80 text-brand-700 transition-colors duration-300 group-hover:border-brand-300 group-hover:bg-brand-100/80">
                        <FeatureIcon itemKey={industry.key} className="h-6 w-6" />
                      </span>
                      <h2 className="mt-5 text-lg font-semibold leading-snug text-ink">
                        {industry.name}
                      </h2>
                      <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
                        {industry.blurb}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Section>

      <Section tone="muted" spacing="tight" containerSize="wide">
        <div className="partner-client-shell">
        <div className="partner-client-heading">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
              {content.industries.partners.eyebrow}
            </h2>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {content.industries.partners.heading}
            </h3>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ink-muted">
            {content.industries.partners.body}
          </p>
        </div>

        <div className="partner-marquee mt-9">
          <div className="partner-marquee-track">
            <ul className="partner-marquee-list" aria-label="Partners and clients">
              {PARTNERS.map((partner) => (
                <li key={partner.name}>
                  <a href={partner.href} target="_blank" rel="noreferrer" className="partner-client-card" aria-label={`Visit ${partner.name}`}>
                    <span className="partner-client-logo" aria-hidden="true">
                      <Image src={partner.logo} alt="" fill sizes="80px" className="object-contain" />
                    </span>
                    <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-snug text-ink sm:text-[0.95rem]">{partner.name}</span>
                    <span className="partner-client-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            {/* A keyboard-hidden duplicate gives the strip its seamless loop. */}
            <ul className="partner-marquee-list" aria-hidden="true">
              {PARTNERS.map((partner) => (
                <li key={`duplicate-${partner.name}`}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={-1}
                    className="partner-client-card"
                  >
                    <span className="partner-client-logo">
                      <Image src={partner.logo} alt="" fill sizes="80px" className="object-contain" />
                    </span>
                    <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-snug text-ink sm:text-[0.95rem]">{partner.name}</span>
                    <span className="partner-client-arrow">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </Section>

      <CtaBand
        heading={content.industries.ctaHeading}
        body={content.industries.ctaBody}
        only="employer"
      />
    </>
  );
}
