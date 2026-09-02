/**
 * Shared job-seeker rules for the "I'm Looking for Work" flow.
 *
 * Kept as pure functions with no React and no Node imports so the same logic
 * can validate on the client (instant feedback in the modal) and, if ever
 * needed, on a server route — a crafted request can never bypass it.
 *
 * ⚠️ PHASE 1: the job-seeker flow is WhatsApp only — it never sends email.
 * Details are validated and handed to WhatsApp as a pre-filled message.
 * Nothing is uploaded, stored, or written to a database.
 */

export type ApplicantDetails = {
  fullName: string;
  contactNumber: string;
  currentLocation: string;
  position: string;
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
    errors.contactNumber = "Please enter your contact / WhatsApp number.";
  } else if (!PHONE_ALLOWED.test(contactNumber)) {
    errors.contactNumber = "Use digits only, with optional +, spaces or dashes.";
  } else if (digitCount(contactNumber) < 7) {
    errors.contactNumber = "That contact number looks too short.";
  } else if (digitCount(contactNumber) > 15) {
    errors.contactNumber = "That contact number looks too long.";
  }

  if (!details.currentLocation.trim()) {
    errors.currentLocation = "Please enter your current location.";
  }

  if (!details.position.trim()) {
    errors.position = "Please enter the position you are looking for.";
  }

  return errors;
}

export const isValidApplicant = (details: ApplicantDetails): boolean =>
  Object.keys(validateApplicant(details)).length === 0;

/**
 * The message pre-filled into WhatsApp. Kept here (not in the component) so
 * the exact wording is testable. Structure is fixed — do not reorder or
 * reword the lines.
 *
 * The CV line is a standing note to the recruiter that the document is
 * coming as an attachment in the same chat — the applicant is reminded to
 * add it on the step before this message is handed over.
 */
export function buildWhatsAppMessage(details: ApplicantDetails): string {
  return [
    "Hello Taoohan Recruitment Team,",
    "",
    "I would like to apply for a job opportunity.",
    "",
    `Full Name: ${details.fullName.trim()}`,
    `Contact Number: ${details.contactNumber.trim()}`,
    `Current Location: ${details.currentLocation.trim()}`,
    `Position Looking For: ${details.position.trim()}`,
    "",
    "CV / Resume: attached in this chat.",
    "",
    "Thank you.",
  ].join("\n");
}

/**
 * Builds the wa.me deep link.
 *
 * Returns `null` when no business WhatsApp number is configured — callers
 * must handle null by telling the applicant the channel is unavailable
 * rather than building a link to an empty number.
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
