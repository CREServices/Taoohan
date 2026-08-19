/**
 * Page scroll lock, shared by every overlay on the site.
 *
 * ─── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * The header, the Apply Now dialog and the Request Manpower dialog each used to
 * do this:
 *
 *     document.body.style.overflow = "hidden";
 *
 * That is the common recipe and it is subtly wrong on this site, because the
 * header is `position: sticky`. Setting `overflow: hidden` on <body> turns the
 * body into the nearest scrolling ancestor, so the sticky header stops
 * resolving against the viewport and snaps back to the top of the DOCUMENT.
 *
 * Measured at 360px wide, scrolled to y=1200, opening the menu: the header
 * landed at top: -1710px and the panel at -1646px — completely off screen. You
 * had to scroll back up to see the menu you had just opened.
 *
 * Locking the ROOT element instead keeps the viewport as the scrollport, so
 * sticky positioning is unaffected and the scroll offset is preserved.
 *
 * ─── REFERENCE COUNTING ─────────────────────────────────────────────────────
 * Overlays nest here: the mobile menu panel contains the CTA buttons, so a
 * visitor can open the Apply Now dialog from inside the open menu. With naive
 * lock/unlock the dialog closing would unlock the page while the menu is still
 * open. Locks are counted, and the page is only released when the last one
 * lets go.
 */

let lockCount = 0;
/** Inline styles as they were before the first lock, restored by the last. */
let previous: { overflow: string; paddingRight: string } | null = null;

/** Width of the classic scrollbar, so removing it does not shift the layout. */
const scrollbarWidth = (): number =>
  window.innerWidth - document.documentElement.clientWidth;

/**
 * Prevent the page behind an overlay from scrolling.
 * Safe to call repeatedly; pair every call with `unlockScroll`.
 */
export function lockScroll(): void {
  if (typeof document === "undefined") return;

  lockCount += 1;
  if (lockCount > 1) return; // already locked by an outer overlay

  const root = document.documentElement;
  previous = {
    overflow: root.style.overflow,
    paddingRight: root.style.paddingRight,
  };

  const gap = scrollbarWidth();
  root.style.overflow = "hidden";
  // Overlay scrollbars (most phones, and macOS by default) report 0 — there is
  // nothing to compensate for and adding padding would itself shift the page.
  if (gap > 0) root.style.paddingRight = `${gap}px`;
}

/** Release one lock. The page scrolls again once every lock is released. */
export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return; // an outer overlay still wants the page locked

  const root = document.documentElement;
  root.style.overflow = previous?.overflow ?? "";
  root.style.paddingRight = previous?.paddingRight ?? "";
  previous = null;
}

/** Test-only helper: how many overlays currently hold the page. */
export const activeScrollLocks = (): number => lockCount;
