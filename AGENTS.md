# AGENTS.md — Project Health Command Hub demo

This repository is a **mock-data Angular wireframe** for a construction portfolio health hub.

Humans dispatch work from **Agents Window**, [cursor.com/agents](https://cursor.com/agents), and [cursor.com/automations](https://cursor.com/automations). A classic IDE is not required for the eval narrative.

**First prompt:** paste (or `@`) [`docs/prompts/00-main-intake.md`](docs/prompts/00-main-intake.md). Mock/stub only — no live APIs or secrets.

## Non-negotiables

- Mock/stub data only — no live APIs, secrets, or production URLs
- Keep the DEMO / mock-data banner visible
- Prefer decision-oriented UX over visual polish
- Implement journeys **J1–J3** only; J4–J6 stay in `docs/inputs/`
- Update `docs/inputs/` when journeys or mock contracts change

## How to run

```bash
npm install
npm start
# or: npx ng serve
```

`ng build` must succeed. Preview the forwarded port; desktop-first (1280+).

## Layout

| Path | Role |
| --- | --- |
| `docs/prompts/00-main-intake.md` | First prompt to run in Agents Window / Cloud Agents |
| `docs/inputs/` | Example customer intake (concept, personas, J1–J3, IA, contracts) |
| `docs/automations/` | Paste-ready Automation prompts (PR review, daily digest, Slack triage) |
| `docs/10-cursor-components-for-repeatable-prototypes.md` | Rules / skills / hooks / Automations pattern |
| `.cursor/rules/` | Mock-only, decision UX, Angular conventions, docs-sync |
| `.cursor/skills/` | `intake-to-journeys`, `prototype-brief`, `angular-wireframe-scaffold`, `feasibility-readout`, `handoff-brief` |
| `.cursor/hooks.json` | Optional prototype guardrails (see README) |
| `src/assets/mock/` | Fictional portfolio + driver fixtures |
| `src/app/` | Standalone Angular hub |

## Routes

- `/portfolio` — ranked / filterable health list (J1)
- `/projects/:id` — overview, drivers, `needsSteer` (session only)
- `/projects/:id/:domain` — `schedule` \| `cost` \| `safety` \| `change` (J2, J3)
- Driver / issue detail from the project

## Commands (intent)

| Intent | Skill |
| --- | --- |
| `/intake` | `intake-to-journeys` |
| `/brief` | `prototype-brief` |
| `/wireframe` | `angular-wireframe-scaffold` |
| `/feasibility` | `feasibility-readout` |
| `/handoff` | `handoff-brief` |

## Ban list

Live ERP / P6 / EHS clients, auth/SSO hardening, mobile-native, PDF export, RFI workflow, resource-reallocation wizard.
