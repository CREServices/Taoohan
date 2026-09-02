/**
 * Shared job-seeker rules for the "I'm Looking for Work" flow.
 *
 * Kept as pure functions with no React and no Node imports so the same logic
 * can validate on the client (instant feedback in the modal) and, if ever
 * needed, on a server route — a crafted request can never bypass it.
 *
 * ⚠️ PHASE 1: the job-seeker flow is WhatsApp only — it never sends email.
 * Details are validated, the CV is uploaded to blob storage, and both are
 * handed to WhatsApp as one pre-filled message carrying a download link to
 * the CV. Nothing is written to a database.
 */

export type ApplicantDetails = {
  fullName: string;
  contactNumber: string;
  currentLocation: string;
  position: string;
  /**
   * Whether the applicant selected a CV/resume file.
   *
   * A `wa.me` deep link cannot carry a binary attachment — that is a real
   * limit of the click-to-chat API. So the file is uploaded to blob storage
   * via `POST /api/submit-cv` and the WhatsApp message carries a download
   * LINK to it, alongside the details above. Everything still reaches the
   * team through WhatsApp; nothing is emailed.
   */
  hasCv: boolean;
};

export type ValidationErrors = Partial<Record<keyof ApplicantDetails, string>>;

/**
 * CV upload limits. Shared so the modal and the API route enforce exactly the
 * same rule — a crafted request can never smuggle past what the picker allows.
 */
export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const CV_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

/**
 * Validates the chosen CV by name and size only — no File/Blob type, so the
 * same check runs in the browser and on the server.
 *
 * Returns an error message, or null when the file is acceptable.
 */
export function validateCvFile(
  file: { name: string; size: number } | null,
): string | null {
  if (!file) return "Please select your CV / resume before continuing.";

  const name = file.name.toLowerCase();
  const allowed = CV_ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!allowed) {
    return "Your CV must be a PDF, DOC or DOCX file.";
  }

  if (file.size <= 0) {
    return "That file appears to be empty. Please choose another.";
  }

  if (file.size > CV_MAX_BYTES) {
    return `Your CV must be ${CV_MAX_BYTES / (1024 * 1024)}MB or smaller.`;
  }

  return null;
}

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

  if (!details.hasCv) {
    errors.hasCv = "Please select your CV / resume before continuing.";
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
 * `cvUrl` is the uploaded CV's download link. When it is absent — the upload
 * failed, or storage is not configured — the CV lines are replaced by a note
 * asking the applicant to attach the file in the chat, so the message is
 * never left claiming a link that does not exist.
 */
export function buildWhatsAppMessage(
  details: ApplicantDetails,
  cvUrl?: string | null,
): string {
  const cvLines = cvUrl
    ? ["", "CV / Resume:", cvUrl]
    : ["", "CV / Resume: attached manually in this chat."];

  return [
    "Hello Taoohan Recruitment Team,",
    "",
    "I would like to apply for a job opportunity.",
    "",
    `Full Name: ${details.fullName.trim()}`,
    `Contact Number: ${details.contactNumber.trim()}`,
    `Current Location: ${details.currentLocation.trim()}`,
    `Position Looking For: ${details.position.trim()}`,
    ...cvLines,
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
  cvUrl?: string | null,
): string | null {
  // wa.me requires digits only: no "+", spaces or dashes.
  const digits = businessNumber.replace(/\D/g, "");
  if (!digits) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(
    buildWhatsAppMessage(details, cvUrl),
  )}`;
}
