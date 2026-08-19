/**
 * Manpower categories an employer can request — Developer 2 scope.
 *
 * ⚠️ BLOCKED ON CLIENT. The intake form answered "Will send you a separate file
 * for the format", so this list is an EMPTY TYPED SLOT. Do NOT populate it from
 * the services or industries lists: those answer different questions, and
 * guessing here would put invented options in front of a paying employer.
 *
 * Everything that consumes this degrades on its own when the array is empty:
 *   - the For Employers page shows an "awaiting client content" slot
 *   - the Request Manpower selector hides its checkbox group and relies on the
 *     free-text field, so the flow still works before the list arrives
 *
 * When the client sends the file, add the entries here and both surfaces light
 * up. No component or test changes are needed.
 */

export type ManpowerCategory = {
  /** Stable key — used by tests and as the checkbox value. */
  key: string;
  /** Label shown to the employer, and sent verbatim in the request email. */
  label: string;
};

/** BLOCKED ON CLIENT — promised as a separate file, not yet received. */
export const MANPOWER_CATEGORIES: readonly ManpowerCategory[] = [];

/** True once the client's list has actually been supplied. */
export const hasManpowerCategories = (): boolean =>
  MANPOWER_CATEGORIES.length > 0;
