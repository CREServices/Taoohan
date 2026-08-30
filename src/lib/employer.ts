/**
 * Shared rules for the employer Request Manpower flow — Developer 2 scope.
 *
 * Mirrors `lib/applicant.ts` deliberately: pure functions, no React and no Node
 * imports, so the SAME logic validates in the modal (instant feedback) and in
 * the API route (a crafted request cannot bypass it).
 *
 * ⚠️ PHASE 1: employer requests are validated and handed off by email. They are
 * NEVER written to a database or a file — that is Phase 2.
 *
 * Employers get email only, by agreement: WhatsApp is offered on the job-seeker
 * side, but employer requests are expected to arrive through the more formal
 * channel. There is intentionally no wa.me builder here.
 */

export type EmployerRequest = {
  contactName: string;
  email: string;
  /** Optional — employers are reached by email; a number just speeds it up. */
  phone: string;
  /** Keys from MANPOWER_CATEGORIES. Empty until the client sends the list. */
  categories: readonly string[];
  /** Free text: roles, headcount, timing. Carries the request on its own. */
  details: string;
};

export type EmployerErrors = Partial<
  Record<keyof Omit<EmployerRequest, "categories">, string>
>;

/** Digits, spaces, and the usual phone punctuation. Matches the applicant rule. */
const PHONE_ALLOWED = /^[+()\d\s-]+$/;

const digitCount = (value: string) => (value.match(/\d/g) ?? []).length;

/**
 * Pragmatic email check: one @, something either side, a dot in the domain.
 * Deliberately not an RFC 5322 regex — the goal is catching typos, and the real
 * proof an address works is that the reply arrives.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmployerRequest(
  request: EmployerRequest,
): EmployerErrors {
  const errors: EmployerErrors = {};

  const contactName = request.contactName.trim();
  if (!contactName) {
    errors.contactName = "Please enter a contact name.";
  } else if (contactName.length < 2) {
    errors.contactName = "Please enter a contact name.";
  }

  const email = request.email.trim();
  if (!email) {
    errors.email = "Please enter your work email address.";
  } else if (!EMAIL_SHAPE.test(email)) {
    errors.email = "That email address does not look right.";
  }

  // Optional, but if it is filled in it has to be plausible.
  const phone = request.phone.trim();
  if (phone) {
    if (!PHONE_ALLOWED.test(phone)) {
      errors.phone = "Use digits only, with optional +, spaces or dashes.";
    } else if (digitCount(phone) < 7) {
      errors.phone = "That contact number looks too short.";
    } else if (digitCount(phone) > 15) {
      errors.phone = "That contact number looks too long.";
    }
  }

  const details = request.details.trim();
  if (!details) {
    errors.details = "Please tell us which roles you need filled.";
  } else if (details.length < 10) {
    errors.details = "Please add a little more detail about the roles.";
  }

  return errors;
}

export const isValidEmployerRequest = (request: EmployerRequest): boolean =>
  Object.keys(validateEmployerRequest(request)).length === 0;

/** The subject line, pre-filled on every channel so replies stay findable. */
export function buildEmployerSubject(request: EmployerRequest): string {
  return `Manpower request — ${request.contactName.trim()}`;
}

/**
 * The request body. Kept here rather than in the component so the exact wording
 * is testable and identical whether it is sent by SMTP or handed to a mail app.
 */
export function buildEmployerEmailBody(request: EmployerRequest): string {
  const lines = [
    "A staffing request was submitted through the website.",
    "",
    `Contact: ${request.contactName.trim()}`,
    `Email: ${request.email.trim()}`,
  ];

  const phone = request.phone.trim();
  if (phone) lines.push(`Phone: ${phone}`);

  if (request.categories.length > 0) {
    lines.push(`Categories: ${request.categories.join(", ")}`);
  }

  lines.push("", "Requirements:", request.details.trim());

  return lines.join("\n");
}

/**
 * Builds a mailto: link with the recipient and subject already filled in.
 *
 * Returns `null` when no business email is configured — the client has not
 * supplied one yet, and a mailto to an empty address silently opens a blank
 * draft. Callers must handle null by telling the employer the channel is not
 * available, exactly as the WhatsApp builder does on the job-seeker side.
 */
export function buildEmployerMailto(
  businessEmail: string,
  request: EmployerRequest,
): string | null {
  const to = businessEmail.trim();
  if (!to) return null;

  const query = new URLSearchParams({
    subject: buildEmployerSubject(request),
    body: buildEmployerEmailBody(request),
  });

  // URLSearchParams encodes spaces as "+", which mail clients render literally
  // in the subject line. %20 is what mailto: actually wants.
  return `mailto:${to}?${query.toString().replace(/\+/g, "%20")}`;
}
