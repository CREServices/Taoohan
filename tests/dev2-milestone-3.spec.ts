import { test, expect, type Page } from "@playwright/test";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  validateEmployerRequest,
  buildEmployerSubject,
  buildEmployerEmailBody,
  buildEmployerMailto,
  type EmployerRequest,
} from "../src/lib/employer";
import {
  MANPOWER_CATEGORIES,
  hasManpowerCategories,
} from "../src/config/manpower";
import { content } from "../src/content";

/**
 * MILESTONE 3 (DEVELOPER 2) — THE EMPLOYER REQUEST MANPOWER FLOW.
 *
 * Covers the two-step request dialog, the category selector's behaviour before
 * the client's list arrives, the Nodemailer route's contract, the pre-filled
 * mailto: fallback, credential hygiene and dialog accessibility.
 *
 * One line cannot be closed by any test and is reported as BLOCKED-ON-HUMAN
 * rather than faked green:
 *   - "the request arrives at REQUEST_TO_EMAIL / APPLY_TO_EMAIL"
 * That needs real SMTP credentials, which only the developer has.
 */

const ROUTE_PATH = join(
  process.cwd(),
  "src/app/api/request-manpower/route.ts",
);

const VALID: EmployerRequest = {
  companyName: "Northwind Construction",
  contactName: "Alex Reyes",
  email: "alex@northwind.example",
  phone: "+63 917 555 0100",
  categories: [],
  details: "Six site labourers and two foremen for a six-month contract.",
};

/** Opens the Request Manpower dialog from the first visible employer CTA. */
async function openRequestModal(page: Page, path = "/for-employers") {
  await page.goto(path);
  await page
    .getByTestId("cta-employer")
    .filter({ visible: true })
    .first()
    .click();
  await expect(page.getByTestId("request-modal")).toBeVisible();
}

const fillStepOne = async (page: Page, request = VALID) => {
  await page.getByLabel("Company name").fill(request.companyName);
  await page.getByLabel("Your name").fill(request.contactName);
  await page.getByLabel("Work email").fill(request.email);
  await page.getByLabel(/Phone number/).fill(request.phone);
  await page.getByRole("button", { name: "Continue" }).click();
};

// ---------------------------------------------------------------------------
// The dialog itself
// ---------------------------------------------------------------------------

