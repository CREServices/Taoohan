import type { SiteContent } from "./types";

/**
 * MILESTONE 1 PLACEHOLDER COPY.
 *
 * Every string here is deliberately fake and clearly non-final, BUT each one is
 * written to the same character length and the same item count as the real
 * Taoohan copy that lands in Milestone 2 (11 services, 12 industries, 3
 * differentiators, ~42-char hero headline, ~124-char supporting line). That way
 * the layout is stress-tested against real text volume instead of short lorem
 * that would misrepresent how much space the content needs.
 *
 * Do NOT put real client content in this file — it is replaced wholesale in
 * Milestone 2 by `taoohan.ts`.
 */

const placeholderBody =
  "Placeholder description text that stands in for the final wording and is set to roughly the length the real sentence will run to on this card.";

export const placeholderContent: SiteContent = {
  isPlaceholder: true,

  brand: {
    name: "Company Name",
    tagline: "Placeholder Tagline Goes Here In This Space",
  },

  home: {
    // Real headline is ~42 characters — matched here.
    headline: "Placeholder Headline For The Home Hero.",
    // Real supporting line is ~124 characters — matched here.
    supporting:
      "Placeholder supporting sentence sitting under the main headline, written to about the same length as the final approved line.",
    trustLine: "Placeholder trust line — replaced with real proof in Milestone 2.",
    intro: {
      eyebrow: "Placeholder Eyebrow",
      heading: "Placeholder Section Heading For The Introduction",
      lead: "Placeholder lead paragraph introducing the section, sized to the length the approved copy is expected to run.",
    },
    // Real "what we do" paragraph is ~470 characters — matched here.
    introBody:
      "Placeholder paragraph describing what the company does, who it works with and the outcome it delivers for both sides of the market. It is written at approximately the length of the final approved paragraph so the surrounding layout, line height and column width can be judged honestly at review time rather than being flattered by short filler text that would collapse the section and hide any spacing problems.",
  },

  about: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder About Page Heading Here",
    lead: "Placeholder lead paragraph for the about page, written to approximately the length of the final approved introduction.",
    body: [
      "Placeholder first body paragraph for the about page. It runs to roughly the length of the real paragraph so that column width, measure and vertical rhythm can be judged properly during layout review.",
      "Placeholder second body paragraph continuing the story with a comparable amount of text, keeping the section height representative of the finished page.",
    ],
    values: [
      { key: "value-1", title: "Placeholder Value One", body: placeholderBody },
      { key: "value-2", title: "Placeholder Value Two", body: placeholderBody },
      { key: "value-3", title: "Placeholder Value Three", body: placeholderBody },
    ],
  },

  services: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder Services Page Heading",
    lead: "Placeholder lead paragraph for the services page, sized to the length of the final approved introduction line.",
    // 11 items — matches the real services count exactly.
    items: [
      { key: "service-1", title: "Placeholder Service One", body: placeholderBody },
      { key: "service-2", title: "Placeholder Service Two", body: placeholderBody },
      { key: "service-3", title: "Placeholder Service Three", body: placeholderBody },
      { key: "service-4", title: "Placeholder Service Four", body: placeholderBody },
      { key: "service-5", title: "Placeholder Service Five", body: placeholderBody },
      { key: "service-6", title: "Placeholder Service Six", body: placeholderBody },
      { key: "service-7", title: "Placeholder Service Seven", body: placeholderBody },
      { key: "service-8", title: "Placeholder Service Eight", body: placeholderBody },
      { key: "service-9", title: "Placeholder Service Nine", body: placeholderBody },
      { key: "service-10", title: "Placeholder Service Ten", body: placeholderBody },
      { key: "service-11", title: "Placeholder Service Eleven", body: placeholderBody },
    ],
  },

  industries: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder Industries Page Heading",
    lead: "Placeholder lead paragraph for the industries page, sized to the length of the final approved introduction line.",
    // 12 items — matches the real industries count exactly.
    items: [
      { key: "industry-1", name: "Placeholder Industry One", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-2", name: "Placeholder Industry Two", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-3", name: "Placeholder Industry Three", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-4", name: "Placeholder Industry Four", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-5", name: "Placeholder Industry Five", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-6", name: "Placeholder Industry Six", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-7", name: "Placeholder Industry Seven", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-8", name: "Placeholder Industry Eight", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-9", name: "Placeholder Industry Nine", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-10", name: "Placeholder Industry Ten", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-11", name: "Placeholder Industry Eleven", blurb: "Placeholder industry blurb sized to the final line." },
      { key: "industry-12", name: "Placeholder Industry Twelve", blurb: "Placeholder industry blurb sized to the final line." },
    ],
  },

  employers: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder For Employers Heading",
    lead: "Placeholder lead paragraph for the employers page, sized to the length of the final approved introduction line.",
    body: "Placeholder body paragraph for the employers page explaining how the hiring process works from first brief through to placement, written at approximately the length the final approved copy is expected to run so the section height stays honest.",
    steps: [
      { key: "employer-step-1", title: "Placeholder Step One", body: placeholderBody },
      { key: "employer-step-2", title: "Placeholder Step Two", body: placeholderBody },
      { key: "employer-step-3", title: "Placeholder Step Three", body: placeholderBody },
      { key: "employer-step-4", title: "Placeholder Step Four", body: placeholderBody },
    ],
    requestInstructions: [
      "Placeholder employer request instruction one, sized to the final copy.",
      "Placeholder employer request instruction two, sized to the final copy.",
      "Placeholder employer request instruction three, sized to the final copy.",
      "Placeholder employer request instruction four, sized to the final copy.",
    ],
  },

  jobSeekers: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder For Job Seekers Heading",
    lead: "Placeholder lead paragraph for the job seekers page, sized to the length of the final approved introduction line.",
    body: "Placeholder body paragraph for the job seekers page explaining how candidates are matched to roles and what to expect after applying, written at approximately the length the final approved copy is expected to run.",
    steps: [
      { key: "seeker-step-1", title: "Placeholder Step One", body: placeholderBody },
      { key: "seeker-step-2", title: "Placeholder Step Two", body: placeholderBody },
      { key: "seeker-step-3", title: "Placeholder Step Three", body: placeholderBody },
      { key: "seeker-step-4", title: "Placeholder Step Four", body: placeholderBody },
    ],
    applyInstructions: [
      "Placeholder instruction line one, replaced with the real guidance in Milestone 3.",
      "Placeholder instruction line two, replaced with the real guidance in Milestone 3.",
      "Placeholder instruction line three, replaced with the real guidance in Milestone 3.",
    ],
  },

  contact: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder Contact Page Heading",
    lead: "Placeholder lead paragraph for the contact page, sized to the length of the final approved introduction line.",
    body: "Placeholder body paragraph for the contact page telling visitors which channel to use and how quickly they can expect a response once they get in touch.",
  },

  differentiators: [
    { key: "diff-1", title: "Placeholder Reason One", body: placeholderBody },
    { key: "diff-2", title: "Placeholder Reason Two", body: placeholderBody },
    { key: "diff-3", title: "Placeholder Reason Three", body: placeholderBody },
  ],

  // BLOCKED ON CLIENT — answered "TBD" on the intake form. Intentionally empty.
  stats: [],
  testimonials: [],
  partners: [],
  certifications: [],

  labels: {
    testimonialsGeneral: "Placeholder Testimonials Heading",
    testimonialsEmployers: "Placeholder Employer Testimonials Heading",
    certifications: "Placeholder Certifications Heading",
    partners: "Placeholder Partners Heading",
    manpowerCategories: "Placeholder Manpower Categories Heading",
    requestManpower: "Placeholder Request Manpower Heading",
    howToApply: "Placeholder How To Apply Heading",
    applyWhatsApp: "Placeholder WhatsApp Channel Heading",
    applyEmail: "Placeholder Email Channel Heading",
    viewAllServices: "Placeholder View All Link",
    footerPages: "Pages",
    footerContact: "Contact",
    footerOffice: "Office",
  },

  errorPage: {
    heading: "Placeholder Error Heading",
    body: "Placeholder error page body sentence, sized to the final approved copy.",
    retry: "Placeholder Retry Label",
    home: "Placeholder Home Link Label",
    reference: "Reference:",
  },

  disclaimer:
    "Placeholder recruitment disclaimer sentence, sized to the length of the final approved statement.",

  // BLOCKED ON CLIENT — client has not prepared these documents yet.
  legal: {
    privacy: { title: "", sections: [] },
    terms: { title: "", sections: [] },
  },
};
