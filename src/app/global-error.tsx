"use client";

import { content } from "@/content";

/**
 * Root error boundary — Developer 2 scope (Milestone 3: go live).
 *
 * Catches errors thrown in the root layout itself, which the per-route error
 * boundary cannot reach. Because it REPLACES the root layout when it renders,
 * it has to carry its own <html> and <body>, and it cannot use the site header,
 * footer or theme components — the layout that provides them is exactly what
 * has failed.
 *
 * It is deliberately styled inline: if the failure prevented the stylesheet
 * from loading, class names would render an unstyled wall of text. Copy still
 * comes from the content layer — that is a plain static object with no side
 * effects, so importing it here cannot depend on the layout that just failed.
 *
 * Added because the site would not deploy without it. Next 16 emits a
 * `_global-error` segment into the Vercel build output whether or not the file
 * exists, and the deploy aborted with a missing
 * `_global-error.segments/__PAGE__.segment.rsc.func`. Defining the boundary
 * makes the segment real, and gives visitors a usable page instead of a blank
 * screen if the layout ever throws.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          backgroundColor: "#ffffff",
          color: "#15241f",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            {content.errorPage.heading}
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              lineHeight: 1.6,
              color: "#5a6b66",
            }}
          >
            {content.errorPage.body}
          </p>

          {/* The digest is the only safe identifier to surface: it lets the
              developer find the real error in the server logs, and it never
              contains the message or a stack trace. */}
          {error.digest && (
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                color: "#5a6b66",
              }}
            >
              {content.errorPage.reference} {error.digest}
            </p>
          )}

          <div
            style={{
              marginTop: "1.75rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => retry()}
              style={{
                cursor: "pointer",
                borderRadius: "999px",
                border: "none",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                backgroundColor: "#0b5138",
                color: "#ffffff",
              }}
            >
              {content.errorPage.retry}
            </button>
            {/* A real <a>, not next/link, on purpose: the root layout has
                already failed, so a client-side navigation would re-mount the
                same broken tree. A full document load is the recovery. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "999px",
                border: "1px solid #dfe7e4",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#15241f",
                textDecoration: "none",
              }}
            >
              {content.errorPage.home}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
