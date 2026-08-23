import { Section } from "@/components/ui/Section";
import { CtaGroup } from "@/components/cta/CtaGroup";

type CtaBandProps = {
  heading: string;
  body: string;
  only?: "jobSeeker" | "employer";
};

/** Closing conversion band, repeated at the foot of every page. */
export function CtaBand({ heading, body, only }: CtaBandProps) {
  return (
    <Section tone="inverse" spacing="tight">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-inverse/75">
            {body}
          </p>
        </div>
        <div className="lg:shrink-0">
          <CtaGroup size="lg" tone="inverse" only={only} />
        </div>
      </div>
    </Section>
  );
}
