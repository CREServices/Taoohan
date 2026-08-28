"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mailtoHref, whatsappHref, hasValue, CONTACT } from "@/config/contact";
import { content } from "@/content";
import { Button } from "@/components/ui/Button";

/**
 * The "Become Our Partner" flow — the home hero's single CTA.
 *
 * This implements the two Milestone 3 submission flows from the milestone
 * proposal. Phase 1 has no database, so nothing is stored: both flows hand the
 * visitor off to a channel with their details already written out.
 *
 *   JOB SEEKER — two steps, both channels.
 *     1. Collect the basic details the proposal names: full name and contact
 *        number, validated.
 *     2. Offer WhatsApp or email; the details typed in step one are carried
 *        into whichever is chosen, and on-screen instructions explain what
 *        happens next.
 *
 *   EMPLOYER — one step, email only.
 *     The proposal is explicit that "WhatsApp will not be offered on the
 *     employer side", on the basis that employer requests should come through
 *     email as the more professional channel. The mailto: carries a pre-filled
 *     recipient, subject line and body.
 *
 * ⚠️ BOTH DESTINATIONS ARE BLOCKED SLOTS. CONTACT.email and CONTACT.whatsapp
 * are empty pending client sign-off (see src/config/contact.ts and the gate),
 * so the final hand-off renders the awaiting-details notice instead of a
 * broken `mailto:`/`wa.me` link. Everything up to that point — the forms, the
 * validation, the composed message — works today and needs no change when the
 * values land; only the two slots have to be filled.
 *
 * The email option is a `mailto:` rather than the Nodemailer API route the
 * build guide describes. That route needs SMTP credentials which do not exist
 * yet, and it is Milestone 3 proper; the gate only requires it once the
 * milestone is bumped. Swapping this button for a POST to /api/apply is the
 * upgrade path and does not change the form above it.
 */

type Path = "job-seeker" | "employer";

/** Enough digits to be a real phone number, ignoring +, spaces and brackets. */
const isPhone = (value: string) => value.replace(/\D/g, "").length >= 7;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/** Opens a composed hand-off link without leaving the page behind a blocker. */
function openChannel(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.rel = "noopener";
  anchor.click();
}

