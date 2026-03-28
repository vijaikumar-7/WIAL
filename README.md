# WIAL Global Chapter Hub — upgraded build

This upgrade turns the early prototype into a tighter WIAL-facing platform:

- native global + chapter coach directory
- complete public page set: About, Certification, Coaches, Chapters, Events, Resources, Contact
- WIAL-style dues and invoice portal instead of course checkout
- chapter provisioning + template governance UI
- AI-1 cross-lingual coach search
- AI-2 chapter content generation with human review
- AI-3 smart coach matching
- AI-4 research and webinar knowledge search
- real coach import pipeline from the provided CSV export
- Stripe sandbox handoff route with mock-safe fallback

## What changed

### 1) WIAL scope alignment
The build is now centered on the website + chapter platform problem, not a pseudo-LMS checkout flow.
Certification is informational and routes users to chapters/global support instead of pretending to be the course system.

### 2) Real directory import
The repo now includes `data/wial_coaches.csv` and a regeneration script:
```bash
npm run import:coaches
```

This produces:
- `src/lib/data/imported-coaches.json`
- `src/lib/data/chapters.json`

### 3) Payment model
Admin now uses a dues / invoice model based on WIAL’s stated business rules:
- $50 per enrolled learner
- $30 per fully certified learner

The UI exposes invoice status, reminders, receipt state, and optional Stripe sandbox handoff instead of “Enroll Now” course commerce.

### 4) AI layers
The app ships with safe local fallbacks and optional server-side OpenAI upgrades when `OPENAI_API_KEY` is present.

- `/api/search` — cross-lingual coach search fallback with chapter-aware ranking
- `/api/match` — guided “Find a Coach” intake
- `/api/chapter-content` — chapter-in-a-box content drafts
- `/api/knowledge` — research/webinar knowledge retrieval
- `/api/payments/checkout` — Stripe sandbox session or mock-safe fallback

### 5) Governance UX
The admin surface now demonstrates:
- chapter provisioning preview
- template inheritance / locked zones
- dues workflow
- chapter content generation with review-required output

## Data truth and limitations

The uploaded CSV is valuable but sparse:
- 100 public coach rows imported
- 40 rows include a phone number
- 3 rows include an email address
- biography, company, certification, and structured specialization fields are mostly missing in the export

Because of that, the directory explicitly labels many imported coach rows as:
- **Verification needed**
- **Imported from public directory export**
- **Needs certification sync**

This is intentional and honest. It matches the WIAL SRD note that badge/certification truth should come from external source systems rather than being guessed inside the website.

## Setup

```bash
npm install
npm run dev
```

Optional environment variables:
```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
STRIPE_SECRET_KEY=
```

Without keys:
- AI endpoints use deterministic local fallbacks
- payment flows stay in demo / mock mode

With keys:
- chapter drafting and knowledge routes can use OpenAI structured outputs
- checkout can open a real Stripe sandbox session

## Recommended demo order

1. Home page + find-a-coach intake
2. Global coach directory with Portuguese or multilingual search
3. Brazil or Nigeria chapter page
4. Admin chapter provisioning preview
5. Admin invoice portal
6. Chapter content generator
7. Knowledge search on resources page

## Important note for the team

The imported coach data is real, but not complete enough to support production-grade coach ranking on specialization alone.
For the hackathon, that is okay as long as you say:

> “We imported the live public directory export, preserved source gaps honestly, and built the AI layer to degrade gracefully when specialization metadata is missing.”

That answer is stronger than fabricating fields.
