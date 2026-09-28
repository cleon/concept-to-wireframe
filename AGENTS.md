# AGENTS.md — concept → Angular mock wireframe

This repository is a **reusable playbook** plus a worked example. New wireframes are mock-data Angular apps. Humans dispatch work from **Agents Window**, [cursor.com/agents](https://cursor.com/agents), and [cursor.com/automations](https://cursor.com/automations). A classic IDE is not required.

**First prompt:** paste (or `@`) [`framework/prompts/00-main-intake.md`](framework/prompts/00-main-intake.md).

## Non-negotiables

- Mock/stub data only — no live APIs, secrets, or production URLs
- Keep the DEMO / mock-data banner visible
- Prefer decision-oriented UX over visual polish
- Default store path: `apps/<slug>/` (slug from working title). Confirm once: “App folder will be `apps/<slug>/` — OK or different slug?”
- Never overwrite `apps/examples/project-health/` when building a new concept unless the user explicitly says to extend that example
- Flow specs live at `apps/<slug>/docs/flows/`
- One branch / one PR per session by default (see the main intake prompt)

## How to run the example

```bash
cd apps/examples/project-health
npm install
npm start
# or: npx ng serve
```

`ng build` must succeed for the app you are changing. Preview the forwarded port; desktop-first (1280+).

## Layout

| Path | Role |
| --- | --- |
| `framework/prompts/00-main-intake.md` | First prompt — Agents Window / Cloud Agents |
| `framework/inputs/templates/` | Blank intake forms (workshop / offline) |
| `framework/automations/` | Paste-ready Automation prompts |
| `framework/cursor-components.md` | Rules / skills / hooks / Automations pattern |
| `apps/examples/project-health/` | Worked example app + filled intake |
| `apps/examples/project-health/docs/inputs/` | Example defaults (“use Project Health example defaults”) |
| `apps/<slug>/` | New customer wireframe |
| `apps/<slug>/docs/flows/` | Flow specs for that wireframe |
| `.cursor/rules/` | Mock-only, decision UX, Angular conventions, docs-sync |
| `.cursor/skills/` | `intake-to-journeys`, `prototype-brief`, `angular-wireframe-scaffold`, `feasibility-readout`, `handoff-brief` |
| `.cursor/hooks.json` | Optional prototype guardrails (see README) |

## Commands (intent)

| Intent | Skill |
| --- | --- |
| `/intake` | `intake-to-journeys` |
| `/brief` | `prototype-brief` |
| `/wireframe` | `angular-wireframe-scaffold` |
| `/feasibility` | `feasibility-readout` |
| `/handoff` | `handoff-brief` |

## Ban list

Live customer / source-system clients, auth/SSO hardening, inventing a hosted deploy, secrets in repo or chat.
