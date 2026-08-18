# Outstanding information needed from Taoohan

Everything below was marked **"TBD"**, **"N/A"**, or *"please remind me"* on the
intake form, or was promised as a separate file. The client asked to be
followed up ("Please send me followup once needed and will try to send as soon
as possible"), so this page is that follow-up list.

**Nothing here has been invented or filled with sample data.** Every item
renders on the site as a visible dashed *"Awaiting client content"* slot until
the real value arrives.

---

## Priority 1 — blocking the launch

The Apply Now flow cannot go live without these three.

| # | Item | Why it blocks | Lands in |
| --- | --- | --- | --- |
| 1 | **SMTP credentials** — host, port, username, password | The email application channel cannot send without them | Vercel env vars + `.env.local` |
| 2 | **Business email address** | The inbox that receives job applications (`APPLY_TO_EMAIL`) | Vercel env vars + `.env.local` |
| 3 | **WhatsApp business number** | The `wa.me` deep link cannot be built; the WhatsApp option currently shows "not available yet" | `src/config/contact.ts` |

> For #1, ask whether the mail provider supports an **app-specific password** —
> that is safer than the account password and is what should be supplied.

---

## Priority 2 — visibly empty on the live site

These appear as dashed placeholder blocks that a visitor would notice.

| # | Item | Where it shows | Form answer given |
| --- | --- | --- | --- |
| 4 | Phone number | Contact page, footer | TBD |
| 5 | Office address | Contact page, footer | N/A |
| 6 | Office hours | Contact page, footer | TBD |
| 7 | Social media links | Contact page, footer | TBD |
| 8 | Logo file (the infinity concept) | Header, footer | "Yes — I will send the file separately" |
| 9 | Company photos | Home hero, About page | "Not yet — please use professional stock photos for now" |
| 10 | Numbers/stats to show off | Home, About | TBD |
| 11 | Testimonials or reviews | Home, For Employers | "TBD, please remind me" |
| 12 | Partner or client names | Industries page | "TBD, please remind me to send this" |
| 13 | Certifications or licences | About page | TBD |

> **On #9:** the client authorised stock photography as an interim. Imagery is
> **Developer 2's scope**, so Developer 1 has left marked image slots at the
> correct dimensions rather than sourcing photos. Hand this to Developer 2
> along with the client's permission.

---

## Priority 3 — content quality

| # | Item | Detail |
| --- | --- | --- |
| 14 | **Descriptions for the 11 services** | Only service *names* were supplied. Cards currently render name-only rather than carry invented marketing copy. |
| 15 | **Descriptions for the 12 industries** | Same — names only were supplied. |
| 16 | **Manpower categories list** | Promised as a separate file. Needed for the employer request selector (**Developer 2's** component). |
| 17 | **Year founded** | Answered "N/A". Confirm whether to omit permanently or supply a year. |
| 18 | Privacy policy | "I do not have one yet — I will prepare it" |
| 19 | Terms and conditions | "I do not have one yet" |

---

## Priority 4 — sign-off required

The client supplied a headline, tagline, supporting line, company description,
service list, industry list, differentiators and the recruitment disclaimer.
Those are used **verbatim**.

They did **not** supply section headings, page introductions, or the "how it
works" process steps. Developer 1 drafted those so the pages are not empty.
Every one is tagged `[DRAFT]` in `src/content/taoohan.ts` and **needs client
approval before launch**:

- Section headings and page introduction lines on all seven pages
- The four-step employer process on **For Employers**
- The four-step job-seeker process on **For Job Seekers**
- The Apply Now instruction steps
- The home page trust line

None of these make factual claims about the business — they describe how the
site itself works — but they are the agency's words, not the client's, and
should be read before they go public.

---

## Already confirmed — no action needed

For completeness, these were answered and are already built in:

- Company name: **Taoohan**
- Tagline: *"Bringing Great People to Great Businesses"*
- Homepage headline and supporting line
- Full 11-item service list and 12-item industry list
- Three differentiators
- Brand colour: **green** (fresh, growth, approachable); no excluded colour
- Logo concept: infinity — approved to proceed
- Site feel: warm and people-focused
- Menu order and both button names
- Recruitment disclaimer
- Domain: `Taoohan.com`, client purchasing — **not connected in Phase 1**
