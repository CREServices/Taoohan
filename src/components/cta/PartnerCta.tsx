"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PartnerModal } from "./PartnerModal";
import { CTA } from "@/config/site.config";
import { cn } from "@/lib/cn";

/**
 * The home hero's single CTA. Opens the "Become Our Partner" modal, which
 * offers the job-alerts signup and the employer hiring-request paths.
 */
export function PartnerCta({
  size = "lg",
  className,
}: {
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size={size}
        variant="primary"
        data-testid="cta-partner"
        data-cta={CTA.heroPartner.key}
        onClick={() => setOpen(true)}
        className={cn(className)}
      >
        {CTA.heroPartner.label}
      </Button>
      {open && <PartnerModal onClose={() => setOpen(false)} />}
    </>
  );
}
