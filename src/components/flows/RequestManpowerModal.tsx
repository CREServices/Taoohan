"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONTACT } from "@/config/contact";
import { MANPOWER_CATEGORIES } from "@/config/manpower";
import { content } from "@/content";
import { Button } from "@/components/ui/Button";
import {
  buildEmployerMailto,
  validateEmployerRequest,
  type EmployerRequest,
  type EmployerErrors,
} from "@/lib/employer";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/**
 * The employer Request Manpower flow — Developer 2 scope, Milestone 3.
 *
 * Two steps, matching the shape of the job-seeker flow so the site has one
 * interaction pattern rather than two:
 *   Step 1 — who is asking: company, contact name, work email, optional phone.
 *   Step 2 — what they need: category selector (when the client's list exists)
 *            plus free text, then send.
 *
 * EMAIL ONLY, by agreement — WhatsApp is offered to job seekers but employer
 * requests come through email as the more formal channel. Two ways to send:
 *   1. POST to /api/request-manpower, which sends via Nodemailer/SMTP.
 *   2. A mailto: link with recipient and subject pre-filled, which works with
 *      no backend at all and is the fallback when SMTP is not configured yet.
 *
 * ⚠️ PHASE 1: nothing is stored. Details live in component state only, long
 * enough to build an email, and are discarded on close.
 *
 * Accessibility mirrors ApplyNowModal: role="dialog" + aria-modal, focus moves
 * in on open and is restored to the trigger on close, Tab is trapped, Escape
 * closes, every field has a real <label>, errors wired via aria-describedby.
 */

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const EMPTY_REQUEST: EmployerRequest = {
  contactName: "",
  email: "",
  phone: "",
  categories: [],
  details: "",
};

