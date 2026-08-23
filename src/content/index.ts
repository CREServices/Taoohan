import type { SiteContent } from "./types";
import { taoohanContent } from "./taoohan";

/**
 * THE CONTENT SWITCH.
 *
 * Normally Milestone 1 serves placeholder copy and this only flips to the real
 * Taoohan content (`./taoohan`) in Milestone 2. Flipped early here at the
 * client's own request — Sir Jerome asked to see his actual form answers
 * reflected on the site during the Milestone 1 review, before the rest of
 * Milestone 2 (final design/colors) is built. `./placeholder` still exists and
 * is untouched; this is a one-line pointer change, not a rewrite.
 */
export const content: SiteContent = taoohanContent;

export type { SiteContent } from "./types";
export * from "./types";
