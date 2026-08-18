import { test, expect, type Page } from "@playwright/test";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  buildWhatsAppUrl,
  buildWhatsAppMessage,
  validateApplicant,
} from "../src/lib/applicant";

/**
 * MILESTONE 3 ACCEPTANCE CHECKLIST — AS EXECUTABLE TESTS.
 *
 * Covers the Apply Now flow, the WhatsApp deep link, the Nodemailer route's
 * contract, credential hygiene, and modal accessibility.
 *
 * Two checklist lines cannot be closed by any test and are reported as
 * BLOCKED-ON-HUMAN instead of being faked green:
 *   - "WhatsApp option tested on a REAL phone"
 *   - "Email arrives at APPLY_TO_EMAIL" / "Deployed to Vercel with env vars"
 * Both need credentials and a physical device that only the developer has.
 */

/** Opens the Apply Now modal from the first visible job-seeker CTA. */
async function openApplyModal(page: Page, path = "/for-job-seekers") {
  await page.goto(path);
  await page
    .getByTestId("cta-job-seeker")
    .filter({ visible: true })
    .first()
    .click();
  await expect(page.getByTestId("apply-modal")).toBeVisible();
}

const fillStepOne = async (page: Page, name: string, number: string) => {
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Contact number").fill(number);
  await page.getByRole("button", { name: "Continue" }).click();
};

// ---------------------------------------------------------------------------
// CHECKLIST: "Apply Now pop-up: 2 steps max (details → channel choice)"
// ---------------------------------------------------------------------------

