import { test, expect } from "@playwright/test";
import { NAV } from "../src/config/site.config";
import { showsFullNav } from "./support/viewport";
import { ALL_IMAGE_SLOTS, IMAGES, hasImage } from "../src/config/images";

/**
 * LAPTOP AND DESKTOP LAYOUT GATE — Developer 2 scope.
 *
 * The task division assigns laptop and desktop to Developer 2 ("make the site
 * look good on laptop and desktop"). Mobile and tablet overflow are already
 * covered by Developer 1's suites; this covers the wide end, which had no
 * viewport in the matrix at all until laptop-1280 and desktop-1920 were added.
 *
 * These exist because a real defect shipped unnoticed: with only a 1440 project
 * configured, nothing caught that every multi-word nav label ("Industries We
 * Serve", "For Job Seekers") wrapped onto two lines at EVERY desktop width,
 * because the flex row squeezed each item. A screenshot found it; these tests
 * keep it found.
 */

const PATHS = NAV.map((item) => item.href);

test.describe("header fits on one row", () => {
  test("no nav label wraps onto a second line", async ({ page }, testInfo) => {
    test.skip(!showsFullNav(testInfo), "The full nav bar is desktop-only.");
    await page.goto("/");

    const heights = await page
      .getByTestId("desktop-nav")
      .locator("a")
      .evaluateAll((links) =>
        links.map((link) => ({
          text: link.textContent?.trim() ?? "",
          height: link.getBoundingClientRect().height,
          lineHeight: parseFloat(getComputedStyle(link).lineHeight) || 0,
        })),
      );

    expect(heights.length).toBe(NAV.length);

    for (const link of heights) {
      // A wrapped label is two line-boxes tall. Allow padding, but never a
      // second line.
      expect(
        link.height,
        `nav label "${link.text}" wrapped onto a second line`,
      ).toBeLessThan(link.lineHeight * 2);
    }
  });

  test("the header row does not overflow the viewport", async ({
    page,
  }, testInfo) => {
    test.skip(!showsFullNav(testInfo), "The full nav bar is desktop-only.");
    await page.goto("/");

    const overflow = await page.evaluate(() => {
      const header = document.querySelector("header");
      if (!header) return null;
      return {
        scrollWidth: header.scrollWidth,
        clientWidth: header.clientWidth,
      };
    });

    expect(overflow).not.toBeNull();
    // The compact header CTA wording exists precisely so this holds at 1280.
    expect(overflow!.scrollWidth).toBeLessThanOrEqual(overflow!.clientWidth);
  });
});

test.describe("no horizontal overflow at laptop and desktop", () => {
  for (const path of PATHS) {
    test(`${path} does not scroll horizontally`, async ({ page }, testInfo) => {
      test.skip(!showsFullNav(testInfo), "Covers the wide end only.");
      await page.goto(path);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }
});

test.describe("content stays readable at very wide widths", () => {
  test("body text is not stretched across the full 1920 viewport", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1920",
      "Only meaningful at the widest configured desktop.",
    );
    await page.goto("/");

    // A centred max-width container is what stops line lengths becoming
    // unreadable on a wide monitor.
    const width = await page
      .locator("main p")
      .first()
      .evaluate((el) => el.getBoundingClientRect().width);

    expect(width).toBeLessThan(1000);
  });
});

// ---------------------------------------------------------------------------
// Photography slots — Developer 2 scope
// ---------------------------------------------------------------------------

test.describe("image slots", () => {
  test("every configured image has real alt text", () => {
    // TypeScript cannot catch an empty string, and a photo shipped with
    // alt="" is invisible to screen readers. This is the guard.
    for (const slot of ALL_IMAGE_SLOTS) {
      if (hasImage(slot)) {
        expect(
          slot.alt.trim().length,
          `image slot "${slot.key}" has a src but no alt text`,
        ).toBeGreaterThan(0);
      }
    }
  });

  test("unsupplied slots render a marked placeholder, never a broken image", async ({
    page,
  }) => {
    await page.goto("/");

    const hero = page.getByTestId("image-slot-home-hero");
    await expect(hero).toBeVisible();

    if (!hasImage(IMAGES.homeHero)) {
      await expect(hero).toHaveAttribute(
        "data-empty-slot",
        IMAGES.homeHero.label,
      );
      // No <img> at all, so nothing can 404 or show a broken-image icon.
      await expect(hero.locator("img")).toHaveCount(0);
    }
  });

  test("the slot holds its aspect ratio whether or not a photo exists", async ({
    page,
  }) => {
    // Guards against layout shift when the client's photos land.
    await page.goto("/");
    const box = await page.getByTestId("image-slot-home-hero").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(4 / 3, 1);
  });
});
