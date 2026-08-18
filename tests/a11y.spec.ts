import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { NAV } from "../src/config/site.config";

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

for (const item of NAV) {
  test(`${item.label} (${item.href}) has no WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(item.href);
    await page.waitForLoadState("networkidle");

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

test("the open Apply Now dialog is accessible", async ({ page }) => {
  await page.goto("/for-job-seekers");
  await page
    .getByTestId("cta-job-seeker")
    .filter({ visible: true })
    .first()
    .click();
  await expect(page.getByTestId("apply-modal")).toBeVisible();

  // Step 1 — the form fields.
  let result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    result.violations.map((violation) => `${violation.id}: ${violation.help}`),
    "Apply Now step 1",
  ).toEqual([]);

  // Step 2 — the channel choice.
  await page.getByLabel("Full name").fill("Maria Santos");
  await page.getByLabel("Contact number").fill("09171234567");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByTestId("apply-step-2")).toBeVisible();

  result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(
    result.violations.map((violation) => `${violation.id}: ${violation.help}`),
    "Apply Now step 2",
  ).toEqual([]);
});

test("the open mobile menu is accessible", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "desktop-1440",
    "Desktop shows the full nav bar instead.",
  );

  await page.goto("/");
  await page.getByTestId("mobile-menu-toggle").click();
  await expect(page.getByTestId("mobile-menu")).toBeVisible();

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(violations.map((violation) => violation.id)).toEqual([]);
});
