# Taoohan — Manpower & Recruitment Website

Phase 1 marketing site for Taoohan, a manpower and recruitment company.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Poppins.

**Developer 1 scope** (this repository's work): pages, navigation, content
layer, and the job-seeker *Apply Now* flow.
**Developer 2 scope** (not built here): imagery, animation ownership, the
employer *Request Manpower* flow logic, and deployment ownership.

---

## Quick start

```bash
npm install
npx playwright install chromium   # only needed to run the gate
npm run dev                       # http://localhost:3000
```

For the email channel to work locally, copy the env template and fill it in:

```bash
cp .env.local.example .env.local
```

`.env.local` is git-ignored and must never be committed. See
[docs/DEPLOY.md](docs/DEPLOY.md) for the six keys and the Vercel setup.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint over `src` and `tests` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Playwright suite (276 tests × 3 viewports) |
| `npm run gate` | **The full acceptance gate** — see below |

---

## Architecture: four files control almost everything

The site is deliberately built so that structure, copy, colour and contact
details each have exactly **one** source. This is enforced mechanically — the
gate fails the build if a second source appears.

| File | Owns |
| --- | --- |
| `src/config/site.config.ts` | Navigation order, page labels, CTA wording |
| `src/content/index.ts` | Which content set is live (one-line switch) |
| `src/content/taoohan.ts` | Every string of real copy |
| `src/app/globals.css` | Every colour, via `--color-*` design tokens |
| `src/config/contact.ts` | Email, phone, WhatsApp, address, hours, socials |

Consequences worth knowing:

- **Re-ordering the menu** is one array edit in `site.config.ts`; the header,
  mobile menu and footer all follow.
- **Changing the brand colour** is eleven `--color-brand-*` lines in
  `globals.css`. No component references a stock Tailwind colour.
- **Page eyebrows derive from the nav labels**, so menu wording and page
  wording cannot drift apart.

### Content provenance

Every string in `src/content/taoohan.ts` is tagged:

- `[CLIENT]` — verbatim from the intake form. Never edited or paraphrased.
- `[DRAFT]` — connective copy written by Developer 1 because the client did not
  supply a string. **Needs client sign-off.**
- `[BLOCKED]` — client answered "TBD". Left as an empty typed slot.

Services and industries render **name-only**: the client supplied names without
descriptions, and none were invented. `Feature.body` and `Industry.blurb` are
optional for exactly this reason.

Anything the client has not sent renders as a visible dashed
"Awaiting client content" slot, so blocked data is obvious rather than silently
missing.

---

## The acceptance gate

`npm run gate` runs the milestone acceptance criteria as machine checks, and is
wired to a Claude Code `Stop` hook in `.claude/settings.json` so work cannot be
declared finished while anything is red.

It runs:

1. **16 static hard rules** — credentials never hardcoded, `.env.local` ignored,
   no database code, colours only from tokens, nav declared once, contact
   details declared once, no heading text hardcoded in JSX, no invented data in
   blocked slots, no applicant persistence, no custom domain.
2. **lint → typecheck → production build**
3. **276 Playwright tests** against the real production build at **360 / 768 /
   1440**, including a full axe WCAG 2.1 A/AA sweep of all seven pages and both
   Apply Now steps.

Exit `0` = pass. Exit `2` = blocked, with the failing checks listed. A ceiling
of six consecutive blocks releases the loop so it can never spin forever.

`.claude/gate.json` sets which milestone's rules apply.

To turn the automatic gate off, delete the `Stop` block from
`.claude/settings.json`. `npm run gate` still works manually.

---

## Milestone status

| Milestone | Status |
| --- | --- |
| 1 — Layout & navigation skeleton | ✅ 10/10 acceptance items pass |
| 2 — Real content & final design | ✅ 9/9 acceptance items pass |
| 3 — Apply Now flow + go live | ⚠️ 8/12 pass, 4 blocked on human input |

Milestone 3's four open items all require credentials or access that the code
cannot supply: a real-phone WhatsApp test, confirmed email delivery, the Vercel
deployment, and the Vercel environment variables.

**Outstanding client data** is listed in
[docs/CLIENT-INFO-REQUEST.md](docs/CLIENT-INFO-REQUEST.md).

---

## The Apply Now flow (Milestone 3)

Two steps, no more:

1. Full name + contact number, validated.
2. Choose **WhatsApp** or **Email**.

- **WhatsApp** builds a `wa.me` deep link with the details pre-filled. No
  backend. While the business number is unset it shows a clear message instead
  of linking to a broken URL.
- **Email** POSTs to `src/app/api/apply/route.ts`, which sends via Nodemailer.
  All six SMTP values are read from `process.env` at request time. While
  unconfigured it returns **503** naming the missing keys — never their values.

**Phase 1 stores nothing.** Applicant details live in component state only, long
enough to build a link or an email, then are discarded. No database, no file
writes, no logging of applicant data. Persistence is Phase 2.

---

## Branches

`main`, `milestone-1`, `milestone-2`, `milestone-3` exist both locally and on
[the remote](https://github.com/Gene232908/manpower-dev). Each milestone branch
holds that milestone's accepted state; `main` holds the merged result.
