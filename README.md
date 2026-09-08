# 🍚 Ration Saathi

A phone-only ration card management app for India. Citizens can apply for a new ration card, add a family member, update an address, or replace a lost card — track real-time status, fix a flagged correction, and book an actual fair price shop time slot. No Aadhaar number is ever collected.

Built for **Build What Moves India 2026**.

**Built by:** [Hanshal Gajula](https://www.linkedin.com/in/hanshal-gajula)

**Live site:** [ration-saathi-sigma.vercel.app](https://ration-saathi-lime.vercel.app/) · 

---

## The problem

A ration card application can fail for a dozen reasons — a mismatched document, a fingerprint scanner that won't read a worn print, a card flagged during a routine re-verification. The real problem isn't any single cause. It's that when something goes wrong, the system doesn't say what — people are simply told to come back, with no idea if the next trip will work.

Biometric failure is the sharpest example: fingerprints genuinely wear down with age and years of manual labour, so elderly citizens and laborers are hit hardest by scanners that won't read their prints. We can't fix a scanner. What Ration Saathi fixes is the silence around it — whatever the cause, a person can always see exactly what's wrong and what to do next, instead of guessing.



---

## Phase 1 — Citizen Experience

- **Phone-only login** — no Aadhaar or other government ID collected
- **Guided application flow** — new card, add member, update address, lost card replacement, with a personalized document checklist
- **Save & resume** — drafts autosave locally and pick up where you left off
- **Real-time status tracking** — with an expandable detail view per application and a clear correction → resubmit path
- **Fair price shop locator** with real, bookable time slots and a duplicate-booking safeguard
- **English / Hindi / Marathi** — the app is now trilingual, with a **read-aloud option** for citizens who find reading difficult
- **Bigger-text mode** — an accessibility toggle for citizens who find small on-screen text hard to read
- **Light / dark mode**
- **Static FAQ** instead of a flaky third-party AI dependency — reliable by design for a live demo

---

## 🚀 Phase 2 — From Citizen Experience to Complete Service Workflow

Phase 1 focused on the citizen side of the ration service — applying, tracking applications, fixing issues, and finding a Fair Price Shop (FPS). But the journey doesn't end when a citizen books a slot: someone at the shop still has to receive that booking and serve the citizen. Phase 2 connects both sides — citizen and dealer.

### 1. Dealer Dashboard
Dealers get a dedicated dashboard where bookings made by citizens appear for their shop, instead of the citizen simply getting a confirmation with no downstream connection. Dealer access starts at a dedicated entry point, kept separate from the citizen login flow.

### 2. Citizen → Dealer Booking Flow
```
Citizen
   ↓
Books a Fair Price Shop slot
   ↓
Receives a booking code
   ↓
Booking appears on dealer dashboard
   ↓
Dealer verifies code / phone number
   ↓
Citizen is checked in
```
This turns slot booking from a citizen-only feature into an actual two-sided workflow.

### 3. No login needed at the counter, for the citizen
At the shop counter, the citizen doesn't need any account or login at all — they hand over their **booking code + phone number**, and the dealer verifies it by hand on the dealer dashboard. The only login in this loop belongs to the dealer, not the citizen.

### 4. Designed for real shop conditions
No assumptions about modern smartphones, dedicated apps, scanners, or perfect internet. A dealer only needs:
- A basic or shared computer
- A booking code
- A phone number
- An existing web browser

No dedicated dealer mobile app or scanner is required for the basic check-in flow — the technology fits the environment, not the other way around.

### 5. Secure dealer access
Instead of a permanent password or raw PIN in a URL, dealer access uses **signed, expiring magic links**, entered via `/shops/login`. Each link contains:
- Authorized shop identifier
- Expiry timestamp
- HMAC-SHA256 signature

The server verifies the signature and expiry before allowing access — an expired link stops working, a modified link is rejected, and link generation is centralized behind the signing secret so shops can't mint their own valid links.

### 6. 8 pilot shops
The Phase 2 dealer workflow is currently configured across 8 pilot shops, so the full journey — **Citizen → Booking → Dealer Dashboard → Verification → Check-in** — can be demonstrated end-to-end, not shown as two disconnected halves.

---

## Phase 1 → Phase 2

| Phase 1 | Phase 2 |
|---|---|
| Focused on the citizen | Connects citizen and dealer |
| Ration card application | Dealer workflow added |
| Application status tracking | Booking appears on dealer dashboard |
| Fair Price Shop locator | Citizen can book a slot and dealer can receive it |
| Citizen-side booking | Code / phone-based check-in, no citizen login needed at the counter |
| Citizen experience | End-to-end service workflow |
| Basic access flow | Signed, expiring dealer access via `/shops/login` |

The biggest change wasn't just adding a dealer dashboard — it was asking a bigger question:

> **Can the service work from the citizen's phone all the way to the shop counter?**

That question shaped everything built in Phase 2.

---

## Complete Ration Saathi flow

```
                    CITIZEN
                       │
                       ▼
                  Sign in
                       │
                       ▼
             Choose ration service
                       │
                       ▼
              Submit application
                       │
                       ▼
             Track application
                       │
                ┌──────┴──────┐
                │             │
             No issue     Correction
                │             │
                │             ▼
                │       Fix & resubmit
                │
                ▼
              Find FPS
                │
                ▼
            Book a slot
                │
                ▼
         Receive booking code
                │
                ▼
        ┌───────────────────┐
        │  FAIR PRICE SHOP  │
        └───────────────────┘
                │
                ▼
     Dealer signs in via /shops/login
                │
                ▼
         Dealer dashboard
                │
                ▼
          View booking
                │
                ▼
   Citizen gives code / phone (no login)
                │
                ▼
          Citizen served
```

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Deployment:** Vercel
- **Citizen authentication:** Email verification
- **Dealer authentication:** Signed, expiring HMAC-SHA256 magic links, via `/shops/login`
- **Localization:** English / Hindi / Marathi with read-aloud support
- **Accessibility:** Bigger-text mode

---

## Test login

- **Email:** use your own email — it receives a PIN for you to confirm
- **Phone:** any 10-digit number (e.g. `9876543210`)
- **Linking card:** `MH-2233-2343` (format: `MH-****-****`)

Once logged in, your dashboard is yours alone and separate from other users — no need to re-link your card each time. After entering the card number you'll see a fixed set of family members (hardcoded demo data) — just click continue.

Each phone number gets its own separate applications and bookings — real per-user data, not shared demo data.

---

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

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/         Next.js App Router pages + API routes (incl. /shops/login, /about)
components/  Shared UI components
context/     Language, theme, text-size, and app-state React contexts
lib/         i18n dictionaries (English/Hindi/Marathi), Prisma client
prisma/      Database schema and seed script
public/      Static assets
```

---

## Production roadmap

Ration Saathi is currently a working prototype with real database-backed citizen and dealer workflows. We've kept the items below separate from the current prototype so we don't claim integrations or capabilities we haven't actually implemented. For a production government deployment, we would add:

- Integration with actual state PDS systems
- Government-verified authentication and authorization (replacing demo PIN/email verification)
- Encrypted document storage
- Audited government integrations
- SMS and voice notifications on status change
- Stronger dealer identity verification
- Offline-first synchronization for intermittent connectivity
- Accessibility testing with real citizens and dealers
- Production-grade monitoring and audit logging

---

## Build What Moves India 🇮🇳

Ration Saathi started with a simple idea: make an existing government service easier to understand and easier to use.

Phase 1 taught us that improving the citizen experience isn't only about putting forms online — people need to understand what's happening with their application and what they need to do next.

Phase 2 made us look at the other side of the counter. Now, a citizen can book a slot, and that booking can reach the dealer who will actually serve them, without either side needing more than a phone number, a booking code, and a browser.

For us, that's what improving a government service means — not just making a better-looking website, but making the workflow work better for the people on both sides of it.
