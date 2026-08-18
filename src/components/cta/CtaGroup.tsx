"use client";

import { useState } from "react";
import { CTA } from "@/config/site.config";
import { Button } from "@/components/ui/Button";
import { ApplyNowModal } from "@/components/flows/ApplyNowModal";
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
 * - JOB SEEKER ("Submit Your CV") — Developer 1 scope. Milestone 3 wired this
 *   to the real two-step Apply Now flow (WhatsApp deep link or Nodemailer
 *   email). Nothing is stored; the modal hands off and forgets.
 *
 * - EMPLOYER ("Request Staffing & Manpower") — the request-manpower flow logic
 *   is Developer 2's scope. Developer 1 places the button and leaves it on a
 *   PLACEHOLDER HANDLER so the two workstreams do not collide.
 */
export function CtaGroup({
  size = "md",
  className,
  tone = "default",
  only,
}: CtaGroupProps) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [notice, setNotice] = useState("");

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
            aria-haspopup="dialog"
            onClick={() => setApplyOpen(true)}
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
            onClick={() =>
              // Placeholder only — Developer 2 owns this flow.
              setNotice(
                `“${CTA.employer.label}” is handled by the employer request flow, which is still being built.`,
              )
            }
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
          tone === "inverse" ? "text-ink-inverse" : "text-ink-muted",
          notice ? "block" : "sr-only",
        )}
      >
        {notice}
      </p>

      {showJobSeeker && (
        <ApplyNowModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      )}
    </div>
  );
}
