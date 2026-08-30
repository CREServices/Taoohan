"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONTACT, hasValue } from "@/config/contact";
import { content } from "@/content";
import { Button } from "@/components/ui/Button";
import {
  buildWhatsAppUrl,
  validateApplicant,
  type ApplicantDetails,
  type ValidationErrors,
} from "@/lib/applicant";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/**
 * The job-seeker Apply Now flow — Developer 1 scope, Milestone 3.
 *
 * Exactly two steps, as specified:
 *   Step 1 — full name + contact number, with validation.
 *   Step 2 — choose a channel: WhatsApp (wa.me deep link, no backend) or
 *            Email (POST to /api/apply, which sends via Nodemailer/SMTP).
 *
 * ⚠️ PHASE 1: nothing is stored. The details live in component state only, long
 * enough to build a WhatsApp link or an email, and are discarded on close.
 *
 * Accessibility: role="dialog" + aria-modal, focus moves in on open and is
 * restored to the trigger on close, Tab is trapped inside, Escape closes, and
 * every field has a real <label> tied by id with errors wired via
 * aria-describedby / aria-invalid.
 */

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ApplyNowModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  /** The element that had focus before the dialog opened. */
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<ApplicantDetails>({
    fullName: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const titleId = useId();
  const nameId = useId();
  const numberId = useId();
  const nameErrorId = `${nameId}-error`;
  const numberErrorId = `${numberId}-error`;

  // Reset to a clean slate every time the dialog opens.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(1);
      setDetails({ fullName: "", contactNumber: "" });
      setErrors({});
      setStatus({ kind: "idle" });
    }
  }

  // Remember where focus came from so it can be handed back on close. This runs
  // BEFORE the focus-moving effect below (effects fire in declaration order),
  // so it still sees the trigger rather than an element inside the dialog. It
  // depends on `open` only, so changing step never overwrites it.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
  }, [open]);

  // Move focus into the dialog once it is on screen.
  useEffect(() => {
    if (!open) return;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
  }, [open, step]);

  // Escape to close, and trap Tab inside the dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock the page behind the dialog, and restore focus to the trigger on close.
  // Uses the shared reference-counted lock: this dialog can be opened from
  // inside the already-open mobile menu, and a naive unlock here would release
  // the page while the menu is still covering it.
  useEffect(() => {
    if (!open) return;
    lockScroll();

    return () => {
      unlockScroll();
      // preventScroll: restoring focus must not drag the page to the trigger.
      // Without it, closing this dialog from inside the open mobile menu
      // scrolled the locked page by ~500px.
      restoreFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // `open` only ever becomes true from a click in the browser, so by this point
  // document.body exists. On the server this renders closed and returns null.
  if (!open || typeof document === "undefined") return null;

  const whatsappUrl = buildWhatsAppUrl(CONTACT.whatsapp, details);
  const whatsappAvailable = whatsappUrl !== null;

  const goToStepTwo = () => {
    const found = validateApplicant(details);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(2);
  };

  const sendByEmail = async () => {
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          kind: "error",
          message:
            typeof data?.error === "string"
              ? data.error
              : "We could not send your application. Please try WhatsApp instead.",
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message:
          "We could not reach the server. Please check your connection or use WhatsApp.",
      });
    }
  };

  const field = (key: keyof ApplicantDetails) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setDetails((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  // Portalled to <body> so the dialog is never trapped by an ancestor that
  // creates a containing block for fixed positioning — the sticky header uses
  // backdrop-blur, which would otherwise clip a dialog rendered inside it.
  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-ink/60 p-0 motion-safe:animate-[fade-in_180ms_ease-out] sm:items-center sm:p-6"
      data-testid="apply-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="apply-modal"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-card bg-surface p-6 motion-safe:animate-[sheet-up_260ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-card sm:p-8 sm:motion-safe:animate-[dialog-in_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-muted">
              Step {step} of 2
            </p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold tracking-tight">
              {content.labels.howToApply}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="apply-close"
            aria-label="Close"
            className="-mr-2 -mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill text-ink-muted hover:bg-surface-muted"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* ------------------------------------------------- STEP 1: details */}
        {step === 1 && (
          <form
            data-testid="apply-step-1"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              goToStepTwo();
            }}
            className="mt-6"
          >
            <div>
              <label htmlFor={nameId} className="block text-sm font-medium">
                Full name
              </label>
              <input
                id={nameId}
                name="fullName"
                type="text"
                autoComplete="name"
                value={details.fullName}
                onChange={field("fullName")}
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={errors.fullName ? nameErrorId : undefined}
                className={cn(
                  "mt-2 w-full rounded-card border bg-surface px-4 py-3 text-base",
                  errors.fullName ? "border-ink" : "border-hairline",
                )}
              />
              {errors.fullName && (
                <p id={nameErrorId} className="mt-2 text-sm font-medium text-ink">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor={numberId} className="block text-sm font-medium">
                Contact number
              </label>
              <input
                id={numberId}
                name="contactNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={details.contactNumber}
                onChange={field("contactNumber")}
                aria-invalid={errors.contactNumber ? true : undefined}
                aria-describedby={
                  errors.contactNumber ? numberErrorId : undefined
                }
                className={cn(
                  "mt-2 w-full rounded-card border bg-surface px-4 py-3 text-base",
                  errors.contactNumber ? "border-ink" : "border-hairline",
                )}
              />
              {errors.contactNumber && (
                <p
                  id={numberErrorId}
                  className="mt-2 text-sm font-medium text-ink"
                >
                  {errors.contactNumber}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="mt-7 w-full">
              Continue
            </Button>
          </form>
        )}

        {/* ------------------------------------------ STEP 2: choose channel */}
        {step === 2 && (
          <div data-testid="apply-step-2" className="mt-6">
            <p className="text-sm leading-relaxed text-ink-muted">
              Choose how you would like to send your application. Whichever you
              pick, attach your CV in the chat or email that opens.
            </p>

            {/* WhatsApp */}
            <div className="mt-6 rounded-card border border-hairline p-5">
              <h3 className="text-base font-semibold">{content.labels.applyWhatsApp}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Opens WhatsApp with your name and number already filled in.
                Attach your CV in the chat and send.
              </p>
              {whatsappAvailable ? (
                <Button
                  href={whatsappUrl}
                  size="lg"
                  className="mt-4 w-full"
                  data-testid="apply-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open WhatsApp
                </Button>
              ) : (
                <p
                  data-empty-slot="whatsapp business number"
                  data-testid="apply-whatsapp-unavailable"
                  className="mt-4 rounded-card border border-dashed border-hairline bg-surface-muted p-4 text-sm text-ink-muted"
                >
                  WhatsApp is not available yet — the business number has not
                  been supplied. Please use email below.
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 rounded-card border border-hairline p-5">
              <h3 className="text-base font-semibold">{content.labels.applyEmail}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Sends your name and number to our recruitment team, who will
                reply asking for your CV.
              </p>

              {status.kind === "sent" ? (
                <p
                  role="status"
                  data-testid="apply-email-sent"
                  className="mt-4 rounded-card border border-hairline bg-surface-muted p-4 text-sm text-ink"
                >
                  Thank you, {details.fullName.trim()}. Your details have been
                  sent and our team will be in touch on {details.contactNumber.trim()}.
                </p>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="mt-4 w-full"
                    data-testid="apply-email"
                    disabled={status.kind === "sending"}
                    onClick={sendByEmail}
                  >
                    {status.kind === "sending" ? "Sending…" : "Send by email"}
                  </Button>
                  {status.kind === "error" && (
                    <p
                      role="alert"
                      data-testid="apply-email-error"
                      className="mt-3 text-sm font-medium text-ink"
                    >
                      {status.message}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                data-testid="apply-back"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-ink-muted underline underline-offset-4"
              >
                Back to your details
              </button>
              {hasValue(CONTACT.email) && (
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm font-medium text-brand-700 underline underline-offset-4"
                >
                  Email us directly
                </a>
              )}
            </div>
          </div>
        )}

        {/* Instructions, shown for both channels. */}
        <ol className="mt-7 space-y-2 border-t border-hairline pt-5">
          {(content.jobSeekers.applyInstructions ?? []).map((instruction, index) => (
            <li key={index} className="flex gap-3 text-sm text-ink-muted">
              <span className="font-medium text-ink">{index + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>

        <p className="mt-5 text-xs leading-relaxed text-ink-muted">
          {content.disclaimer}
        </p>
      </div>
    </div>,
    document.body,
  );
}
