# 🍚 Ration Saathi

A phone-only ration card management app for India. Citizens can apply for a
new ration card, add a family member, update an address, or replace a lost
card — track real-time status, fix a flagged correction, and book an actual
fair price shop time slot. No Aadhar number is ever collected.

Built for **Build What Moves India 2026**.

**Built by:** [Hanshal Gajula](https://www.linkedin.com/in/hanshal-gajula)

## The problem

Ration shops across India verify citizens through Aadhaar-linked fingerprint
scanners before handing over grain. The single biggest reason that fails:
fingerprints genuinely wear down with age and years of manual labour —
construction workers, farmers, and the elderly are hit hardest. When a scan
fails, there's often no clear path back into the system, just repeat visits
and no explanation of what to do next.

We can't fix a fingerprint scanner. Ration Saathi makes sure a person always
has a way to check where their application stands, fix a flagged issue
without starting over, and reserve a real shop slot instead of guessing when
to show up.

## Features

- **Phone-only login** — no Aadhar or other government ID collected
- **Guided application flow** — new card, add member, update address, lost
  card replacement, with a personalized document checklist
- **Save & resume** — drafts autosave locally and pick up where you left off
- **Real-time status tracking** — with an expandable detail view per
  application and a clear correction → resubmit path
- **Fair price shop locator** with real, bookable time slots and a
  duplicate-booking safeguard
- **English / Hindi** — fully bilingual across the app
- **Light / dark mode**
- **Static FAQ** instead of a flaky third-party AI dependency — reliable by
  design for a live demo

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Deployment:** Vercel

## Test login

-Phone: any 10-digit number (e.g. 9876543210)
-PIN: any 6 digits (e.g. 123456)

Each phone number gets its own separate applications and bookings — real
per-user data, not shared demo data.

## Running locally

```bash
npm install
cp .env.example .env
```
Fill in `.env`:
```env
DATABASE_URL="your Neon postgres connection string"
GEMINI_API_KEY=""   # unused — kept for future re-enablement, safe to leave blank
```
```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```
Open `http://localhost:3000`.

## Production roadmap

This is a working prototype using mock application data over a real
database. A production version would add:
- OTP-based authentication instead of a demo PIN
- Encrypted document storage
- Audited integrations with actual state PDS systems
- SMS/call notifications on status change

## Project structure
-app/ Next.js App Router pages + API routes
-components/ Shared UI components
-context/ Language, theme, and app-state React contexts
-lib/ i18n dictionaries, Prisma client
-prisma/ Database schema and seed script
-public/ Static assets
