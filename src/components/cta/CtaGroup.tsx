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
 * ⚠️ MILESTONE 1: both buttons are wired to PLACEHOLDER HANDLERS ONLY.
 * - The job-seeker flow (Apply Now → WhatsApp / Nodemailer email) is built in
 *   Milestone 3.
 * - The employer "Request Staffing & Manpower" flow logic lands later too;
 *   only the button is placed here for now.
 *
 * Neither handler performs navigation, network calls or storage.
 */
export function CtaGroup({
  size = "md",
  className,
  tone = "default",
  only,
  compact = false,
}: CtaGroupProps) {
  const [notice, setNotice] = useState("");

  const placeholderHandler = (label: string) => () => {
    // Placeholder only — no real flow, no network, no storage.
    setNotice(`“${label}” is a placeholder in Milestone 1. The real flow is built in Milestone 3.`);
  };

  const showJobSeeker = only !== "employer";
  const showEmployer = only !== "jobSeeker";

  return (
    <div
      data-testid="cta-group"
      className={cn(
        "flex",
        // In the page body the buttons stack and fill the column. In the
        // header they must size to their content: `w-full` there made the
        // group claim 413px of a 1216px container, which is what pushed the
        // whole header row past the container and forced the nav to wrap.
        compact ? "w-auto items-center gap-2" : "w-full flex-col gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          compact
            ? "flex-row flex-nowrap gap-2"
            : "flex-col gap-3 sm:flex-row sm:flex-wrap",
        )}
      >
        {showJobSeeker && (
          <Button
            size={size}
            variant={tone === "inverse" ? "inverse" : "primary"}
            data-testid="cta-job-seeker"
            data-cta={CTA.jobSeeker.key}
            onClick={placeholderHandler(CTA.jobSeeker.label)}
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
            onClick={placeholderHandler(CTA.employer.label)}
          >
            {compact ? CTA.employer.shortLabel : CTA.employer.label}
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
