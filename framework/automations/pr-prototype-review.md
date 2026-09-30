# Automation: Prototype PR review

**Recreate in:** [cursor.com/automations](https://cursor.com/automations)  
**Trigger:** Pull request opened or pushed on this wireframe repo  
**Purpose:** Enforce mock-only discipline and a reviewable mock hub before humans walk journeys.

Paste the prompt below into the Automation. Do not add live API credentials to the Automation config.

---

## Prompt

You are reviewing a **concept → mock wireframe** PR. Humans operate via Agents Window / Cloud Agents — do not assume a classic IDE.

Read `AGENTS.md`, `.cursor/rules/`, `framework/cursor-components.md`, and this PR’s diff. Identify which app changed (`apps/<slug>/` or the example `apps/examples/project-health/`).

### Check these and report pass / fail with file evidence

1. **Mock only.** No live API clients, secrets, production URLs, or real customer/PII. Data must come from that app’s `src/assets/mock/` (or an in-repo equivalent).
2. **DEMO banner** remains visible on primary routes.
3. **Scope.** Only confirmed flows are in the running app. Deferred journeys stay docs-only.
4. **README** for the changed app still documents `npm install` and `npm start` / `ng serve`, plus a mock-only note.
5. **Decision-oriented UX** — the primary decision is scannable; drill-down to *why*; empty states. Do not nitpick marketing polish.
6. If journeys or mock contracts changed, that app’s `docs/` (flows + inputs) should be updated in the same PR when practical.
7. A **new concept** must not overwrite `apps/examples/project-health/` unless the PR explicitly extends that example.

### Output

- Verdict: **approve**, **request changes**, or **comment**.
- Bullet list of blockers vs. nits.
- If you find a live URL or secret, treat it as a blocker.

Do not implement a real backend to “fix” missing data. Prefer fixtures and empty states. Do not invent a hosted deploy.
