import { defineConfig, devices } from "@playwright/test";

/**
 * Browser binaries are installed inside node_modules (see the Milestone 1
 * notes) because the machine-wide cache directory is not writable here.
 */
process.env.PLAYWRIGHT_BROWSERS_PATH ??= "0";

/** Dedicated port so the gate never collides with a hand-run `npm run dev`. */
const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  reporter: [["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
  },

  /**
   * The widths in the acceptance checklists: phone (360) and tablet (768) are
   * Developer 1's assigned devices, plus a desktop width where the full 7-item
   * nav bar is shown.
   *
   * laptop-1280 and desktop-1920 were added by Developer 2: the task division
   * assigns laptop and desktop to Developer 2 ("make the site look good on
   * laptop and desktop", "test the employer flow on laptop and desktop"), and
   * neither width was represented. 1440 alone cannot stand in for both a
   * 1280 laptop and a 1920 desktop — the grid breakpoints differ.
   */
  projects: [
    {
      name: "mobile-360",
      use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 } },
    },
    {
      name: "tablet-768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "laptop-1280",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-1920",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } },
    },
  ],

  /**
   * Serves the real production build, so the gate tests exactly what would be
   * deployed rather than a dev-server approximation.
   */
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
