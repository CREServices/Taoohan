import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Background treatment, all resolved from theme tokens. */
  tone?: "default" | "muted" | "inverse";
  /** Vertical rhythm. */
  spacing?: "default" | "tight";
  id?: string;
};

const toneClass: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-surface text-ink",
  muted: "bg-surface-muted text-ink",
  inverse: "bg-surface-inverse text-ink-inverse",
};

/** A full-bleed band with consistent vertical rhythm and a centred container. */
export function Section({
  children,
  className,
  tone = "default",
  spacing = "default",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        toneClass[tone],
        // `relative` so the watermark anchors here; `overflow-hidden` so the
        // mark can bleed past the edge without widening the page.
        "relative overflow-hidden",
        spacing === "tight" ? "py-12 sm:py-16" : "py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      {/*
        Brand watermark. Decorative only — aria-hidden, no pointer events, and
        it carries no meaning the heading does not already give.

        Position and size vary per section via `:nth-of-type` in globals.css,
        so the mark lands somewhere different down the page. Deliberately CSS
        and NOT Math.random(): a random position would differ between the
        server render and the client, which is exactly the hydration mismatch
        React reports.
      */}
      <span aria-hidden="true" data-brand-watermark className="brand-watermark" />

      {/* Every band reveals as one unit on scroll. Putting it here means all
          seven pages animate without a single page file changing — and the
          bands built on Section (stats, testimonials, CTA) inherit it too. */}
      <Container className="relative z-10">
        <div data-reveal>{children}</div>
      </Container>
    </section>
  );
}