export function RequestManpowerModal({
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
  const [request, setRequest] = useState<EmployerRequest>(EMPTY_REQUEST);
  const [errors, setErrors] = useState<EmployerErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const titleId = useId();
  const contactId = useId();
  const emailId = useId();
  const phoneId = useId();
  const detailsId = useId();

  // Reset to a clean slate every time the dialog opens.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(1);
      setRequest(EMPTY_REQUEST);
      setErrors({});
      setStatus({ kind: "idle" });
    }
  }

  // Remember where focus came from so it can be handed back on close. Depends
  // on `open` only, so changing step never overwrites it.
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

  if (!open || typeof document === "undefined") return null;

  const mailtoUrl = buildEmployerMailto(CONTACT.email, request);
  const mailtoAvailable = mailtoUrl !== null;

  /** Step 1 only gates on the "who is asking" fields. */
  const goToStepTwo = () => {
    const found = validateEmployerRequest(request);
    const stepOneErrors: EmployerErrors = {
      contactName: found.contactName,
      email: found.email,
      phone: found.phone,
    };
    const blocking = Object.values(stepOneErrors).filter(Boolean);
    setErrors(stepOneErrors);
    if (blocking.length === 0) {
      setErrors({});
      setStep(2);
    }
  };

  const send = async () => {
    const found = validateEmployerRequest(request);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/request-manpower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          kind: "error",
          message:
            typeof data?.error === "string"
              ? data.error
              : "We could not send your request. Please open it in your email app instead.",
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message:
          "We could not reach the server. Please check your connection or use your own email app.",
      });
    }
  };

  const field =
    (key: keyof Omit<EmployerRequest, "categories">) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const value = event.target.value;
      setRequest((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    };

  const toggleCategory = (key: string) => {
    setRequest((current) => ({
      ...current,
      categories: current.categories.includes(key)
        ? current.categories.filter((entry) => entry !== key)
        : [...current.categories, key],
    }));
  };

  /** One labelled text input with its error wiring. */
  const textField = (
    id: string,
    key: keyof Omit<EmployerRequest, "categories">,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
    hint?: string,
  ) => {
    const errorId = `${id}-error`;
    const error = errors[key];
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
          {hint && (
            <span className="ml-2 font-normal text-ink-muted">{hint}</span>
          )}
        </label>
        <input
          id={id}
          name={key}
          type="text"
          value={request[key]}
          onChange={field(key)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-2 w-full rounded-card border bg-surface px-4 py-3 text-base",
            error ? "border-ink" : "border-hairline",
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm font-medium text-ink">
            {error}
          </p>
        )}
      </div>
    );
  };

  // Portalled to <body> for the same reason as the job-seeker dialog: the
  // sticky header's backdrop-blur creates a containing block that would
  // otherwise clip a fixed-position dialog rendered inside it.
  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-ink/60 p-0 motion-safe:animate-[fade-in_180ms_ease-out] sm:items-center sm:p-6"
      data-testid="request-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="request-modal"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-card bg-surface p-6 motion-safe:animate-[sheet-up_260ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-card sm:p-8 sm:motion-safe:animate-[dialog-in_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-muted">
              Step {step} of 2
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-semibold tracking-tight"
            >
              {content.labels.requestManpower}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="request-close"
            aria-label="Close"
            className="-mr-2 -mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill text-ink-muted hover:bg-surface-muted"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* --------------------------------------------- STEP 1: who is asking */}
        {step === 1 && (
          <form
            data-testid="request-step-1"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              goToStepTwo();
            }}
            className="mt-6 space-y-5"
          >
            {textField(contactId, "contactName", "Your name", {
              autoComplete: "name",
            })}
            {textField(emailId, "email", "Work email", {
              type: "email",
              inputMode: "email",
              autoComplete: "email",
            })}
            {textField(
              phoneId,
              "phone",
              "Phone number",
              { type: "tel", inputMode: "tel", autoComplete: "tel" },
              "(optional)",
            )}

            <Button type="submit" size="lg" className="w-full">
              Continue
            </Button>
          </form>
        )}

        {/* ------------------------------------------ STEP 2: what they need */}
        {step === 2 && (
          <div data-testid="request-step-2" className="mt-6">
            {/* Category selector — only rendered once the client's list exists.
                Until then the free-text field below carries the request on its
                own, so the flow is usable rather than blocked. */}
            {MANPOWER_CATEGORIES.length > 0 ? (
              <fieldset data-testid="request-categories">
                <legend className="text-sm font-medium">
                  {content.labels.manpowerCategories}
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {MANPOWER_CATEGORIES.map((category) => (
                    <label
                      key={category.key}
                      className="flex items-center gap-3 rounded-card border border-hairline px-4 py-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="categories"
                        value={category.key}
                        checked={request.categories.includes(category.key)}
                        onChange={() => toggleCategory(category.key)}
                      />
                      {category.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p
                data-empty-slot="manpower categories list"
                data-testid="request-categories-unavailable"
                className="rounded-card border border-dashed border-hairline bg-surface-muted p-4 text-sm text-ink-muted"
              >
                The category list has not been supplied yet — please describe
                the roles you need below and we will match them for you.
              </p>
            )}

            <div className="mt-5">
              <label htmlFor={detailsId} className="block text-sm font-medium">
                What do you need?
              </label>
              <textarea
                id={detailsId}
                name="details"
                rows={5}
                value={request.details}
                onChange={field("details")}
                placeholder="Roles, number of staff, location, and whether the placement is temporary, contract or permanent."
                aria-invalid={errors.details ? true : undefined}
                aria-describedby={
                  errors.details ? `${detailsId}-error` : undefined
                }
                className={cn(
                  "mt-2 w-full rounded-card border bg-surface px-4 py-3 text-base",
                  errors.details ? "border-ink" : "border-hairline",
                )}
              />
              {errors.details && (
                <p
                  id={`${detailsId}-error`}
                  className="mt-2 text-sm font-medium text-ink"
                >
                  {errors.details}
                </p>
              )}
            </div>

            {status.kind === "sent" ? (
              <p
                role="status"
                data-testid="request-sent"
                className="mt-6 rounded-card border border-hairline bg-surface-muted p-4 text-sm text-ink"
              >
                Thank you. Your request has been sent and our team will reply to{" "}
                {request.email.trim()}.
              </p>
            ) : (
              <>
                <Button
                  size="lg"
                  className="mt-6 w-full"
                  data-testid="request-send"
                  disabled={status.kind === "sending"}
                  onClick={send}
                >
                  {status.kind === "sending" ? "Sending…" : "Send request"}
                </Button>

                {status.kind === "error" && (
                  <p
                    role="alert"
                    data-testid="request-error"
                    className="mt-3 text-sm font-medium text-ink"
                  >
                    {status.message}
                  </p>
                )}

                {/* No-backend fallback: recipient and subject pre-filled. */}
                {mailtoAvailable ? (
                  <Button
                    href={mailtoUrl}
                    size="lg"
                    variant="secondary"
                    className="mt-3 w-full"
                    data-testid="request-mailto"
                  >
                    Open in my email app
                  </Button>
                ) : (
                  <p
                    data-empty-slot="business email address"
                    data-testid="request-mailto-unavailable"
                    className="mt-3 rounded-card border border-dashed border-hairline bg-surface-muted p-4 text-sm text-ink-muted"
                  >
                    Opening this in your own email app is not available yet —
                    the business email address has not been supplied.
                  </p>
                )}
              </>
            )}

            <div className="mt-6">
              <button
                type="button"
                data-testid="request-back"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-ink-muted underline underline-offset-4"
              >
                Back to your details
              </button>
            </div>
          </div>
        )}

        <p className="mt-7 border-t border-hairline pt-5 text-xs leading-relaxed text-ink-muted">
          {content.disclaimer}
        </p>
      </div>
    </div>,
    document.body,
  );
}
