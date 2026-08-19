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
      className={cn(
        toneClass[tone],
        spacing === "tight" ? "py-12 sm:py-16" : "py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      {/* Every band reveals as one unit on scroll. Putting it here means all
          seven pages animate without a single page file changing — and the
          bands built on Section (stats, testimonials, CTA) inherit it too. */}
      <Container>
        <div data-reveal>{children}</div>
      </Container>
    </section>
  );
}
