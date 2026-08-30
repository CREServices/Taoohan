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
  /**
   * Use the config's `shortLabel` instead of the full button name.
   *
   * For the sticky header, where the brand, all seven nav items and both
   * buttons share one row. At full length the row needs ~1318px inside a
   * 1232px container at 1280, which is what made the nav labels wrap onto two
   * lines at every desktop width. The page body always uses the full,
   * client-approved wording.
   */
  compact?: boolean;
};

/**
 * The two primary calls to action.
 *
 * - JOB SEEKER ("Submit Your CV") opens the Apply Now flow (WhatsApp deep
 *   link or Nodemailer email via /api/apply). Nothing is stored — the modal
 *   hands off and forgets.
 * - EMPLOYER ("Request Staffing & Manpower") opens the Request Manpower flow
 *   (SMTP via /api/request-manpower, with a pre-filled mailto: fallback).
 *   Email only, by agreement — no WhatsApp on the employer side.
 */
export function CtaGroup({
  size = "md",
  className,
  tone = "default",
  only,
  compact = false,
}: CtaGroupProps) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const showJobSeeker = only !== "employer";
  const showEmployer = only !== "jobSeeker";

  return (
    <div
      data-testid="cta-group"
      className={cn(
        "flex gap-3",
        // In the page body the buttons stack and fill the column. In the
        // header they must size to their content: `w-full` there made the
        // group claim 413px of a 1216px container, which is what pushed the
        // whole header row past the container and forced the nav to wrap.
        compact ? "w-auto items-center" : "w-full flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-3",
          compact
            ? "flex-row flex-nowrap"
            : "flex-col sm:flex-row sm:flex-wrap",
        )}
      >
        {showJobSeeker && (
          <Button
            size={size}
            variant={tone === "inverse" ? "inverse" : "primary"}
            data-testid="cta-job-seeker"
            data-cta={CTA.jobSeeker.key}
            aria-haspopup="dialog"
            onClick={() => setApplyOpen(true)}
          >
            {compact ? CTA.jobSeeker.shortLabel : CTA.jobSeeker.label}
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
            {compact ? CTA.employer.shortLabel : CTA.employer.label}
          </Button>
        )}
      </div>

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
