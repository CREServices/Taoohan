/**
 * Manpower categories an employer can choose from in the "I'm Hiring Staff"
 * form's Manpower Category / Industry dropdown.
 *
 * This exact list — including order and the trailing "Other" escape hatch —
 * was supplied directly, replacing the earlier placeholder slot that was
 * blocked pending a client file. It is real, approved content, not invented.
 */

export type ManpowerCategory = {
  /** Stable key — used as the <option> value and sent verbatim in the request email. */
  key: string;
  /** Label shown to the employer. */
  label: string;
};

export const MANPOWER_CATEGORIES: readonly ManpowerCategory[] = [
  { key: "construction", label: "Construction" },
  { key: "hospitality-tourism", label: "Hospitality & Tourism" },
  { key: "healthcare", label: "Healthcare" },
  { key: "it-technology", label: "IT & Technology" },
  { key: "engineering", label: "Engineering" },
  { key: "sales-marketing", label: "Sales & Marketing" },
  { key: "administration-office", label: "Administration & Office" },
  { key: "logistics-transportation", label: "Logistics & Transportation" },
  { key: "security-facilities", label: "Security & Facilities" },
  { key: "retail", label: "Retail" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "other", label: "Other" },
] as const;

/** True once the category list has entries — always true now, kept for callers that check it. */
export const hasManpowerCategories = (): boolean =>
  MANPOWER_CATEGORIES.length > 0;
