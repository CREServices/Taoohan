import { test, expect } from "@playwright/test";
import { CTA } from "../src/config/site.config";
import { CONTACT, hasValue } from "../src/config/contact";
import { MANPOWER_CATEGORIES } from "../src/config/manpower";

/**
 * THE "BECOME OUR PARTNER" MODAL — the two submission flows.
 *
 *   JOB SEEKER — "I'm Looking for Work". ONE form: full name, contact /
 *   WhatsApp number, current location, position, and a required CV/resume
 *   file. Validated, then handed straight to the official Taoohan WhatsApp
 *   with the message pre-filled — no channel choice, no email option.
 *
 *   EMPLOYER — "I'm Hiring Staff". ONE form, submitted directly from the
 *   site (never a `mailto:`, never a redirect to the employer's own email
 *   application).
 *
 * CONTACT.email and CONTACT.whatsapp are confirmed real values, so both
 * forms' final buttons render. The employer form's actual SMTP send still
 * depends on server credentials that are not present in this environment,
 * so those tests assert the "not configured yet" response rather than a
 * successful delivery — that is real, expected behaviour here.
 */

const openModal = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await page.getByTestId("cta-partner").first().click();
  await expect(page.getByTestId("partner-modal")).toBeVisible();
};

test.describe("Become Our Partner modal", () => {
  test("the hero CTA opens it, on the job-seeker form by default", async ({ page }) => {
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
    await expect(modal.getByTestId("field-company-name")).toBeVisible();
    await expect(modal.getByTestId("field-full-name")).toHaveCount(0);

    await modal.getByTestId("partner-path-job-seeker").click();
    await expect(modal.getByTestId("field-full-name")).toBeVisible();
    await expect(modal.getByTestId("field-company-name")).toHaveCount(0);
  });

  test("the hero CTA wording still comes from the config", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("cta-partner").first()).toHaveText(
      CTA.heroPartner.label,
    );
  });

  // -- Job seeker: "I'm Looking for Work" ----------------------------------

  test("job seeker step one asks for full name, contact number, location, position and a CV", async ({
    page,
  }) => {
    await openModal(page);

    const modal = page.getByTestId("partner-modal");
    await expect(modal.getByTestId("field-full-name")).toBeVisible();
    await expect(modal.getByTestId("field-contact-number")).toBeVisible();
    await expect(modal.getByTestId("field-current-location")).toBeVisible();
    await expect(modal.getByTestId("field-position")).toBeVisible();
    await expect(modal.getByTestId("field-cv")).toBeVisible();
    await expect(
      modal.getByTestId("job-seeker-continue"),
    ).toHaveText("Continue to WhatsApp");
  });

  test("job seeker form refuses to advance when required fields are missing", async ({
    page,
  }) => {
    await openModal(page);
    const modal = page.getByTestId("partner-modal");

    // Empty everything: every required field complains and WhatsApp never opens.
    await modal.getByTestId("job-seeker-continue").click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(
      page.getByText("Please enter your contact / WhatsApp number."),
    ).toBeVisible();
    await expect(page.getByText("Please enter your current location.")).toBeVisible();
    await expect(
      page.getByText("Please enter the position you are looking for."),
    ).toBeVisible();
    await expect(
      page.getByText("Please select your CV / resume before continuing."),
    ).toBeVisible();
    await expect(modal.getByTestId("partner-sent")).toHaveCount(0);

    // A number too short to be real still fails, independent of the others.
    await modal.getByTestId("field-full-name").fill("Maria Santos");
    await modal.getByTestId("field-contact-number").fill("12345");
    await modal.getByTestId("job-seeker-continue").click();
    await expect(page.getByText("That contact number looks too short.")).toBeVisible();
  });

  test("valid job-seeker details open WhatsApp with the message pre-filled", async ({
    page,
    context,
  }) => {
    test.skip(!hasValue(CONTACT.whatsapp), "WhatsApp button only renders once the number is confirmed.");
    await openModal(page);
    const modal = page.getByTestId("partner-modal");

    // Contact number is stripped to digits only as it's typed — filling
    // "+971 50 123 4567" and asserting the digits-only result is what the
    // field actually does, not a bug to work around.
    await modal.getByTestId("field-full-name").fill("Maria Santos");
    await modal.getByTestId("field-contact-number").fill("+971 50 123 4567");
    await expect(modal.getByTestId("field-contact-number")).toHaveValue("971501234567");
    await modal.getByTestId("field-current-location").fill("Dubai, UAE");
    await modal.getByTestId("field-position").fill("Administrative Assistant");
    await modal
      .getByTestId("field-cv")
      .setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });

    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      modal.getByTestId("job-seeker-continue").click(),
    ]);
    await popup.waitForLoadState("domcontentloaded").catch(() => {});

    // wa.me is a redirect shortlink — real WhatsApp resolves it to
    // api.whatsapp.com, so only the destination and the carried `text`
    // param are checked, not the exact host the click first opened.
    const url = new URL(popup.url());
    expect(url.hostname).toMatch(/wa\.me|whatsapp\.com/);
    // URLSearchParams.get() already decodes both %XX escapes and literal
    // "+" (space) correctly — a phone number's real "+" survives because
    // buildWhatsAppUrl percent-encodes it as %2B via encodeURIComponent.
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain("Hello Taoohan Recruitment Team,");
    expect(text).toContain("Full Name: Maria Santos");
    expect(text).toContain("Contact Number: 971501234567");
    expect(text).toContain("Current Location: Dubai, UAE");
    expect(text).toContain("Position Looking For: Administrative Assistant");

    await expect(modal.getByTestId("partner-sent")).toBeVisible();
  });

  // -- Employer: "I'm Hiring Staff" ----------------------------------------

  test("the employer flow is email only — WhatsApp is never offered", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();

    const modal = page.getByTestId("partner-modal");
    await expect(modal.getByTestId("field-company-name")).toBeVisible();
    await expect(modal.getByTestId("field-category")).toBeVisible();
    await expect(modal.getByTestId("channel-whatsapp")).toHaveCount(0);
    await expect(modal.getByText(/whatsapp/i)).toHaveCount(0);
  });

  test("the employer form asks for every required field, plus the optional ones", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();

    const modal = page.getByTestId("partner-modal");
    for (const id of [
      "field-company-name",
      "field-contact-person",
      "field-business-email",
      "field-employer-contact-number",
      "field-country-location",
      "field-category",
      "field-roles-needed",
      "field-number-of-workers",
      "field-employment-type",
      "field-start-date",
      "field-message",
    ]) {
      await expect(modal.getByTestId(id)).toBeVisible();
    }
    await expect(modal.getByTestId("employer-submit")).toHaveText(
      "Submit Hiring Request",
    );
  });

  test("the category dropdown is exactly the client-supplied list, plus Other", async ({
    page,
  }) => {
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();

    const options = page.getByTestId("field-category").locator("option");
    // No blank placeholder option — every option is a real category.
    await expect(options).toHaveCount(MANPOWER_CATEGORIES.length);
    for (const category of MANPOWER_CATEGORIES) {
      await expect(
        page.getByTestId("field-category").locator(`option[value="${category.key}"]`),
      ).toHaveText(category.label);
    }
    await expect(options.last()).toHaveAttribute("value", "other");
  });

  test("the employer form validates before sending anything", async ({ page }) => {
    await openModal(page);
    await page.getByTestId("partner-path-employer").click();
    await page.getByTestId("employer-submit").click();

    await expect(page.getByText("Please enter your company name.")).toBeVisible();
    await expect(page.getByText("Please enter a contact person.")).toBeVisible();
    await expect(
      page.getByText("Please enter your business email address."),
    ).toBeVisible();
    await expect(page.getByText("Please enter a contact number.")).toBeVisible();
    await expect(page.getByText("Please enter the country / location.")).toBeVisible();
    // No "choose a category" error any more — the dropdown has no blank
    // placeholder option, so it always carries a real category (the first
    // one, Construction) from the moment the form mounts.
    await expect(
      page.getByText("Please describe the roles / positions needed."),
    ).toBeVisible();
    await expect(
      page.getByText("Please enter the number of workers needed."),
    ).toBeVisible();
  });

  test("a valid employer submission does not open mailto: or an email app", async ({
    page,
  }) => {
    await openModal(page);
    const modal = page.getByTestId("partner-modal");
    await modal.getByTestId("partner-path-employer").click();

    await modal.getByTestId("field-company-name").fill("Acme Facilities LLC");
    await modal.getByTestId("field-contact-person").fill("Ahmed Al Farsi");
    await modal.getByTestId("field-business-email").fill("hiring@acme.example");
    await modal.getByTestId("field-employer-contact-number").fill("+971 4 123 4567");
    await modal.getByTestId("field-country-location").fill("Abu Dhabi, UAE");
    await modal.getByTestId("field-category").selectOption("construction");
    await modal.getByTestId("field-roles-needed").fill("10 general labourers");
    await modal.getByTestId("field-number-of-workers").fill("10");

    // Nothing on the page should ever be an anchor to mailto: for this flow.
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);

    await modal.getByTestId("employer-submit").click();

    // SMTP credentials are not present in this environment, so the real,
    // expected outcome is the "not configured yet" error — not a silent
    // mailto fallback and not a fabricated success.
    await expect(modal.getByTestId("employer-error")).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
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
