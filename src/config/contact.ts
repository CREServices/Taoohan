/**
 * Centralised contact details and social links.
 *
 * ⚠️ email and whatsapp WERE empty typed slots pending explicit client
 * sign-off; the client has now confirmed all three values, matching the
 * approved content document (manpower@cresvcs.com, +971 54 466 1984,
 * +971 50 863 4011). The Milestone 2 gate's contact-slot rule
 * (.claude/gate.mjs) was updated in the same change so it does not flag
 * these as unconfirmed.
 *
 * Social links remain BLOCKED ON CLIENT ("Social media links are TBD ...
 * please do not create or add placeholder social media links") — the
 * `SOCIALS` array stays empty and every value is a typed empty slot so the
 * UI hides the section rather than rendering blank rows or invented links.
 */

export type ContactDetails = {
  /** General inquiries, employer requests, business questions. */
  email: string;
  /** Display phone number — direct inquiries / general assistance. */
  phone: string;
  /** Display WhatsApp number — for job seekers submitting their CV. */
  whatsapp: string;
};

/** Client-confirmed contact details. */
export const CONTACT: ContactDetails = {
  email: "manpower@cresvcs.com",
  phone: "+971 54 466 1984",
  whatsapp: "+971 50 863 4011",
};

export type SocialLink = {
  key: string;
  label: string;
  /** Empty string = client has not supplied this profile yet. */
  href: string;
};

/** BLOCKED ON CLIENT — social links marked TBD in the approved copy. Hidden. */
export const SOCIALS: readonly SocialLink[] = [] as const;

/** True when a slot has real data and may be rendered. */
export const hasValue = (value: string): boolean => value.trim().length > 0;

/** Socials that actually have a URL — safe to render. */
export const activeSocials = (): readonly SocialLink[] =>
  SOCIALS.filter((social) => hasValue(social.href));

/**
 * WhatsApp deep link, built from the display number (digits only).
 * Returns null while the slot is empty so callers can hide/disable the CTA
 * instead of building a broken `wa.me/` link with no number.
 */
export const whatsappHref = (message?: string): string | null => {
  if (!hasValue(CONTACT.whatsapp)) return null;
  const digits = CONTACT.whatsapp.replace(/[^0-9]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
};

/**
 * mailto: link, built from the confirmed inbox.
 * Returns null while the slot is empty so callers can hide/disable the CTA
 * instead of building a broken `mailto:` link with no address.
 */
export const mailtoHref = (subject?: string): string | null => {
  if (!hasValue(CONTACT.email)) return null;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${CONTACT.email}${query}`;
};
