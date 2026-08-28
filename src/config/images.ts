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
 * rather than one recolourable asset. The standalone mark is used for the
 * page watermark and the browser icon (src/app/icon.png).
 *
 * ALL FOUR ARE DERIVED, not hand-cropped. The client supplied three flattened
 * PNGs (logo-dark, logo-white, taoohan-dark), each 978x662 with an opaque
 * ground baked in — a white box that would have shown as a pale rectangle on
 * the footer's inverse band and over every watermark. They are un-composited
 * back to real alpha and trimmed to the glyph bounds by the script recorded in
 * docs/logo-assets.md; the dark-on-light wordmark is also remapped to white
 * for the inverse band, matching the client's own logo-white.png treatment.
 *
 * Both wordmark files now come from the SAME source at the SAME crop, so they
 * share one intrinsic ratio (956x173, ~5.5:1) and a single CSS height renders
 * header and footer at matching sizes. That was not true of the previous pair
 * and was the cause of the footer wordmark reading larger than the header's.
 * If a replacement file arrives, re-run the script rather than cropping by
 * hand, and update the width/height here to the real pixel dimensions.
 */
export const LOGOS = {
  /** Dark text — for light backgrounds (the header). */
  wordmarkOnLight: { src: "/logo/taoohan-wordmark.png", width: 956, height: 173 },
  /** White text — for dark backgrounds (the footer's inverse band). */
  wordmarkOnDark: { src: "/logo/taoohan-wordmark-inverse.png", width: 956, height: 173 },
  /** The two-person mark on its own, no wordmark. */
  mark: "/logo/taoohan-mark.png",
} as const;

/** True once a real file has been supplied for this slot. */
export const hasImage = (slot: ImageSlot): boolean => slot.src.trim().length > 0;

/** Every slot, for tests and for the blocked-content report. */
export const ALL_IMAGE_SLOTS: readonly ImageSlot[] = Object.values(IMAGES);
