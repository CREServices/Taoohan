import { NextResponse } from "next/server";
import {
  validateApplicant,
  validateCvFile,
  type ApplicantDetails,
} from "@/lib/applicant";
import { storeCv } from "@/lib/cv-storage";

/**
 * Job-seeker CV upload — the "I'm Looking for Work" form.
 *
 * The client's brief for this side is explicit: it is WHATSAPP ONLY. This
 * route sends no email and offers no `mailto:`. Its single job is to park the
 * uploaded CV somewhere durable and hand back a URL, which the modal folds
 * into the pre-filled WhatsApp message alongside the applicant's details — so
 * the recruiter receives everything in one chat, the CV included as a link.
 *
 * The applicant's details are re-validated here rather than trusted from the
 * client: this endpoint is reachable directly, and an unvalidated file write
 * is not something to leave open.
 *
 * ⚠️ PHASE 1 — NO DATABASE. The CV is stored under a random id and nothing
 * else is recorded: no applicant row, no log of the details, no index tying
 * the file back to a person. The WhatsApp message is the only record, and it
 * lives in the recruiter's chat, not here.
 */

// Blob storage and the local fallback both need Node, not the edge runtime.
export const runtime = "nodejs";

const asString = (value: FormDataEntryValue | null): string =>
  typeof value === "string" ? value : "";

export async function POST(request: Request) {
  // ---- 1. Parse ----------------------------------------------------------
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const details: ApplicantDetails = {
    fullName: asString(form.get("fullName")),
    contactNumber: asString(form.get("contactNumber")),
    currentLocation: asString(form.get("currentLocation")),
    position: asString(form.get("position")),
    // Presence of the file is what decides this, not a client-sent flag.
    hasCv: form.get("cv") instanceof File,
  };

  // ---- 2. Validate (server-side, never trusting the client) --------------
  const errors = validateApplicant(details);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const cv = form.get("cv");
  if (!(cv instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Please attach your CV / resume." },
      { status: 400 },
    );
  }

  const fileError = validateCvFile({ name: cv.name, size: cv.size });
  if (fileError) {
    return NextResponse.json({ ok: false, error: fileError }, { status: 400 });
  }

  // ---- 3. Store ----------------------------------------------------------
  try {
    const url = await storeCv(cv, new URL(request.url).origin);
    return NextResponse.json({ ok: true, url });
  } catch {
    // Deliberately not logging the error object — it can carry storage
    // credentials. The modal treats a failure as "send without the link and
    // tell the applicant to attach manually", so this never blocks WhatsApp.
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not upload your CV just now. Please attach it manually in the WhatsApp chat.",
      },
      { status: 502 },
    );
  }
}
