import type { SiteContent } from "./types";
import { NAV } from "@/config/site.config";

/** Page eyebrows reuse the nav label so wording never diverges from the menu. */
const navLabel = (key: string): string =>
  NAV.find((item) => item.key === key)!.label;

/**
 * MILESTONE 2 — REAL TAOOHAN CONTENT.
 *
 * Provenance rules used throughout this file:
 *
 *   [CLIENT]  Verbatim from the Taoohan intake form. Never edited, never
 *             paraphrased. Where a long answer is split across paragraphs the
 *             wording is still the client's, only the line break is ours.
 *
 *   [DRAFT]   Connective copy written by Developer 1 because the client did not
 *             supply a string for that slot (section headings, leads, process
 *             steps). These describe how the site itself works and make no
 *             factual claims about the business. THEY NEED CLIENT SIGN-OFF and
 *             are listed as such in the Milestone 2 report.
 *
 *   [BLOCKED] Client answered "TBD" — left as an empty typed slot. NOTHING is
 *             invented to fill these: no stats, no testimonials, no partners,
 *             no certifications, no legal documents.
 *
 * Service and industry entries are NAME-ONLY because the client supplied names
 * without descriptions. `Feature.body` and `Industry.blurb` are optional so
 * those cards render honestly rather than carrying made-up marketing lines.
 */

// [CLIENT] "What does your company do?" — verbatim, split into two paragraphs.
const whatWeDoParagraphOne =
  "Taoohan is a manpower and recruitment company that connects businesses with qualified and reliable talent across different industries. We support employers with talent sourcing, recruitment, and manpower solutions based on their specific workforce needs.";

const whatWeDoParagraphTwo =
  "We serve industries including healthcare, construction, IT, hospitality, logistics, engineering, and more. Our goal is to make hiring easier while helping people find the right opportunities to build their careers.";

