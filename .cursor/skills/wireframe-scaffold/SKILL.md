---
name: wireframe-scaffold
description: >-
  Generate or extend a clickable mock wireframe hub from the brief and mock
  fixtures. Branches on the confirmed stack (angular, vanilla-js, react-ts,
  or validated other). Use when implementing or patching flows under apps/<slug>/.
---

# Wireframe scaffold

## When

Brief is locked. Stack is accepted and recorded. Implement or extend the current concept’s screens under `apps/<slug>/`.

## Do

1. Confirm the target folder (`apps/<slug>/`). Do **not** write a new concept into `apps/examples/project-health/` unless the user explicitly said to extend that example.
2. Read that app’s IA, mock contracts, and frontend constraints (`docs/inputs/07-frontend-constraints.md`), plus `.cursor/rules/`. If using example defaults, read `apps/examples/project-health/docs/inputs/` then still implement under `apps/<slug>/`. Intake **defaults to Angular** unless the user picked another stack; Project Health is the Angular worked example only.
3. Do **not** start scaffolding until `stack` is accepted and written in `07-frontend-constraints.md` (with run command). If intake recorded no stack, use **angular**.
4. Branch on `stack` (same mock / DEMO / IA rules for every branch):

### Feasibility gate (Other / custom)

```text
Accept if: browser-rendered UI, npm-installable, local static/dev server produces HTML for walkthrough, mock data only.
Reject if: iOS/Android-only, desktop-native without web target, requires proprietary hosted runtime, or no clear npm start → browser path.
On reject: explain in one sentence, re-offer Angular (default) / Vanilla JS / React+TS / another Other.
```

### Branch: `angular` (default)

- Current supported Angular, **standalone** components, no NgModule app shell.
- Prefer signals for session state.
- Fixtures in `src/assets/mock/`. Fictional `EXAMPLE —` names only.
- Verify with `ng build` (and `npm start` / `ng serve` for preview).
- Repo ships Angular CLI MCP (`.vscode/mcp.json`); see `framework/mcp-setup.md`.

### Branch: `vanilla-js`

- Vite vanilla app. Client routing (hash or a simple router).
- Fixtures under `src/assets/mock/` or `public/mock/`.
- Verify with `npm run build` and `npm start`.

### Branch: `react-ts`

- Vite + React + TypeScript. React Router for routes from the flow spec / IA.
- Same fixture and DEMO banner conventions.
- Verify with `npm run build` and `npm start`.

### Branch: `other` (validated)

- Same Vite SPA shape adapted to the accepted framework (e.g. Svelte, Vue, Vanilla TS).
- Document stack + run steps in the app README and `07-frontend-constraints.md`.
- Verify with the documented production build + `npm start` (or equivalent).

5. Implement only the confirmed flows: routes from the flow spec, empty states, persistent DEMO / mock-data banner.
6. Keyboard + visible focus on primary actions.
7. Production build for the chosen stack must pass in `apps/<slug>/` before handoff.

## Guardrails

- No remote HTTP clients. No secrets. No invented Render/deploy.
- Dense/usable over polish. Desktop-first.
- If you change contracts or journeys, update `apps/<slug>/docs/` in the same PR.
- Tooling default for non-Angular: **Vite**. Angular keeps CLI / `ng serve`.
