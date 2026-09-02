import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { NAV } from "../src/config/site.config";
import { showsFullNav } from "./support/viewport";

/**
 * ACCESSIBILITY GATE.
 *
 * Runs the real axe-core rule set against every page at every viewport the
 * project targets. This is what makes "the design is professional" a checkable
 * claim rather than an opinion: colour contrast, heading order, landmark
 * structure, link naming and form labelling are all machine-verified.
 *
 * It also protects the brand-colour swap — if a future palette change puts text
 * below the WCAG AA contrast ratio, this suite catches it immediately.
 */

/**
 * Audited with reduced motion — added by Developer 2 with the Milestone 1
 * animation work.
 *
 * WCAG contrast applies to the settled, rendered state. Scanning an element
 * mid-fade measures a partially transparent colour and reports a contrast
 * failure that does not exist once the animation lands, which made the dialog
 * and mobile-menu scans race the hero entrance.
 *
 * Forcing `prefers-reduced-motion` means the boot script never applies the
 * hidden starting state, so axe always sees the final frame. It also audits the
 * exact experience a motion-sensitive visitor gets. The animation itself is
 * covered separately in motion.spec.ts.
 */
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const item of NAV) {
  test(`${item.label} (${item.href}) has no WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(item.href);
    // "load", not "networkidle": the home page's hero video autoplays and
    // loops, so it streams indefinitely and "networkidle" would never fire.
    await page.waitForLoadState("load");

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const summary = violations.map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help}\n` +
        violation.nodes
          .slice(0, 3)
          .map((node) => `    ${node.target.join(" ")}`)
          .join("\n"),
    );

    expect(summary, `accessibility violations on ${item.href}`).toEqual([]);
  });
}

test("the open Become Our Partner modal is accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("cta-partner").first().click();
  await expect(page.getByTestId("partner-modal")).toBeVisible();

  // Step 1 — the job-seeker form fields.
  let result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    result.violations.map((violation) => `${violation.id}: ${violation.help}`),
    "Partner modal — job-seeker form",
  ).toEqual([]);

  // Step 2 — the WhatsApp reminder.
  await page.getByTestId("field-full-name").fill("Maria Santos");
  await page.getByTestId("field-contact-number").fill("971501234567");
  await page.getByTestId("field-current-location").fill("Dubai, UAE");
  await page.getByTestId("field-position").fill("Administrative Assistant");
  await page.getByTestId("job-seeker-continue").click();
  await expect(page.getByTestId("cv-reminder")).toBeVisible();

  result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(
    result.violations.map((violation) => `${violation.id}: ${violation.help}`),
    "Partner modal — CV reminder step",
  ).toEqual([]);
});

test("the open mobile menu is accessible", async ({ page }, testInfo) => {
  test.skip(showsFullNav(testInfo), "Desktop shows the full nav bar instead.");

  await page.goto("/");
  await page.getByTestId("mobile-menu-toggle").click();
  await expect(page.getByTestId("mobile-menu")).toBeVisible();

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(violations.map((violation) => violation.id)).toEqual([]);
});

/**
 * The "Become Our Partner" dialog carries the two Milestone 3 submission
 * forms, so it is scanned in every state that renders inputs — the build guide
 * requires "all fields labeled", and a dialog is exactly where labelling and
 * focus order tend to rot unnoticed.
 */
test("the Become Our Partner dialog is accessible in every step", async ({
  page,
}) => {
  const scan = async (label: string) => {
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      violations.map((violation) => violation.id),
      `accessibility violations with the dialog on ${label}`,
    ).toEqual([]);
  };

  await page.goto("/");
  await page.getByTestId("cta-partner").first().click();
  await expect(page.getByTestId("partner-modal")).toBeVisible();
  await scan("the path chooser");

  // Job seeker: the single "I'm Looking for Work" form, then the same form
  // showing its errors.
  await page.getByTestId("partner-path-job-seeker").click();
  await scan("the job-seeker form");
  await page.getByTestId("job-seeker-continue").click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await scan("the job-seeker validation errors");

  // Employer: the "I'm Hiring Staff" form, including its select. The
  // audience toggle swaps the job-seeker form for the employer one in
  // place — there is no intermediate step to go back through.
  await page.getByTestId("partner-path-employer").click();
  await expect(page.getByTestId("field-category")).toBeVisible();
  await scan("the employer request form");
  await page.getByTestId("employer-submit").click();
  await expect(page.getByText("Please enter your company name.")).toBeVisible();
  await scan("the employer validation errors");
});
