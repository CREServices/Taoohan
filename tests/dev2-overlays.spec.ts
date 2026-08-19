import { test, expect, type Page } from "@playwright/test";
import { showsFullNav } from "./support/viewport";

/**
 * OVERLAY BEHAVIOUR GATE — Developer 2 scope.
 *
 * These exist because of a bug a visitor hit, not one a test caught.
 *
 * Every overlay used to lock the page with `document.body.style.overflow =
 * "hidden"`. That is the common recipe, and on this site it is wrong: the
 * header is `position: sticky`, and making <body> the scroll container
 * un-sticks it back to the top of the DOCUMENT.
 *
 * Measured at 360px, scrolled to y=1200, opening the menu put the header at
 * top: -1710px and the panel at -1646px — both off screen. You had to scroll
 * up to reach the menu you had just opened.
 *
 * The fix locks the ROOT element instead (src/lib/scroll-lock.ts). These tests
 * pin the behaviour that was broken.
 */

const scrollDown = async (page: Page, y = 1200) => {
  await page.evaluate((to) => window.scrollTo(0, to), y);
  await page.waitForTimeout(150);
};

const openMenu = async (page: Page) => {
  await page.getByTestId("mobile-menu-toggle").click();
  await expect(page.getByTestId("mobile-menu")).toBeVisible();
};

test.describe("mobile menu opens where the visitor is", () => {
  test("the panel is in the viewport when opened after scrolling", async ({
    page,
  }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    await page.goto("/");
    await scrollDown(page);
    await openMenu(page);

    const box = await page.getByTestId("mobile-menu").boundingBox();
    const viewport = page.viewportSize()!;

    expect(box).not.toBeNull();
    // The exact regression: the panel must be ON screen, not above it.
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeLessThan(viewport.height);
  });

  test("the sticky header stays pinned when the menu opens", async ({
    page,
  }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    await page.goto("/");
    await scrollDown(page);
    await openMenu(page);

    const headerTop = await page
      .locator("header")
      .evaluate((el) => el.getBoundingClientRect().top);

    expect(headerTop).toBe(0);
  });

  test("opening the menu does not move the page", async ({ page }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    await page.goto("/");
    await scrollDown(page);
    const before = await page.evaluate(() => window.scrollY);

    await openMenu(page);
    const after = await page.evaluate(() => window.scrollY);

    expect(after).toBe(before);
  });

  test("the page behind the open menu does not scroll", async ({ page }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    await page.goto("/");
    await scrollDown(page);
    await openMenu(page);

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(200);

    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });

  test("closing the menu restores scrolling and the position", async ({
    page,
  }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    await page.goto("/");
    await scrollDown(page);
    const before = await page.evaluate(() => window.scrollY);

    await openMenu(page);
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("mobile-menu")).toHaveCount(0);

    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test("tapping the backdrop closes the menu", async ({ page }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    await page.goto("/");
    await openMenu(page);

    const backdrop = page.getByTestId("mobile-menu-backdrop");
    // The backdrop must actually occupy the area below the panel — it once
    // computed to height 0, which made it invisible and untappable.
    const box = (await backdrop.boundingBox())!;
    expect(box.height).toBeGreaterThan(0);

    // Tap near the bottom, clear of the panel.
    const viewport = page.viewportSize()!;
    await page.mouse.click(viewport.width / 2, viewport.height - 20);
    await expect(page.getByTestId("mobile-menu")).toHaveCount(0);
  });
});

test.describe("nested overlays keep the page locked", () => {
  test("closing a dialog opened from the menu leaves the page locked", async ({
    page,
  }, testInfo) => {
    test.skip(showsFullNav(testInfo), "Disclosure menu only.");
    // The reference-counting case. A naive unlock released the page while the
    // menu was still covering it, and restoring focus then scrolled it ~500px.
    await page.goto("/");
    await scrollDown(page);
    await openMenu(page);
    const before = await page.evaluate(() => window.scrollY);

    await page
      .getByTestId("mobile-menu")
      .getByTestId("cta-job-seeker")
      .click();
    await expect(page.getByTestId("apply-modal")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("apply-modal")).toHaveCount(0);

    // Menu still open, so the page must still be locked AND unmoved.
    await expect(page.getByTestId("mobile-menu")).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(before);

    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });
});

test.describe("dialogs do not move the page", () => {
  test("opening and closing a dialog preserves scroll position", async ({
    page,
  }) => {
    await page.goto("/for-job-seekers");
    await scrollDown(page, 600);

    const cta = page.getByTestId("cta-job-seeker").filter({ visible: true }).first();
    // Bring the button into view FIRST. Playwright scrolls before clicking, so
    // reading the offset before that would compare against a stale position
    // and blame the dialog for a scroll the click itself caused.
    await cta.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);

    await cta.click();
    await expect(page.getByTestId("apply-modal")).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(before);

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("apply-modal")).toHaveCount(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });
});
