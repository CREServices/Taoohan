"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONTACT, hasValue } from "@/config/contact";
import { MANPOWER_CATEGORIES } from "@/config/manpower";
import { content } from "@/content";
import { Button } from "@/components/ui/Button";
import {
  buildWhatsAppUrl,
  validateApplicant,
  type ApplicantDetails,
  type ValidationErrors,
} from "@/lib/applicant";
import {
  validateEmployerRequest,
  type EmployerRequest,
  type EmployerErrors,
} from "@/lib/employer";

/**
 * The "Become Our Partner" flow — the home hero's single CTA, and also what
 * the header's "Submit CV" / "Request Staff" buttons open (see CtaGroup).
 * One implementation, one interaction pattern, rather than two divergent
 * flows for the same two audiences.
 *
 *   JOB SEEKER — "I'm Looking for Work". ONE form: full name, contact /
 *   WhatsApp number, current location, position looking for, and a required
 *   CV/resume file picker. Validated, then handed straight to the official
 *   Taoohan WhatsApp with the message pre-filled — there is no email option
 *   on this side any more and no intermediate "choose a channel" step.
 *
 *   CV HANDLING: `wa.me` deep links cannot carry a file attachment — that is
 *   a real limitation of the WhatsApp Web/click-to-chat API, not something
 *   this form works around. The file picker still gates submission (you must
 *   select a CV before continuing), the redirect to WhatsApp is never
 *   blocked by the attachment limitation, and the applicant is told plainly,
 *   both before and after sending, that they need to attach the CV manually
 *   in the chat. Nothing here claims the CV was uploaded automatically.
 *
 *   EMPLOYER — "I'm Hiring Staff". ONE form, submitted directly from the
 *   site (POST to /api/request-manpower, which emails the confirmed Taoohan
 *   business inbox via SMTP) — never a `mailto:` link, never a redirect to
 *   the employer's own email application.
 *
 * ⚠️ PHASE 1 — no database. Both flows validate and hand off; nothing here is
 * ever written to storage.
 */

type Path = "job-seeker" | "employer";
type SendStatus = "idle" | "sending" | "sent" | "error";

const EMPTY_APPLICANT: ApplicantDetails = {
  fullName: "",
  contactNumber: "",
  currentLocation: "",
  position: "",
  hasCv: false,
};

const EMPTY_EMPLOYER: EmployerRequest = {
  companyName: "",
  contactPerson: "",
  businessEmail: "",
  contactNumber: "",
  countryLocation: "",
  // No blank "Select a category" placeholder option any more, so the
  // <select> itself defaults to its first <option> on mount regardless of
  // this value — starting state here at the SAME first category keeps the
  // visible selection and the actual form state in agreement from the
  // first paint, rather than showing "Construction" while category is
  // secretly still "".
  category: MANPOWER_CATEGORIES[0]?.key ?? "",
  rolesNeeded: "",
  numberOfWorkers: "",
  employmentType: "",
  expectedStartDate: "",
  message: "",
};

/** Opens a link (WhatsApp) without leaving the current page behind a blocker. */
function openInNewTab(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  anchor.click();
}

