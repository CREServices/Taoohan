/**
 * Shape of every piece of copy on the site.
 *
 * MILESTONE 2 — reshaped to match the client-approved
 * "Taoohan Website Content & Copy" document exactly: 6 core services (not
 * 11), 16 industries (not 12), numbered process steps per page, and the
 * removal of the About page's Company Statistics, Certifications & Licences
 * and Team Photograph sections.
 */

/**
 * A titled block of copy — used for value props, steps, service cards.
 */
export type Feature = {
  key: string;
  title: string;
  body?: string;
};

/** A named industry with its approved one-line description. */
export type Industry = {
  key: string;
  name: string;
  blurb: string;
};

/**
 * A headline number. BLOCKED ON CLIENT — "do not add or invent any figures."
 * Kept as a typed slot so a future stats section is a data change only.
 */
export type Stat = {
  key: string;
  value: string;
  label: string;
};

/**
 * A client quote. BLOCKED ON CLIENT — testimonials are TBD, no placeholder
 * reviews are invented.
 */
export type Testimonial = {
  key: string;
  quote: string;
  author: string;
  role: string;
};

/**
 * A partner/client logo slot. The client explicitly authorised temporary
 * letter placeholders (A, B, C, X, Y, Z) for the Partners & Clients section
 * only — real company names/logos are on hold.
 */
export type Partner = {
  key: string;
  /** Single-letter placeholder ("A"–"Z") — never a real company name. */
  label: string;
};

/** A legal document rendered from data rather than hardcoded JSX. */
export type LegalDocument = {
  /** Empty string = client has not supplied this document yet. */
  title: string;
  /** Empty array = still blocked on the client. */
  sections: readonly { heading: string; body: string }[];
};

/** A standard page header. */
export type PageIntro = {
  /** Eyebrow label shown above the heading. */
  eyebrow: string;
  heading: string;
  lead: string;
};

/** One audience card in the Home page's For Employers / For Job Seekers split. */
export type AudienceCard = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  linkLabel: string;
  linkHref: string;
};

