# Developer 2 — handover

Status of all fifteen Developer 2 tasks from `Manpower_Task_Division_Simple.pdf`,
and the exact reason for anything not finished.

**Verification:** 671 Playwright tests passing, 0 failing, across five viewports
(360, 768, 1280, 1440, 1920). `npm run typecheck`, `npm run lint` and
`npm run build` all clean.

**Branches:** `dev2-milestone-1` (animation) and `dev2-milestone-3` (employer
flow, layout, images, docs). Neither is merged to `main` — the task division
says who merges is agreed first, not taken.

---

## Milestone 1

| Task | Level | Status |
| --- | --- | --- |
| Landing page animation (hero + scroll) | Hard | Done |
| Animation for the other pages | Medium | Done |
| Look good on laptop and desktop | Medium | Done — fixed a real defect, see below |
| Placeholder image blocks | Easy | Done — now config-driven |
| Footer | Easy | Built by Developer 1 |

## Milestone 2

| Task | Level | Status |
| --- | --- | --- |
| Apply final brand colours (green) | Hard | Applied by Developer 1 |
| Replace placeholder images with real photos | Medium | **BLOCKED — needs image files** |
| Re-check laptop/desktop with real content | Medium | Done |
| Adjust positions to approved layout | Easy | Done |
| Fix animation timing where content changed | Easy | Done |

## Milestone 3

| Task | Level | Status |
| --- | --- | --- |
| Publish on Vercel, no custom domain | Hard | **BLOCKED — needs a Vercel login** |
| Request Manpower category selector | Medium | Done |
| Employer email routing (pre-filled recipient + subject) | Medium | Done |
| On-screen instructions for employers | Easy | Done |
| Test the employer flow on laptop and desktop | Easy | Done |

---

## The two blocked items

### 1. Publish on Vercel

Not skipped — attempted and investigated. See
[DEPLOY.md](DEPLOY.md) for the full write-up.

- `vercel build` and `vercel deploy` need an account login, which is yours.
- The anonymous `vercel deploy --temporary` path fails inside Vercel's builder
  on the Next 16 `_global-error` segment. `next build` produces the file the
  builder reports as missing, it reproduces with and without an explicit
  `global-error.tsx`, and Next 16.3.1 has no flag to suppress segment output.

**To finish it:** import the repo through the Vercel dashboard (the
authenticated path, which builds differently), add the environment variables
*before* the first deploy, and do not connect a custom domain.

### 2. Replace placeholder images

The client authorised interim stock photography ("please use professional stock
photos for now"), so this is not waiting on them — but choosing and licensing
images is a human decision, and unlicensed images must not go into a client
repository.

**The code side is finished.** To fill a slot:

1. Put the file in `public/images/`
2. Set `src` and `alt` in [`src/config/images.ts`](../src/config/images.ts)

No component or test changes. Until then `SiteImage` renders the standard
dashed "awaiting client content" block, holding the same 4:3 ratio, so photos
landing later cannot shift the layout. A test asserts `alt` is non-empty
whenever `src` is set.

---

## The defect worth reading about

Developer 2 owns laptop and desktop, but **neither width existed in the test
matrix** — only 360, 768 and 1440. Adding laptop-1280 and desktop-1920
immediately exposed a bug that had been shipping to every desktop visitor:

> The header row needed **1353px inside a 1216px container**, so the flex row
> squeezed the navigation and every multi-word label ("Industries We Serve",
> "For Job Seekers") wrapped onto two lines — at 1920 as well, with room to
> spare. It was never a narrow-viewport problem.

Two causes, both fixed:

- nav items could shrink → now `shrink-0` + `whitespace-nowrap`
- `CtaGroup` rendered `w-full`, claiming 413px of the header row → a new
  `compact` variant sizes to content and uses the `shortLabel` fields already
  in `site.config.ts`, which nothing had used. The group is now 262px.

The page body keeps the client's approved full button wording; only the sticky
header abbreviates. `tests/dev2-layout.spec.ts` guards both.

---

## Changes made inside Developer 1's files

Flagged rather than done quietly, per "do not touch the other developer's files
without telling them".

| File | Change | Why |
| --- | --- | --- |
| `components/cta/CtaGroup.tsx` | Placeholder handler replaced with the real employer flow; dead `cta-notice` region removed; `compact` variant added | Developer 1 marked this flow as Developer 2's to claim |
| `components/layout/Header.tsx` | Nav `shrink-0` + `whitespace-nowrap`; header CTAs use `compact` | The wrapping defect above |
| `app/for-employers/page.tsx` | Hardcoded categories `EmptySlot` made data-driven | The selector reads the same config |
| `app/page.tsx`, `app/about/page.tsx` | Hero animation; image slots use `SiteImage` | Animation and imagery are Developer 2 scope |
| `tests/milestone-1.spec.ts` | Employer-CTA-inert test now asserts it opens the dialog; CTA wording scoped to `<main>` | The flow it asserted was unbuilt now exists |
| `tests/milestone-2.spec.ts` | CTA wording scoped to `<main>`; new header short-label test | First *visible* CTA at desktop is the header's |
| `tests/a11y.spec.ts` | Audits under reduced motion | axe measured half-faded colours mid-animation and reported contrast failures that do not exist once settled |
| `tests/milestone-1.spec.ts`, `tests/a11y.spec.ts` | `project.name === "desktop-1440"` skip guards replaced with `showsFullNav()` | They assumed exactly one desktop project existed |
| `playwright.config.ts` | Added laptop-1280 and desktop-1920 | Developer 2's assigned devices were untested |

---

## Still blocked on the client

Unchanged from [CLIENT-INFO-REQUEST.md](CLIENT-INFO-REQUEST.md): SMTP
credentials, business email, WhatsApp number, and the manpower categories list.

Nothing was invented to cover these. The employer category selector hides
itself and the free-text field carries the request until the list arrives — and
it was deliberately **not** filled from the services or industries lists, which
answer a different question. A test enforces that.
