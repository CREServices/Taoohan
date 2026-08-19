import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  validateEmployerRequest,
  buildEmployerSubject,
  buildEmployerEmailBody,
  type EmployerRequest,
} from "@/lib/employer";

/**
 * Employer staffing request handoff — Developer 2 scope, Milestone 3.
 *
 * Deliberately mirrors `api/apply/route.ts` (Developer 1's job-seeker route) so
 * there is one credential story on the site rather than two:
 *
 * ⚠️ CREDENTIALS: every SMTP value is read from environment variables at
 * request time. Nothing is hardcoded, nothing is committed. Fill them in
 * `.env.local` locally (git-ignored) and in Vercel → Settings → Environment
 * Variables for the deployment. See `.env.local.example`.
 *
 * ⚠️ PHASE 1 — NO STORAGE: this route emails the request onward and keeps
 * nothing. No database, no file writes, no logging of employer details.
 */

// Nodemailer needs the Node runtime, not the edge runtime.
export const runtime = "nodejs";

/** SMTP transport keys — identical set to the job-seeker route. */
const REQUIRED_SMTP = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
] as const;

/**
 * Where employer requests land. `REQUEST_TO_EMAIL` lets the client route
 * staffing enquiries to a different inbox than job applications; when it is not
 * set, both land in `APPLY_TO_EMAIL`.
 */
const recipient = (): string =>
  process.env.REQUEST_TO_EMAIL?.trim() ||
  process.env.APPLY_TO_EMAIL?.trim() ||
  "";

const missingEnv = (): string[] => {
  const missing: string[] = REQUIRED_SMTP.filter(
    (key) => !process.env[key]?.trim(),
  );
  if (!recipient()) missing.push("REQUEST_TO_EMAIL or APPLY_TO_EMAIL");
  return missing;
};

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
    contactName: asString(payload.contactName),
    email: asString(payload.email),
    phone: asString(payload.phone),
    categories: Array.isArray(payload.categories)
      ? payload.categories.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    details: asString(payload.details),
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
          "Email requests are not configured yet. Please use the button to open this in your own email app, or contact us directly.",
        missingConfiguration: missing,
      },
      { status: 503 },
    );
  }

  // ---- 4. Send -----------------------------------------------------------
  const port = Number(process.env.SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipient(),
      // Replies go straight back to the employer rather than to the site's
      // no-reply sender.
      replyTo: details.email.trim(),
      subject: buildEmployerSubject(details),
      text: buildEmployerEmailBody(details),
    });
  } catch {
    // Deliberately not logging the error object: it can contain credentials
    // and employer details.
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send your request just now. Please open it in your own email app instead.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
