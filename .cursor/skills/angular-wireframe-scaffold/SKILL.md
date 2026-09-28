---
name: angular-wireframe-scaffold
description: Generate or extend the clickable standalone Angular hub from the brief and mock fixtures. Use when implementing or patching J1–J3 screens.
---

# Angular wireframe scaffold

## When

Brief is locked. Implement or extend `/portfolio`, `/projects/:id`, domain tabs, and driver detail.

## Do

1. Read `docs/inputs/04-ia-and-screens.md`, `05-mock-data-contracts.md`, `07-angular-constraints.md`, and `.cursor/rules/`.
2. Keep **standalone** components and the existing route table. Prefer signals for session state.
3. Fixtures live in `src/assets/mock/`. 8–12 fictional projects. `EXAMPLE —` names only.
4. Implement:
   - Ranked, filterable portfolio (region, business unit, health)
   - Project overview with drivers + `needsSteer` (client-only)
   - Schedule / cost / safety / change tabs or `/projects/:id/:domain`
   - Driver/issue detail with recommended next action
   - Persistent DEMO / mock-data banner
5. Empty states for domains with no issues. Keyboard + visible focus on primary actions.
6. `ng build` must pass before handoff.

## Guardrails

- No HttpClient calls to remotes. No secrets.
- Do not build J4–J6.
- Dense/usable over polish. Desktop-first.
- If you change contracts or journeys, update `docs/inputs/` in the same PR.
