"use client";

import { useState } from "react";
import { CTA } from "@/config/site.config";
import { Button } from "@/components/ui/Button";
import { ApplyNowModal } from "@/components/flows/ApplyNowModal";
import { RequestManpowerModal } from "@/components/flows/RequestManpowerModal";
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
 * - EMPLOYER ("Request Staffing & Manpower") — Developer 2 scope. Milestone 3
 *   replaced Developer 1's placeholder handler with the real two-step employer
 *   request flow (SMTP via /api/request-manpower, with a pre-filled mailto:
 *   fallback). Email only, by agreement — no WhatsApp on the employer side.
 */
export function CtaGroup({
  size = "md",
  className,
  tone = "default",
  only,
}: CtaGroupProps) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

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
            aria-haspopup="dialog"
            onClick={() => setRequestOpen(true)}
          >
            {CTA.employer.label}
          </Button>
        )}
      </div>

      {/* The `cta-notice` live region that used to announce the employer
          placeholder is gone: the button now opens a real dialog, which
          announces itself. */}

      {showJobSeeker && (
        <ApplyNowModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      )}

      {showEmployer && (
        <RequestManpowerModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
        />
      )}
    </div>
  );
}
