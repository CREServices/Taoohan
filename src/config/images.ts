/**
 * Photography slots — Developer 2 scope.
 *
 * ⚠️ BLOCKED ON ASSETS. The client answered "Not yet — please use professional
 * stock photos for now", so every `src` below is an EMPTY TYPED SLOT. Nothing
 * renders a broken image: `SiteImage` falls back to the same dashed
 * "awaiting client content" block used everywhere else on the site.
 *
 * TO FILL A SLOT (no component or test changes needed):
 *   1. Put the file in `public/images/`
 *   2. Set `src` to its path, e.g. "/images/hero.jpg"
 *   3. Write a real `alt` describing the photo — it is required whenever `src`
 *      is set, and `npm run typecheck` will not catch an empty one, so the
 *      image test asserts it instead.
 *
 * The client authorised stock photography as an interim, so these can be
 * filled before the real workforce photos arrive. Licensing is a human
 * decision: pick images the client is cleared to use commercially.
 */

export type ImageSlot = {
  /** Stable key, used by tests and as the empty-slot label. */
  key: string;
  /** Human label shown in the placeholder while the slot is empty. */
  label: string;
  /** Path under `public/`. Empty string = not supplied yet. */
  src: string;
  /** Screen-reader description. Must be non-empty whenever `src` is set. */
  alt: string;
  /** Extra guidance shown in the placeholder during review. */
  note?: string;
};

/** BLOCKED ON ASSETS — the client is sending photos separately. */
export const IMAGES = {
  homeHero: {
    key: "home-hero",
    label: "hero photograph",
    src: "",
    alt: "",
    note: "Real workforce imagery — supplied separately by the client. Stock photography is authorised as an interim.",
  },
  aboutTeam: {
    key: "about-team",
    label: "team photograph",
    src: "",
    alt: "",
    note: "Supplied separately by the client. Stock photography is authorised as an interim.",
  },
} as const satisfies Record<string, ImageSlot>;

/**
 * Brand logo files — SUPPLIED by the client, no longer a blocked slot.
 *
 * The wordmark bakes its text colour into the artwork, so there are two files
 * rather than one recolourable asset. The standalone infinity mark is used for
 * the browser tab icon (src/app/icon.svg).
 */
export const LOGOS = {
  /** Dark text — for light backgrounds (the header). */
  wordmarkOnLight: "/logo/taoohan-black.svg",
  /** White text — for dark backgrounds (the footer's inverse band). */
  wordmarkOnDark: "/logo/taoohan-white.svg",
  /** The infinity mark on its own, no wordmark. */
  mark: "/logo/logo.svg",
  /** Intrinsic size of the wordmark files, for next/image. */
  wordmarkWidth: 880,
  wordmarkHeight: 289,
} as const;

/** True once a real file has been supplied for this slot. */
export const hasImage = (slot: ImageSlot): boolean => slot.src.trim().length > 0;

/** Every slot, for tests and for the blocked-content report. */
export const ALL_IMAGE_SLOTS: readonly ImageSlot[] = Object.values(IMAGES);
