import { test, expect, type Page } from "@playwright/test";

/**
 * MOTION GATE — Developer 2 scope (Milestone 1: animation).
 *
 * The animation's one hard requirement is that it must never be load-bearing:
 * content has to be readable whether or not the animation can run. These tests
 * exercise all three environments that decide that —
 *
 *   motion allowed  → elements start hidden and animate in
 *   reduced motion  → nothing is ever hidden
 *   no JavaScript   → nothing is ever hidden
 *
 * The second and third are the ones that matter. A reveal-on-scroll effect that
 * silently eats the page when its observer does not run is a content bug, not a
 * design flourish, so those paths are asserted rather than assumed.
 */

/** Computed opacity of the nth matching element, read from the live DOM. */
const opacityOf = (page: Page, selector: string, index = 0) =>
  page
    .locator(selector)
    .nth(index)
    .evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("motion enabled", () => {
  test("the boot script marks the document before content paints", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
  });

  test("hero content settles at full opacity", async ({ page }) => {
    await page.goto("/");

    // The entrance is animation-driven with a stagger, so poll rather than
    // sampling a single frame.
    await expect
      .poll(() => opacityOf(page, "[data-hero]"), { timeout: 5_000 })
      .toBe(1);

    // The last staggered line carries the longest delay — if that one lands,
    // every earlier one has too.
    const heroCount = await page.locator("[data-hero]").count();
    await expect
      .poll(() => opacityOf(page, "[data-hero]", heroCount - 1), {
        timeout: 5_000,
      })
      .toBe(1);
  });

  test("below-the-fold content starts hidden, then reveals on scroll", async ({
    page,
  }) => {
    await page.goto("/");

    const lastReveal = page.locator("[data-reveal]").last();

    // Far enough down the home page that it cannot be in the initial viewport
    // at any of the three tested widths.
    await expect
      .poll(async () =>
        lastReveal.evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBeLessThan(1);

    await lastReveal.scrollIntoViewIfNeeded();

    await expect
      .poll(
        async () =>
          lastReveal.evaluate((el) => Number(getComputedStyle(el).opacity)),
        { timeout: 5_000 },
      )
      .toBe(1);
  });

  test("revealing is one-way — scrolling back up does not re-hide", async ({
    page,
  }) => {
    await page.goto("/");

    const lastReveal = page.locator("[data-reveal]").last();
    await lastReveal.scrollIntoViewIfNeeded();
    await expect(lastReveal).toHaveAttribute("data-revealed", "");

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(lastReveal).toHaveAttribute("data-revealed", "");
  });

  test("the Apply Now dialog is never inside an animating ancestor", async ({
    page,
  }) => {
    // Regression guard. Wrapping CtaGroup in the hero entrance once dragged the
    // open dialog through the hero's fade, because the modal renders as a child
    // of CtaGroup. The dialog must not inherit a running animation.
    await page.goto("/");
    // `visible: true` matters at 360/768, where the header's copy of the CTA
    // comes first in the DOM but sits inside the collapsed mobile menu.
    await page
      .getByTestId("cta-job-seeker")
      .filter({ visible: true })
      .first()
      .click();

    const dialog = page.getByTestId("apply-modal");
    await expect(dialog).toBeVisible();

    // The guarantee is that the dialog is PORTALLED OUT of the page content,
    // so it can never inherit the hero entrance or a scroll reveal. Its own
    // backdrop animates on purpose, so "no ancestor animates" would be the
    // wrong assertion — what matters is which ancestors it has at all.
    const trappedIn = await dialog.evaluate((el) => {
      for (let node = el.parentElement; node; node = node.parentElement) {
        if (node.tagName === "MAIN") return "main";
        if (node.hasAttribute("data-hero")) return "data-hero";
        if (node.hasAttribute("data-reveal")) return "data-reveal";
      }
      return null;
    });

    expect(trappedIn).toBeNull();

    // And it really is a direct child of <body>, i.e. portalled.
    const parentIsBody = await dialog.evaluate(
      (el) => el.parentElement?.parentElement === document.body,
    );
    expect(parentIsBody).toBe(true);
  });
});

test.describe("reduced motion", () => {
  // This Playwright version takes the motion preference via contextOptions
  // rather than as a top-level test option.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the document is never marked, so nothing is ever hidden", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  });

  test("every reveal target is fully opaque without scrolling", async ({
    page,
  }) => {
    await page.goto("/");

    const opacities = await page
      .locator("[data-reveal], [data-hero]")
      .evaluateAll((els) =>
        els.map((el) => Number(getComputedStyle(el).opacity)),
      );

    expect(opacities.length).toBeGreaterThan(0);
    expect(opacities.every((value) => value === 1)).toBe(true);
  });
});

test.describe("no javascript", () => {
  test.use({ javaScriptEnabled: false });

  test("content is fully visible with scripting unavailable", async ({
    page,
  }) => {
    await page.goto("/");

    // The boot script cannot run, so the hidden starting state must never apply.
    await expect(page.locator("html")).not.toHaveClass(/motion-ready/);

    const opacities = await page
      .locator("[data-reveal], [data-hero]")
      .evaluateAll((els) =>
        els.map((el) => Number(getComputedStyle(el).opacity)),
      );

    expect(opacities.length).toBeGreaterThan(0);
    expect(opacities.every((value) => value === 1)).toBe(true);

    // And the actual words are on the page, not just non-transparent boxes.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
