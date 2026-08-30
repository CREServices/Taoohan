"use client";

import { useEffect, useRef } from "react";

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
 * WHY THIS IS A CLIENT COMPONENT: the footage is played FAST. At its native
 * speed the long construction sequence crawls, and a hero loop that takes
 * that long to get anywhere reads as a still image. `playbackRate` does this
 * at runtime with no re-encode and no extra bytes — the same four files are
 * still served. It has to be set from script because there is no HTML
 * attribute for it, and it has to be re-applied on `play` because the
 * PartnerModal pauses every playing video while it is open (its backdrop blur
 * recomposites per video frame) and some browsers reset the rate when a
 * source is re-selected at a new viewport width.
 */

/**
 * How much faster than real time the loop runs.
 *
 * The brief asked for 2–3x; 2.5x sits in the middle and is the point where
 * the construction segment reads as purposeful rather than either sluggish
 * (2x) or comic (3x). Motion stays smooth because every encode is 30fps —
 * dropped-frame judder only starts to show past ~4x.
 */
const PLAYBACK_RATE = 2.5;

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyRate = () => {
      // Guarded: assigning playbackRate throws in browsers that do not
      // support the requested rate, and a hero that throws on mount would
      // take the whole client bundle's error boundary with it.
      try {
        if (video.playbackRate !== PLAYBACK_RATE) video.playbackRate = PLAYBACK_RATE;
      } catch {
        /* Browser refused the rate — fall back to real time, still plays. */
      }
    };

    applyRate();
    video.addEventListener("loadedmetadata", applyRate);
    video.addEventListener("play", applyRate);
    video.addEventListener("ratechange", applyRate);
    return () => {
      video.removeEventListener("loadedmetadata", applyRate);
      video.removeEventListener("play", applyRate);
      video.removeEventListener("ratechange", applyRate);
    };
  }, []);

  return (
    <video
      ref={videoRef}
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