test.describe("Apply Now flow", () => {
  test("opens on the job-seeker CTA and starts at step 1 of 2", async ({
    page,
  }) => {
    await openApplyModal(page);

    await expect(page.getByTestId("apply-step-1")).toBeVisible();
    await expect(page.getByTestId("apply-step-2")).toHaveCount(0);
    await expect(page.getByTestId("apply-modal")).toContainText("Step 1 of 2");
  });

  test("advances to the channel choice and no further", async ({ page }) => {
    await openApplyModal(page);
    await fillStepOne(page, "Maria Santos", "+63 917 123 4567");

    await expect(page.getByTestId("apply-step-2")).toBeVisible();
    await expect(page.getByTestId("apply-modal")).toContainText("Step 2 of 2");
    // Exactly two channels, no third step.
    await expect(page.getByTestId("apply-modal")).toContainText("WhatsApp");
    await expect(page.getByTestId("apply-modal")).toContainText("email");
  });

  test("can go back to step 1 without losing the entered details", async ({
    page,
  }) => {
    await openApplyModal(page);
    await fillStepOne(page, "Maria Santos", "+63 917 123 4567");

    await page.getByTestId("apply-back").click();

    await expect(page.getByTestId("apply-step-1")).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveValue("Maria Santos");
  });

  test("shows on-screen instructions for both channels", async ({ page }) => {
    await openApplyModal(page);
    await fillStepOne(page, "Maria Santos", "+63 917 123 4567");

    const modal = page.getByTestId("apply-modal");
    await expect(modal).toContainText("attach your CV", { ignoreCase: true });
    // The numbered instruction list from the content layer.
    await expect(modal.locator("ol li")).not.toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Field validation works (empty name/number blocked, clear error)"
// ---------------------------------------------------------------------------

test.describe("validation", () => {
  test("blocks an empty form with visible, associated errors", async ({
    page,
  }) => {
    await openApplyModal(page);
    await page.getByRole("button", { name: "Continue" }).click();

    // Still on step 1.
    await expect(page.getByTestId("apply-step-1")).toBeVisible();
    await expect(page.getByTestId("apply-step-2")).toHaveCount(0);

    // Errors are shown AND wired to the inputs for screen readers.
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(
      page.getByText("Please enter your contact number."),
    ).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.getByLabel("Contact number")).toHaveAttribute(
      "aria-describedby",
      /.+/,
    );
  });

  test("rejects a contact number that is not a plausible phone number", async ({
    page,
  }) => {
    await openApplyModal(page);
    await fillStepOne(page, "Maria Santos", "12");

    await expect(page.getByTestId("apply-step-1")).toBeVisible();
    await expect(page.getByText(/too short/i)).toBeVisible();
  });

  test("the same rules hold as pure functions (client and server share them)", () => {
    expect(validateApplicant({ fullName: "", contactNumber: "" })).toEqual({
      fullName: "Please enter your full name.",
      contactNumber: "Please enter your contact number.",
    });
    expect(
      validateApplicant({ fullName: "Maria Santos", contactNumber: "09171234567" }),
    ).toEqual({});
    expect(
      validateApplicant({ fullName: "Maria", contactNumber: "not-a-number" })
        .contactNumber,
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "WhatsApp option opens wa.me with name + contact pre-filled"
// ---------------------------------------------------------------------------

test.describe("WhatsApp channel", () => {
  test("builds a wa.me link with the details pre-filled", () => {
    const url = buildWhatsAppUrl("+63 917 000 1111", {
      fullName: "Maria Santos",
      contactNumber: "09171234567",
    });

    expect(url).not.toBeNull();
    // Digits only in the path — no "+", spaces or dashes.
    expect(url).toContain("https://wa.me/639170001111?text=");

    const message = decodeURIComponent(new URL(url!).searchParams.get("text")!);
    expect(message).toContain("Maria Santos");
    expect(message).toContain("09171234567");
    expect(message).toBe(
      buildWhatsAppMessage({
        fullName: "Maria Santos",
        contactNumber: "09171234567",
      }),
    );
  });

  test("degrades safely when the business number is not configured", async ({
    page,
  }) => {
    // The client has not supplied a WhatsApp number, so the UI must say so
    // rather than link to a broken wa.me URL.
    expect(
      buildWhatsAppUrl("", { fullName: "Maria", contactNumber: "09171234567" }),
    ).toBeNull();

    await openApplyModal(page);
    await fillStepOne(page, "Maria Santos", "09171234567");

    await expect(page.getByTestId("apply-whatsapp-unavailable")).toBeVisible();
    await expect(page.getByTestId("apply-whatsapp")).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Email option sends via the Nodemailer API route"
//            "No SMTP creds hardcoded" / ".env.local not committed"
// ---------------------------------------------------------------------------

test.describe("email channel", () => {
  test("the API route rejects an invalid application with 400", async ({
    request,
  }) => {
    const response = await request.post("/api/apply", {
      data: { fullName: "", contactNumber: "" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.errors.fullName).toBeTruthy();
    expect(body.errors.contactNumber).toBeTruthy();
  });

  test("the API route rejects a malformed body with 400", async ({ request }) => {
    const response = await request.post("/api/apply", {
      headers: { "Content-Type": "application/json" },
      data: "not json",
    });
    expect(response.status()).toBe(400);
  });

  test("a valid application reports 503 while SMTP is unconfigured", async ({
    request,
  }) => {
    // This is the honest current state: the client has not supplied SMTP
    // credentials. The route must say "not configured", not crash, and must
    // never leak a credential value.
    const response = await request.post("/api/apply", {
      data: { fullName: "Maria Santos", contactNumber: "09171234567" },
    });

    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.missingConfiguration).toContain("SMTP_HOST");
    expect(JSON.stringify(body)).not.toMatch(/password|pass["']?\s*:/i);
  });

  test("the modal surfaces the unconfigured state instead of failing silently", async ({
    page,
  }) => {
    await openApplyModal(page);
    await fillStepOne(page, "Maria Santos", "09171234567");
    await page.getByTestId("apply-email").click();

    await expect(page.getByTestId("apply-email-error")).toBeVisible();
    await expect(page.getByTestId("apply-email-error")).toContainText(
      "not configured",
    );
  });

  test("credentials are read from env only and never committed", () => {
    const route = readFileSync("src/app/api/apply/route.ts", "utf8");

    for (const key of [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "SMTP_FROM",
      "APPLY_TO_EMAIL",
    ]) {
      expect(route, `${key} must be read from process.env`).toContain(
        `process.env.${key}`,
      );
    }

    // No key is assigned a literal value anywhere in the route.
    expect(route).not.toMatch(/SMTP_(HOST|USER|PASS)\s*[:=]\s*["'][^"']+["']/);

    // .env.local is ignored, and no env file is tracked by git.
    const tracked = execSync("git ls-files", { encoding: "utf8" })
      .split("\n")
      .filter((file) => /(^|\/)\.env($|\.)/.test(file));
    expect(tracked).toEqual([".env.local.example"]);

    // The committed example carries placeholders, never real secrets.
    const example = readFileSync(".env.local.example", "utf8");
    expect(example).toMatch(/^SMTP_HOST=\s*$/m);
    expect(example).toMatch(/^SMTP_PASS=\s*$/m);
  });

  test("no applicant data is persisted (Phase 1)", () => {
    const route = readFileSync("src/app/api/apply/route.ts", "utf8");
    // No filesystem writes, no database clients, no caching of applicants.
    expect(route).not.toMatch(/writeFile|appendFile|fs\.|createClient|prisma/);
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Modal: closes on Esc, traps focus, restores focus, fields labeled"
// ---------------------------------------------------------------------------

test.describe("modal accessibility", () => {
  test("is a labelled modal dialog", async ({ page }) => {
    await openApplyModal(page);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("aria-labelledby", /.+/);
  });

  test("moves focus into the dialog on open", async ({ page }) => {
    await openApplyModal(page);

    const focusedInsideDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[data-testid="apply-modal"]');
      return !!dialog && dialog.contains(document.activeElement);
    });
    expect(focusedInsideDialog).toBe(true);
  });

  test("traps Tab inside the dialog", async ({ page }) => {
    await openApplyModal(page);

    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('[data-testid="apply-modal"]');
        return !!dialog && dialog.contains(document.activeElement);
      });
      expect(inside, `focus escaped the dialog on Tab #${i + 1}`).toBe(true);
    }
  });

  test("closes on Escape and restores focus to the trigger", async ({ page }) => {
    await page.goto("/for-job-seekers");
    const trigger = page
      .getByTestId("cta-job-seeker")
      .filter({ visible: true })
      .first();

    await trigger.click();
    await expect(page.getByTestId("apply-modal")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("apply-modal")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("closes on the close button and on backdrop click", async ({ page }) => {
    await openApplyModal(page);
    await page.getByTestId("apply-close").click();
    await expect(page.getByTestId("apply-modal")).toHaveCount(0);

    await openApplyModal(page);
    await page.getByTestId("apply-backdrop").click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId("apply-modal")).toHaveCount(0);
  });

  test("every field has a real label", async ({ page }) => {
    await openApplyModal(page);

    for (const label of ["Full name", "Contact number"]) {
      const input = page.getByLabel(label);
      await expect(input).toBeVisible();
      await expect(input).toHaveAttribute("id", /.+/);
    }
  });
});
