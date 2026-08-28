# 🍚 Ration Saathi

A phone-only ration card management app for India — apply, track, and manage
ration card services with an AI assistant, English/Hindi support, and a
Maharashtra pilot for fair price shop bookings.

## 🔁 Already deployed once and pulling this update?

Run `npm run db:seed` again after pulling — the seed script now wipes and
re-creates shops/slots/applications, so it will clear out any old demo
applications and reset all fair-price-shop slots to "available". Then
redeploy (`vercel --prod`) so the new Gemini model name and UI ship.

## ⏱ Fast deploy (do this if you're on a deadline)

1. **Database — Neon (2 min):** go to https://neon.tech → sign up free →
   "Create a project" → copy the **connection string** it shows you
   (starts with `postgresql://...`).
2. **AI key — Gemini (1 min):** https://aistudio.google.com/app/apikey →
   "Create API key" → copy it.
3. **Locally, in this folder:**
   ```bash
   npm install
   cp .env.example .env
   ```
   Paste the Neon string into `DATABASE_URL` and the Gemini key into
   `GEMINI_API_KEY` inside `.env`.
4. **Push the schema and seed data to Neon:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
5. **(Optional) confirm it works locally:** `npm run dev` → http://localhost:3000
   → log in with `9876543210` / any 6-digit PIN.
6. **Deploy with the Vercel CLI (fastest, no GitHub needed):**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```
   Accept the defaults when prompted (link to a new project, current directory).
   When it finishes, it gives you a preview URL — **not production yet**.
7. **Add your env vars to the Vercel project** (it doesn't read your local
   `.env` automatically):
   ```bash
   vercel env add DATABASE_URL production
   vercel env add GEMINI_API_KEY production
   ```
   Paste each value when prompted.
8. **Deploy to production:**
   ```bash
   vercel --prod
   ```
   This prints your live URL — that's what you submit.

If you'd rather use the Vercel website instead of the CLI: push this folder
to a new GitHub repo, "Import Project" on vercel.com, add the same two env
vars under Project Settings → Environment Variables, then Deploy.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Set up your environment variables

Copy the example file:

```bash
cp .env.example .env
```

Open `.env` and fill in **two things**:

```env
# 1. Database — get a free connection string from https://neon.tech
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"

# 2. Gemini API key — needed for the AI assistant chat.
#    Get a free key here: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="paste-your-key-here"
```

That's it — **`.env` is where both the database URL and the Gemini key go.**
The app reads them automatically; you never paste keys into any code file.

## 3. Create and seed the database

```bash
npm run db:generate   # generates the Prisma client
npm run db:push       # creates the tables on your Neon database
npm run db:seed        # fills it with 3 citizens, 8 shops, 4 sample applications, 96 time slots
```

## 4. Run it

```bash
npm run dev
```

Open **http://localhost:3000** — you'll land on the login page.

**Demo login:** phone `9876543210`, any 6-digit PIN (e.g. `123456`).

## 5. Build for production

```bash
npm run build
npm start
```

## Deploying

See the "⏱ Fast deploy" section at the top — it's the same idea: Neon for
the database, Vercel for hosting, two env vars (`DATABASE_URL`,
`GEMINI_API_KEY`) set in the Vercel project.

## What's in the box

| Area | Where |
|---|---|
| Login (phone + PIN) | `app/login/page.js` |
| Home | `app/page.js` |
| Apply (4-step form) | `app/apply/[type]/form/page.js` |
| Confirmation | `app/apply/confirmation/[id]/page.js` |
| Status tracking | `app/status/page.js` |
| Fair price shops | `app/shops/page.js` |
| AI assistant (Gemini) | `components/AIChat.js` + `app/api/assistant/route.js` |
| Applications API | `app/api/applications/route.js` |
| Shops API | `app/api/shops/route.js` |
| Database schema | `prisma/schema.prisma` |
| Seed data | `prisma/seed.js` |
| English/Hindi text | `lib/i18n.js` |

## Notes

- No Aadhar or other personal ID is ever collected — only a phone number.
- The demo citizen (`9876543210`) is what the Status/Apply pages read and
  write to, since there's no full session system — good enough for a
  hackathon demo. For a production version you'd tie applications to
  whichever phone number just logged in.
- Only **Maharashtra** has seeded shop data (the "pilot" state); every other
  state shows a "coming soon" screen, as speced.
- The Status page shows **only real applications you submit** — the seed
  script no longer creates fake ones. "View details" expands each card
  in place to show the contact method, reason, and documents on file.
- Fair price shops show their real open slots (`prisma/seed.js` creates
  96 of them). Tapping a shop opens a picker; booking a slot marks it
  unavailable in the database and shows a confirmation banner.
- The AI assistant uses Google's current `@google/genai` SDK with
  `gemini-3.7-flash`, falling back to `gemini-2.5-flash` automatically if
  that model isn't available on your key/region. Google has been rotating
  Gemini model names quickly — if both ever 404, check
  https://ai.google.dev/gemini-api/docs/models and update the `MODEL`
  constant in `app/api/assistant/route.js`.
- There's a light/dark theme toggle (moon/sun icon in the header),
  persisted per browser.
