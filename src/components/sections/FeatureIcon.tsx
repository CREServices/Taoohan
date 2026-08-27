/**
 * Icon set for FeatureGrid cards, keyed by `Feature.key`. Inline SVG rather
 * than an icon library dependency — the set is small, fixed, and content-
 * driven from `src/content`, so a lookup table is the entire integration.
 *
 * `fallback` covers any key without a specific glyph (e.g. future content
 * additions) with a neutral "badge" mark rather than rendering nothing.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

type IconRender = (p: IconProps) => React.ReactElement;

const icons: Record<string, IconRender> = {
  // Home value props
  "quality-talent": (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 20c.9-3.2 3.4-5 6.5-5s5.6 1.8 6.5 5" />
      <path d="M17.5 5.5l1.2 1.2 2-2.1" />
    </Base>
  ),
  "fast-reliable": (p: IconProps) => (
    <Base {...p}>
      <path d="M13 3 5 13.5h5.5L11 21l8-11h-5.5z" />
    </Base>
  ),
  "flexible-staffing": (p: IconProps) => (
    <Base {...p}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M8 11v2a3 3 0 0 0 3 3h2" />
      <path d="M16 13v-2a3 3 0 0 0-3-3h-2" />
    </Base>
  ),
  // Core services / employer solutions
  "manpower-supply": (p: IconProps) => (
    <Base {...p}>
      <circle cx="9" cy="7" r="2.75" />
      <path d="M3.5 20c.7-3 2.8-4.75 5.5-4.75s4.8 1.75 5.5 4.75" />
      <path d="M16 8.25a2.5 2.5 0 1 1 0-5" />
      <path d="M15.5 20c.5-2.4 1.9-4.05 3.9-4.6" />
    </Base>
  ),
  "recruitment-staffing": (p: IconProps) => (
    <Base {...p}>
      <rect x="4" y="6" width="16" height="13" rx="2" />
      <path d="M9 6V5a3 3 0 0 1 6 0v1" />
      <path d="M4 12h16" />
    </Base>
  ),
  "talent-sourcing": (p: IconProps) => (
    <Base {...p}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5.5 5.5" />
    </Base>
  ),
  "screening-shortlisting": (p: IconProps) => (
    <Base {...p}>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 9.5l1.8 1.8L14.5 8" />
      <path d="M8.5 15.5h7" />
    </Base>
  ),
  "screening-shortlisting-2": (p: IconProps) => icons["screening-shortlisting"](p),
  "contract-staffing": (p: IconProps) => (
    <Base {...p}>
      <path d="M7 3.5h8l3 3V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M9 12.5l2 2 4-4.5" />
    </Base>
  ),
  "temp-permanent": (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </Base>
  ),
  // Recruitment process steps
  understand: (p: IconProps) => (
    <Base {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.2 16.2 21 21" />
    </Base>
  ),
  strategy: (p: IconProps) => (
    <Base {...p}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </Base>
  ),
  source: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </Base>
  ),
  screen: (p: IconProps) => icons["screening-shortlisting"](p),
  interview: (p: IconProps) => (
    <Base {...p}>
      <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-5 4V5z" />
      <path d="M18 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3" />
    </Base>
  ),
  placement: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3v12" />
      <path d="M7.5 9 12 4.5 16.5 9" />
      <path d="M4.5 15.5V19a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5" />
    </Base>
  ),
  // Employer journey (for-employers steps)
  "share-requirements": (p: IconProps) => (
    <Base {...p}>
      <path d="M5 4.5h10l4 4V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z" />
      <path d="M8.5 12h7M8.5 15.5h5" />
    </Base>
  ),
  "candidate-sourcing": (p: IconProps) => icons["talent-sourcing"](p),
  "interview-selection": (p: IconProps) => icons.interview(p),
  "candidate-selection": (p: IconProps) => (
    <Base {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.7-3 2.7-4.75 5.5-4.75s4.8 1.75 5.5 4.75" />
      <path d="M16.5 9.5l2 2 3.5-4" />
    </Base>
  ),
  "placement-onboarding": (p: IconProps) => icons.placement(p),
  // Job seeker journey
  "send-cv": (p: IconProps) => (
    <Base {...p}>
      <path d="M6 3.5h9l3 3V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M9 14l3-3 3 3M12 11v7" />
    </Base>
  ),
  "profile-review": (p: IconProps) => icons.understand(p),
  "interview-opportunities": (p: IconProps) => icons.interview(p),
  "selection-placement": (p: IconProps) => icons.placement(p),
  "prepare-cv": (p: IconProps) => icons["send-cv"](p),
  "send-via-whatsapp": (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3.5a8.25 8.25 0 0 0-7.1 12.4L4 20.5l4.7-1.2A8.25 8.25 0 1 0 12 3.5z" />
      <path d="M9 9.6c.1-.7.6-.9 1-.9.4 0 .7.1.9.6.2.5.6 1.5.6 1.7 0 .2 0 .4-.2.6-.2.3-.4.5-.5.6-.2.2-.3.4-.1.7.2.4.8 1.2 1.7 1.9 1.1.9 2 1.2 2.4 1.3.3.1.5.1.7-.1.2-.2.6-.7.8-1 .2-.2.4-.2.6-.1.3.1 1.7.8 2 .9.3.2.5.2.6.4.1.2.1.9-.2 1.5-.3.6-1.5 1.2-2.1 1.3-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.8-2.1 1.1-2.4z" />
    </Base>
  ),
  "wait-for-opportunities": (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l2.5 1.5" />
    </Base>
  ),
  // Industries
  construction: (p: IconProps) => (
    <Base {...p}>
      <path d="M4 20V10l8-5 8 5v10" />
      <path d="M9 20v-6h6v6" />
    </Base>
  ),
  healthcare: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 21s-7-4.3-9.5-8.7C.8 8.6 2.6 5 6 5c2 0 3.4 1 4 2.3.6-1.3 2-2.3 4-2.3 3.4 0 5.2 3.6 3.5 7.3C19 16.7 12 21 12 21z" />
      <path d="M12 8v5M9.5 10.5h5" />
    </Base>
  ),
  "it-technology": (p: IconProps) => (
    <Base {...p}>
      <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </Base>
  ),
  engineering: (p: IconProps) => (
    <Base {...p}>
      <path d="M14.5 3.5 20.5 9.5 9.5 20.5 3.5 14.5z" />
      <path d="M13 8l3 3" />
    </Base>
  ),
  hospitality: (p: IconProps) => (
    <Base {...p}>
      <path d="M4 19V9.5a4 4 0 0 1 8 0" />
      <path d="M12 19V9.5a4 4 0 0 1 4-4c2 0 4 1.5 4 4.5V19" />
      <path d="M3 19h18" />
    </Base>
  ),
  "logistics-transportation": (p: IconProps) => (
    <Base {...p}>
      <rect x="2.5" y="7" width="12" height="9" rx="1.2" />
      <path d="M14.5 10h3.5l3 3v3h-6.5z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </Base>
  ),
  manufacturing: (p: IconProps) => (
    <Base {...p}>
      <path d="M3.5 20V11l5 3.5V11l5 3.5V11l5.5 3.5V20z" />
      <path d="M3.5 20h17" />
    </Base>
  ),
  "retail-sales": (p: IconProps) => (
    <Base {...p}>
      <path d="M4.5 8.5h15l-1.2 10a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3z" />
      <path d="M8.5 8.5v-2a3.5 3.5 0 0 1 7 0v2" />
    </Base>
  ),
  "facilities-management": (p: IconProps) => (
    <Base {...p}>
      <path d="M14.5 3.5 12 6l6 6-2.5 2.5-6-6L7 11l7 7-2.5 2.5L3 12l3.5-3.5" />
    </Base>
  ),
  "real-estate": (p: IconProps) => (
    <Base {...p}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" />
      <path d="M10 20.5V15h4v5.5" />
    </Base>
  ),
  aviation: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3v18M4 9l8-2 8 2M6 15l6-1.5L18 15" />
    </Base>
  ),
  "banking-financial-services": (p: IconProps) => (
    <Base {...p}>
      <path d="M3.5 9.5 12 4l8.5 5.5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3.5 19.5h17" />
    </Base>
  ),
  "oil-gas-energy": (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3s4 4.5 4 8.5a4 4 0 1 1-8 0C8 7.5 12 3 12 3z" />
      <path d="M12 12.5c0 1-.8 1.5-1.5 1.5" />
    </Base>
  ),
  education: (p: IconProps) => (
    <Base {...p}>
      <path d="M2.5 8 12 4l9.5 4-9.5 4-9.5-4z" />
      <path d="M6 10.5V16c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7v-5.5" />
    </Base>
  ),
  telecommunications: (p: IconProps) => (
    <Base {...p}>
      <path d="M5 12.5a7 7 0 0 1 14 0" />
      <path d="M8 15a3.5 3.5 0 0 1 8 0" />
      <circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none" />
    </Base>
  ),
  "administration-office-support": (p: IconProps) => (
    <Base {...p}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M8 9h8M8 12.5h8M8 16h5" />
    </Base>
  ),
} satisfies Record<string, (p: IconProps) => React.ReactElement>;

const fallback = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 8v5" />
    <circle cx="12" cy="15.75" r="0.1" fill="currentColor" stroke="none" />
  </Base>
);

export function FeatureIcon({
  itemKey,
  className,
}: {
  itemKey: string;
  className?: string;
}) {
  const Render = (icons as Record<string, ((p: IconProps) => React.ReactElement) | undefined>)[itemKey] ?? fallback;
  return <Render className={className} />;
}
