import type { SiteContent } from "./types";

/**
 * MILESTONE 1 PLACEHOLDER COPY.
 *
 * Every string here is deliberately fake and clearly non-final, BUT each one
 * is written to roughly the same length and the same item count as the real
 * Taoohan copy in `taoohan.ts` (6 services, 16 industries, 3 differentiators,
 * 6-step recruitment process, 6-step employer process, 4-step job-seeker
 * journey, 3-step apply flow, 6 partner slots). That way the layout is
 * stress-tested against real text volume instead of short lorem that would
 * misrepresent how much space the content needs.
 *
 * Do NOT put real client content in this file — `taoohan.ts` is what ships.
 */

const placeholderBody =
  "Placeholder description text that stands in for the final wording and is set to roughly the length the real sentence will run to on this card.";

const placeholderFeature = (key: string, n: number): SiteContent["services"]["items"][number] => ({
  key,
  title: `Placeholder Item ${n}`,
  body: placeholderBody,
});

export const placeholderContent: SiteContent = {
  isPlaceholder: true,

  brand: {
    name: "Company Name",
    tagline: "Placeholder Tagline Goes Here In This Space",
  },

  home: {
    eyebrow: "Placeholder Eyebrow Line",
    headline: "Placeholder Headline For The Home Hero.",
    headlineLines: ["Placeholder Headline", "For The Home Hero."],
    supporting:
      "Placeholder supporting sentence sitting under the main headline, written to about the same length as the final approved line.",
    heroCta: { label: "Placeholder Hero CTA" },
    intro: {
      eyebrow: "Placeholder Eyebrow",
      heading: "Placeholder Section Heading For The Introduction",
      lead: "Placeholder lead paragraph introducing the section, sized to the length the approved copy is expected to run.",
    },
    features: [
      { key: "feature-1", title: "Placeholder Feature One", body: placeholderBody },
      { key: "feature-2", title: "Placeholder Feature Two", body: placeholderBody },
      { key: "feature-3", title: "Placeholder Feature Three", body: placeholderBody },
    ],
    employerCard: {
      heading: "Placeholder Employer Card Heading",
      body: placeholderBody,
      ctaLabel: "Placeholder Employer CTA",
      ctaHref: "/for-employers",
      linkLabel: "Placeholder Link →",
      linkHref: "/for-employers",
    },
    jobSeekerCard: {
      heading: "Placeholder Job Seeker Card Heading",
      body: placeholderBody,
      ctaLabel: "Placeholder Job Seeker CTA",
      ctaHref: "/for-job-seekers",
      linkLabel: "Placeholder Link →",
      linkHref: "/for-job-seekers",
    },
    finalCta: {
      heading: "Placeholder Final CTA Heading Goes Here",
      body: placeholderBody,
    },
    partnerModal: {
      heading: "Placeholder Modal Heading",
      lead: placeholderBody,
      jobSeeker: {
        tabLabel: "Placeholder Job Seeker Tab",
        formHeading: "Placeholder Job Seeker Heading",
        submitLabel: "Placeholder Submit",
        successNote: placeholderBody,
        reminderHeading: "Placeholder Reminder Heading",
        reminderBody: placeholderBody,
        reminderContinueLabel: "Placeholder Continue",
        reminderBackLabel: "Placeholder Back",
        openWhatsApp: "Placeholder Open WhatsApp",
      },
      employer: {
        tabLabel: "Placeholder Employer Tab",
        formHeading: "Placeholder Employer Heading",
        ctaLabel: "Placeholder Employer CTA",
        successNote: placeholderBody,
      },
    },
  },

  about: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder About Page Heading Here",
    lead: "Placeholder lead paragraph for the about page, written to approximately the length of the final approved introduction.",
    body: [
      "Placeholder first body paragraph for the about page. It runs to roughly the length of the real paragraph so that column width, measure and vertical rhythm can be judged properly during layout review.",
      "Placeholder second body paragraph continuing the story with a comparable amount of text, keeping the section height representative of the finished page.",
    ],
    testimonialsHeading: "Placeholder Testimonials Heading",
    approachHeading: "Placeholder Approach Heading",
    approachLead: placeholderBody,
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
    coreHeading: "PLACEHOLDER CORE SERVICES",
    // 6 items — matches the real services count exactly.
    items: [1, 2, 3, 4, 5, 6].map((n) => placeholderFeature(`service-${n}`, n)),
    processHeading: "PLACEHOLDER RECRUITMENT PROCESS",
    processTitle: "Placeholder Process Title Heading Line",
    processLead: placeholderBody,
    // 6 steps — matches the real process step count exactly.
    steps: [1, 2, 3, 4, 5, 6].map((n) => placeholderFeature(`service-step-${n}`, n)),
    ctaHeading: "PLACEHOLDER SERVICES CTA HEADING",
    ctaBody: placeholderBody,
  },

  industries: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder Industries Page Heading",
    lead: "Placeholder lead paragraph for the industries page, sized to the length of the final approved introduction line.",
    // 16 items — matches the real industries count exactly.
    items: Array.from({ length: 16 }, (_, i) => ({
      key: `industry-${i + 1}`,
      name: `Placeholder Industry ${i + 1}`,
      blurb: "Placeholder industry blurb sized to the final line.",
    })),
    partners: {
      eyebrow: "PLACEHOLDER PARTNERS & CLIENTS",
      heading: "Placeholder Partners Heading",
      body: placeholderBody,
    },
    ctaHeading: "PLACEHOLDER INDUSTRIES CTA HEADING",
    ctaBody: placeholderBody,
  },

  employers: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder For Employers Heading",
    lead: "Placeholder lead paragraph for the employers page, sized to the length of the final approved introduction line.",
    processHeading: "Placeholder Recruitment Process Heading",
    processLead: placeholderBody,
    // 6 steps — matches the real employer process step count exactly.
    steps: [1, 2, 3, 4, 5, 6].map((n) => placeholderFeature(`employer-step-${n}`, n)),
    solutionsHeading: "PLACEHOLDER EMPLOYER SOLUTIONS",
    solutionsLead: placeholderBody,
    solutions: [1, 2, 3, 4, 5, 6].map((n) => placeholderFeature(`employer-solution-${n}`, n)),
    ctaHeading: "PLACEHOLDER EMPLOYERS CTA HEADING",
    ctaBody: placeholderBody,
  },

  jobSeekers: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder For Job Seekers Heading",
    lead: "Placeholder lead paragraph for the job seekers page, sized to the length of the final approved introduction line.",
    journeyHeading: "Placeholder Journey Heading",
    journeyLead: placeholderBody,
    // 4 steps — matches the real job-seeker journey step count exactly.
    steps: [1, 2, 3, 4].map((n) => placeholderFeature(`seeker-step-${n}`, n)),
    applyHeading: "PLACEHOLDER HOW TO APPLY",
    applySidebarHeading: "Placeholder Sidebar Heading",
    // 3 steps — matches the real "how to apply" step count exactly.
    applySteps: [1, 2, 3].map((n) => placeholderFeature(`apply-step-${n}`, n)),
    ctaHeading: "PLACEHOLDER JOB SEEKERS CTA HEADING",
    ctaBody: placeholderBody,
  },

  contact: {
    eyebrow: "Placeholder Eyebrow",
    heading: "Placeholder Contact Page Heading",
    lead: "Placeholder lead paragraph for the contact page, sized to the length of the final approved introduction line.",
    body: "Placeholder body paragraph for the contact page telling visitors which channel to use and how quickly they can expect a response once they get in touch.",
    channels: {
      email: { label: "Placeholder Email Address", note: placeholderBody },
      phone: { label: "Placeholder Phone Number", note: placeholderBody },
      whatsapp: { label: "Placeholder WhatsApp Number", note: placeholderBody, ctaLabel: "Placeholder WhatsApp CTA" },
    },
    secondaryHeading: "Placeholder Secondary Heading",
    secondaryBody: placeholderBody,
  },

  // BLOCKED ON CLIENT — intentionally empty. The Partners & Clients page
  // renders its own temporary A–Z letter placeholders as decorative UI, not
  // from this content slot — see PARTNER_PLACEHOLDER_LABELS in
  // src/app/industries/page.tsx.
  stats: [],
  testimonials: [],
  partners: [],
  certifications: [],

  labels: {
    manpowerCategories: "PLACEHOLDER MANPOWER CATEGORIES HEADING",
    footerPages: "Pages",
    footerContact: "Contact",
  },

  footer: {
    tagline: "Placeholder — Company Name Tagline Here.",
  },

  disclaimer:
    "Placeholder recruitment disclaimer sentence, sized to the length of the final approved statement.",

  copyright: {
    year: "2026",
    holder: "Company Name. All rights reserved.",
    developedBy: "Developed by Placeholder Developer Credit",
  },

  // BLOCKED ON CLIENT — client has not prepared these documents yet.
  legal: {
    privacy: { title: "", sections: [] },
    terms: { title: "", sections: [] },
  },
};
