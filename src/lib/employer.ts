/**
 * Shared rules for the "I'm Hiring Staff" employer flow.
 *
 * Mirrors `lib/applicant.ts` deliberately: pure functions, no React and no
 * Node imports, so the same logic validates in the modal (instant feedback)
 * and in the API route (a crafted request cannot bypass it).
 *
 * ⚠️ PHASE 1: employer requests are validated and handed off by email. They
 * are never written to a database or a file.
 *
 * EMAIL ONLY — no mailto:, no WhatsApp. The client's brief for this form is
 * explicit that the employer must never be redirected to their own email
 * client; the request is sent directly from the site to the confirmed
 * business inbox (see `recipient()` in api/request-manpower/route.ts).
 */

export type EmployerRequest = {
  companyName: string;
  contactPerson: string;
  businessEmail: string;
  contactNumber: string;
  countryLocation: string;
  /** Key from MANPOWER_CATEGORIES, or "" while unselected. */
  category: string;
  rolesNeeded: string;
  /** Kept as a string in form state; validated/parsed as a positive integer. */
  numberOfWorkers: string;
  /** Optional. */
  employmentType: string;
  /** Optional. ISO date string (yyyy-mm-dd) from a <input type="date">. */
  expectedStartDate: string;
  /** Optional. */
  message: string;
};

export type EmployerErrors = Partial<Record<keyof EmployerRequest, string>>;

/** Digits, spaces, and the usual phone punctuation. */
const PHONE_ALLOWED = /^[+()\d\s-]+$/;

const digitCount = (value: string) => (value.match(/\d/g) ?? []).length;

/**
 * Pragmatic email check: one @, something either side, a dot in the domain.
 * Deliberately not an RFC 5322 regex — the goal is catching typos, and the
 * real proof an address works is that the reply arrives.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmployerRequest(
  request: EmployerRequest,
): EmployerErrors {
  const errors: EmployerErrors = {};

  if (!request.companyName.trim()) {
    errors.companyName = "Please enter your company name.";
  }

  if (!request.contactPerson.trim()) {
    errors.contactPerson = "Please enter a contact person.";
  }

  const businessEmail = request.businessEmail.trim();
  if (!businessEmail) {
    errors.businessEmail = "Please enter your business email address.";
  } else if (!EMAIL_SHAPE.test(businessEmail)) {
    errors.businessEmail = "That email address does not look right.";
  }

  const contactNumber = request.contactNumber.trim();
  if (!contactNumber) {
    errors.contactNumber = "Please enter a contact number.";
  } else if (!PHONE_ALLOWED.test(contactNumber)) {
    errors.contactNumber = "Use digits only, with optional +, spaces or dashes.";
  } else if (digitCount(contactNumber) < 7) {
    errors.contactNumber = "That contact number looks too short.";
  } else if (digitCount(contactNumber) > 15) {
    errors.contactNumber = "That contact number looks too long.";
  }

  if (!request.countryLocation.trim()) {
    errors.countryLocation = "Please enter the country / location.";
  }

  if (!request.category) {
    errors.category = "Please choose a manpower category.";
  }

  if (!request.rolesNeeded.trim()) {
    errors.rolesNeeded = "Please describe the roles / positions needed.";
  }

  const workers = request.numberOfWorkers.trim();
  if (!workers) {
    errors.numberOfWorkers = "Please enter the number of workers needed.";
  } else if (!/^\d+$/.test(workers) || Number(workers) < 1) {
    errors.numberOfWorkers = "Enter a whole number of 1 or more.";
  }

  // employmentType, expectedStartDate and message are optional — no rule.

  return errors;
}

export const isValidEmployerRequest = (request: EmployerRequest): boolean =>
  Object.keys(validateEmployerRequest(request)).length === 0;

/** The subject line, pre-filled and identifying the submission type. */
export function buildEmployerSubject(request: EmployerRequest): string {
  return `Employer Hiring Request — ${request.companyName.trim()}`;
}

/**
 * The request body. Kept here rather than in the component so the exact
 * wording is testable. Field order and labels match the client's brief.
 */
export function buildEmployerEmailBody(
  request: EmployerRequest,
  categoryLabel: string,
): string {
  return [
    "Employer Hiring Request",
    "",
    "A staffing request was submitted through the Taoohan website.",
    "",
    `Company Name: ${request.companyName.trim()}`,
    `Contact Person: ${request.contactPerson.trim()}`,
    `Business Email: ${request.businessEmail.trim()}`,
    `Contact Number: ${request.contactNumber.trim()}`,
    `Country / Location: ${request.countryLocation.trim()}`,
    `Manpower Category / Industry: ${categoryLabel}`,
    `Roles / Positions Needed: ${request.rolesNeeded.trim()}`,
    `Number of Workers Needed: ${request.numberOfWorkers.trim()}`,
    `Employment Type: ${request.employmentType.trim() || "Not specified"}`,
    `Expected Start Date: ${request.expectedStartDate.trim() || "Not specified"}`,
    `Additional Requirements / Message: ${request.message.trim() || "None"}`,
  ].join("\n");
}
