import type { TestInfo } from "@playwright/test";

/**
 * Shared viewport predicates for the acceptance suites.
 *
 * Added by Developer 2 when the project list grew from three widths to five.
 * The nav-related tests used to skip on `project.name === "desktop-1440"`,
 * which silently assumed exactly one desktop project existed. Adding
 * laptop-1280 and desktop-1920 broke that assumption and the tests failed at
 * the new widths even though the site was behaving correctly.
 *
 * These helpers key off the actual viewport width and the real breakpoint, so
 * adding another project never needs a test edit again.
 */

/**
 * The width at which Header swaps the disclosure menu for the full nav bar.
 * Mirrors the `xl:` breakpoint used in components/layout/Header.tsx — if that
 * changes, change it here too.
 */
export const FULL_NAV_BREAKPOINT = 1280;

const widthOf = (testInfo: TestInfo): number =>
  testInfo.project.use.viewport?.width ?? 0;

/** True where the full 7-item nav bar is shown and the toggle is hidden. */
export const showsFullNav = (testInfo: TestInfo): boolean =>
  widthOf(testInfo) >= FULL_NAV_BREAKPOINT;

/** True where navigation collapses into the mobile disclosure menu. */
export const showsMobileMenu = (testInfo: TestInfo): boolean =>
  !showsFullNav(testInfo);
