/**
 * SINGLE SOURCE OF TRUTH for site structure.
 *
 * Nav order, page names, headers and button wording all live here.
 * Changing the order of `NAV` below re-orders the navigation on EVERY page
 * (header + mobile menu + footer) — nothing else needs editing.
 *
 * MILESTONE 1: structure only. Copy lives in src/content/*, brand colour lives
 * in src/app/globals.css. Do not put real client content in this file.
 */

export type NavItem = {
  /** Stable key used by tests and by the content layer. */
  key: string;
  /** Visible menu label. Final wording is confirmed in Milestone 2. */
  label: string;
  /** Route path. */
  href: string;
};

/**
 * Client-confirmed menu order (Taoohan form response, "What order should the
 * menu be in?"). This array is the ONLY place the order is defined.
 */
export const NAV: readonly NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "services", label: "Services", href: "/services" },
  { key: "industries", label: "Industries We Serve", href: "/industries" },
  { key: "employers", label: "For Employers", href: "/for-employers" },
  { key: "jobseekers", label: "For Job Seekers", href: "/for-job-seekers" },
  { key: "contact", label: "Contact Us", href: "/contact" },
] as const;

/**
 * Call-to-action wording. Client-confirmed button names, from the approved
 * "Taoohan Website Content & Copy" document.
 * `href` is intentionally absent — real routing (WhatsApp deep link /
 * Nodemailer) is Milestone 3. The home hero's single CTA (`heroPartner`)
 * opens the Milestone 2 lead-capture modal, built in this milestone.
 */
export const CTA = {
  /** Job-seeker CTA — used on Services, For Job Seekers, Home CTA band, etc. */
  jobSeeker: {
    key: "apply-now",
    label: "Submit Your CV",
    /** Short label used where horizontal space is tight (mobile header). */
    shortLabel: "Submit CV",
  },
  /** Employer CTA — used on Services, For Employers, Industries, Home CTA band, etc. */
  employer: {
    key: "request-manpower",
    label: "Request Staffing & Manpower",
    shortLabel: "Request Staff",
  },
  /**
   * Home hero — the client asked for a SINGLE button here instead of the two
   * above ("so it doesn't feel redundant"). Opens the lead-capture modal,
   * which offers both the job-alerts signup and the employer hiring-request
   * paths in one place.
   */
  heroPartner: {
    key: "become-partner",
    label: "Become Our Partner",
  },
} as const;

export const SITE = {
  /** Legal/company name. */
  name: "Taoohan",
  /**
   * Domain is not connected in Phase 1 (Vercel preview URL only, no custom
   * domain). Client intends Taoohan.com but is still checking alternatives.
   */
  url: "",
} as const;

/** Convenience lookup used by tests and breadcrumbs. */
export const NAV_BY_HREF = Object.fromEntries(
  NAV.map((item) => [item.href, item]),
) as Record<string, NavItem>;
