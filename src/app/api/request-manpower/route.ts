import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT, hasValue } from "@/config/contact";
import { MANPOWER_CATEGORIES } from "@/config/manpower";
import {
  validateEmployerRequest,
  buildEmployerSubject,
  buildEmployerEmailBody,
  type EmployerRequest,
} from "@/lib/employer";

/**
 * Employer hiring-request handoff — "I'm Hiring Staff" form.
 *
 * The client's brief for this form is explicit: the employer must NEVER be
 * redirected to their own email application (no `mailto:`). The website
 * handles the submission directly, sending it on to the confirmed Taoohan
 * business inbox via SMTP.
 *
 * ⚠️ CREDENTIALS: the SMTP LOGIN (host/port/user/pass/from) is read from
 * environment variables at request time — nothing hardcoded, nothing
 * committed. Fill them in `.env.local` locally (git-ignored) and in the
 * deployment's environment variables. See `.env.local.example`.
 *
 * The RECIPIENT, however, is the already-confirmed business address in
 * `src/config/contact.ts` (`CONTACT.email` — "General inquiries, employer
 * requests, business questions"), not a separate invented env var. An
 * operator can still override it with REQUEST_TO_EMAIL / APPLY_TO_EMAIL if
 * the client ever wants staffing enquiries routed to a different inbox.
 *
 * ⚠️ PHASE 1 — NO STORAGE: this route emails the request onward and keeps
 * nothing. No database, no file writes, no logging of employer details.
 */

// Nodemailer needs the Node runtime, not the edge runtime.
export const runtime = "nodejs";

/** SMTP transport keys — the "how to send" half of the configuration. */
const REQUIRED_SMTP = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
] as const;

/**
 * Where employer requests land. An env override takes priority — for a
 * client who wants staffing enquiries kept separate from job applications —
 * but falls back to the already-confirmed `CONTACT.email`, so this route
 * works out of the box once SMTP login credentials exist, with nothing
 * invented for the recipient.
 */
const recipient = (): string =>
  process.env.REQUEST_TO_EMAIL?.trim() ||
  process.env.APPLY_TO_EMAIL?.trim() ||
  (hasValue(CONTACT.email) ? CONTACT.email.trim() : "");

const missingEnv = (): string[] => {
  const missing: string[] = REQUIRED_SMTP.filter(
    (key) => !process.env[key]?.trim(),
  );
  if (!recipient()) missing.push("REQUEST_TO_EMAIL, APPLY_TO_EMAIL, or CONTACT.email");
  return missing;
};

const categoryLabel = (key: string): string =>
  MANPOWER_CATEGORIES.find((category) => category.key === key)?.label ?? key;

export async function POST(request: Request) {
  // ---- 1. Parse ----------------------------------------------------------
  let payload: Partial<EmployerRequest>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const asString = (value: unknown): string =>
    typeof value === "string" ? value : "";

  const details: EmployerRequest = {
    companyName: asString(payload.companyName),
    contactPerson: asString(payload.contactPerson),
    businessEmail: asString(payload.businessEmail),
    contactNumber: asString(payload.contactNumber),
    countryLocation: asString(payload.countryLocation),
    category: asString(payload.category),
    rolesNeeded: asString(payload.rolesNeeded),
    numberOfWorkers: asString(payload.numberOfWorkers),
    employmentType: asString(payload.employmentType),
    expectedStartDate: asString(payload.expectedStartDate),
    message: asString(payload.message),
  };

  // ---- 2. Validate (server-side, never trusting the client) --------------
  const errors = validateEmployerRequest(details);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  // ---- 3. Confirm the mail transport is configured -----------------------
  const missing = missingEnv();
  if (missing.length > 0) {
    // 503, not 500: the code is fine, the deployment is not yet configured.
    // The response names the missing keys but never echoes their values.
    return NextResponse.json(
      {
        ok: false,
        error:
          "Hiring requests are not configured yet. Please contact us directly at " +
          (hasValue(CONTACT.email) ? CONTACT.email : CONTACT.phone) +
          ".",
        missingConfiguration: missing,
      },
      { status: 503 },
    );
  }

  // ---- 4. Send -----------------------------------------------------------
  const port = Number(process.env.SMTP_PORT?.trim());
  const smtpUser = process.env.SMTP_USER!.trim();
  // Google displays app passwords in four groups for readability. Vercel
  // values are easy to paste in that format, but SMTP needs the raw value.
  const smtpPass = process.env.SMTP_PASS!.replace(/\s+/g, "");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!.trim(),
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      // Keep the authenticated address fixed for deliverability, while the
      // display name identifies the employer in the recipient's inbox.
      from: {
        name: `${details.companyName.trim()} via Taoohan`,
        address: smtpUser,
      },
      to: recipient(),
      // Replies go straight back to the employer rather than to the site's
      // no-reply sender.
      replyTo: details.businessEmail.trim(),
      subject: buildEmployerSubject(details),
      text: buildEmployerEmailBody(details, categoryLabel(details.category)),
    });
  } catch (error) {
    // Keep diagnostics useful in Vercel without logging credentials or form
    // contents. Nodemailer exposes these non-sensitive classification fields.
    const smtpError = error as {
      code?: string;
      command?: string;
      responseCode?: number;
    };
    console.error("Hiring request SMTP failure", {
      code: smtpError.code ?? "UNKNOWN",
      command: smtpError.command ?? "UNKNOWN",
      responseCode: smtpError.responseCode ?? null,
    });
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send your hiring request just now. Please try again shortly or contact us directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
