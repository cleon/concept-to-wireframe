# AGENTS.md — Project Health example

This folder is the **worked example** wireframe (construction portfolio health hub). New concepts belong in `apps/<slug>/`, not here, unless the user explicitly says to extend this example.

Filled intake: [`docs/inputs/`](docs/inputs/). Playbook: [`framework/`](../../../framework/).

## Non-negotiables (this example)

- Mock/stub data only — fixtures in `src/assets/mock/`
- Keep the DEMO / mock-data banner visible
- Implement journeys **J1–J3** only; J4–J6 stay in `docs/inputs/`
- Update `docs/inputs/` when journeys or mock contracts change

## Routes

- `/portfolio` — ranked / filterable health list (J1)
- `/projects/:id` — overview, drivers, `needsSteer` (session only)
- `/projects/:id/:domain` — `schedule` \| `cost` \| `safety` \| `change` (J2, J3)

## Ban list

Live ERP / P6 / EHS clients, auth/SSO hardening, mobile-native, PDF export, RFI workflow, resource-reallocation wizard.
