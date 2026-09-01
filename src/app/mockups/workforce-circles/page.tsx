import type { Metadata } from "next";
import { content } from "@/content";
import { FeatureIcon } from "@/components/sections/FeatureIcon";

export const metadata: Metadata = {
  title: "Workforce Circle Mockups",
};

const options = [
  {
    id: "option-a",
    label: "Option A",
    title: "Soft Offset Circles",
    description: "Two pale brand circles placed behind the center cards.",
  },
  {
    id: "option-b",
    label: "Option B",
    title: "Wide Halo Circles",
    description: "Larger, quieter circles spread across the full card group.",
  },
] as const;

export default function WorkforceCircleMockupsPage() {
  return (
    <main className="bg-surface text-ink">
      <section className="px-6 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-brand-700">
              Temporary Mockup
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Workforce Solutions Circle Background Options
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Reference only. This page does not change the live Workforce section.
            </p>
          </div>

          <div className="mt-12 space-y-16">
            {options.map((option) => (
              <section key={option.id} className="rounded-card border border-hairline bg-white p-5 sm:p-8">
                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                      {option.label}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                      {option.title}
                    </h2>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-ink-muted">
                    {option.description}
                  </p>
                </div>

                <div className={`workforce-circle-mockup workforce-circle-mockup--${option.id}`}>
                  <span aria-hidden="true" className="workforce-circle workforce-circle--one" />
                  <span aria-hidden="true" className="workforce-circle workforce-circle--two" />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {content.services.heading}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-ink-muted">
                        {content.services.lead}
                      </p>
                    </div>
                    <span className="text-sm font-medium uppercase text-brand-700 underline underline-offset-4">
                      {content.services.coreHeading}
                    </span>
                  </div>

                  <ul className="relative z-10 mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {content.services.items.map((item, index) => (
                      <li
                        key={item.key}
                        className="group relative z-10 flex h-full flex-col overflow-hidden rounded-card border border-white/70 bg-white/45 p-7 shadow-[inset_0_2px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(38,51,42,0.08),inset_0_0_0_1px_rgba(255,255,255,0.46),0_-6px_18px_-16px_rgba(38,51,42,0.2),0_4px_10px_rgba(38,51,42,0.1),0_22px_48px_-14px_rgba(38,51,42,0.34)] backdrop-blur-lg transition-all duration-300 ease-out supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:backdrop-blur-lg hover:-translate-y-1 hover:border-brand-300/70 hover:bg-white/45 hover:shadow-[inset_0_2px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(38,51,42,0.1),inset_0_0_0_1px_rgba(255,255,255,0.52),0_-7px_20px_-16px_rgba(38,51,42,0.24),0_5px_12px_rgba(38,51,42,0.12),0_30px_60px_-16px_rgba(38,51,42,0.4)] supports-[backdrop-filter]:hover:bg-white/35 sm:p-8"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
                        />
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-200/70 bg-brand-50/80 text-brand-700 transition-colors duration-300 group-hover:border-brand-300 group-hover:bg-brand-100/80">
                            <FeatureIcon itemKey={item.key} className="h-6 w-6" />
                          </span>
                          <span className="text-sm font-semibold tracking-wide text-brand-700">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h4 className="mt-5 text-lg font-semibold leading-snug text-ink">
                          {item.title}
                        </h4>
                        {item.body && (
                          <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
                            {item.body}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
