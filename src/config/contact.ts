/**
 * Centralised contact details and social links.
 *
 * ⚠️ EVERY VALUE BELOW IS AN EMPTY TYPED SLOT AWAITING REAL CLIENT DATA.
 * The client marked these "TBD" on the intake form. Do NOT invent values.
 * Empty string = still blocked on the client. UI components must detect the
 * empty string and hide/placeholder the field rather than render a blank line.
 *
 * Filled in during Milestone 2 (contact details) and Milestone 3 (WhatsApp
 * number, which the Apply Now flow needs for its wa.me deep link).
 */

export type ContactDetails = {
  /** Receives job applications. Also becomes APPLY_TO_EMAIL in Milestone 3. */
  email: string;
  /** E.164 digits only, no "+" or spaces — used to build the wa.me link. */
  whatsapp: string;
  /** Display phone number. */
  phone: string;
  /** Office address, multi-line. */
  address: string;
  /** Office hours, e.g. "Mon–Fri, 9:00–18:00". */
  hours: string;
};

/** BLOCKED ON CLIENT — every field marked "TBD" on the intake form. */
export const CONTACT: ContactDetails = {
  email: "",
  whatsapp: "",
  phone: "",
  address: "",
  hours: "",
};

export type SocialLink = {
  key: string;
  label: string;
  /** Empty string = client has not supplied this profile yet. */
  href: string;
};

/** BLOCKED ON CLIENT — social links marked "TBD" on the intake form. */
export const SOCIALS: readonly SocialLink[] = [
  { key: "facebook", label: "Facebook", href: "" },
  { key: "linkedin", label: "LinkedIn", href: "" },
  { key: "instagram", label: "Instagram", href: "" },
] as const;

/** True when a slot has real data and may be rendered. */
export const hasValue = (value: string): boolean => value.trim().length > 0;

/** Socials that actually have a URL — safe to render. */
export const activeSocials = (): readonly SocialLink[] =>
  SOCIALS.filter((social) => hasValue(social.href));