export function PartnerModal({
  onClose,
  /** Which form is showing when the dialog opens — set by whichever button opened it. */
  initialPath = "job-seeker",
}: {
  onClose: () => void;
  initialPath?: Path;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const [path, setPath] = useState<Path>(initialPath);
  const [step, setStep] = useState<"form" | "sent">("form");

  // Job seeker.
  const [applicant, setApplicant] = useState<ApplicantDetails>(EMPTY_APPLICANT);
  const [applicantErrors, setApplicantErrors] = useState<ValidationErrors>({});
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Employer.
  const [employer, setEmployer] = useState<EmployerRequest>(EMPTY_EMPLOYER);
  const [employerErrors, setEmployerErrors] = useState<EmployerErrors>({});
  const [employerStatus, setEmployerStatus] = useState<SendStatus>("idle");
  const [employerStatusMessage, setEmployerStatusMessage] = useState("");

  // Portalled to <body>, so this can only render once mounted on the client.
  // The component is only ever mounted from a click handler, never during the
  // initial render, so `document` already exists the first time this runs.
  const [mounted] = useState(() => typeof document !== "undefined");

  const copy = content.home.partnerModal;
  const whatsappReady = hasValue(CONTACT.whatsapp);

  useEffect(() => {
    // Restore focus to whatever opened the modal.
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    // The video is fully hidden behind the opaque overlay either way, so
    // pausing it for as long as the modal is open costs nothing visually and
    // saves the decode/composite work; resuming on close is exactly what the
    // visitor would expect.
    const playingVideos = Array.from(document.querySelectorAll("video")).filter(
      (video) => !video.paused,
    );
    playingVideos.forEach((video) => video.pause());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Focus trap. Without it, tabbing walks out of the dialog and into the
      // page behind, which is still rendered and still focusable.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
      playingVideos.forEach((video) => video.play().catch(() => {}));
    };
  }, [onClose]);

  const switchPath = useCallback((next: Path) => {
    setPath(next);
    setStep("form");
    setApplicantErrors({});
    setEmployerErrors({});
    setEmployerStatus("idle");
  }, []);

  // ---- Job seeker ----------------------------------------------------------

  const applicantField =
    (key: keyof Omit<ApplicantDetails, "hasCv">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setApplicant((current) => ({ ...current, [key]: value }));
      setApplicantErrors((current) => ({ ...current, [key]: undefined }));
    };

  /**
   * Contact number fields: strip anything that isn't a digit as the visitor
   * types, so the field can only ever hold digits — no letters, no "+", no
   * spaces or dashes. Applied at input time rather than left to validation
   * so a non-numeric keystroke is simply discarded instead of producing an
   * error message.
   */
  const numericField =
    (key: keyof Omit<ApplicantDetails, "hasCv">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/\D/g, "");
      setApplicant((current) => ({ ...current, [key]: value }));
      setApplicantErrors((current) => ({ ...current, [key]: undefined }));
    };

  const onCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hasCv = (event.target.files?.length ?? 0) > 0;
    setApplicant((current) => ({ ...current, hasCv }));
    setApplicantErrors((current) => ({ ...current, hasCv: undefined }));
  };

  const submitJobSeeker = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validateApplicant(applicant);
    setApplicantErrors(found);
    if (Object.keys(found).length > 0) return;

    // A missing WhatsApp business number is the one condition that can still
    // block the redirect — everything else (including the CV limitation)
    // must not.
    const href = buildWhatsAppUrl(CONTACT.whatsapp, applicant);
    if (!href) return;
    openInNewTab(href);
    setStep("sent");
  };

  // ---- Employer --------------------------------------------------------------

  const employerField =
    (key: keyof Omit<EmployerRequest, "category">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setEmployer((current) => ({ ...current, [key]: value }));
      setEmployerErrors((current) => ({ ...current, [key]: undefined }));
    };

  /** Same digit-only stripping as the job-seeker contact field, see above. */
  const numericEmployerField =
    (key: keyof Omit<EmployerRequest, "category">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/\D/g, "");
      setEmployer((current) => ({ ...current, [key]: value }));
      setEmployerErrors((current) => ({ ...current, [key]: undefined }));
    };

  const submitEmployer = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validateEmployerRequest(employer);
    setEmployerErrors(found);
    if (Object.keys(found).length > 0) return;

    setEmployerStatus("sending");
    try {
      const response = await fetch("/api/request-manpower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employer),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setEmployerStatus("error");
        setEmployerStatusMessage(
          typeof data?.error === "string"
            ? data.error
            : "We could not send your hiring request. Please try again shortly.",
        );
        return;
      }
      setEmployerStatus("sent");
      setStep("sent");
    } catch {
      setEmployerStatus("error");
      setEmployerStatusMessage(
        "We could not reach the server. Please check your connection and try again.",
      );
    }
  };

  if (!mounted) return null;

  const field =
    "mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus-visible:border-brand-500";
  const label = "text-xs font-medium text-ink-muted";
  const errorText = "mt-1 text-xs text-brand-800";
  /** Marks a required field's label — every field without "(optional)" in it. */
  const required = "text-brand-700";

  return createPortal(
    <div
      role="presentation"
      // Deliberately a flat, opaque-ish fill with NO `backdrop-blur` — a
      // backdrop-filter has to recomposite on every DOM mutation beneath it,
      // and every keystroke in a controlled input is exactly that. With the
      // blur on, typing in these forms visibly lagged; a plain fill has
      // nothing to recompute and costs nothing per keystroke.
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-ink/70 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        data-testid="partner-modal"
        className="my-auto w-full max-w-2xl rounded-card border border-hairline bg-surface p-6 shadow-xl outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={headingId} className="text-2xl font-semibold tracking-tight">
            {copy.heading}
          </h2>
          <button
            type="button"
            aria-label="Close"
            data-testid="partner-modal-close"
            onClick={onClose}
            className="shrink-0 rounded-pill p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-ink-muted">{copy.lead}</p>

        {/* ---- Audience toggle ------------------------------------------
            Switches the fields below in place. `aria-pressed` rather than a
            tablist: these swap the form, they do not reveal sibling panels.
            The label doubles as the form's own title — "I'm Looking for
            Work" / "I'm Hiring Staff". */}
        {step !== "sent" && (
          <div className="mt-5 flex gap-2 rounded-pill bg-surface-muted p-1">
            {(
              [
                ["job-seeker", copy.jobSeeker.tabLabel],
                ["employer", copy.employer.tabLabel],
              ] as const
            ).map(([key, tabLabel]) => (
              <button
                key={key}
                type="button"
                data-testid={`partner-path-${key}`}
                aria-pressed={path === key}
                onClick={() => switchPath(key)}
                className={
                  "flex-1 rounded-pill px-4 py-2 text-sm font-medium transition-colors " +
                  (path === key
                    ? "bg-brand-700 text-ink-inverse"
                    : "text-ink-muted hover:text-ink")
                }
              >
                {tabLabel}
              </button>
            ))}
          </div>
        )}

        {/* ---- Job seeker: "I'm Looking for Work" ------------------------ */}
        {path === "job-seeker" && step === "form" && (
          <form className="mt-5 space-y-4" onSubmit={submitJobSeeker} noValidate>
            <div>
              <h3 className="text-base font-semibold">{copy.jobSeeker.formHeading}</h3>
            </div>

            <label className="block">
              <span className={label}>
                Full Name<span className={required}> *</span>
              </span>
              <input
                name="fullName"
                data-testid="field-full-name"
                value={applicant.fullName}
                onChange={applicantField("fullName")}
                aria-invalid={Boolean(applicantErrors.fullName)}
                className={field}
              />
              {applicantErrors.fullName && (
                <span className={errorText}>{applicantErrors.fullName}</span>
              )}
            </label>

            <label className="block">
              <span className={label}>
                Contact Number / WhatsApp Number<span className={required}> *</span>
              </span>
              <input
                name="contactNumber"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                data-testid="field-contact-number"
                value={applicant.contactNumber}
                onChange={numericField("contactNumber")}
                aria-invalid={Boolean(applicantErrors.contactNumber)}
                className={field}
              />
              {applicantErrors.contactNumber && (
                <span className={errorText}>{applicantErrors.contactNumber}</span>
              )}
            </label>

            <label className="block">
              <span className={label}>
                Current Location<span className={required}> *</span>
              </span>
              <input
                name="currentLocation"
                data-testid="field-current-location"
                value={applicant.currentLocation}
                onChange={applicantField("currentLocation")}
                aria-invalid={Boolean(applicantErrors.currentLocation)}
                className={field}
              />
              {applicantErrors.currentLocation && (
                <span className={errorText}>{applicantErrors.currentLocation}</span>
              )}
            </label>

            <label className="block">
              <span className={label}>
                Position Looking For<span className={required}> *</span>
              </span>
              <input
                name="position"
                data-testid="field-position"
                value={applicant.position}
                onChange={applicantField("position")}
                aria-invalid={Boolean(applicantErrors.position)}
                className={field}
              />
              {applicantErrors.position && (
                <span className={errorText}>{applicantErrors.position}</span>
              )}
            </label>

            <label className="block">
              <span className={label}>
                CV / Resume Upload<span className={required}> *</span>
              </span>
              <input
                ref={cvInputRef}
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                data-testid="field-cv"
                onChange={onCvChange}
                aria-invalid={Boolean(applicantErrors.hasCv)}
                className={field}
              />
              {applicantErrors.hasCv && (
                <span className={errorText}>{applicantErrors.hasCv}</span>
              )}
              <span className="mt-1 block text-xs text-ink-muted">
                {copy.jobSeeker.cvNote}
              </span>
            </label>

            {whatsappReady ? (
              <Button
                type="submit"
                size="md"
                data-testid="job-seeker-continue"
                className="w-full"
              >
                {copy.jobSeeker.submitLabel}
              </Button>
            ) : (
              <p data-empty-slot="whatsapp" className="text-sm italic text-ink-muted">
                Awaiting client details — this will send once the WhatsApp number
                is confirmed.
              </p>
            )}
          </form>
        )}

        {/* ---- Employer: "I'm Hiring Staff" ------------------------------- */}
        {path === "employer" && step === "form" && (
          <form className="mt-5 space-y-4" onSubmit={submitEmployer} noValidate>
            <div>
              <h3 className="text-base font-semibold">{copy.employer.formHeading}</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>
                  Company Name<span className={required}> *</span>
                </span>
                <input
                  name="companyName"
                  data-testid="field-company-name"
                  value={employer.companyName}
                  onChange={employerField("companyName")}
                  aria-invalid={Boolean(employerErrors.companyName)}
                  className={field}
                />
                {employerErrors.companyName && (
                  <span className={errorText}>{employerErrors.companyName}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Contact Person<span className={required}> *</span>
                </span>
                <input
                  name="contactPerson"
                  data-testid="field-contact-person"
                  value={employer.contactPerson}
                  onChange={employerField("contactPerson")}
                  aria-invalid={Boolean(employerErrors.contactPerson)}
                  className={field}
                />
                {employerErrors.contactPerson && (
                  <span className={errorText}>{employerErrors.contactPerson}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Business Email<span className={required}> *</span>
                </span>
                <input
                  name="businessEmail"
                  type="email"
                  data-testid="field-business-email"
                  value={employer.businessEmail}
                  onChange={employerField("businessEmail")}
                  aria-invalid={Boolean(employerErrors.businessEmail)}
                  className={field}
                />
                {employerErrors.businessEmail && (
                  <span className={errorText}>{employerErrors.businessEmail}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Contact Number<span className={required}> *</span>
                </span>
                <input
                  name="contactNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  data-testid="field-employer-contact-number"
                  value={employer.contactNumber}
                  onChange={numericEmployerField("contactNumber")}
                  aria-invalid={Boolean(employerErrors.contactNumber)}
                  className={field}
                />
                {employerErrors.contactNumber && (
                  <span className={errorText}>{employerErrors.contactNumber}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Country / Location<span className={required}> *</span>
                </span>
                <input
                  name="countryLocation"
                  data-testid="field-country-location"
                  value={employer.countryLocation}
                  onChange={employerField("countryLocation")}
                  aria-invalid={Boolean(employerErrors.countryLocation)}
                  className={field}
                />
                {employerErrors.countryLocation && (
                  <span className={errorText}>{employerErrors.countryLocation}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Manpower Category / Industry<span className={required}> *</span>
                </span>
                <select
                  name="category"
                  data-testid="field-category"
                  value={employer.category}
                  onChange={(event) => {
                    const value = event.target.value;
                    setEmployer((current) => ({ ...current, category: value }));
                    setEmployerErrors((current) => ({ ...current, category: undefined }));
                  }}
                  aria-invalid={Boolean(employerErrors.category)}
                  className={field}
                >
                  {MANPOWER_CATEGORIES.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {employerErrors.category && (
                  <span className={errorText}>{employerErrors.category}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Roles / Positions Needed<span className={required}> *</span>
                </span>
                <input
                  name="rolesNeeded"
                  data-testid="field-roles-needed"
                  value={employer.rolesNeeded}
                  onChange={employerField("rolesNeeded")}
                  aria-invalid={Boolean(employerErrors.rolesNeeded)}
                  className={field}
                />
                {employerErrors.rolesNeeded && (
                  <span className={errorText}>{employerErrors.rolesNeeded}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>
                  Number of Workers Needed<span className={required}> *</span>
                </span>
                <input
                  name="numberOfWorkers"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  data-testid="field-number-of-workers"
                  value={employer.numberOfWorkers}
                  onChange={numericEmployerField("numberOfWorkers")}
                  aria-invalid={Boolean(employerErrors.numberOfWorkers)}
                  className={field}
                />
                {employerErrors.numberOfWorkers && (
                  <span className={errorText}>{employerErrors.numberOfWorkers}</span>
                )}
              </label>

              <label className="block">
                <span className={label}>Employment Type (optional)</span>
                <input
                  name="employmentType"
                  data-testid="field-employment-type"
                  value={employer.employmentType}
                  onChange={employerField("employmentType")}
                  placeholder="e.g. Full-time, Contract, Temporary"
                  className={field}
                />
              </label>

              <label className="block">
                <span className={label}>Expected Start Date (optional)</span>
                <input
                  name="expectedStartDate"
                  type="date"
                  data-testid="field-start-date"
                  value={employer.expectedStartDate}
                  onChange={employerField("expectedStartDate")}
                  className={field}
                />
              </label>
            </div>

            <label className="block">
              <span className={label}>Additional Requirements / Message (optional)</span>
              <textarea
                name="message"
                rows={3}
                data-testid="field-message"
                value={employer.message}
                onChange={employerField("message")}
                className={field}
              />
            </label>

            <Button
              type="submit"
              size="md"
              data-testid="employer-submit"
              className="w-full"
              disabled={employerStatus === "sending"}
            >
              {employerStatus === "sending" ? "Sending…" : copy.employer.ctaLabel}
            </Button>

            {employerStatus === "error" && (
              <p role="alert" data-testid="employer-error" className="text-sm text-brand-800">
                {employerStatusMessage}
              </p>
            )}
          </form>
        )}

        {/* ---- Hand-off complete --------------------------------------- */}
        {step === "sent" && (
          <div className="mt-4 space-y-4">
            <p role="status" data-testid="partner-sent" className="text-sm font-medium text-brand-700">
              {path === "job-seeker" ? copy.jobSeeker.successNote : copy.employer.successNote}
            </p>
            <Button type="button" size="md" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
