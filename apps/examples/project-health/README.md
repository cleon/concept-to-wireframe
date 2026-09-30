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

## Animated flowcharts

Open these in a browser (offline, no server). They play J1–J3. Space pauses. They are not the Angular app.

| File | What it shows |
| --- | --- |
| [`docs/flows/visualizer/overview.html`](docs/flows/visualizer/overview.html) | Main process across J1, J2, and J3 |
| [`docs/flows/visualizer/j1-portfolio-scan.html`](docs/flows/visualizer/j1-portfolio-scan.html) | Portfolio morning scan |
| [`docs/flows/visualizer/j2-why-red.html`](docs/flows/visualizer/j2-why-red.html) | Why a project is red |
| [`docs/flows/visualizer/j3-cost-review.html`](docs/flows/visualizer/j3-cost-review.html) | Cost lead review |

Rebuild from the JSON with `python3 framework/flow-visualizer/build.py`.
