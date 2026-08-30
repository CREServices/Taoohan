import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { validateApplicant, type ApplicantDetails } from "@/lib/applicant";

/**
 * Job application handoff — the EMAIL channel of the Apply Now flow.
 *
 * ⚠️ CREDENTIALS: every SMTP value is read from environment variables at
 * request time. Nothing is hardcoded, nothing is committed. Fill them in
 * `.env.local` locally (git-ignored) and in Vercel → Settings → Environment
 * Variables for the deployment. See `.env.local.example`.
 *
 * ⚠️ PHASE 1 — NO STORAGE: this route emails the application onward and keeps
 * nothing. No database, no file writes, no logging of applicant details.
 */

// Nodemailer needs the Node runtime, not the edge runtime.
export const runtime = "nodejs";

/** The env keys this route depends on. */
const REQUIRED_ENV = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "APPLY_TO_EMAIL",
] as const;

const missingEnv = (): string[] =>
  REQUIRED_ENV.filter((key) => !process.env[key]?.trim());

export async function POST(request: Request) {
  // ---- 1. Parse ----------------------------------------------------------
  let payload: Partial<ApplicantDetails>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const details: ApplicantDetails = {
    fullName: typeof payload.fullName === "string" ? payload.fullName : "",
    contactNumber:
      typeof payload.contactNumber === "string" ? payload.contactNumber : "",
  };

  // ---- 2. Validate (server-side, never trusting the client) --------------
  const errors = validateApplicant(details);
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
          "Email applications are not configured yet. Please use the WhatsApp option, or contact us directly.",
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

  const fullName = details.fullName.trim();
  const contactNumber = details.contactNumber.trim();

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.APPLY_TO_EMAIL,
      subject: `New job application — ${fullName}`,
      text: [
        "A new job application was submitted through the website.",
        "",
        `Name: ${fullName}`,
        `Contact number: ${contactNumber}`,
        "",
        "The applicant was asked to reply to this thread with their CV attached.",
      ].join("\n"),
    });
  } catch {
    // Deliberately not logging the error object: it can contain credentials
    // and applicant details.
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send your application just now. Please try the WhatsApp option instead.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