export type SiteContent = {
  /**
   * True while placeholder copy is in use (Milestone 1). Components may use
   * this to render a visible "placeholder" affordance during review.
   */
  isPlaceholder: boolean;

  brand: {
    name: string;
    tagline: string;
  };

  home: {
    eyebrow: string;
    headline: string;
    /**
     * The same headline, pre-split into the two lines the client signed off on
     * ("Bringing Great People" / "to Great Businesses."). The hero sets these
     * as non-wrapping lines so the break never moves with the viewport; the
     * flat `headline` above stays the canonical string for metadata and for
     * anywhere the break does not matter.
     */
    headlineLines: readonly string[];
    supporting: string;
    /** Single hero CTA — "Become Our Partner". Replaces the old two-button hero. */
    heroCta: {
      label: string;
    };
    intro: PageIntro;
    features: readonly Feature[];
    employerCard: AudienceCard;
    jobSeekerCard: AudienceCard;
    finalCta: {
      heading: string;
      body: string;
    };
    /**
     * The hero's "Become Our Partner" modal, which carries both submission
     * flows: the job seeker's single-form "I'm Looking for Work" (validated,
     * then handed to WhatsApp) and the employer's single-form "I'm Hiring
     * Staff" (validated, then submitted directly from the site by email).
     */
    partnerModal: {
      heading: string;
      lead: string;
      jobSeeker: {
        /** Short audience toggle label at the top of the form — "Job Seekers". */
        tabLabel: string;
        /** The form's own title — "I'm Looking for Work". */
        formHeading: string;
        submitLabel: string;
        successNote: string;
        /** Heading of the step that precedes the WhatsApp hand-off. */
        reminderHeading: string;
        /** Tells the applicant to attach the CV themselves, in the chat. */
        reminderBody: string;
        /** The link that actually opens WhatsApp. */
        reminderContinueLabel: string;
        /** Returns to the form without opening anything. */
        reminderBackLabel: string;
        /** Label on the WhatsApp link shown after the hand-off. */
        openWhatsApp: string;
      };
      employer: {
        /** Short audience toggle label at the top of the form — "Employers". */
        tabLabel: string;
        /** The form's own title — "I'm Hiring Staff". */
        formHeading: string;
        ctaLabel: string;
        successNote: string;
      };
    };
  };

  about: PageIntro & {
    body: readonly string[];
    approachHeading: string;
    /**
     * Heading for the testimonials band that closes the page. The quotes
     * themselves are still blocked on the client (`testimonials` below is
     * empty); only the section title is settled.
     */
    testimonialsHeading: string;
    approachLead: string;
    values: readonly Feature[];
  };

  services: PageIntro & {
    coreHeading: string;
    items: readonly Feature[];
    processHeading: string;
    processTitle: string;
    processLead: string;
    steps: readonly Feature[];
    ctaHeading: string;
    ctaBody: string;
  };

  industries: PageIntro & {
    items: readonly Industry[];
    partners: {
      eyebrow: string;
      heading: string;
      body: string;
    };
    ctaHeading: string;
    ctaBody: string;
  };

  employers: PageIntro & {
    processHeading: string;
    processLead: string;
    steps: readonly Feature[];
    solutionsHeading: string;
    solutionsLead: string;
    solutions: readonly Feature[];
    ctaHeading: string;
    ctaBody: string;
  };

  jobSeekers: PageIntro & {
    journeyHeading: string;
    journeyLead: string;
    steps: readonly Feature[];
    applyHeading: string;
    applySteps: readonly Feature[];
    applySidebarHeading: string;
    ctaHeading: string;
    ctaBody: string;
    /**
     * Optional — instructions shown alongside the Apply Now flow (navbar
     * "Submit CV" button). Only `taoohan.ts` supplies this today; kept
     * optional so `placeholder.ts` does not need updating for a flow it never
     * exercises.
     */
    applyInstructions?: readonly string[];
  };

  contact: PageIntro & {
    body: string;
    channels: {
      email: { label: string; note: string };
      phone: { label: string; note: string };
      whatsapp: { label: string; note: string; ctaLabel: string };
    };
    secondaryHeading: string;
    secondaryBody: string;
  };

  /** BLOCKED ON CLIENT — empty until real numbers arrive. Section stays hidden. */
  stats: readonly Stat[];

  /** BLOCKED ON CLIENT — empty until real reviews arrive. Section stays hidden. */
  testimonials: readonly Testimonial[];

  /** Temporary letter placeholders only — client authorised A–Z as a stand-in. */
  partners: readonly Partner[];

  /** BLOCKED ON CLIENT — empty until certifications arrive. Section stays hidden. */
  certifications: readonly string[];

  /**
   * Standing UI labels — section headings and link text that are not tied to
   * a single page. Kept here so NO heading is hardcoded in JSX.
   */
  labels: {
    manpowerCategories: string;
    footerPages: string;
    footerContact: string;
    /**
     * Optional — copy for the navbar "Request Staff" / "Submit CV" flows.
     * Only `taoohan.ts` supplies these today; kept optional so
     * `placeholder.ts` does not need updating for flows it never exercises.
     */
    requestManpower?: string;
    howToApply?: string;
    applyWhatsApp?: string;
    applyEmail?: string;
  };

  footer: {
    tagline: string;
  };

  /** Copy for the root error boundary (src/app/global-error.tsx). */
  errorPage: {
    heading: string;
    body: string;
    /** Label on the button that re-renders the failed tree. */
    retry: string;
    /** Label on the link back to the home page. */
    home: string;
    /** Prefix for the error digest, e.g. "Reference:". */
    reference: string;
  };

  /** Recruitment disclaimer shown in the footer. */
  disclaimer: string;

  copyright: {
    year: string;
    holder: string;
    developedBy: string;
  };

  /** BLOCKED ON CLIENT — client stated they do not have these documents yet. */
  legal: {
    privacy: LegalDocument;
    terms: LegalDocument;
  };
};
