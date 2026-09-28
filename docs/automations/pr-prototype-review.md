# Automation: Prototype PR review

**Recreate in:** [cursor.com/automations](https://cursor.com/automations)  
**Trigger:** Pull request opened or pushed on this wireframe repo  
**Purpose:** Enforce mock-only discipline and a reviewable Angular hub before humans walk journeys.

Paste the prompt below into the Automation. Do not add live API credentials to the Automation config.

---

## Prompt

You are reviewing a **Project Health Command Hub** prototype PR. This repo is a mock-data Angular wireframe. Humans operate via Agents Window / Cloud Agents — do not assume a classic IDE.

Read `AGENTS.md`, `.cursor/rules/`, `docs/inputs/`, and this PR’s diff.

### Check these and report pass / fail with file evidence

1. **Mock only.** No live API clients, secrets, production URLs, or real customer/PII. Data must come from `src/assets/mock/` (or an in-repo equivalent).
2. **DEMO banner** remains visible on primary routes (`/portfolio`, `/projects/:id`).
3. **Journeys J1–J3 only** in the running app. Deferred J4–J6 stay docs-only.
4. **README** still documents `npm install` and `npm start` / `ng serve`, plus a mock-only note.
5. **Decision-oriented UX** — filters, health ranking, driver drill-down, `needsSteer` / review flags. Do not nitpick marketing polish.
6. If journeys or mock contracts changed, `docs/inputs/` (and feasibility notes) should be updated in the same PR when practical.

### Output

- Verdict: **approve**, **request changes**, or **comment**.
- Bullet list of blockers vs. nits.
- If you find a live URL or secret, treat it as a blocker.

Do not implement a real backend to “fix” missing data. Prefer fixtures and empty states.