export const taoohanContent: SiteContent = {
  isPlaceholder: false,

  brand: {
    // [CLIENT] "Official company name" / "Tagline or slogan"
    name: "Taoohan",
    tagline: "Bringing Great People to Great Businesses",
  },

  home: {
    // [CLIENT] "Big headline for the homepage"
    headline: "Bringing Great People to Great Businesses.",
    // [CLIENT] "Supporting line under the headline"
    supporting:
      "Connecting employers with qualified talent through reliable recruitment, staffing, and manpower solutions across industries.",
    // [DRAFT] Derived only from the client's own industries list — no new claims.
    trustLine:
      "Recruiting across 12 industries, from construction and healthcare to IT and aviation.",
    intro: {
      // [DRAFT] Section framing for the client's "why choose you" answer.
      eyebrow: "Why Taoohan",
      heading: "What you get when you work with us",
      lead: "Three things we focus on for every employer and every candidate we place.",
    },
    // [CLIENT] Full "what does your company do" answer, verbatim.
    introBody: `${whatWeDoParagraphOne} ${whatWeDoParagraphTwo}`,
  },

  about: {
    // [DRAFT] Page framing.
    eyebrow: navLabel("about"),
    heading: "Who we are",
    // [CLIENT] Opening sentence of the company description.
    lead: "Taoohan is a manpower and recruitment company that connects businesses with qualified and reliable talent across different industries.",
    // [CLIENT] Verbatim, split for readability.
    body: [whatWeDoParagraphOne, whatWeDoParagraphTwo],
    // [CLIENT] "Why should a client choose you over another agency?" — the
    // three answers, name-only because no descriptions were supplied.
    values: [
      { key: "quality-talent", title: "Access to Quality Talent" },
      { key: "fast-reliable", title: "Fast, Reliable Recruitment" },
      { key: "flexible-staffing", title: "Flexible Staffing Solutions" },
    ],
  },

  services: {
    // [DRAFT] Page framing.
    eyebrow: navLabel("services"),
    heading: "Recruitment and manpower services",
    lead: "The full range of staffing support we provide to employers and job seekers.",
    // [CLIENT] "What services do you offer?" — all 11, verbatim, in order.
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
  },

  industries: {
    // [DRAFT] Page framing.
    eyebrow: navLabel("industries"),
    heading: "Industries we recruit for",
    lead: "We place skilled and reliable people across these sectors.",
    // [CLIENT] "What industries do you serve?" — all 12, verbatim, in order.
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
  },

  employers: {
    // [DRAFT] Page framing and process description — describes how a request
    // moves through the site, makes no claims about volumes or timelines.
    eyebrow: navLabel("employers"),
    heading: "Staffing built around your workforce needs",
    lead: "Tell us the roles you need filled and we will source, screen and shortlist candidates for you.",
    body: "We work from your specific requirements rather than a fixed template: the roles you need, the skills that matter, and whether the placement is temporary, contract or permanent. From there we handle sourcing, screening and shortlisting so your team only spends time on candidates worth interviewing.",
    steps: [
      {
        key: "employer-step-brief",
        title: "Send your request",
        body: "Use the Request Staffing & Manpower button to tell us the roles, skills and headcount you need.",
      },
      {
        key: "employer-step-scope",
        title: "We confirm the requirements",
        body: "We come back to agree the details: role scope, industry, and whether you need temporary, contract or permanent staff.",
      },
      {
        key: "employer-step-source",
        title: "We source and screen",
        body: "We draw on our talent pool and run candidate screening so you receive a shortlist rather than a pile of CVs.",
      },
      {
        key: "employer-step-place",
        title: "Placement and onboarding",
        body: "You interview and select, and we support the placement and onboarding of the people you hire.",
      },
    ],
    // [DRAFT] On-screen instructions for the Request Manpower flow — describes
    // how the form itself works, makes no claims about response times.
    requestInstructions: [
      "Tell us who you are: company, contact name and a work email we can reply to.",
      "Describe the roles you need — headcount, location, and whether the placement is temporary, contract or permanent.",
      "Send the request to our team, or open it in your own email app if you would rather write it yourself.",
      "We reply by email to confirm the requirements before we start sourcing.",
    ],
  },

  jobSeekers: {
    // [DRAFT] Page framing and process description, aligned to the Apply flow
    // that Milestone 3 actually builds.
    eyebrow: navLabel("jobseekers"),
    heading: "Find the right opportunity to build your career",
    lead: "Send us your details and we will match you against roles with the employers we recruit for.",
    body: "Whether you are looking for temporary work, a contract placement or a permanent role, sharing your details puts you in front of the employers we are actively recruiting for across construction, healthcare, IT, hospitality, logistics, engineering and more.",
    steps: [
      {
        key: "seeker-step-submit",
        title: "Submit your details",
        body: "Send your name and contact number, then choose whether to continue over WhatsApp or by email.",
      },
      {
        key: "seeker-step-cv",
        title: "Share your CV",
        body: "Attach your CV so we can see your experience, qualifications and the kind of work you are looking for.",
      },
      {
        key: "seeker-step-match",
        title: "We match you to roles",
        body: "Our team reviews your details against current openings in the industries we recruit for.",
      },
      {
        key: "seeker-step-placement",
        title: "Interview and placement",
        body: "If there is a fit, we introduce you to the employer and support you through to placement and onboarding.",
      },
    ],
    applyInstructions: [
      "Enter your full name and contact number.",
      "Choose how you would like to continue: WhatsApp or email.",
      "Attach your CV in the chat or email that opens, and our team will be in touch.",
    ],
  },

  contact: {
    // [DRAFT] Page framing.
    eyebrow: navLabel("contact"),
    heading: "Get in touch",
    lead: "Whether you are hiring or looking for work, we are happy to hear from you.",
    body: "Employers can send a staffing request and job seekers can submit their CV using the buttons on this page. Direct contact details are published below as soon as they are confirmed.",
  },

  // [CLIENT] "Why should a client choose you over another agency?" — verbatim,
  // name-only (no descriptions were supplied).
  differentiators: [
    { key: "quality-talent", title: "Access to Quality Talent" },
    { key: "fast-reliable", title: "Fast, Reliable Recruitment" },
    { key: "flexible-staffing", title: "Flexible Staffing Solutions" },
  ],

  // [BLOCKED] Client answered "TBD" to every one of these. Nothing invented.
  stats: [],
  testimonials: [],
  partners: [],
  certifications: [],

  // [DRAFT] Standing UI labels — final wording pending client sign-off.
  labels: {
    testimonialsGeneral: "What people say",
    testimonialsEmployers: "What employers say",
    certifications: "Certifications and licences",
    partners: "Partners and clients",
    manpowerCategories: "Manpower categories you can request",
    requestManpower: "Request staffing and manpower",
    howToApply: "How to apply",
    applyWhatsApp: "Continue on WhatsApp",
    applyEmail: "Send by email",
    viewAllServices: "View all services",
    footerPages: "Pages",
    footerContact: "Contact",
    footerOffice: "Office",
  },

  // [DRAFT] Root error boundary copy. Describes a site failure, makes no claim
  // about the business, but is Taoohan's voice to a visitor — worth a read at
  // sign-off with the other [DRAFT] strings.
  errorPage: {
    heading: "Something went wrong",
    body: "Sorry — this page could not be loaded. Please try again, or return to the home page.",
    retry: "Try again",
    home: "Go to home page",
    reference: "Reference:",
  },

  // [CLIENT] "Recruitment disclaimer" — verbatim.
  disclaimer:
    "Taoohan does not guarantee a specific salary, position, or hiring outcome unless formally agreed.",

  // [BLOCKED] Client stated they do not have these documents yet.
  legal: {
    privacy: { title: "", sections: [] },
    terms: { title: "", sections: [] },
  },
};
