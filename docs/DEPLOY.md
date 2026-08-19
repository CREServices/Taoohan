# Deployment & credentials

Everything on this page is a **manual step**. None of it can be automated from
the codebase, because all of it needs credentials or account access.

**Ownership:** collecting the credentials is Developer 1's job (they are the
sole client liaison). Publishing to Vercel is **Developer 2's** task per the
task division. Developer 1 hands the values over; Developer 2 pastes them into
Vercel and deploys.

---

## 1. The six environment variables

These are the only secrets the project uses. They are read at request time via
`process.env` by both mail routes — `src/app/api/apply/route.ts` (job seekers)
and `src/app/api/request-manpower/route.ts` (employers) — and are never
hardcoded.

| Key | What it is | Source |
| --- | --- | --- |
| `SMTP_HOST` | SMTP server hostname, e.g. `smtp.gmail.com` | Client / mail provider |
| `SMTP_PORT` | `587` for STARTTLS (typical) or `465` for implicit TLS | Mail provider |
| `SMTP_USER` | SMTP account username | Client / mail provider |
| `SMTP_PASS` | SMTP password or app-specific password | Client / mail provider |
| `SMTP_FROM` | From header, e.g. `Taoohan Careers <noreply@example.com>` | Client |
| `APPLY_TO_EMAIL` | The inbox that receives job applications | Client |
| `REQUEST_TO_EMAIL` | *Optional.* Inbox for employer staffing requests. Leave blank and they go to `APPLY_TO_EMAIL` too. | Client |

> If the mail provider offers an **app-specific password**, use it. Never put a
> primary account password in `SMTP_PASS`.

### Locally

```bash
cp .env.local.example .env.local
# then edit .env.local and fill in the six values
```

`.env.local` is git-ignored. Verify before your first commit:

```bash
git check-ignore -v .env.local     # must print a .gitignore rule
git ls-files | grep '\.env'        # must print ONLY .env.local.example
```

The acceptance gate checks both of these on every run, so a leaked env file
fails the build rather than reaching the remote.

### On Vercel

**Vercel → Project → Settings → Environment Variables**, then add the six
required keys (plus `REQUEST_TO_EMAIL` if the client wants employer requests in
a separate inbox). Apply them to **Production** and **Preview**.

Redeploy after adding them — Vercel bakes environment variables at build time,
so an existing deployment will not pick them up on its own.

---

## 2. Deploying

1. Sign in to Vercel and **Add New → Project**.
2. Import `Gene232908/manpower-dev`.
3. Framework preset: **Next.js**. Root directory: repository root. Build
   command and output directory: leave as detected.
4. Add the environment variables (above) *before* the first deploy.
5. Deploy.

### Known issue: the anonymous `--temporary` deploy fails

`npx vercel deploy --temporary` (the no-login path) fails on this project with:

```
ENOENT: no such file or directory, stat
'/vercel/path0/.vercel/output/functions/_global-error.segments/__PAGE__.segment.rsc.func'
```

This is **not** a fault in the app, and not something a code change fixes:

- `next build` produces the file locally — `.next/server/app/_global-error.segments/__PAGE__.segment.rsc` exists.
- The global-error segment is laid out differently from a normal route
  (`__PAGE__` sits at the top level, and there is no `_index.segment.rsc`), and
  the builder tries to turn it into a serverless function anyway.
- It reproduces with and without an explicit `src/app/global-error.tsx`, because
  Next 16 emits the segment either way.
- Next 16.3.1 has no supported flag to suppress segment output.

Use the normal **authenticated** flow below instead — importing the GitHub repo
through the Vercel dashboard. That path builds differently from the anonymous
temporary one and is the supported route. If the same error appears there,
report it to Vercel as a Next.js 16.3.1 builder issue rather than trying to
work around it in the app.

---

**Do NOT connect a custom domain.** Phase 1 ships on the Vercel-provided URL
only. `Taoohan.com` is still being confirmed by the client, and the domain is
theirs to purchase. The gate has a rule that fails the build if a custom domain
is wired into `next.config.ts`.

---

## 3. Verifying the live site

Once deployed, these are the two checks that the automated gate cannot perform
for you. Both are open Milestone 3 acceptance items.

### Email channel

1. Open the live site → **Submit Your CV**.
2. Enter a real name and number → **Continue** → **Send by email**.
3. Expect the on-screen confirmation, and an email in `APPLY_TO_EMAIL`.

If you instead see *"Email applications are not configured yet"*, the
environment variables are missing or the project was not redeployed after they
were added. That message is the route returning **503**, which is the correct,
deliberate behaviour when unconfigured — not a crash.

### WhatsApp channel — must be tested on a real phone

This cannot be verified in a desktop browser. You need the client's WhatsApp
business number in `src/config/contact.ts` first (see
[CLIENT-INFO-REQUEST.md](CLIENT-INFO-REQUEST.md)).

1. Open the live site **on a phone with WhatsApp installed**.
2. **Submit Your CV** → enter details → **Continue** → **Open WhatsApp**.
3. WhatsApp should open a chat with the business number, with the message
   already filled in with the name and contact number.
4. Confirm the message arrives on the business handset.

Until the number is supplied, the modal correctly shows *"WhatsApp is not
available yet"* instead of a broken link.

### Employer channel — Request Staffing & Manpower

1. Open the live site → **Request Staffing & Manpower**.
2. Fill in company, name and work email → **Continue**.
3. Describe the roles needed → **Send request**.
4. Expect the on-screen confirmation, and an email in `REQUEST_TO_EMAIL` (or
   `APPLY_TO_EMAIL` if that key is blank).

The dialog also offers **Open in my email app**, a `mailto:` link with the
recipient and subject already filled in. That path needs no SMTP at all, but it
does need the client's business email in `src/config/contact.ts` — until then
the dialog says so rather than rendering a dead link.

The category selector stays hidden until the client's manpower categories list
is added to `src/config/manpower.ts`; the free-text field carries the request
in the meantime.

---

## 4. Security notes

- The API route never logs the error object on send failure — it can contain
  credentials and applicant details.
- The 503 response names which keys are missing but never their values.
- No applicant data is written to a database, a file, or browser storage. Phase
  1 is email/WhatsApp handoff only; persistence is Phase 2.
- Validation runs on the server as well as the client, so a crafted request
  cannot bypass the form rules.
