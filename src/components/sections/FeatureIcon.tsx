/**
 * Icon set for FeatureGrid cards, keyed by `Feature.key`. Inline SVG rather
 * than an icon library dependency — the set is small, fixed, and content-
 * driven from `src/content`, so a lookup table is the entire integration.
 *
 * EVERY GLYPH IS PICKED FOR ITS CARD'S TITLE, and no two cards that appear in
 * the same grid share one. That is a rule the set previously broke in three
 * ways, all of which are fixed here:
 *
 *   Malformed paths. "Manpower Supply" drew its second figure as a half-arc,
 *   so it rendered as a lone person beside a squiggle; "Facilities Management"
 *   drew overlapping strokes that read as a scribble.
 *
 *   Wrong metaphors. "Source & Identify Candidates" was a sun/starburst,
 *   "Aviation" a mast with two chevrons, "Engineering" an unlabelled diamond.
 *
 *   Collisions. "Construction" reused the Real Estate house, "Contract
 *   Staffing" reused the screening clipboard, and a bare magnifying glass
 *   stood in for four separate cards.
 *
 * Aliases below are deliberate: where two pages genuinely name the SAME step
 * ("Interview & Selection" on both the services and employer journeys) they
 * share a glyph, because they never appear in the same grid.
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
  // --- Home value props / About values ---------------------------------
  "quality-talent": (p: IconProps) => (
    // A vetted person: figure plus approval tick.
    <Base {...p}>
      <circle cx="10" cy="8" r="3.25" />
      <path d="M4 20c.8-3.3 3.1-5.15 6-5.15 1.05 0 2 .24 2.85.7" />
      <path d="M15.5 16.8l1.9 1.9 3.6-4" />
    </Base>
  ),
  "fast-reliable": (p: IconProps) => (
    <Base {...p}>
      <path d="M13 3 5 13.5h5.5L11 21l8-11h-5.5z" />
    </Base>
  ),
  "flexible-staffing": (p: IconProps) => (
    // Sliders: staffing levels that adjust, rather than a fixed arrangement.
    <Base {...p}>
      <path d="M4 7h9M17 7h3M4 17h1.5M9.5 17h10.5" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="7.5" cy="17" r="2" />
    </Base>
  ),

  // --- Core services / employer solutions -------------------------------
  "manpower-supply": (p: IconProps) => (
    // A workforce: one figure front, two behind.
    <Base {...p}>
      <circle cx="12" cy="8.5" r="3" />
      <path d="M6.2 19.5c.6-3.1 2.8-4.9 5.8-4.9s5.2 1.8 5.8 4.9" />
      <circle cx="4.5" cy="11" r="2" />
      <path d="M1 18.5c.3-1.9 1.2-3.1 2.6-3.5" />
      <circle cx="19.5" cy="11" r="2" />
      <path d="M23 18.5c-.3-1.9-1.2-3.1-2.6-3.5" />
    </Base>
  ),
  "recruitment-staffing": (p: IconProps) => (
    <Base {...p}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12.5h18" />
    </Base>
  ),
  "talent-sourcing": (p: IconProps) => (
    // Searching for PEOPLE — a figure inside the lens, not a bare magnifier.
    <Base {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <circle cx="10.5" cy="8.8" r="1.9" />
      <path d="M7.2 14.6c.5-1.7 1.8-2.6 3.3-2.6s2.8.9 3.3 2.6" />
      <path d="M15.2 15.2 20.5 20.5" />
    </Base>
  ),
  "screening-shortlisting": (p: IconProps) => (
    <Base {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M8.5 12l2 2 4.5-4.5" />
      <path d="M8.5 17.5h7" />
    </Base>
  ),
  "screening-shortlisting-2": (p: IconProps) => icons["screening-shortlisting"](p),
  "contract-staffing": (p: IconProps) => (
    // A signed agreement.
    <Base {...p}>
      <path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M13 3v5h5" />
      <path d="M8 15.5c1.1-1.5 1.9-1.5 2.5-.5.6 1 1.3.9 2.4-1" />
      <path d="M8 18.5h8" />
    </Base>
  ),
  "temp-permanent": (p: IconProps) => (
    // Fixed terms and open-ended ones: a calendar, not another clock.
    <Base {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
      <path d="M7.5 14h3M7.5 17.5h8" />
    </Base>
  ),

  // --- Recruitment process steps ---------------------------------------
  understand: (p: IconProps) => (
    // Listening to the client: a person and their brief.
    <Base {...p}>
      <circle cx="6.5" cy="7.5" r="2.7" />
      <path d="M2 18c.5-3 2.3-4.7 4.5-4.7" />
      <path d="M12 5.5h8.5a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H16l-3.5 2.8V14H12a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 12 5.5z" />
    </Base>
  ),
  strategy: (p: IconProps) => (
    // A target, not a bar chart: the step is about aim, not measurement.
    <Base {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Base>
  ),
  source: (p: IconProps) => (
    // A sourcing funnel.
    <Base {...p}>
      <path d="M3.5 5h17l-6.5 7.6V20l-4-2.2v-5.2z" />
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
    // Starting the role: stepping through the door.
    <Base {...p}>
      <path d="M12 3.5h6a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5h-6" />
      <path d="M3 12h8" />
      <path d="M8 8.7 11.3 12 8 15.3" />
    </Base>
  ),

  // --- Employer journey -------------------------------------------------
  "share-requirements": (p: IconProps) => (
    <Base {...p}>
      <path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M13 3v5h5" />
      <path d="M11 18.5v-6M8.5 15l2.5-2.5 2.5 2.5" />
    </Base>
  ),
  "candidate-sourcing": (p: IconProps) => icons["talent-sourcing"](p),
  "interview-selection": (p: IconProps) => icons.interview(p),
  "candidate-selection": (p: IconProps) => (
    // Picking from a shortlist.
    <Base {...p}>
      <path d="M3.5 6.5h10M3.5 12h7M3.5 17.5h5" />
      <path d="M13.6 16.4l2.1 2.1 4.3-4.8" />
    </Base>
  ),
  "placement-onboarding": (p: IconProps) => icons.placement(p),

  // --- Job seeker journey ----------------------------------------------
  "prepare-cv": (p: IconProps) => (
    // Writing the CV.
    <Base {...p}>
      <path d="M13.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6" />
      <path d="M8 8.5h5M8 12h4" />
      <path d="M19.4 4.1a1.7 1.7 0 0 1 2.4 2.4L15.9 12.4l-3 .6.6-3z" />
    </Base>
  ),
  "send-cv": (p: IconProps) => (
    // Sending it — a paper plane, distinct from the employer's document upload.
    <Base {...p}>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3l-6.8 18-3.7-7.5L3 9.8z" />
    </Base>
  ),
  "send-via-whatsapp": (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3.5a8.25 8.25 0 0 0-7.1 12.4L4 20.5l4.7-1.2A8.25 8.25 0 1 0 12 3.5z" />
      <path d="M9 9.6c.1-.7.6-.9 1-.9.4 0 .7.1.9.6.2.5.6 1.5.6 1.7 0 .2 0 .4-.2.6-.2.3-.4.5-.5.6-.2.2-.3.4-.1.7.2.4.8 1.2 1.7 1.9 1.1.9 2 1.2 2.4 1.3.3.1.5.1.7-.1.2-.2.6-.7.8-1 .2-.2.4-.2.6-.1.3.1 1.7.8 2 .9.3.2.5.2.6.4.1.2.1.9-.2 1.5-.3.6-1.5 1.2-2.1 1.3-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3 0-1.4.8-2.1 1.1-2.4z" />
    </Base>
  ),
  "profile-review": (p: IconProps) => (
    // Matching one profile to another.
    <Base {...p}>
      <circle cx="6" cy="8.5" r="2.6" />
      <path d="M2 18c.4-2.6 1.9-4.1 4-4.1s3.6 1.5 4 4.1" />
      <circle cx="18" cy="8.5" r="2.6" />
      <path d="M14 18c.4-2.6 1.9-4.1 4-4.1s3.6 1.5 4 4.1" />
      <path d="M10.8 21h2.4" />
    </Base>
  ),
  "interview-opportunities": (p: IconProps) => icons.interview(p),
  "selection-placement": (p: IconProps) => icons.placement(p),
  "wait-for-opportunities": (p: IconProps) => (
    // Time passing — an hourglass, so it no longer twins the staffing clock.
    <Base {...p}>
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3v3.2c0 1.6 1.4 2.8 4 5.8 2.6-3 4-4.2 4-5.8V3" />
      <path d="M8 21v-3.2c0-1.6 1.4-2.8 4-5.8 2.6 3 4 4.2 4 5.8V21" />
    </Base>
  ),

  // --- Industries -------------------------------------------------------
  construction: (p: IconProps) => (
    // A hard hat. The brim is a solid bar rather than a bare rule — as a line
    // it read as an archway rather than headgear.
    <Base {...p}>
      <path d="M5.5 16v-3.5a6.5 6.5 0 0 1 13 0V16" />
      <rect x="2.5" y="16" width="19" height="2.8" rx="1.4" />
      <path d="M12 9.5v3" />
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
      <rect x="2.5" y="4.5" width="19" height="12.5" rx="2" />
      <path d="M8.5 21h7M12 17v4" />
      <path d="M9.6 8.7 7.2 10.9l2.4 2.2M14.4 8.7l2.4 2.2-2.4 2.2" />
    </Base>
  ),
  engineering: (p: IconProps) => (
    // A cog. The outer RING is what makes this read as a gear — spokes
    // radiating from a bare hub render as a sun at 24px.
    <Base {...p}>
      <circle cx="12" cy="12" r="6.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 3.2v2.6M12 18.2v2.6M20.8 12h-2.6M5.8 12H3.2M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8M18.2 18.2l-1.8-1.8M7.6 7.6 5.8 5.8" />
    </Base>
  ),
  hospitality: (p: IconProps) => (
    // A bed — unambiguous for hotels and hospitality.
    <Base {...p}>
      <path d="M2.5 19.5v-9" />
      <path d="M2.5 14h16a3 3 0 0 1 3 3v2.5" />
      <path d="M2.5 17.5h19" />
      <circle cx="7" cy="11" r="2" />
      <path d="M10.2 14v-1.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V14" />
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
    // A sawtooth factory roof. The previous mix of teeth and one tall block
    // read as a rising bar chart.
    <Base {...p}>
      <path d="M2.5 20.5h19" />
      <path d="M4 20.5V12l4.6 3V12l4.6 3V12l4.6 3v5.5" />
      <path d="M8.6 20.5v-2.6M13.2 20.5v-2.6" />
    </Base>
  ),
  "retail-sales": (p: IconProps) => (
    <Base {...p}>
      <path d="M4.5 8.5h15l-1.2 10a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3z" />
      <path d="M8.5 8.5v-2a3.5 3.5 0 0 1 7 0v2" />
    </Base>
  ),
  "facilities-management": (p: IconProps) => (
    // Keeping a building running: premises plus a spanner. Deliberately NOT a
    // cog — Engineering sits in the same industries grid and already is one.
    <Base {...p}>
      <path d="M3 20.5V6A1.5 1.5 0 0 1 4.5 4.5h5A1.5 1.5 0 0 1 11 6v14.5" />
      <path d="M2 20.5h10" />
      <path d="M5.5 8.5h3M5.5 12h3M5.5 15.5h3" />
      <path d="M21.5 12.2a2.7 2.7 0 0 1-3.6 3.6l-3 3a1.15 1.15 0 0 1-1.6-1.6l3-3a2.7 2.7 0 0 1 3.6-3.6l-1.7 1.7 1.6 1.6z" />
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
    // An aircraft.
    <Base {...p}>
      <path d="M10.2 4.2a1.8 1.8 0 0 1 3.6 0v5.3l7.7 4.4v2.3l-7.7-2.2v3.6l2.4 1.8v1.7L12 20.2l-4.2.9v-1.7l2.4-1.8V14L2.5 16.2v-2.3l7.7-4.4z" />
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
    // Filing — distinct from the documents used by the requirement cards.
    <Base {...p}>
      <path d="M3 9V6a1.5 1.5 0 0 1 1.5-1.5h4.2l2 2.6h9.8" />
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
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
