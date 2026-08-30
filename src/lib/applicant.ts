/**
 * Shared applicant-detail rules for the Apply Now flow.
 *
 * Kept as pure functions with no React and no Node imports so the SAME logic
 * validates on the client (instant feedback in the modal) and on the server
 * (the API route can never be bypassed by a crafted request).
 *
 * ⚠️ PHASE 1: applicant details are validated and handed off to WhatsApp or
 * email. They are NEVER written to a database or a file — that is Phase 2.
 */

export type ApplicantDetails = {
  fullName: string;
  contactNumber: string;
};

export type ValidationErrors = Partial<Record<keyof ApplicantDetails, string>>;

/** Digits, spaces, and the usual phone punctuation. */
const PHONE_ALLOWED = /^[+()\d\s-]+$/;

/** Count of actual digits, ignoring formatting. */
const digitCount = (value: string) => (value.match(/\d/g) ?? []).length;

export function validateApplicant(details: ApplicantDetails): ValidationErrors {
  const errors: ValidationErrors = {};

  const fullName = details.fullName.trim();
  if (!fullName) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  const contactNumber = details.contactNumber.trim();
  if (!contactNumber) {
    errors.contactNumber = "Please enter your contact number.";
  } else if (!PHONE_ALLOWED.test(contactNumber)) {
    errors.contactNumber = "Use digits only, with optional +, spaces or dashes.";
  } else if (digitCount(contactNumber) < 7) {
    errors.contactNumber = "That contact number looks too short.";
  } else if (digitCount(contactNumber) > 15) {
    errors.contactNumber = "That contact number looks too long.";
  }

  return errors;
}

export const isValidApplicant = (details: ApplicantDetails): boolean =>
  Object.keys(validateApplicant(details)).length === 0;

/**
 * The message pre-filled into WhatsApp. Kept here (not in the component) so the
 * exact wording is testable.
 */
export function buildWhatsAppMessage(details: ApplicantDetails): string {
  return [
    "Hello Taoohan, I would like to apply for a job.",
    `Name: ${details.fullName.trim()}`,
    `Contact number: ${details.contactNumber.trim()}`,
    "I will attach my CV in this chat.",
  ].join("\n");
}

/**
 * Builds the wa.me deep link.
 *
 * Returns `null` when no business WhatsApp number is configured — the client
 * has not supplied one yet, and a link to an empty number would silently fail.
 * Callers must handle null by telling the user the channel is unavailable.
 */
export function buildWhatsAppUrl(
  businessNumber: string,
  details: ApplicantDetails,
): string | null {
  // wa.me requires digits only: no "+", spaces or dashes.
  const digits = businessNumber.replace(/\D/g, "");
  if (!digits) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(
    buildWhatsAppMessage(details),
  )}`;
}
