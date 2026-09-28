# Project Health Command Hub — example wireframe

**Worked example** of the concept → Angular mock playbook. Fictional construction portfolio. Not a customer system. Not the place to put a new concept (use `apps/<slug>/` instead).

Playbook: [`framework/`](../../../framework/). First prompt: [`framework/prompts/00-main-intake.md`](../../../framework/prompts/00-main-intake.md).

## Run

Requires Node **22.12+**.

```bash
cd apps/examples/project-health
npm install
npm start
```

Equivalent: `npx ng serve`. Open the forwarded port (default `http://localhost:4200`).

```bash
npx ng build
```

From repo root (after this folder has `node_modules`): `npm start` / `npm run build`.

## Journeys in the app

| Route | Journey |
| --- | --- |
| `/portfolio` | J1 — ranked / filterable health list |
| `/projects/:id` | J2 — overview, drivers, session-only **Needs steer** |
| `/projects/:id/schedule` (also `cost`, `safety`, `change`) | J2 / J3 domain tabs |
| `/projects/:id/issues/:issueId` | Driver detail + recommended action |

J4–J6 stay in [`docs/inputs/03-priority-journeys.md`](docs/inputs/03-priority-journeys.md).

10 fictional jobs (2 red, 3 amber, 5 green) live in `src/assets/mock/`. Names use `EXAMPLE —`. No real PII.

Deep-link for the Cost Lead path (J3): `/projects/northridge-hospital/cost`.

Filled intake: [`docs/inputs/`](docs/inputs/).
