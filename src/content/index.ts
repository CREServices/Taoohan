import type { SiteContent } from "./types";
import { placeholderContent } from "./placeholder";

/**
 * THE CONTENT SWITCH.
 *
 * Milestone 1 serves placeholder copy. In Milestone 2 the real Taoohan copy is
 * added as `./taoohan` and this single line changes to point at it — no page or
 * component needs editing, because everything imports `content` from here.
 */
export const content: SiteContent = placeholderContent;

export type { SiteContent } from "./types";
export * from "./types";
