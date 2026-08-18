# Deployment & credentials

Everything on this page is a **manual step for Developer 1**. None of it can be
automated from the codebase, because all of it needs credentials or account
access.

---

## 1. The six environment variables

These are the only secrets the project uses. They are read at request time by
`src/app/api/apply/route.ts` via `process.env`, and are never hardcoded.

| Key | What it is | Source |
| --- | --- | --- |
| `SMTP_HOST` | SMTP server hostname, e.g. `smtp.gmail.com` | Client / mail provider |
| `SMTP_PORT` | `587` for STARTTLS (typical) or `465` for implicit TLS | Mail provider |
| `SMTP_USER` | SMTP account username | Client / mail provider |
| `SMTP_PASS` | SMTP password or app-specific password | Client / mail provider |
| `SMTP_FROM` | From header, e.g. `Taoohan Careers <noreply@example.com>` | Client |
| `APPLY_TO_EMAIL` | The inbox that receives job applications | Client |

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

**Vercel → Project → Settings → Environment Variables**, then add all six keys
with the same values. Apply them to **Production** and **Preview**.

Redeploy after adding them — Vercel bakes environment variables at build time,
so an existing deployment will not pick them up on its own.

---

## 2. Deploying

1. Sign in to Vercel and **Add New → Project**.
2. Import `Gene232908/manpower-dev`.
3. Framework preset: **Next.js**. Root directory: repository root. Build
   command and output directory: leave as detected.
4. Add the six environment variables (above) *before* the first deploy.
5. Deploy.

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

---

## 4. Security notes

- The API route never logs the error object on send failure — it can contain
  credentials and applicant details.
- The 503 response names which keys are missing but never their values.
- No applicant data is written to a database, a file, or browser storage. Phase
  1 is email/WhatsApp handoff only; persistence is Phase 2.
- Validation runs on the server as well as the client, so a crafted request
  cannot bypass the form rules.
