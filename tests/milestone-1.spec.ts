import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";
import { NAV, CTA } from "../src/config/site.config";

/**
 * MILESTONE 1 ACCEPTANCE CHECKLIST — AS EXECUTABLE TESTS.
 *
 * Each `test` below maps to a line in the Milestone 1 checklist in 18-08-26.md.
 * This file is the loop's gate: the milestone is only "done" when this suite is
 * green across all three viewport projects. A model asserting "looks fine" is
 * not evidence; a green run is.
 */

/** Collects real errors so a page can be asserted console-clean. */
function watchConsole(page: Page) {
  const errors: string[] = [];

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  return errors;
}

/** True when the document is wider than the viewport (horizontal scrollbar). */
async function hasHorizontalScroll(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    // 1px tolerance for sub-pixel rounding.
    return doc.scrollWidth > doc.clientWidth + 1;
  });
}

// ---------------------------------------------------------------------------
// CHECKLIST: "All 7 pages exist and route correctly"
//            "Layout holds on mobile (360) and tablet (768) — no horizontal scroll"
//            "Runs clean with zero console errors"
// ---------------------------------------------------------------------------

for (const item of NAV) {
  test.describe(`page: ${item.label} (${item.href})`, () => {
    test("routes with HTTP 200 and renders exactly one H1", async ({ page }) => {
      const response = await page.goto(item.href);

      expect(response?.status(), `${item.href} should return 200`).toBe(200);

      const headings = page.locator("h1");
      await expect(headings).toHaveCount(1);
      await expect(headings.first()).toBeVisible();
    });

    test("produces no console errors", async ({ page }) => {
      const errors = watchConsole(page);

      await page.goto(item.href);
      await page.waitForLoadState("networkidle");

      expect(errors, `console must be clean on ${item.href}`).toEqual([]);
    });

    test("does not scroll horizontally", async ({ page }) => {
      await page.goto(item.href);
      await page.waitForLoadState("networkidle");

      expect(
        await hasHorizontalScroll(page),
        `${item.href} must not overflow horizontally`,
      ).toBe(false);
    });

    test("renders the footer navigation in config order", async ({ page }) => {
      await page.goto(item.href);

      const keys = await page
        .locator('[data-testid="footer-nav"] [data-nav-key]')
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("data-nav-key")),
        );

      expect(keys).toEqual(NAV.map((navItem) => navItem.key));
    });
  });
}

// ---------------------------------------------------------------------------
// CHECKLIST: "Nav order = Home → ... → Contact Us"
//            "Nav order comes from ONE config file"
// ---------------------------------------------------------------------------

test.describe("navigation order", () => {
  test("config declares the client-approved order", () => {
    expect(NAV.map((item) => item.label)).toEqual([
      "Home",
      "About Us",
      "Services",
      "Industries We Serve",
      "For Employers",
      "For Job Seekers",
      "Contact Us",
    ]);
  });

  test("desktop bar renders in config order", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "The full nav bar is only shown at desktop width.",
    );

    await page.goto("/");

    const keys = await page
      .locator('[data-testid="desktop-nav"] [data-nav-key]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-nav-key")),
      );

    expect(keys).toEqual(NAV.map((item) => item.key));
  });

  test("every nav target is reachable and marks itself current", async ({ page }) => {
    for (const item of NAV) {
      const response = await page.goto(item.href);
      expect(response?.status()).toBe(200);

      await expect(
        page.locator(`[data-nav-key="${item.key}"][aria-current="page"]`).first(),
      ).toHaveCount(1);
    }
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Mobile menu opens/closes on phone width"
// ---------------------------------------------------------------------------

test.describe("mobile menu", () => {
  test("opens, closes by toggle, closes on Escape, closes on link click", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "desktop-1440",
      "Desktop shows the full bar instead of the disclosure menu.",
    );

    await page.goto("/");

    const toggle = page.getByTestId("mobile-menu-toggle");
    const panel = page.getByTestId("mobile-menu");

    await expect(toggle).toBeVisible();
    await expect(panel).toHaveCount(0);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Open
    await toggle.click();
    await expect(panel).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Panel lists every nav item, in config order
    const keys = await panel
      .locator("[data-nav-key]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-nav-key")));
    expect(keys).toEqual(NAV.map((item) => item.key));

    // Close by toggle
    await toggle.click();
    await expect(panel).toHaveCount(0);

    // Close on Escape
    await toggle.click();
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);

    // Close on navigating via a menu link
    await toggle.click();
    await panel.locator('[data-nav-key="about"]').click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(panel).toHaveCount(0);
  });

  test("desktop hides the disclosure toggle", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "Desktop-only assertion.");

    await page.goto("/");
    await expect(page.getByTestId("mobile-menu-toggle")).toBeHidden();
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Apply Now + Request Manpower buttons visible and placed"
//            "Buttons wired to placeholder handlers only (NO real flow yet)"
// ---------------------------------------------------------------------------

