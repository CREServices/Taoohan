"use client";

import { useState } from "react";
import { CTA } from "@/config/site.config";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type CtaGroupProps = {
  size?: "md" | "lg";
  className?: string;
  /** `inverse` is used on dark bands so the primary button stays legible. */
  tone?: "default" | "inverse";
  /** Hide the employer CTA where only the job-seeker path is relevant. */
  only?: "jobSeeker" | "employer";
};

/**
 * The two primary calls to action.
 *
 * ⚠️ MILESTONE 1: both buttons are wired to PLACEHOLDER HANDLERS ONLY.
 * - The job-seeker flow (Apply Now → WhatsApp / Nodemailer email) is built in
 *   Milestone 3 and is Developer 1 scope.
 * - The employer "Request Staffing & Manpower" flow logic is Developer 2 scope;
 *   Developer 1 only places the button here.
 *
 * Neither handler performs navigation, network calls or storage.
 */
export function CtaGroup({
  size = "md",
  className,
  tone = "default",
  only,
}: CtaGroupProps) {
  const [notice, setNotice] = useState("");

  const placeholderHandler = (label: string) => () => {
    // Placeholder only — no real flow, no network, no storage.
    setNotice(`“${label}” is a placeholder in Milestone 1. The real flow is built in Milestone 3.`);
  };

  const showJobSeeker = only !== "employer";
  const showEmployer = only !== "jobSeeker";

  return (
    <div data-testid="cta-group" className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {showJobSeeker && (
          <Button
            size={size}
            variant={tone === "inverse" ? "inverse" : "primary"}
            data-testid="cta-job-seeker"
            data-cta={CTA.jobSeeker.key}
            onClick={placeholderHandler(CTA.jobSeeker.label)}
          >
            {CTA.jobSeeker.label}
          </Button>
        )}

        {showEmployer && (
          <Button
            size={size}
            variant="secondary"
            data-testid="cta-employer"
            data-cta={CTA.employer.key}
            onClick={placeholderHandler(CTA.employer.label)}
          >
            {CTA.employer.label}
          </Button>
        )}
      </div>

      <p
        role="status"
        aria-live="polite"
        data-testid="cta-notice"
        className={cn(
          "text-sm",
          tone === "inverse" ? "text-ink-inverse/80" : "text-ink-muted",
          notice ? "block" : "sr-only",
        )}
      >
        {notice}
      </p>
    </div>
  );
}
