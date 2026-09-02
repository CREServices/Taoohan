/**
 * The home hero's background footage.
 *
 * Decorative only (muted, looping, no controls), so it carries `aria-hidden`
 * and is announced to nobody — the same message is in the text column beside
 * it. `poster` paints the first frame instantly so there is never a blank
 * flash while the video buffers. Two encodes (1080/540, WebM before MP4) are
 * served from `public/video/`; see the source master in `raw-assets/`
 * (gitignored) if these ever need re-encoding.
 *
 * Plays at native speed — no client-side playbackRate override.
 */
export function HeroVideo() {
  return (
    <video
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      poster="/manpower-hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source media="(max-width: 640px)" src="/video/hero-540.webm" type="video/webm" />
      <source media="(max-width: 640px)" src="/video/hero-540.mp4" type="video/mp4" />
      <source src="/video/hero-1080.webm" type="video/webm" />
      <source src="/video/hero-1080.mp4" type="video/mp4" />
    </video>
  );
}
