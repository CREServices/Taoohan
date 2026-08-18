import { test, expect, type Page } from "@playwright/test";
import { NAV, CTA } from "../src/config/site.config";
import { CONTACT, SOCIALS } from "../src/config/contact";
import { content } from "../src/content";

/**
 * MILESTONE 2 ACCEPTANCE CHECKLIST — AS EXECUTABLE TESTS.
 *
 * The point of this file is that the client's own words are checked against the
 * rendered page character-for-character. If anyone paraphrases a client string,
 * these tests go red.
 */

/** Client's exact answers from the Taoohan intake form. */
const CLIENT_VERBATIM = {
  tagline: "Bringing Great People to Great Businesses",
  headline: "Bringing Great People to Great Businesses.",
  supporting:
    "Connecting employers with qualified talent through reliable recruitment, staffing, and manpower solutions across industries.",
  disclaimer:
    "Taoohan does not guarantee a specific salary, position, or hiring outcome unless formally agreed.",
  services: [
    "Manpower supply",
    "Recruitment and staffing",
    "Talent sourcing and recruitment",
    "Candidate screening and shortlisting",
    "Contract staffing",
    "Temporary and permanent staffing",
    "Workforce solutions",
    "Job seeker assistance",
    "Industry-specific recruitment",
    "International recruitment",
    "Talent placement and onboarding",
  ],
  industries: [
    "Construction",
    "Healthcare",
    "IT and Technology",
    "Engineering",
    "Hospitality",
    "Logistics and Transportation",
    "Manufacturing",
    "Retail and Sales",
    "Facilities Management",
    "Real Estate",
    "Aviation",
    "Administration and Office Support",
  ],
  differentiators: [
    "Access to Quality Talent",
    "Fast, Reliable Recruitment",
    "Flexible Staffing Solutions",
  ],
};

const bodyText = async (page: Page) =>
  (await page.locator("body").innerText()).replace(/\s+/g, " ");

// ---------------------------------------------------------------------------
// CHECKLIST: "Every placeholder string replaced ... no lorem shipped"
// ---------------------------------------------------------------------------

