# Rewind

Rewind is a personal decision intelligence system. It helps you separate decision quality from outcome quality so you stop confusing being lucky with being right.

## The Core Loop

Most journaling apps focus on what you did. Rewind focuses on how you thought. 

1. **Decide:** Log a decision, your reasoning, your confidence, and what you expect to happen.
2. **Replay:** When the review date arrives, Rewind hides your original reasoning. You must make the choice again to prevent hindsight bias.
3. **Autopsy:** Compare your expectation to reality. Was the process sound? Did the outcome match?
4. **Patterns:** Discover your calibration. Are you overconfident? Do you have blind spots in certain categories?

## Features

- **Replay First:** Original reasoning is hidden until you submit a replay choice.
- **Two Axis Autopsy:** Separates decision quality (process) from outcome quality (luck).
- **Pattern Engine:** SQL-derived insights on confidence calibration, blind spots, and regret rates.
- **Data Export:** Full JSON and CSV export of your entire decision history.
- **Bento UI:** A clean, modular interface with light and dark mode support.

## Tech Stack

- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, Zod
- **Frontend:** React, Vite, Tailwind CSS, React Query, React Router
- **Auth:** Session cookies (HTTP-only, SameSite), Argon2 password hashing