# Project Health Command Hub — Demo Wireframe

Clickable **Angular** hub for a construction portfolio morning scan. Fictional projects only. Not a customer system.

This repo is the worked example of **intake docs → Cloud Agent → reviewable wireframe**. Humans operate from Agents Window / [cursor.com/agents](https://cursor.com/agents) / [cursor.com/automations](https://cursor.com/automations). A classic IDE is not required.

**First prompt:** paste the block in [`docs/prompts/00-main-intake.md`](docs/prompts/00-main-intake.md) (or `@` that file). See [`docs/prompts/`](docs/prompts/). Mock/stub only.

## What this demo proves

1. Filled `docs/inputs/` become journeys J1–J3 without live integrations.
2. Repo-local rules, skills, and Automation prompts make the pattern repeatable for the next concept.
3. The Angular shell + mock contracts are real enough to walk decisions (escalate, needs-steer, cost flag) and hand off later.

**Mock/stub only.** No ERP, P6, EHS, warehouse, auth, or production URLs.

## Run

Requires Node **22.12+** (this workspace uses Angular 21, the current line that installs on Node 22.14; Angular 22 needs Node 22.22.3+).

```bash
npm install
npm start
```

Equivalent: `npx ng serve`. Open the forwarded port (default `http://localhost:4200`).

Production compile check:

```bash
npx ng build
```

## Journeys in the app

| Route | Journey |
| --- | --- |
| `/portfolio` | J1 — ranked / filterable health list |
| `/projects/:id` | J2 — overview, drivers, session-only **Needs steer** |
| `/projects/:id/schedule` (also `cost`, `safety`, `change`) | J2 / J3 domain tabs |
| `/projects/:id/issues/:issueId` | Driver detail + recommended action |

J4–J6 stay in `docs/inputs/03-priority-journeys.md`.

10 fictional jobs (2 red, 3 amber, 5 green) live in `src/assets/mock/`. Names use `EXAMPLE —`. No real PII.

Deep-link for the Cost Lead path (J3): `/projects/northridge-hospital/cost`.

## Docs

- First-run intake prompt: [`docs/prompts/00-main-intake.md`](docs/prompts/00-main-intake.md)
- Intake examples (filled): [`docs/inputs/`](docs/inputs/)
- Intake templates (blank): [`docs/inputs/templates/`](docs/inputs/templates/)
- Cursor components (rules / skills / hooks / Automations): [`docs/10-cursor-components-for-repeatable-prototypes.md`](docs/10-cursor-components-for-repeatable-prototypes.md)
- Agent playbook: [`AGENTS.md`](AGENTS.md)
- Automation prompts: [`docs/automations/`](docs/automations/)

## Optional hooks

[`.cursor/hooks.json`](.cursor/hooks.json) is a lightweight guardrail:

- `sessionStart` — inject the mock-only checklist (IDE / worker sessions)
- `beforeShellExecution` — ask before `curl`/`wget` to non-toolchain hosts
- `afterFileEdit` — remind if `environment.ts` gains a remote URL

Hooks are optional. Rules and skills are the primary repeatability lever. Cloud Agents do not run `sessionStart`.