test.describe("Request Manpower flow", () => {
  test("opens on the employer CTA and starts at step 1 of 2", async ({
    page,
  }) => {
    await openRequestModal(page);
    await expect(page.getByTestId("request-step-1")).toBeVisible();
    await expect(page.getByTestId("request-modal")).toContainText("Step 1 of 2");
  });

  test("advances to the requirements step and no further", async ({ page }) => {
    await openRequestModal(page);
    await fillStepOne(page);

    await expect(page.getByTestId("request-step-2")).toBeVisible();
    await expect(page.getByTestId("request-modal")).toContainText("Step 2 of 2");
    // Two steps is the whole flow — there is no step 3 to reach.
    await expect(page.getByTestId("request-modal")).not.toContainText(
      "Step 3",
    );
  });

  test("can go back to step 1 without losing the entered details", async ({
    page,
  }) => {
    await openRequestModal(page);
    await fillStepOne(page);
    await page.getByTestId("request-back").click();

    await expect(page.getByLabel("Company name")).toHaveValue(
      VALID.companyName,
    );
    await expect(page.getByLabel("Work email")).toHaveValue(VALID.email);
  });

  test("shows on-screen instructions for employers", async ({ page }) => {
    await openRequestModal(page);
    // Present at step 1...
    const instructions = page.getByTestId("request-modal").locator("ol li");
    await expect(instructions.first()).toBeVisible();
    const atStepOne = await instructions.count();
    expect(atStepOne).toBeGreaterThan(0);

    // ...and still present at step 2, so guidance never disappears mid-flow.
    await fillStepOne(page);
    await expect(instructions.first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Validation — the same rules on both sides of the wire
// ---------------------------------------------------------------------------

test.describe("validation", () => {
  test("blocks an empty form with visible, associated errors", async ({
    page,
  }) => {
    await openRequestModal(page);
    await page.getByRole("button", { name: "Continue" }).click();

    // Still on step 1.
    await expect(page.getByTestId("request-step-1")).toBeVisible();

    const company = page.getByLabel("Company name");
    await expect(company).toHaveAttribute("aria-invalid", "true");

    // The error is programmatically associated, not just visually near.
    const describedBy = await company.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toBeVisible();
  });

  test("rejects a malformed email address", async ({ page }) => {
    await openRequestModal(page);
    await page.getByLabel("Company name").fill(VALID.companyName);
    await page.getByLabel("Your name").fill(VALID.contactName);
    await page.getByLabel("Work email").fill("not-an-email");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByTestId("request-step-1")).toBeVisible();
    await expect(page.getByLabel("Work email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("accepts a blank phone number but rejects an implausible one", async ({
    page,
  }) => {
    await openRequestModal(page);
    await page.getByLabel("Company name").fill(VALID.companyName);
    await page.getByLabel("Your name").fill(VALID.contactName);
    await page.getByLabel("Work email").fill(VALID.email);

    // Blank is fine — phone is optional.
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByTestId("request-step-2")).toBeVisible();

    // A filled-in but nonsense number is not.
    await page.getByTestId("request-back").click();
    await page.getByLabel(/Phone number/).fill("12");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByTestId("request-step-1")).toBeVisible();
  });

  test("requires a description of the roles before sending", async ({
    page,
  }) => {
    await openRequestModal(page);
    await fillStepOne(page);

    await page.getByTestId("request-send").click();
    await expect(
      page.getByLabel("What do you need?"),
    ).toHaveAttribute("aria-invalid", "true");
  });

  test("the same rules hold as pure functions (client and server share them)", () => {
    expect(validateEmployerRequest(VALID)).toEqual({});

    expect(
      validateEmployerRequest({ ...VALID, companyName: "  " }),
    ).toHaveProperty("companyName");
    expect(validateEmployerRequest({ ...VALID, email: "nope" })).toHaveProperty(
      "email",
    );
    expect(
      validateEmployerRequest({ ...VALID, details: "too short" }),
    ).toHaveProperty("details");

    // Phone is optional, so blank must NOT be an error.
    expect(validateEmployerRequest({ ...VALID, phone: "" })).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// The category selector, before the client's list arrives
// ---------------------------------------------------------------------------

test.describe("category selector", () => {
  test("degrades to free text while the client list is unsupplied", async ({
    page,
  }) => {
    await openRequestModal(page);
    await fillStepOne(page);

    // The list is an empty typed slot, so the checkbox group is absent and the
    // employer is told why — the flow still works.
    await expect(page.getByTestId("request-categories")).toHaveCount(0);
    await expect(
      page.getByTestId("request-categories-unavailable"),
    ).toBeVisible();
    await expect(page.getByLabel("What do you need?")).toBeVisible();
  });

  test("the For Employers page shows the same awaited slot, from the same config", async ({
    page,
  }) => {
    await page.goto("/for-employers");
    await expect(page.getByTestId("manpower-categories")).toHaveCount(0);
    await expect(
      page.locator('[data-empty-slot="manpower categories list"]'),
    ).toBeVisible();
  });

  test("no category was invented from the services or industries lists", () => {
    // Guards the most tempting shortcut. The client answered "will send a
    // separate file" for categories, but DID supply services and industries —
    // copying either in would put words in the client's mouth.
    expect(MANPOWER_CATEGORIES).toEqual([]);
    expect(hasManpowerCategories()).toBe(false);

    const borrowed = MANPOWER_CATEGORIES.map((c) => c.label).filter(
      (label) =>
        content.industries.items.some((i) => i.name === label) ||
        content.services.items.some((s) => s.title === label),
    );
    expect(borrowed).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Email routing
// ---------------------------------------------------------------------------

test.describe("email routing", () => {
  test("the subject line is pre-filled with the company name", () => {
    expect(buildEmployerSubject(VALID)).toBe(
      "Manpower request — Northwind Construction",
    );
  });

  test("the body carries every supplied field", () => {
    const body = buildEmployerEmailBody(VALID);
    expect(body).toContain(VALID.companyName);
    expect(body).toContain(VALID.contactName);
    expect(body).toContain(VALID.email);
    expect(body).toContain(VALID.phone);
    expect(body).toContain(VALID.details);
  });

  test("the mailto link pre-fills recipient and subject", () => {
    const url = buildEmployerMailto("hiring@example.com", VALID);
    expect(url).not.toBeNull();
    expect(url!.startsWith("mailto:hiring@example.com?")).toBe(true);
    expect(url).toContain("subject=");
    // Spaces must be %20, not "+", or mail clients show the plus signs.
    expect(url).not.toContain("+");
  });

  test("the mailto link is null when no business email is configured", () => {
    // The client has not supplied one, and a mailto to an empty address opens
    // a blank draft that silently loses the request.
    expect(buildEmployerMailto("", VALID)).toBeNull();
  });

  test("the dialog surfaces the unconfigured state instead of failing silently", async ({
    page,
  }) => {
    await openRequestModal(page);
    await fillStepOne(page);
    await page.getByLabel("What do you need?").fill(VALID.details);

    // CONTACT.email is an empty slot, so the mailto fallback is unavailable and
    // says so rather than rendering a dead link.
    await expect(page.getByTestId("request-mailto")).toHaveCount(0);
    await expect(
      page.getByTestId("request-mailto-unavailable"),
    ).toBeVisible();

    // And SMTP is unconfigured locally, so sending reports it plainly.
    await page.getByTestId("request-send").click();
    await expect(page.getByTestId("request-error")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// The API route contract
// ---------------------------------------------------------------------------

test.describe("api/request-manpower", () => {
  test("rejects an invalid request with 400", async ({ request }) => {
    const response = await request.post("/api/request-manpower", {
      data: { ...VALID, email: "nope" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.errors).toHaveProperty("email");
  });

  test("rejects a malformed body with 400", async ({ request }) => {
    const response = await request.post("/api/request-manpower", {
      headers: { "Content-Type": "application/json" },
      data: "not json",
    });
    expect(response.status()).toBe(400);
  });

  test("a valid request reports 503 while SMTP is unconfigured", async ({
    request,
  }) => {
    // BLOCKED-ON-HUMAN: proving the mail actually ARRIVES needs real
    // credentials. What is provable here is that the route validates, then
    // reports the missing configuration honestly instead of pretending to send.
    const response = await request.post("/api/request-manpower", {
      data: VALID,
    });
    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(Array.isArray(body.missingConfiguration)).toBe(true);
  });

  test("credentials are read from env only and never committed", () => {
    const source = readFileSync(ROUTE_PATH, "utf8");

    // Every credential reaches the route through process.env.
    for (const key of ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"]) {
      expect(source).toContain(`process.env.${key}`);
    }

    // Nothing that looks like a literal secret or inbox is baked in.
    expect(source).not.toMatch(/smtp\.[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(source).not.toMatch(/pass(word)?\s*[:=]\s*["'][^"']+["']/i);

    // And no env file other than the example is tracked by git.
    const tracked = execSync("git ls-files", {
      encoding: "utf8",
      cwd: process.cwd(),
    })
      .split("\n")
      .filter((line) => line.includes(".env"));

    expect(tracked).toEqual([".env.local.example"]);
  });

  test("no employer data is persisted (Phase 1)", () => {
    // Read from disk rather than git: this must hold for the working tree,
    // including before the file has been staged.
    const source = readFileSync(ROUTE_PATH, "utf8");

    // No database client, no filesystem write.
    expect(source).not.toMatch(
      /supabase|prisma|mongoose|drizzle|writeFile|appendFile/i,
    );
  });
});

// ---------------------------------------------------------------------------
// Accessibility — the same contract Developer 1's dialog meets
// ---------------------------------------------------------------------------

test.describe("dialog accessibility", () => {
  test("is a labelled modal dialog", async ({ page }) => {
    await openRequestModal(page);
    const dialog = page.getByTestId("request-modal");
    await expect(dialog).toHaveAttribute("role", "dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    const labelledBy = await dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`#${labelledBy}`)).toBeVisible();
  });

  test("moves focus into the dialog on open", async ({ page }) => {
    await openRequestModal(page);
    const focusedInDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[data-testid="request-modal"]');
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect(focusedInDialog).toBe(true);
  });

  test("traps Tab inside the dialog", async ({ page }) => {
    await openRequestModal(page);
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");

    const stillInside = await page.evaluate(() => {
      const dialog = document.querySelector('[data-testid="request-modal"]');
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect(stillInside).toBe(true);
  });

  test("closes on Escape and restores focus to the trigger", async ({
    page,
  }) => {
    await openRequestModal(page);
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("request-modal")).toHaveCount(0);

    const focusedTrigger = await page.evaluate(
      () => document.activeElement?.getAttribute("data-testid") ?? null,
    );
    expect(focusedTrigger).toBe("cta-employer");
  });

  test("closes on the close button and on backdrop click", async ({ page }) => {
    await openRequestModal(page);
    await page.getByTestId("request-close").click();
    await expect(page.getByTestId("request-modal")).toHaveCount(0);

    await openRequestModal(page);
    await page.getByTestId("request-backdrop").click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId("request-modal")).toHaveCount(0);
  });

  test("every field has a real label", async ({ page }) => {
    await openRequestModal(page);
    for (const label of [
      "Company name",
      "Your name",
      "Work email",
    ]) {
      await expect(page.getByLabel(label)).toBeVisible();
    }
    await fillStepOne(page);
    await expect(page.getByLabel("What do you need?")).toBeVisible();
  });
});
