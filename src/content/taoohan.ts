import type { SiteContent } from "./types";
import { placeholderContent } from "./placeholder";

/**
 * MILESTONE 1 — LITERAL CLIENT ANSWERS ONLY, EARLY REVEAL.
 *
 * Sir Jerome asked to see his actual Google Form answers reflected on the
 * site during the Milestone 1 review — before the rest of Milestone 2 (final
 * design, brand color, real logo) is built.
 *
 * STRICT RULE FOLLOWED HERE: every string below is copied character-for-
 * character from the client's form response. NOTHING is paraphrased,
 * reworded, or invented to "fill out" a section. Any page heading, eyebrow,
 * lead paragraph, process description, or section the client did not
 * literally answer STAYS ON PLACEHOLDER TEXT — it is not this file's job to
 * write connective copy. That drafting work (with client sign-off) is
 * Milestone 2 scope, in `taoohan.ts` on the milestone-2 branch, which is a
 * separate, more complete file — this one is intentionally narrower.
 *
 * Base object is `placeholderContent` itself, with ONLY the fields below
 * overridden. Anything not listed here is still 100% placeholder.
 */

// Verbatim answer to "What does your company do?" — one continuous answer in
// the form; split into two <p> paragraphs here for readability only. No word
// was added, removed or changed — only where the line break falls.
const whatWeDoParagraphOne =
  "Taoohan is a manpower and recruitment company that connects businesses with qualified and reliable talent across different industries. We support employers with talent sourcing, recruitment, and manpower solutions based on their specific workforce needs.";
const whatWeDoParagraphTwo =
  "We serve industries including healthcare, construction, IT, hospitality, logistics, engineering, and more. Our goal is to make hiring easier while helping people find the right opportunities to build their careers.";

// Verbatim answer to "Why should a client choose you over another agency?"
// — three items, names only (no descriptions were supplied).
const differentiators = [
  { key: "quality-talent", title: "Access to Quality Talent" },
  { key: "fast-reliable", title: "Fast, Reliable Recruitment" },
  { key: "flexible-staffing", title: "Flexible Staffing Solutions" },
];

export const taoohanContent: SiteContent = {
  ...placeholderContent,
  isPlaceholder: false,

  // "Official company name" / "Tagline or slogan"
  brand: {
    name: "Taoohan",
    tagline: "Bringing Great People to Great Businesses",
  },

  home: {
    ...placeholderContent.home,
    // "Big headline for the homepage"
    headline: "Bringing Great People to Great Businesses.",
    // "Supporting line under the headline"
    supporting:
      "Connecting employers with qualified talent through reliable recruitment, staffing, and manpower solutions across industries.",
    // "What does your company do?" — verbatim, both paragraphs.
    introBody: `${whatWeDoParagraphOne} ${whatWeDoParagraphTwo}`,
    // trustLine, intro.eyebrow/heading/lead: not answered — stay placeholder.
  },

  about: {
    ...placeholderContent.about,
    // "What does your company do?" — same verbatim answer, as paragraphs.
    body: [whatWeDoParagraphOne, whatWeDoParagraphTwo],
    // "Why should a client choose you over another agency?" — verbatim.
    values: differentiators,
    // eyebrow/heading/lead: not answered — stay placeholder.
  },

  services: {
    ...placeholderContent.services,
    // "What services do you offer?" — all 11, verbatim, in order, names only.
    items: [
      { key: "manpower-supply", title: "Manpower supply" },
      { key: "recruitment-staffing", title: "Recruitment and staffing" },
      { key: "talent-sourcing", title: "Talent sourcing and recruitment" },
      { key: "screening", title: "Candidate screening and shortlisting" },
      { key: "contract-staffing", title: "Contract staffing" },
      { key: "temp-permanent", title: "Temporary and permanent staffing" },
      { key: "workforce-solutions", title: "Workforce solutions" },
      { key: "job-seeker-assistance", title: "Job seeker assistance" },
      { key: "industry-specific", title: "Industry-specific recruitment" },
      { key: "international", title: "International recruitment" },
      { key: "placement-onboarding", title: "Talent placement and onboarding" },
    ],
    // eyebrow/heading/lead: not answered — stay placeholder.
  },

  industries: {
    ...placeholderContent.industries,
    // "What industries do you serve?" — all 12, verbatim, in order, names only.
    items: [
      { key: "construction", name: "Construction" },
      { key: "healthcare", name: "Healthcare" },
      { key: "it", name: "IT and Technology" },
      { key: "engineering", name: "Engineering" },
      { key: "hospitality", name: "Hospitality" },
      { key: "logistics", name: "Logistics and Transportation" },
      { key: "manufacturing", name: "Manufacturing" },
      { key: "retail", name: "Retail and Sales" },
      { key: "facilities", name: "Facilities Management" },
      { key: "real-estate", name: "Real Estate" },
      { key: "aviation", name: "Aviation" },
      { key: "admin", name: "Administration and Office Support" },
    ],
    // eyebrow/heading/lead: not answered — stay placeholder.
  },

  // employers / jobSeekers / contact: not answered as page copy in the form
  // (the form only gave the two button labels, which live in site.config.ts,
  // not here) — every field on these three pages stays placeholder.

  // Top-level duplicate of about.values, used on the home page.
  differentiators,

  // "Numbers you want to show off" / "Testimonials" / "Partner or client
  // names" / "Certifications or licences" — all answered "TBD". Empty,
  // exactly like placeholder.ts already has them.

  // "Recruitment disclaimer" — verbatim.
  disclaimer:
    "Taoohan does not guarantee a specific salary, position, or hiring outcome unless formally agreed.",

  // Privacy policy / terms: client stated neither exists yet — stay empty,
  // exactly like placeholder.ts already has them.
};
