"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/config/site.config";
import { content } from "@/content";
import { Container } from "@/components/ui/Container";
import { CtaGroup } from "@/components/cta/CtaGroup";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/cn";

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
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent the page behind the open panel from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-surface/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Brand */}
          <Link
            href="/"
            data-testid="brand-link"
            className="flex shrink-0 items-center gap-2 text-ink"
          >
            <BrandMark className="text-brand-700" />
            <span className="text-lg font-semibold tracking-tight">
              {content.brand.name}
            </span>
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

      {/* Mobile / tablet panel — same NAV array, same order */}
      {open && (
        <div
          ref={panelRef}
          id="mobile-menu"
          data-testid="mobile-menu"
          className="border-t border-hairline bg-surface xl:hidden"
        >
          <Container>
            <nav aria-label="Mobile" className="py-4">
              <ul className="flex flex-col">
                {NAV.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      data-nav-key={item.key}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block border-b border-hairline py-3 text-base",
                        isActive(item.href)
                          ? "font-medium text-ink"
                          : "text-ink-muted",
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
      )}
    </header>
  );
}