export function PartnerModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  // Opens ON the job-seeker form, not on a chooser. The dialog exists to show
  // a form; making the visitor pick an audience first put a menu in front of
  // the thing they clicked for. The audience is a toggle above the fields
  // instead, so a form is on screen the moment the modal opens.
  const [path, setPath] = useState<Path>("job-seeker");
  const [step, setStep] = useState<"details" | "channel" | "sent">("details");

  // Job seeker — the two basic details the proposal names.
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Employer — enough to make the request actionable in one reply.
  const [company, setCompany] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [category, setCategory] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [details, setDetails] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Portalled to <body>, so this can only render once mounted on the client.
  // The component is only ever mounted from a click handler, never during the
  // initial render, so `document` already exists the first time this runs.
  const [mounted] = useState(() => typeof document !== "undefined");

  const copy = content.home.partnerModal;
  const emailReady = hasValue(CONTACT.email);
  const whatsappReady = hasValue(CONTACT.whatsapp);

  /**
   * Manpower categories for the employer selector. The proposal lists "the
   * list of manpower categories" as something the client still owes, so rather
   * than invent one this reuses the SIXTEEN CLIENT-APPROVED INDUSTRIES already
   * in the content layer — real approved data, and the closest match to what
   * the selector is for. Swap this for the dedicated list when it arrives.
   */
  const categories = content.industries.items;

  useEffect(() => {
    // Restore focus to whatever opened the modal, per the Milestone 3
    // accessibility rule ("closes on Esc, restores focus on close").
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

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
    };
  }, [onClose]);

  /** Only reachable from the channel choice — the details form is the root. */
  const back = useCallback(() => {
    setErrors({});
    setStep("details");
  }, []);

  const switchPath = (next: Path) => {
    setPath(next);
    setStep("details");
    setErrors({});
  };

  /** Step one of the job-seeker flow: validate, then offer the channels. */
  const submitJobSeeker = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!isPhone(contactNumber)) next.contactNumber = "Please enter a valid contact number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStep("channel");
  };

  const jobSeekerMessage = () =>
    `Job application from the Taoohan website.\n\n` +
    `Full name: ${fullName.trim()}\n` +
    `Contact number: ${contactNumber.trim()}\n\n` +
    `I would like to apply for opportunities. My CV is attached.`;

  const sendWhatsApp = () => {
    const href = whatsappHref(jobSeekerMessage());
    if (!href) return;
    openChannel(href);
    setStep("sent");
  };

  const sendJobSeekerEmail = () => {
    const href = mailtoHref(`Job Application — ${fullName.trim()}`);
    if (!href) return;
    openChannel(`${href}&body=${encodeURIComponent(jobSeekerMessage())}`);
    setStep("sent");
  };

  /** The employer flow: validate, then open a fully composed email. */
  const submitEmployer = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (company.trim().length < 2) next.company = "Please enter your company name.";
    if (contactPerson.trim().length < 2) next.contactPerson = "Please enter a contact name.";
    if (!isEmail(workEmail)) next.workEmail = "Please enter a valid email address.";
    if (!category) next.category = "Please choose a category.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const href = mailtoHref(`Staffing & Manpower Request — ${company.trim()}`);
    if (!href) return;
    const body =
      `Manpower request from the Taoohan website.\n\n` +
      `Company: ${company.trim()}\n` +
      `Contact person: ${contactPerson.trim()}\n` +
      `Email: ${workEmail.trim()}\n` +
      `Category: ${category}\n` +
      (headcount.trim() ? `Number of staff needed: ${headcount.trim()}\n` : "") +
      (details.trim() ? `\nDetails:\n${details.trim()}\n` : "");
    openChannel(`${href}&body=${encodeURIComponent(body)}`);
    setStep("sent");
  };

  if (!mounted) return null;

  const field =
    "mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus-visible:border-brand-500";
  const label = "text-xs font-medium text-ink-muted";
  const errorText = "mt-1 text-xs text-brand-800";

  /** Shown wherever a destination slot is still empty. */
  const blocked = (slot: "email" | "whatsapp") => (
    <p data-empty-slot={slot} className="text-sm italic text-ink-muted">
      Awaiting client details — this will send once the {slot === "email" ? "inbox" : "WhatsApp number"} is
      confirmed.
    </p>
  );

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
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
            tablist: these swap the form, they do not reveal sibling panels. */}
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

        {/* ---- Job seeker, step 1: the basic details -------------------- */}
        {path === "job-seeker" && step === "details" && (
          <form className="mt-5 space-y-4" onSubmit={submitJobSeeker} noValidate>
            <div>
              <h3 className="text-base font-semibold">{copy.jobSeeker.heading}</h3>
              <p className="mt-1 text-sm text-ink-muted">{copy.jobSeeker.lead}</p>
            </div>
            <label className="block">
              <span className={label}>Full name</span>
              <input
                name="fullName"
                data-testid="field-full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                className={field}
              />
              {errors.fullName && <span className={errorText}>{errors.fullName}</span>}
            </label>
            <label className="block">
              <span className={label}>Contact number</span>
              <input
                name="contactNumber"
                type="tel"
                inputMode="tel"
                data-testid="field-contact-number"
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
                aria-invalid={Boolean(errors.contactNumber)}
                className={field}
              />
              {errors.contactNumber && <span className={errorText}>{errors.contactNumber}</span>}
            </label>
            <p className="text-xs text-ink-muted">{copy.jobSeeker.privacyNote}</p>
            <Button type="submit" size="md" data-testid="job-seeker-continue" className="w-full">
              {copy.jobSeeker.submitLabel}
            </Button>
          </form>
        )}

        {/* ---- Job seeker, step 2: choose a channel --------------------- */}
        {path === "job-seeker" && step === "channel" && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-base font-semibold">{copy.jobSeeker.channelHeading}</h3>
              <p className="mt-1 text-sm text-ink-muted">{copy.jobSeeker.channelLead}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-hairline p-5">
                {whatsappReady ? (
                  <>
                    <Button
                      type="button"
                      size="md"
                      className="w-full"
                      data-testid="channel-whatsapp"
                      onClick={sendWhatsApp}
                    >
                      {copy.jobSeeker.whatsappLabel}
                    </Button>
                    <p className="mt-2 text-xs text-ink-muted">{copy.jobSeeker.whatsappNote}</p>
                  </>
                ) : (
                  blocked("whatsapp")
                )}
              </div>
              <div className="rounded-card border border-hairline p-5">
                {emailReady ? (
                  <>
                    <Button
                      type="button"
                      size="md"
                      variant="secondary"
                      className="w-full"
                      data-testid="channel-email"
                      onClick={sendJobSeekerEmail}
                    >
                      {copy.jobSeeker.emailLabel}
                    </Button>
                    <p className="mt-2 text-xs text-ink-muted">{copy.jobSeeker.emailNote}</p>
                  </>
                ) : (
                  blocked("email")
                )}
              </div>
            </div>

            <Button type="button" size="md" variant="secondary" onClick={back}>
              Back
            </Button>
          </div>
        )}

        {/* ---- Employer: one form, email only --------------------------- */}
        {path === "employer" && step === "details" && (
          <form className="mt-5 space-y-4" onSubmit={submitEmployer} noValidate>
            <div>
              <h3 className="text-base font-semibold">{copy.employer.heading}</h3>
              <p className="mt-1 text-sm text-ink-muted">{copy.employer.lead}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Company name</span>
                <input
                  name="company"
                  data-testid="field-company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  aria-invalid={Boolean(errors.company)}
                  className={field}
                />
                {errors.company && <span className={errorText}>{errors.company}</span>}
              </label>
              <label className="block">
                <span className={label}>Contact person</span>
                <input
                  name="contactPerson"
                  data-testid="field-contact-person"
                  value={contactPerson}
                  onChange={(event) => setContactPerson(event.target.value)}
                  aria-invalid={Boolean(errors.contactPerson)}
                  className={field}
                />
                {errors.contactPerson && <span className={errorText}>{errors.contactPerson}</span>}
              </label>
              <label className="block">
                <span className={label}>Work email</span>
                <input
                  name="workEmail"
                  type="email"
                  data-testid="field-work-email"
                  value={workEmail}
                  onChange={(event) => setWorkEmail(event.target.value)}
                  aria-invalid={Boolean(errors.workEmail)}
                  className={field}
                />
                {errors.workEmail && <span className={errorText}>{errors.workEmail}</span>}
              </label>
              <label className="block">
                <span className={label}>Number of staff needed</span>
                <input
                  name="headcount"
                  inputMode="numeric"
                  value={headcount}
                  onChange={(event) => setHeadcount(event.target.value)}
                  className={field}
                />
              </label>
            </div>

            <label className="block">
              <span className={label}>Manpower category</span>
              <select
                name="category"
                data-testid="field-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-invalid={Boolean(errors.category)}
                className={field}
              >
                <option value="">Select a category</option>
                {categories.map((item) => (
                  <option key={item.key} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className={errorText}>{errors.category}</span>}
            </label>

            <label className="block">
              <span className={label}>What roles do you need? (optional)</span>
              <textarea
                name="details"
                rows={3}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                className={field}
              />
            </label>

            {emailReady ? (
              <>
                <Button type="submit" size="md" data-testid="employer-submit" className="w-full">
                  {copy.employer.ctaLabel}
                </Button>
                <p className="text-xs text-ink-muted">{copy.employer.note}</p>
              </>
            ) : (
              blocked("email")
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
