"use client";

import { useState } from "react";
import { CTA } from "@/config/site.config";
import { Button } from "@/components/ui/Button";
import { PartnerModal } from "./PartnerModal";
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
 * Both open the SAME "Become Our Partner" dialog (`PartnerModal`) that the
 * hero's own CTA uses — one interaction pattern for the two audiences,
 * rather than a separate dialog per entry point. Which form is showing when
 * the dialog opens is set by which button was clicked.
 *
 * - JOB SEEKER ("Submit Your CV") opens on "I'm Looking for Work" — full
 *   name, contact/WhatsApp number, current location, position, CV upload —
 *   then hands off to the official Taoohan WhatsApp.
 * - EMPLOYER ("Request Staffing & Manpower") opens on "I'm Hiring Staff",
 *   submitted directly from the site by email (POST /api/request-manpower) —
 *   never a redirect to the employer's own email application.
 */
export function CtaGroup({
  size = "md",
  className,
  tone = "default",
  only,
  compact = false,
}: CtaGroupProps) {
  const [open, setOpen] = useState<"job-seeker" | "employer" | null>(null);

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
            onClick={() => setOpen("job-seeker")}
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
            onClick={() => setOpen("employer")}
          >
            {compact ? CTA.employer.shortLabel : CTA.employer.label}
          </Button>
        )}
      </div>

      {open && (
        <PartnerModal initialPath={open} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
