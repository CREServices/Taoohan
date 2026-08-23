"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-reveal driver (Milestone 1: animation).
 *
 * ONE IntersectionObserver for the whole document, rather than one client
 * component per animated block. Server components stay server components and
 * simply mark themselves with `data-reveal`, so no page content has to ship as
 * client JavaScript just to fade in. This file is the only motion JS on the
 * site and it renders nothing.
 *
 * SAFETY: the hidden starting state lives behind `.motion-ready`, which the
 * boot script in layout.tsx adds before first paint and never adds when the
 * visitor prefers reduced motion. So if this component fails, is blocked, or
 * never hydrates, every element is already in its final visible state. Content
 * is never trapped behind an animation that cannot run.
 */
export function MotionProvider() {
  // App Router keeps this component mounted across navigations, so a re-scan on
  // pathname change is what reveals the newly rendered page's elements.
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // Reduced motion (or no JS at boot) means nothing was ever hidden.
    if (!root.classList.contains("motion-ready")) return;

    const observer = new IntersectionObserver(
      (entries, self) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          // Reveal is one-way: stop watching so scrolling back up does not
          // re-hide content, and so the observer list keeps shrinking.
          self.unobserve(entry.target);
        }
      },
      {
        // Fire slightly before the element reaches the bottom edge, so the
        // motion reads as "already arriving" rather than "triggered late".
        rootMargin: "0px 0px -10% 0px",
      },
    );

    const targets = document.querySelectorAll(
      "[data-reveal]:not([data-revealed])",
    );
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