test.describe("no placeholder copy remains", () => {
  test("the content layer is serving real content", () => {
    expect(content.isPlaceholder).toBe(false);
    expect(content.brand.name).toBe("Taoohan");
  });

  for (const item of NAV) {
    test(`${item.href} ships no lorem or placeholder text`, async ({ page }) => {
      await page.goto(item.href);
      const text = await bodyText(page);

      // "Awaiting client content" is the deliberate, clearly-marked empty-slot
      // wording for data the client has not sent — that is allowed. Generic
      // filler is not.
      for (const banned of ["Lorem ipsum", "Placeholder ", "TBD", "lorem"]) {
        expect(text, `${item.href} still contains "${banned}"`).not.toContain(
          banned,
        );
      }
    });
  }
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Real copy does not break any layout"
//            (horizontal-overflow + console checks in milestone-1.spec.ts run
//             against this same real content across 360 / 768 / 1440)
// ---------------------------------------------------------------------------

test.describe("client copy renders verbatim", () => {
  test("home hero shows the exact approved headline and supporting line", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveText(CLIENT_VERBATIM.headline);
    expect(await bodyText(page)).toContain(CLIENT_VERBATIM.supporting);
    expect(await bodyText(page)).toContain(CLIENT_VERBATIM.tagline);
  });

  test("hero headline does not overflow its column", async ({ page }) => {
    await page.goto("/");

    const overflows = await page.locator("h1").evaluate((node) => {
      const parent = node.parentElement!;
      return node.scrollWidth > parent.clientWidth + 1;
    });

    expect(overflows, "the real headline must wrap, not overflow").toBe(false);
  });

  test("services page lists all 11 client services verbatim", async ({ page }) => {
    await page.goto("/services");
    const text = await bodyText(page);

    for (const service of CLIENT_VERBATIM.services) {
      expect(text, `missing service: ${service}`).toContain(service);
    }
  });

  test("industries page lists all 12 client industries verbatim", async ({
    page,
  }) => {
    await page.goto("/industries");
    const text = await bodyText(page);

    for (const industry of CLIENT_VERBATIM.industries) {
      expect(text, `missing industry: ${industry}`).toContain(industry);
    }
  });

  test("the three client differentiators appear on the home page", async ({
    page,
  }) => {
    await page.goto("/");
    const text = await bodyText(page);

    for (const item of CLIENT_VERBATIM.differentiators) {
      expect(text, `missing differentiator: ${item}`).toContain(item);
    }
  });

  test("the recruitment disclaimer appears verbatim on every page", async ({
    page,
  }) => {
    for (const item of NAV) {
      await page.goto(item.href);
      await expect(
        page.getByTestId("disclaimer"),
        `disclaimer missing on ${item.href}`,
      ).toHaveText(CLIENT_VERBATIM.disclaimer);
    }
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Final brand color applied from ONE theme token file"
// ---------------------------------------------------------------------------

test.describe("brand colour", () => {
  test("the brand token resolves to the client's approved green", async ({
    page,
  }) => {
    await page.goto("/");

    const brand = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-brand-700")
        .trim(),
    );

    expect(brand, "--color-brand-700 must be defined by the token file").not.toBe(
      "",
    );

    // Resolve the token to RGB and assert green actually dominates.
    const rgb = await page.evaluate((value) => {
      const probe = document.createElement("div");
      probe.style.color = value;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();
      return computed;
    }, brand);

    const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
    expect(g, `brand colour ${rgb} should be green-dominant`).toBeGreaterThan(r);
    expect(g, `brand colour ${rgb} should be green-dominant`).toBeGreaterThan(b);
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Page names / headers / button wording = final, from config file"
// ---------------------------------------------------------------------------

test.describe("wording comes from config", () => {
  test("nav labels on the page match the config exactly", async ({ page }) => {
    await page.goto("/");

    const labels = await page
      .locator('[data-testid="footer-nav"] [data-nav-key]')
      .allInnerTexts();

    expect(labels.map((label) => label.trim())).toEqual(
      NAV.map((item) => item.label),
    );
  });

  test("CTA wording matches the client's approved button names", async ({
    page,
  }) => {
    await page.goto("/");

    expect(CTA.jobSeeker.label).toBe("Submit Your CV");
    expect(CTA.employer.label).toBe("Request Staffing & Manpower");

    await expect(
      page.getByTestId("cta-job-seeker").filter({ visible: true }).first(),
    ).toHaveText(CTA.jobSeeker.label);
    await expect(
      page.getByTestId("cta-employer").filter({ visible: true }).first(),
    ).toHaveText(CTA.employer.label);
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Legal/stats/testimonials render from data, not hardcoded JSX"
//            "Contact + socials centralized in one file"
// ---------------------------------------------------------------------------

test.describe("data-driven blocks and empty slots", () => {
  test("stats and testimonials follow the data, which is still empty", async ({
    page,
  }) => {
    // The client answered "TBD", so the arrays are empty and the UI must show a
    // marked slot rather than invented numbers or quotes.
    expect(content.stats).toHaveLength(0);
    expect(content.testimonials).toHaveLength(0);

    await page.goto("/");
    await expect(page.locator('[data-empty-slot="company statistics"]')).toBeVisible();
    await expect(page.locator('[data-empty-slot="testimonials"]')).toBeVisible();
    await expect(page.getByTestId("stats")).toHaveCount(0);
    await expect(page.getByTestId("testimonials")).toHaveCount(0);
  });

  test("partners and certifications are marked as awaited, never invented", async ({
    page,
  }) => {
    expect(content.partners).toHaveLength(0);
    expect(content.certifications).toHaveLength(0);

    await page.goto("/industries");
    await expect(
      page.locator('[data-empty-slot="partner and client names"]'),
    ).toBeVisible();

    await page.goto("/about");
    await expect(
      page.locator('[data-empty-slot="certifications and licences"]'),
    ).toBeVisible();
  });

  test("contact details are centralised and still awaiting client data", async ({
    page,
  }) => {
    // Every field is blocked on the client — nothing may be fabricated.
    expect(CONTACT.email).toBe("");
    expect(CONTACT.phone).toBe("");
    expect(CONTACT.whatsapp).toBe("");
    expect(SOCIALS.every((social) => social.href === "")).toBe(true);

    await page.goto("/contact");
    const slots = page.locator("[data-empty-slot]");
    expect(await slots.count()).toBeGreaterThan(0);
  });

  test("legal documents are empty slots, not invented policies", async () => {
    expect(content.legal.privacy.sections).toHaveLength(0);
    expect(content.legal.terms.sections).toHaveLength(0);
  });
});
