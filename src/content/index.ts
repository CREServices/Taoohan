import type { SiteContent } from "./types";
import { taoohanContent } from "./taoohan";

/**
 * THE CONTENT SWITCH.
 *
 * Milestone 1 served `./placeholder`. Milestone 2 flipped this single line to
 * the real Taoohan copy — no page or component needed editing, because
 * everything imports `content` from here. `./placeholder` is kept in the tree
 * as the layout stress-test fixture (it is sized to the real copy's length).
 */
export const content: SiteContent = taoohanContent;

export type { SiteContent } from "./types";
export * from "./types";
