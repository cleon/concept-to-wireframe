---
name: angular-wireframe-scaffold
description: Generate or extend a clickable standalone Angular hub from the brief and mock fixtures. Use when implementing or patching flows under apps/<slug>/.
---

# Angular wireframe scaffold

## When

Brief is locked. Implement or extend the current concept’s screens under `apps/<slug>/`.

## Do

1. Confirm the target folder (`apps/<slug>/`). Do **not** write a new concept into `apps/examples/project-health/` unless the user explicitly said to extend that example.
2. Read that app’s IA, mock contracts, and Angular constraints (`docs/inputs/`), plus `.cursor/rules/`. If using example defaults, read `apps/examples/project-health/docs/inputs/` then still implement under `apps/<slug>/`.
3. Keep **standalone** components. Prefer signals for session state.
4. Fixtures live in that app’s `src/assets/mock/`. Fictional `EXAMPLE —` names only.
5. Implement only the confirmed flows: routes from the flow spec, empty states, persistent DEMO / mock-data banner.
6. Keyboard + visible focus on primary actions.
7. `ng build` must pass in `apps/<slug>/` before handoff.

## Guardrails

- No HttpClient calls to remotes. No secrets. No invented Render/deploy.
- Dense/usable over polish. Desktop-first.
- If you change contracts or journeys, update `apps/<slug>/docs/` in the same PR.
