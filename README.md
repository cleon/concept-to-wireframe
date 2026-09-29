# Concept → Angular mock wireframe

This is a reusable **playbook** for turning a concept into a clickable Angular wireframe. Humans run this from Agents Window / [cursor.com/agents](https://cursor.com/agents) / [cursor.com/automations](https://cursor.com/automations). A classic IDE is not required.

**This tool creates mocks/stubs only.** No live APIs, secrets, or production URLs.

```bash
git clone https://github.com/cleon/concept-to-wireframe.git
```

## How to use (fork → intake → app)

1. Fork this repo.
2. In Agents Window / Cloud Agents, paste (or `@`) `[framework/prompts/00-main-intake.md](framework/prompts/00-main-intake.md)`.
3. The wireframe grows under `apps/<your-wireframe>/`, where `<your-wireframe>` is the name from the working title.

## What lives where


| Path                                                                         | What it is                                                                                                 |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `[framework/](framework/)`                                                   | Contains the reusable playbook only — prompts, blank intake templates, Automations, Cursor component guide |
| `[framework/prompts/00-main-intake.md](framework/prompts/00-main-intake.md)` | First prompt to run                                                                                        |
| `[apps/examples/project-health/](apps/examples/project-health/)`             | **Worked example** — construction Project Health Command Hub (J1–J3)                                       |
| `[apps/<slug>/](apps/)`                                                      | Default home for a **new** customer wireframe                                                              |
| `[apps/<slug>/docs/flows/](apps/)`                                           | Flow specs for that wireframe                                                                              |
| `[.cursor/rules/](.cursor/rules/)` + `[.cursor/skills/](.cursor/skills/)`    | Generic concept → Angular mock rules/skills (not example-specific)                                         |




## Run the example app

Requires Node **22.12+** (Angular 21; Angular 22 needs Node 22.22.3+).

```bash
cd apps/examples/project-health
npm install
npm start
```

Equivalent: `npx ng serve` inside `apps/examples/project-health`. Open the forwarded port (default `http://localhost:4200`).

Compile check:

```bash
cd apps/examples/project-health
npx ng build
```

See `[apps/examples/project-health/README.md](apps/examples/project-health/README.md)` for journeys and routes.

## “Use Project Health example defaults”

If you say that in intake, the agent loads `[apps/examples/project-health/docs/inputs/](apps/examples/project-health/docs/inputs/)` and skips redundant questions. That still builds a **new** app under `apps/<slug>/` unless you explicitly extend the example.

## Optional hooks

`[.cursor/hooks.json](.cursor/hooks.json)` is a lightweight guardrail:

- `sessionStart` — inject the mock-only checklist (IDE / worker sessions)
- `beforeShellExecution` — ask before `curl`/`wget` to non-toolchain hosts
- `afterFileEdit` — remind if `environment.ts` gains a remote URL

Hooks are optional. Rules and skills are the primary repeatability lever. Cloud Agents do not run `sessionStart`.