"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { NAV } from "@/config/site.config";
import { Container } from "@/components/ui/Container";
import { CtaGroup } from "@/components/cta/CtaGroup";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/**
 * Site header.
 *
 * The link list is rendered by mapping over `NAV` from src/config/site.config.ts
 * — the single source of order. Nothing here hardcodes a page name or position,
 * so re-ordering that array re-orders both the desktop bar and the mobile panel.
 *
 * The full 7-item bar needs real width, so it appears at `xl` and everything
 * narrower (phone AND tablet) uses the disclosure menu.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the panel whenever the route changes. Adjusting state during render
  // (rather than in an effect) is React's recommended pattern here — it avoids
  // the extra commit and the cascading re-render an effect would cause.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Esc closes the panel and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // Only the TOPMOST overlay responds to Escape. The menu contains the CTA
      // buttons, so a dialog can be open above it — and both listeners are on
      // `document`, so one keypress used to dismiss the dialog AND the menu
      // underneath it. The dialog closes itself; the menu waits its turn.
      if (document.querySelector('[role="dialog"]')) return;

      setOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent the page behind the open panel from scrolling. Locks the root
  // element, not <body> — see lib/scroll-lock.ts for why that distinction
  // matters to a sticky header.
  useEffect(() => {
    if (!open) return;
    lockScroll();
    return unlockScroll;
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-hairline backdrop-blur",
        // Translucent while browsing, so content slides under it — but solid
        // once the menu is open, or page text shows through the bar sitting
        // above a dimmed overlay, which reads as a rendering fault.
        open ? "bg-surface" : "bg-surface/90",
      )}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-2 lg:h-20">
          {/* Brand */}
          <Link
            href="/"
            data-testid="brand-link"
            className="flex shrink-0 items-center gap-2 text-ink"
          >
            {/* The wordmark already reads "Taoohan"; a text span beside it
                announced the name twice to a screen reader. The alt text on
                the image carries it instead.

                Uses Logo's default size, which is tuned for this row: the
                wordmark is a very wide lockup, so anything taller both reads
                as oversized against the nav links and eats the horizontal
                room the 7-item nav and two CTAs need at 1280px. */}
            <Logo priority />
          </Link>

          {/* Desktop navigation — order comes from NAV */}
          <nav aria-label="Main" className="hidden xl:block">
            <ul data-testid="desktop-nav" className="flex items-center gap-1">
              {NAV.map((item) => (
                // `shrink-0` + `whitespace-nowrap`: without them the flex row
                // squeezes each item and multi-word labels ("Industries We
                // Serve", "For Job Seekers") wrap onto two lines at every
                // desktop width, including 1920 where there is room to spare.
                <li key={item.key} className="shrink-0">
                  <Link
                    href={item.href}
                    data-nav-key={item.key}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-pill px-3 py-2 text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-surface-muted font-medium text-ink"
                        : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden shrink-0 xl:block">
            {/* Compact wording: the full button names do not fit alongside the
                brand and all seven nav items on one row. The page body keeps
                the client's approved full labels. */}
            <CtaGroup size="md" compact />
          </div>

          {/* Mobile / tablet toggle */}
          <button
            ref={toggleRef}
            type="button"
            data-testid="mobile-menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-hairline text-ink xl:hidden"
          >
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 bg-current transition-all duration-200",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity duration-200",
                  open ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 bg-current transition-all duration-200",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {/*
        Mobile / tablet panel — same NAV array, same order.

        PORTALLED TO <body>, for the reason ApplyNowModal documents: this
        header sets `backdrop-blur`, and a backdrop-filter creates a containing
        block for fixed descendants. Rendered inside the header, the overlay's
        `fixed` positioning resolved against the 64px header box instead of the
        viewport — so `top-16 bottom-0` computed to a height of exactly 0, and
        the backdrop was invisible and untappable.

        `top` matches the header height at each breakpoint (h-16 / lg:h-20).
      */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            {/* Tap-outside-to-close, and it dims the page so the panel reads as
              a layer rather than part of the section behind it. */}
            <div
              data-testid="mobile-menu-backdrop"
              onClick={() => setOpen(false)}
              // `inset-x-0 bottom-0 top-16`, NOT `inset-0 top-16`: the `inset`
              // shorthand and `top` fight, and the element computed to height 0
              // — an invisible backdrop that neither dimmed the page nor caught
              // a tap.
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-ink/40 motion-safe:animate-[fade-in_180ms_ease-out] lg:top-20 xl:hidden"
            />
            <div
              ref={panelRef}
              id="mobile-menu"
              data-testid="mobile-menu"
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-hairline bg-surface motion-safe:animate-[slide-down_220ms_cubic-bezier(0.16,1,0.3,1)] lg:top-20 lg:max-h-[calc(100dvh-5rem)] xl:hidden"
            >
              <Container>
                <nav aria-label="Mobile" className="py-4">
                  <ul className="flex flex-col">
                    {NAV.map((item) => (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          data-nav-key={item.key}
                          aria-current={
                            isActive(item.href) ? "page" : undefined
                          }
                          onClick={() => setOpen(false)}
                          className={cn(
                            "block border-b border-hairline py-3 text-base transition-colors",
                            isActive(item.href)
                              ? "font-medium text-ink"
                              : "text-ink-muted hover:text-ink",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="pb-6">
                  <CtaGroup size="lg" />
                </div>
              </Container>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
