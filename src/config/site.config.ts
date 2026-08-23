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
 * Call-to-action wording. Client-confirmed button names.
 * `href` is intentionally absent — Milestone 1 wires these to placeholder
 * handlers only. Real routing (WhatsApp deep link / Nodemailer) is Milestone 3.
 */
export const CTA = {
  /** Job-seeker CTA — real flow lands in Milestone 3. */
  jobSeeker: {
    key: "apply-now",
    label: "Submit Your CV",
    /** Short label used where horizontal space is tight (mobile header). */
    shortLabel: "Submit CV",
  },
  /** Employer CTA — flow logic lands later. Button placement only. */
  employer: {
    key: "request-manpower",
    label: "Request Staffing & Manpower",
    shortLabel: "Request Staff",
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
