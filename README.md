# Rewind

**A feedback loop for your judgment.**

Most journals record what you did. Rewind helps you discover *how you think*. It is a personal decision intelligence system designed to help you separate decision quality from outcome quality, so you stop confusing being lucky with being right.

## The Core Loop

Rewind is built around a four-step loop:

1. **Decide:** Log a decision. Record your reasoning, your expected outcome, your probability of success, and the assumptions that must be true for it to work.
2. **Replay:** When the review date arrives, Rewind hides your original reasoning. You must make the choice again to prevent hindsight bias.
3. **Autopsy:** Unlock your original snapshot. Compare your expectations to reality. Evaluate your process and verify whether your assumptions were true, false, or partial.
4. **Patterns:** Discover your calibration. Are you overconfident? Do you have blind spots in certain categories? Track your Brier score.

## Features

- **The Replay Gate:** Original reasoning is hidden on the backend until a fresh replay choice is submitted.
- **Two-Axis Autopsy:** Separates decision quality (process) from outcome quality (luck).
- **Assumption Tracker:** Log beliefs that must be true, and verify them during the autopsy.
- **Pre-mortems & Scorecards:** Force yourself to think critically about risks, evidence, and alternatives before committing.
- **Brier Score Engine:** Mathematically measures how well your probability estimates match reality (treating partial outcomes as 0.5 to avoid binary distortion).
- **Premium UI:** A fully responsive Neumorphic (Soft UI) design with light and dark modes.
- **Session Management:** View active devices and revoke sessions remotely.
- **Data Export:** Download your entire decision history in JSON or CSV format.

## Tech Stack

- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, Zod
- **Frontend:** React, Vite, Tailwind CSS, React Query, React Router
- **Auth:** Session cookies (HTTP-only, SameSite), Argon2id password hashing, Rate limiting

## Architecture Highlights

- **Immutability:** The original reasoning, expected outcome, and probability are locked at creation. If a user edits a pending decision, only the title and review date can be changed.
- **Backend-Enforced Logic:** The Free Tier limit (5 active pending decisions) is enforced on the server, not just hidden in the UI.
- **Cascading Deletes:** Deleting a user account automatically wipes all decisions, sessions, and events via Prisma cascades.

## Known Limitations & TODO (v1.5)

We believe in transparency. Here is what is currently paused or missing from the MVP:

- **Email Delivery is Paused:** Password resets and decision reminders are fully built on the backend, but the actual email delivery via Resend is currently commented out. This is because Resend requires a verified custom domain to send to arbitrary users. Until a domain is purchased, reset tokens are logged to the server console for testing.
- **No Automated Tests:** The core logic (Replay Gate, Immutability, Brier score) is manually verified, but a formal Vitest/Playwright test suite has not yet been written.
- **No Cron Job:** The daily reminder logic exists (`/api/reminders/trigger`), but it is not scheduled. Render charges $1/month for cron jobs, so this will be hooked up via GitHub Actions or a paid Render cron in the future.
- **No CSRF Tokens:** We rely on `SameSite=Lax` cookies and strict CORS policies for CSRF protection, which is standard for modern SPAs, but dedicated CSRF tokens are not implemented.

## Local Development

If you want to run Rewind locally, follow these steps:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Khosrow-hub/Rewind.git
   cd Rewind
2. **Setup the database:**
   ```bash
   docker compose up -d

3. **Setup the Backend:**
   ```bash
   cd server
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev

4. **Setup the Frontend:**
   ```bash
   cd web
   npm install
   npm run dev

5. **Seed demo data (optional):**
   ```bash
   cd server
   npx tsx prisma/seed.ts