test.describe("calls to action", () => {
  /**
   * The header renders its own CTA pair that CSS-hides below the `xl` width,
   * so these assertions deliberately target the VISIBLE instance at whatever
   * viewport is under test — which is what "buttons visible" actually means.
   */
  const visibleCta = (page: Page, id: string) =>
    page.getByTestId(id).filter({ visible: true }).first();

  test("both CTAs are visible on the home page with approved wording", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(visibleCta(page, "cta-job-seeker")).toBeVisible();
    await expect(visibleCta(page, "cta-employer")).toBeVisible();

    await expect(visibleCta(page, "cta-job-seeker")).toHaveText(
      CTA.jobSeeker.label,
    );
    await expect(visibleCta(page, "cta-employer")).toHaveText(CTA.employer.label);
  });

  test("every page surfaces at least one call to action", async ({ page }) => {
    for (const item of NAV) {
      await page.goto(item.href);
      const anyCta = page
        .locator('[data-testid="cta-job-seeker"], [data-testid="cta-employer"]')
        .filter({ visible: true });
      expect(
        await anyCta.count(),
        `no visible CTA on ${item.href}`,
      ).toBeGreaterThan(0);
    }
  });

  test("the job-seeker CTA is present across the job-seeker journey", async ({
    page,
  }) => {
    // /for-employers intentionally shows only the employer CTA, so the
    // job-seeker path is asserted on the pages that path actually runs through.
    for (const href of ["/", "/for-job-seekers", "/contact", "/about"]) {
      await page.goto(href);
      await expect(
        visibleCta(page, "cta-job-seeker"),
        `job-seeker CTA missing on ${href}`,
      ).toBeVisible();
    }
  });

  test("clicking a CTA runs a placeholder handler and does NOT navigate", async ({
    page,
  }) => {
    const errors = watchConsole(page);
    await page.goto("/for-job-seekers");

    const before = page.url();

    // Scope to one CTA group so the notice asserted below is the one this
    // button actually drives.
    const group = page.getByTestId("cta-group").filter({ visible: true }).first();
    await group.getByTestId("cta-job-seeker").click();

    // Placeholder feedback appears...
    await expect(group.getByTestId("cta-notice")).toContainText("placeholder", {
      ignoreCase: true,
    });

    // ...and nothing real happened: no navigation, no console errors.
    expect(page.url()).toBe(before);
    expect(errors).toEqual([]);
  });

  test("CTAs are buttons, not links — no real flow is wired yet", async ({
    page,
  }) => {
    await page.goto("/");

    for (const id of ["cta-job-seeker", "cta-employer"]) {
      const tag = await visibleCta(page, id).evaluate((node) =>
        node.tagName.toLowerCase(),
      );
      expect(tag, `${id} must not be an anchor in Milestone 1`).toBe("button");
    }
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "All copy is placeholder, sized to expected real length"
// ---------------------------------------------------------------------------

test.describe("placeholder copy", () => {
  test("hero copy is placeholder and realistically sized", async ({ page }) => {
    await page.goto("/");

    const headline = (await page.locator("h1").first().innerText()).trim();

    // Not tiny lorem: the real headline is ~42 chars, so demand real volume.
    expect(headline.length).toBeGreaterThan(25);
    expect(headline.toLowerCase()).toContain("placeholder");
  });

  test("services page renders the full 11-item list from the content layer", async ({
    page,
  }) => {
    await page.goto("/services");
    const cards = page.locator('[data-testid="feature-grid"]').first().locator("li");
    await expect(cards).toHaveCount(11);
  });

  test("industries page renders the full 12-item list", async ({ page }) => {
    await page.goto("/industries");
    await expect(page.locator("main ul li h2")).toHaveCount(12);
  });
});
