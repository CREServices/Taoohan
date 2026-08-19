/**
 * Shape of every piece of copy on the site.
 *
 * Milestone 1 ships `placeholder.ts` against this contract; Milestone 2 ships
 * `taoohan.ts` against the SAME contract, so swapping real content in is a
 * one-line change in `src/content/index.ts` and the type checker proves nothing
 * was missed.
 */

/**
 * A titled block of copy — used for value props, steps and service cards.
 *
 * `body` is OPTIONAL on purpose. The client supplied service and value-prop
 * NAMES only, with no descriptions. Rather than invent marketing copy for them,
 * those cards render title-only until the client sends real descriptions.
 */
export type Feature = {
  key: string;
  title: string;
  body?: string;
};

/** A named industry. `blurb` is optional for the same reason as `Feature.body`. */
export type Industry = {
  key: string;
  name: string;
  blurb?: string;
};

/**
 * A headline number. BLOCKED ON CLIENT — the client answered "TBD" for the
 * numbers they want to show off, so this list is empty until they send them.
 */
export type Stat = {
  key: string;
  value: string;
  label: string;
};

/**
 * A client quote. BLOCKED ON CLIENT — answered "TBD, please remind me."
 */
export type Testimonial = {
  key: string;
  quote: string;
  author: string;
  role: string;
};

/**
 * A partner/client logo or name. BLOCKED ON CLIENT — answered "TBD".
 */
export type Partner = {
  key: string;
  name: string;
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
    headline: string;
    supporting: string;
    /** Short trust line shown beneath the hero CTAs. */
    trustLine: string;
    intro: PageIntro;
    introBody: string;
  };

  about: PageIntro & {
    body: readonly string[];
    values: readonly Feature[];
  };

  services: PageIntro & {
    items: readonly Feature[];
  };

  industries: PageIntro & {
    items: readonly Industry[];
  };

  employers: PageIntro & {
    body: string;
    steps: readonly Feature[];
    /** Instructions shown alongside the Request Manpower flow (Milestone 3). */
    requestInstructions: readonly string[];
  };

  jobSeekers: PageIntro & {
    body: string;
    steps: readonly Feature[];
    /** Instructions shown alongside the Apply Now flow (built in Milestone 3). */
    applyInstructions: readonly string[];
  };

  contact: PageIntro & {
    body: string;
  };

  /** "Why choose us" — three client-supplied differentiators. */
  differentiators: readonly Feature[];

  /** BLOCKED ON CLIENT — empty until real numbers arrive. */
  stats: readonly Stat[];

  /** BLOCKED ON CLIENT — empty until real reviews arrive. */
  testimonials: readonly Testimonial[];

  /** BLOCKED ON CLIENT — empty until real partner names arrive. */
  partners: readonly Partner[];

  /** BLOCKED ON CLIENT — empty until certifications arrive. */
  certifications: readonly string[];

  /**
   * Standing UI labels — section headings and link text that are not tied to a
   * single page. Kept here so that NO heading is hardcoded in JSX and the final
   * wording is changed in one place.
   */
  labels: {
    testimonialsGeneral: string;
    testimonialsEmployers: string;
    certifications: string;
    partners: string;
    manpowerCategories: string;
    requestManpower: string;
    howToApply: string;
    applyWhatsApp: string;
    applyEmail: string;
    viewAllServices: string;
    footerPages: string;
    footerContact: string;
    footerOffice: string;
  };

  /** Copy for the root error boundary (app/global-error.tsx). */
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

  legal: {
    privacy: LegalDocument;
    terms: LegalDocument;
  };
};
