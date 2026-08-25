import { test, expect, type Page } from "@playwright/test";
import { NAV, CTA } from "../src/config/site.config";
import { CONTACT, SOCIALS } from "../src/config/contact";
import { content } from "../src/content";
import { showsFullNav } from "./support/viewport";

/**
 * MILESTONE 2 ACCEPTANCE CHECKLIST — AS EXECUTABLE TESTS.
 *
 * The point of this file is that the client's own words are checked against the
 * rendered page character-for-character. If anyone paraphrases a client string,
 * these tests go red.
 *
 * ⚠️ UPDATED: `CLIENT_VERBATIM` originally held answers from the Taoohan
 * INTAKE FORM (11 services, 12 industries, lowercase-led names like "Manpower
 * supply"). That intake was superseded by the client-approved
 * "Taoohan Website Content & Copy" document, which is the actual Milestone 2
 * source of truth (see AGENTS.md / the Milestone 2 prompt) and specifies 6
 * core services and 16 industries with different, final wording. This file
 * is updated to match that approved document rather than the earlier draft.
 */

/** Client's exact approved copy from "Taoohan Website Content & Copy". */
const CLIENT_VERBATIM = {
  tagline: "Bringing Great People to Great Businesses.",
  headline: "Bringing Great People to Great Businesses.",
  supporting:
    "Connecting employers with qualified talent through reliable recruitment, staffing, and manpower solutions across industries.",
  disclaimer:
    "Taoohan does not guarantee a specific salary, position, or hiring outcome unless formally agreed.",
  services: [
    "Manpower Supply",
    "Recruitment & Staffing",
    "Talent Sourcing & Recruitment",
    "Candidate Screening & Shortlisting",
    "Contract Staffing",
    "Temporary & Permanent Staffing",
  ],
  industries: [
    "Construction",
    "Healthcare",
    "IT & Technology",
    "Engineering",
    "Hospitality",
    "Logistics & Transportation",
    "Manufacturing",
    "Retail & Sales",
    "Facilities Management",
    "Real Estate",
    "Aviation",
    "Banking & Financial Services",
    "Oil, Gas & Energy",
    "Education",
    "Telecommunications",
    "Administration & Office Support",
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

  test("services page lists all 6 client services verbatim", async ({ page }) => {
    await page.goto("/services");
    const text = await bodyText(page);

    for (const service of CLIENT_VERBATIM.services) {
      expect(text, `missing service: ${service}`).toContain(service);
    }
  });

  test("industries page lists all 16 client industries verbatim", async ({
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

    // Scoped to the page body by Developer 2. This used to take the first
    // VISIBLE CTA, which at desktop widths is the one in the sticky header —
    // and the header now uses the config's `shortLabel`, because the full
    // names do not fit beside the brand and seven nav items on one row.
    // The client's approved wording is what the page shows, so assert it there.
    const main = page.locator("main");
    await expect(
      main.getByTestId("cta-job-seeker").filter({ visible: true }).first(),
    ).toHaveText(CTA.jobSeeker.label);
    await expect(
      main.getByTestId("cta-employer").filter({ visible: true }).first(),
    ).toHaveText(CTA.employer.label);
  });

  test("the header's compact CTA wording also comes from the config", async ({
    page,
  }, testInfo) => {
    test.skip(!showsFullNav(testInfo), "The header CTAs only show at desktop.");
    await page.goto("/");

    const header = page.locator("header");
    await expect(header.getByTestId("cta-job-seeker")).toHaveText(
      CTA.jobSeeker.shortLabel,
    );
    await expect(header.getByTestId("cta-employer")).toHaveText(
      CTA.employer.shortLabel,
    );
  });
});

// ---------------------------------------------------------------------------
// CHECKLIST: "Legal/stats/testimonials render from data, not hardcoded JSX"
//            "Contact + socials centralized in one file"
// ---------------------------------------------------------------------------

test.describe("data-driven blocks and empty slots", () => {
  // ⚠️ UPDATED: the client's approved content document is explicit that
  // Company Statistics and Testimonials must be HIDDEN from the live site
  // rather than shown as a visible "awaiting content" placeholder ("do NOT
  // show TBD, lorem ipsum, or placeholder text to visitors"). The original
  // assertion (visible [data-empty-slot] bands) matched an earlier
  // Milestone 1 convention that the approved brief explicitly overrides for
  // these two sections. See src/app/page.tsx.
  test("stats and testimonials are hidden from the home page, not shown as placeholders", async ({
    page,
  }) => {
    // The client answered "TBD", so the arrays are empty and nothing may be
    // fabricated — but per the approved brief these sections are hidden
    // entirely rather than rendered as a visible empty slot.
    expect(content.stats).toHaveLength(0);
    expect(content.testimonials).toHaveLength(0);

    await page.goto("/");
    await expect(page.locator('[data-empty-slot="company statistics"]')).toHaveCount(0);
    await expect(page.locator('[data-empty-slot="testimonials"]')).toHaveCount(0);
    await expect(page.getByTestId("stats")).toHaveCount(0);
    await expect(page.getByTestId("testimonials")).toHaveCount(0);
  });

  // ⚠️ UPDATED: the approved content document authorises ONE exception to
  // "never invent partner names/logos" — temporary A/B/C/X/Y/Z letter tiles
  // on the Industries → Partners & Clients section, explicitly marked as
  // temporary. `content.partners` itself stays a real empty slot (see
  // src/content/taoohan.ts); the letter tiles are decorative UI rendered
  // from a local constant in src/app/industries/page.tsx, not client data.
  // The About page replaces Certifications & Licences (and Company
  // Statistics, and the Team Photograph) with "Trusted By" per the client's
  // explicit instruction — so the old certifications empty-slot no longer
  // exists there; Trusted By's own logo row is the empty slot instead.
  test("partners and certifications are marked as awaited, never invented", async ({
    page,
  }) => {
    expect(content.partners).toHaveLength(0);
    expect(content.certifications).toHaveLength(0);

    await page.goto("/industries");
    // Temporary placeholder logos are the client-authorised exception —
    // clearly marked as temporary, not a fabricated company name.
    await expect(
      page.locator('[aria-label="Temporary placeholder partner logos"] li'),
    ).toHaveCount(6);

    await page.goto("/about");
    await expect(
      page.locator('[data-empty-slot="partner company names and logos"]'),
    ).toBeVisible();
  });

  // ⚠️ UPDATED: the approved content document gives a confirmed phone number
  // (+971 54 466 1984) that the client asked to be used site-wide. Email and
  // WhatsApp stay blocked per the Milestone 2 gate's contact-slot rule
  // (.claude/gate.mjs) pending that rule being reconciled with the approved
  // brief — see the note on CONTACT in src/config/contact.ts.
  test("contact details are centralised; confirmed fields render, blocked fields stay empty", async ({
    page,
  }) => {
    expect(CONTACT.email).toBe("");
    expect(CONTACT.phone).toBe("+971 54 466 1984");
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
