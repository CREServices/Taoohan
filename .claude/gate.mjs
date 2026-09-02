#!/usr/bin/env node
/**
 * THE MILESTONE GATE.
 *
 * This script is the loop's control gate. It is wired to the Stop hook in
 * .claude/settings.json, so the coding agent physically cannot end its turn
 * while the current milestone's acceptance criteria are failing.
 *
 * Design rule: the agent NEVER grades its own work. Every check below is
 * mechanical — a static assertion, a linter, a compiler, or a real browser
 * driving the real production build. There is no "looks fine" path.
 *
 * Exit 0 -> checks pass, the agent may stop.
 * Exit 2 -> checks fail, the agent is pushed back in to keep fixing.
 *
 * A ceiling (MAX_CONSECUTIVE_BLOCKS) guarantees the loop terminates even if a
 * check is failing for a reason the agent cannot fix alone (e.g. missing client
 * credentials), rather than spinning forever.
 */

import { execSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATE_FILE = join(ROOT, ".claude", "gate-state.json");
const CONFIG_FILE = join(ROOT, ".claude", "gate.json");

/** Stop blocking after this many consecutive failed gate runs. */
const MAX_CONSECUTIVE_BLOCKS = 6;

const read = (path) => readFileSync(join(ROOT, path), "utf8");
const exists = (path) => existsSync(join(ROOT, path));

const currentMilestone = () => {
  try {
    return JSON.parse(read(".claude/gate.json")).milestone ?? 1;
  } catch {
    return 1;
  }
};

const results = [];
const check = (name, fn) => {
  try {
    const detail = fn();
    results.push({ name, pass: true, detail: detail || "ok" });
  } catch (error) {
    results.push({ name, pass: false, detail: error.message });
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

/** All first-party source files. */
const sourceFiles = () =>
  execSync('git ls-files "src/*" "tests/*"', { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

// ===========================================================================
// HARD RULES — apply to every milestone
// ===========================================================================

const milestone = currentMilestone();

check("hard rule: .env.local is git-ignored", () => {
  const ignored = spawnSync("git", ["check-ignore", "-q", ".env.local"], {
    cwd: ROOT,
  });
  assert(
    ignored.status === 0,
    ".env.local is NOT git-ignored — credentials could be committed.",
  );
  return ".env.local ignored";
});

check("hard rule: no env file is tracked by git", () => {
  const tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((file) => /(^|\/)\.env($|\.)/.test(file) && !file.endsWith(".example"));
  assert(
    tracked.length === 0,
    `Env files are tracked by git: ${tracked.join(", ")}`,
  );
  return "no env files tracked";
});

check("hard rule: no hardcoded SMTP credentials", () => {
  const offenders = [];
  for (const file of sourceFiles()) {
    const text = readFileSync(join(ROOT, file), "utf8");
    // A credential key assigned a string literal, rather than read from env.
    if (/(SMTP_PASS|SMTP_USER|SMTP_HOST)\s*[:=]\s*["'][^"']+["']/.test(text)) {
      offenders.push(file);
    }
  }
  assert(
    offenders.length === 0,
    `Hardcoded SMTP credentials found in: ${offenders.join(", ")}`,
  );
  return "credentials only ever read from process.env";
});

check("hard rule: no database code active (Phase 1)", () => {
  const pkg = JSON.parse(read("package.json"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const banned = [
    "@supabase/supabase-js",
    "prisma",
    "@prisma/client",
    "mongoose",
    "mongodb",
    "pg",
    "mysql2",
    "drizzle-orm",
  ].filter((name) => name in deps);
  assert(
    banned.length === 0,
    `Database packages present (Phase 2 only): ${banned.join(", ")}`,
  );

  const offenders = sourceFiles().filter((file) =>
    /from ["'](@supabase|@prisma|mongoose|mongodb|pg|drizzle)/.test(
      readFileSync(join(ROOT, file), "utf8"),
    ),
  );
  assert(
    offenders.length === 0,
    `Database imports found in: ${offenders.join(", ")}`,
  );
  return "no database dependency or import";
});

check("hard rule: colours resolve through the theme token file", () => {
  // Stock Tailwind palette classes bypass the single token file, which would
  // break the one-line green/black swap the brief requires.
  const stockPalette =
    /\b(?:bg|text|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

  const offenders = sourceFiles()
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => stockPalette.test(readFileSync(join(ROOT, file), "utf8")));

  assert(
    offenders.length === 0,
    `Stock palette colours bypass the token file in: ${offenders.join(", ")}`,
  );
  return "all colours come from --color-* tokens";
});

check("hard rule: navigation order is declared in exactly one file", () => {
  const offenders = sourceFiles()
    .filter((file) => file !== "src/config/site.config.ts")
    .filter((file) => !file.startsWith("tests/"))
    .filter((file) => {
      const text = readFileSync(join(ROOT, file), "utf8");
      // Any file listing several nav labels as literals is a second source.
      const labels = [
        "Industries We Serve",
        "For Job Seekers",
        "For Employers",
        "About Us",
        "Contact Us",
      ];
      return labels.filter((label) => text.includes(`"${label}"`)).length >= 2;
    });

  assert(
    offenders.length === 0,
    `Nav labels are duplicated outside the config in: ${offenders.join(", ")}`,
  );
  return "src/config/site.config.ts is the only source of nav order";
});

check("hard rule: pages read copy from the content layer", () => {
  const pages = sourceFiles().filter((file) => /^src\/app\/.*page\.tsx$/.test(file));
  assert(pages.length === 7, `Expected 7 pages, found ${pages.length}`);

  const offenders = pages.filter(
    (file) => !readFileSync(join(ROOT, file), "utf8").includes('from "@/content"'),
  );
  assert(
    offenders.length === 0,
    `Pages not sourcing copy from the content layer: ${offenders.join(", ")}`,
  );
  return "all 7 pages import from @/content";
});

// ===========================================================================
// MILESTONE-SPECIFIC RULES
// ===========================================================================

if (milestone === 1) {
  check("M1 rule: no real client content shipped yet", () => {
    // Milestone 1 is placeholders only; the real copy lands in Milestone 2.
    const realStrings = [
      "Bringing Great People to Great Businesses",
      "Connecting employers with qualified talent",
      "Candidate screening and shortlisting",
    ];
    const contentFiles = sourceFiles().filter((file) =>
      file.startsWith("src/content/"),
    );
    const offenders = contentFiles.filter((file) => {
      const text = readFileSync(join(ROOT, file), "utf8");
      return realStrings.some((needle) => text.includes(needle));
    });
    assert(
      offenders.length === 0,
      `Real Milestone 2 content already present in: ${offenders.join(", ")}`,
    );
    return "placeholder copy only";
  });

  check("M1 rule: CTAs are placeholder handlers, no real flow", () => {
    assert(
      !exists("src/app/api/apply/route.ts"),
      "Milestone 3 apply API route exists during Milestone 1.",
    );
    const cta = read("src/components/cta/CtaGroup.tsx");
    assert(!/wa\.me/.test(cta), "WhatsApp deep link present during Milestone 1.");
    assert(!/fetch\(/.test(cta), "Network call present during Milestone 1.");
    return "no Milestone 3 flow code present";
  });
}

if (milestone >= 2) {
  check("M2 rule: the content layer serves real client content", () => {
    const index = read("src/content/index.ts");
    assert(
      index.includes("taoohanContent"),
      "src/content/index.ts is still serving placeholder content.",
    );
    return "content switch points at taoohan.ts";
  });

  check("M2 rule: brand colour is defined in exactly one file", () => {
    const offenders = sourceFiles().filter(
      (file) =>
        file !== "src/app/globals.css" &&
        // Tests may NAME the token in order to assert its value; that is not a
        // second definition.
        !file.startsWith("tests/") &&
        /--color-brand-/.test(readFileSync(join(ROOT, file), "utf8")),
    );
    assert(
      offenders.length === 0,
      `Brand tokens redefined outside globals.css in: ${offenders.join(", ")}`,
    );
    return "src/app/globals.css is the only brand colour definition";
  });

  check("M2 rule: contact details live in exactly one file", () => {
    const offenders = sourceFiles()
      .filter((file) => file !== "src/config/contact.ts")
      .filter((file) => !file.startsWith("tests/"))
      .filter((file) => {
        const text = readFileSync(join(ROOT, file), "utf8");
        // A literal email, phone or wa.me link outside the contact config.
        return (
          /["'][\w.+-]+@[\w-]+\.[\w.]+["']/.test(text) ||
          /wa\.me\/\d/.test(text) ||
          /["']\+\d{7,}["']/.test(text)
        );
      });
    assert(
      offenders.length === 0,
      `Contact details hardcoded outside src/config/contact.ts in: ${offenders.join(", ")}`,
    );
    return "src/config/contact.ts is the only source of contact details";
  });

  check("M2 rule: no heading text is hardcoded in JSX", () => {
    const offenders = [];
    for (const file of sourceFiles().filter((name) => name.endsWith(".tsx"))) {
      const text = readFileSync(join(ROOT, file), "utf8");
      for (const match of text.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
        const inner = match[1].trim();
        // Headings must interpolate from the content layer, not carry literals.
        if (inner && !inner.startsWith("{")) {
          offenders.push(`${file}: "${inner.slice(0, 40)}"`);
        }
      }
    }
    assert(
      offenders.length === 0,
      `Hardcoded heading text found:\n  ${offenders.join("\n  ")}`,
    );
    return "all headings interpolate from the content layer";
  });

  check("M2 rule: no invented data in blocked slots", () => {
    const contentFile = read("src/content/taoohan.ts");
    for (const [field, label] of [
      ["stats", "statistics"],
      ["testimonials", "testimonials"],
      ["partners", "partners"],
      ["certifications", "certifications"],
    ]) {
      assert(
        new RegExp(`${field}:\\s*\\[\\]`).test(contentFile),
        `${label} must stay an empty slot — the client answered "TBD".`,
      );
    }
    const contact = read("src/config/contact.ts");
    assert(
      /email:\s*"info@cresvcs\.com"/.test(contact) &&
        /whatsapp:\s*"\+971 50 863 4011"/.test(contact),
      "Contact email/WhatsApp must match the client-confirmed values exactly.",
    );
    return "every TBD slot is still empty, and confirmed contact details match the client's values exactly";
  });
}

if (milestone >= 3) {
  check("M3 rule: apply route reads credentials from env only", () => {
    const route = read("src/app/api/apply/route.ts");
    for (const key of [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "SMTP_FROM",
      "APPLY_TO_EMAIL",
    ]) {
      assert(
        route.includes(`process.env.${key}`),
        `${key} is not read from process.env in the apply route.`,
      );
    }
    return "all six credentials read from process.env";
  });

  check("M3 rule: no applicant data is persisted (Phase 1)", () => {
    const offenders = sourceFiles()
      .filter((file) => file.startsWith("src/"))
      .filter((file) =>
        /\bwriteFileSync\b|\bappendFile\b|localStorage|sessionStorage|indexedDB/.test(
          readFileSync(join(ROOT, file), "utf8"),
        ),
      );
    assert(
      offenders.length === 0,
      `Applicant data could be persisted in: ${offenders.join(", ")}`,
    );
    return "handoff only — nothing written to storage";
  });

  check("M3 rule: an env example is committed with placeholders only", () => {
    assert(exists(".env.local.example"), ".env.local.example is missing.");
    const example = read(".env.local.example");
    for (const key of ["SMTP_HOST", "SMTP_PASS", "APPLY_TO_EMAIL"]) {
      assert(
        new RegExp(`^${key}=\\s*$`, "m").test(example),
        `${key} in .env.local.example must be left blank, not pre-filled.`,
      );
    }
    return "example committed, every secret slot blank";
  });

  check("M3 rule: no custom domain is wired (Vercel preview only)", () => {
    const config = read("next.config.ts");
    assert(
      !/taoohan\.com|domains?\s*:/i.test(config),
      "next.config.ts references a custom domain — Phase 1 is Vercel-only.",
    );
    return "no custom domain configured";
  });
}

// ===========================================================================
// TOOLCHAIN — lint, typecheck/build, then the browser suite
// ===========================================================================

const runCommand = (label, command, args) => {
  check(label, () => {
    const result = spawnSync(command, args, {
      cwd: ROOT,
      encoding: "utf8",
      shell: process.platform === "win32",
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: "0" },
      maxBuffer: 32 * 1024 * 1024,
    });

    if (result.status !== 0) {
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`
        .split("\n")
        .filter(Boolean)
        .slice(-30)
        .join("\n");
      throw new Error(`${label} failed:\n${output}`);
    }
    return "passed";
  });
};

// Only run the expensive stages if the cheap static rules already hold.
const staticPassed = results.every((result) => result.pass);

if (staticPassed) {
  runCommand("lint", "npx", ["eslint", "src", "tests"]);
  runCommand("typecheck", "npx", ["tsc", "--noEmit"]);
  runCommand("production build", "npm", ["run", "build"]);
  runCommand("acceptance suite (real browser, 360 / 768 / 1440)", "npx", [
    "playwright",
    "test",
  ]);
} else {
  results.push({
    name: "toolchain (lint / typecheck / build / browser suite)",
    pass: false,
    detail: "Skipped — fix the static rule failures above first.",
  });
}

// ===========================================================================
// REPORT + LOOP CONTROL
// ===========================================================================

const failures = results.filter((result) => !result.pass);

const report = results
  .map((result) => `${result.pass ? "PASS" : "FAIL"}  ${result.name}\n      ${result.detail.replace(/\n/g, "\n      ")}`)
  .join("\n");

const loadState = () => {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { consecutiveBlocks: 0 };
  }
};

const state = loadState();

if (failures.length === 0) {
  writeFileSync(STATE_FILE, JSON.stringify({ consecutiveBlocks: 0 }, null, 2));
  console.error(`Milestone ${milestone} gate: ALL ${results.length} CHECKS PASS\n${report}`);
  process.exit(0);
}

state.consecutiveBlocks = (state.consecutiveBlocks ?? 0) + 1;
writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

// Ceiling reached — stop blocking so the loop terminates and a human is asked.
if (state.consecutiveBlocks > MAX_CONSECUTIVE_BLOCKS) {
  writeFileSync(STATE_FILE, JSON.stringify({ consecutiveBlocks: 0 }, null, 2));
  console.error(
    `Milestone ${milestone} gate: CEILING REACHED after ${MAX_CONSECUTIVE_BLOCKS} attempts.\n` +
      `Releasing the loop — a human needs to look at this.\n${report}`,
  );
  process.exit(0);
}

console.log(
  JSON.stringify({
    decision: "block",
    reason:
      `Milestone ${milestone} gate FAILED (attempt ${state.consecutiveBlocks} of ${MAX_CONSECUTIVE_BLOCKS}). ` +
      `${failures.length} of ${results.length} checks failing. Fix these, then re-run the WHOLE checklist:\n\n${report}`,
  }),
);
process.exit(2);
