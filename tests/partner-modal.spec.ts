import { test, expect } from "@playwright/test";
import { CTA } from "../src/config/site.config";
import { CONTACT, hasValue } from "../src/config/contact";
import { content } from "../src/content";

/**
 * THE "BECOME OUR PARTNER" MODAL — the two Milestone 3 submission flows.
 *
 * The milestone proposal specifies them precisely, and these tests hold the
 * implementation to it:
 *
 *   Job seeker — "A pop-up asks for basic details such as full name and
 *   contact number", then "They choose whether to continue by WhatsApp or by
 *   email", with the typed details carried over.
 *
 *   Employer — "email only ... WhatsApp will not be offered on the employer
 *   side", with a manpower category selector.
 *
 * ⚠️ THE DESTINATIONS ARE STILL BLOCKED. CONTACT.email and CONTACT.whatsapp
 * are empty typed slots, so the tests that would exercise the final hand-off
 * assert the awaiting-details notice instead, and skip themselves once the
 * real values land rather than going red on a passing change.
 */

const openModal = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await page.getByTestId("cta-partner").first().click();
  await expect(page.getByTestId("partner-modal")).toBeVisible();
};

test.describe("Become Our Partner modal", () => {
  test("the hero CTA opens it, and it offers both flows", async ({ page }) => {
    await page.goto("/");
    // Closed until asked for.
    await expect(page.getByTestId("partner-modal")).toHaveCount(0);

    await page.getByTestId("cta-partner").first().click();

    const modal = page.getByTestId("partner-modal");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("aria-modal", "true");

    // It opens ON a form — the fields are there immediately, not behind a
    // chooser — with the audience offered as a toggle above them.
    await expect(modal.getByTestId("field-full-name")).toBeVisible();
    await expect(modal.getByTestId("field-contact-number")).toBeVisible();
    await expect(modal.getByTestId("partner-path-job-seeker")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(modal.getByTestId("partner-path-employer")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("the toggle swaps the form in place, without a chooser step", async ({
    page,
  }) => {
    await openModal(page);
    const modal = page.getByTestId("partner-modal");

    await modal.getByTestId("partner-path-employer").click();
    await expect(modal.getByTestId("field-company")).toBeVisible();
    await expect(modal.getByTestId("field-full-name")).toHaveCount(0);

    await modal.getByTestId("partner-path-job-seeker").click();
    await expect(modal.getByTestId("field-full-name")).toBeVisible();
    await expect(modal.getByTestId("field-company")).toHaveCount(0);
  });

  test("the hero CTA wording still comes from the config", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("cta-partner").first()).toHaveText(
      CTA.heroPartner.label,
    );
  });

  // -- Job seeker ---------------------------------------------------------

  test("job seeker step one asks for full name and contact number", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-job-seeker").click();

    await expect(page.getByTestId("field-full-name")).toBeVisible();
    await expect(page.getByTestId("field-contact-number")).toBeVisible();
  });

  test("job seeker step one refuses to advance on invalid details", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-job-seeker").click();

    // Empty: both fields complain and the channel step stays out of reach.
    await page.getByTestId("job-seeker-continue").click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid contact number.")).toBeVisible();
    await expect(page.getByTestId("channel-whatsapp")).toHaveCount(0);

    // A name but a number too short to be real still fails.
    await page.getByTestId("field-full-name").fill("Maria Santos");
    await page.getByTestId("field-contact-number").fill("12345");
    await page.getByTestId("job-seeker-continue").click();
    await expect(page.getByText("Please enter a valid contact number.")).toBeVisible();
  });

  test("valid details advance to the WhatsApp / email choice", async ({ page }) => {
    await openModal(page);
    await page.getByTestId("partner-path-job-seeker").click();
    await page.getByTestId("field-full-name").fill("Maria Santos");
    await page.getByTestId("field-contact-number").fill("+971 50 123 4567");
    await page.getByTestId("job-seeker-continue").click();

    const modal = page.getByTestId("partner-modal");
    await expect(
      modal.getByText(content.home.partnerModal.jobSeeker.channelHeading),
    ).toBeVisible();

    // The proposal gives job seekers BOTH channels. Whether each renders a
    // button or the awaiting-details notice depends on the contact slots.
    // Scoped to the dialog: the footer has its own empty slots for these.
    const whatsapp = hasValue(CONTACT.whatsapp)
      ? modal.getByTestId("channel-whatsapp")
      : modal.locator('[data-empty-slot="whatsapp"]');
    const email = hasValue(CONTACT.email)
      ? modal.getByTestId("channel-email")
      : modal.locator('[data-empty-slot="email"]');
    await expect(whatsapp).toBeVisible();
    await expect(email).toBeVisible();
  });

  test("the details typed in step one survive a trip back and forward", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-job-seeker").click();
    await page.getByTestId("field-full-name").fill("Maria Santos");
    await page.getByTestId("field-contact-number").fill("+971 50 123 4567");
    await page.getByTestId("job-seeker-continue").click();

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByTestId("field-full-name")).toHaveValue("Maria Santos");
    await expect(page.getByTestId("field-contact-number")).toHaveValue("+971 50 123 4567");
  });

  // -- Employer -----------------------------------------------------------

  test("the employer flow is email only — WhatsApp is never offered", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();

    const modal = page.getByTestId("partner-modal");
    await expect(modal.getByTestId("field-company")).toBeVisible();
    await expect(modal.getByTestId("field-category")).toBeVisible();
    // The proposal: "WhatsApp will not be offered on the employer side."
    // Scoped to the dialog — the footer legitimately lists a WhatsApp row.
    await expect(modal.getByTestId("channel-whatsapp")).toHaveCount(0);
    await expect(modal.getByText(/whatsapp/i)).toHaveCount(0);
  });

  test("the category selector is built from approved client data, not invented", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();

    const options = page.getByTestId("field-category").locator("option");
    // Every industry the client approved, plus the empty "Select a category".
    await expect(options).toHaveCount(content.industries.items.length + 1);
    for (const item of content.industries.items) {
      await expect(
        page.getByTestId("field-category").locator(`option[value="${item.name}"]`),
      ).toHaveCount(1);
    }
  });

  test("the employer form validates before composing anything", async ({ page }) => {
    test.skip(
      !hasValue(CONTACT.email),
      "Submit only renders once the inbox slot is filled.",
    );
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();
    await page.getByTestId("employer-submit").click();

    await expect(page.getByText("Please enter your company name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Please choose a category.")).toBeVisible();
  });

  test("employer submission is held behind the blocked inbox slot", async ({
    page,
  }) => {
    test.skip(
      hasValue(CONTACT.email),
      "The inbox is configured, so the notice is correctly gone.",
    );
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();

    const modal = page.getByTestId("partner-modal");
    await expect(modal.locator('[data-empty-slot="email"]')).toBeVisible();
    await expect(modal.getByTestId("employer-submit")).toHaveCount(0);
  });

  // -- Dismissal and focus ------------------------------------------------

  test("Escape closes it and focus returns to the button that opened it", async ({
    page,
  }) => {
    await openModal(page);
    await page.keyboard.press("Escape");

    await expect(page.getByTestId("partner-modal")).toHaveCount(0);
    await expect(page.getByTestId("cta-partner").first()).toBeFocused();
  });

  test("the close button and the backdrop both dismiss it", async ({ page }) => {
    await openModal(page);
    await page.getByTestId("partner-modal-close").click();
    await expect(page.getByTestId("partner-modal")).toHaveCount(0);

    await page.getByTestId("cta-partner").first().click();
    // The backdrop is the modal's parent; clicking its far corner closes.
    await page.mouse.click(5, 5);
    await expect(page.getByTestId("partner-modal")).toHaveCount(0);
  });

  test("tab is trapped inside the dialog", async ({ page }) => {
    await openModal(page);

    // Walk further than the dialog has focusable elements; focus must never
    // land on the page behind it.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('[data-testid="partner-modal"]');
        return dialog ? dialog.contains(document.activeElement) : false;
      });
      expect(inside).toBe(true);
    }
  });
});
