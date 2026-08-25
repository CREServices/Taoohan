"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mailtoHref, hasValue, CONTACT } from "@/config/contact";
import { content } from "@/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The "Become Our Partner" flow.
 *
 * Per the approved content document: clicking the home hero's single CTA
 * routes to either (a) a "Get Exclusive Job Alerts" capture form (Name,
 * Email, Subscribe) or (b) a form where a company/employer can submit their
 * hiring needs via email. This modal offers both paths side by side, mirroring
 * the existing employer / job-seeker split used elsewhere on the site.
 *
 * Neither path calls a backend yet — a mailing-list subscription endpoint and
 * the full Nodemailer-backed submission flow are Milestone 3 scope (see the
 * same note on CtaGroup). The job-alerts form composes a mailto: to
 * info@cresvcs.com with the visitor's details so the request still reaches
 * the inbox today; the employer path is a direct mailto: link.
 */
export function PartnerModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Portalled to <body> below, so this can only render once mounted on the
  // client — SSR has no document.body to attach to. This component is only
  // ever mounted from a client event handler (PartnerCta's onClick), never
  // during the initial render, so `document` is already available the first
  // time this runs and no effect is needed to flip it after mount.
  const [mounted] = useState(() => typeof document !== "undefined");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const emailConfigured = hasValue(CONTACT.email);
  const copy = content.home.partnerModal;

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    const link = mailtoHref("Job Alerts Signup");
    if (!link) return;
    const body = `Name: ${firstName} ${lastName}\nEmail: ${email}`;
    const anchor = document.createElement("a");
    anchor.href = `${link}&body=${encodeURIComponent(body)}`;
    anchor.click();
    setSubmitted(true);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-modal-heading"
        tabIndex={-1}
        className="w-full max-w-2xl rounded-card border border-hairline bg-surface p-6 shadow-xl outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="partner-modal-heading" className="text-2xl font-semibold tracking-tight">
            {copy.heading}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="shrink-0 rounded-pill p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Job seeker path — job alerts signup */}
          <div className="rounded-card border border-hairline p-5">
            <h3 className="text-base font-semibold">{copy.jobAlerts.heading}</h3>
            <p className="mt-1 text-sm text-ink-muted">{copy.jobAlerts.lead}</p>

            {submitted ? (
              <p role="status" className="mt-4 text-sm font-medium text-brand-700">
                {copy.jobAlerts.successNote}
              </p>
            ) : !emailConfigured ? (
              <p data-empty-slot="email" className="mt-4 text-sm italic text-ink-muted">
                Awaiting client details — this form will send once an inbox is confirmed.
              </p>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={handleSubscribe}>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-ink-muted">First name</span>
                    <input
                      required
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus-visible:border-brand-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-ink-muted">Last name</span>
                    <input
                      required
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus-visible:border-brand-500"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-medium text-ink-muted">Email</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus-visible:border-brand-500"
                  />
                </label>
                <Button type="submit" size="md" className="w-full">
                  {copy.jobAlerts.submitLabel}
                </Button>
                <p className="text-xs text-ink-muted">{copy.jobAlerts.privacyNote}</p>
              </form>
            )}
          </div>

          {/* Employer path — hiring needs via email */}
          <div className="rounded-card border border-hairline p-5">
            <h3 className="text-base font-semibold">{copy.employer.heading}</h3>
            <p className="mt-1 text-sm text-ink-muted">{copy.employer.lead}</p>
            <div className={cn("mt-4 flex flex-col gap-3")}>
              {emailConfigured ? (
                <>
                  <Button
                    href={mailtoHref("Hiring Needs — Request Staffing & Manpower")!}
                    size="md"
                    variant="secondary"
                    className="w-full"
                  >
                    {copy.employer.ctaLabel}
                  </Button>
                  <p className="text-xs text-ink-muted">{copy.employer.note}</p>
                </>
              ) : (
                <p data-empty-slot="email" className="text-sm italic text-ink-muted">
                  Awaiting client details — this form will send once an inbox is confirmed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
