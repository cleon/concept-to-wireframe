---
name: prototype-brief
description: Lock scope, mock contracts, and definition of done before coding the Angular hub. Use when starting or re-scoping a wireframe run.
---

# Prototype brief

## When

Before `/wireframe` or any new screen work. After intake-to-journeys.

## Do

1. Read the current app’s `docs/inputs/` (journeys, IA, mock contracts, Angular constraints, non-goals). Example defaults: `apps/examples/project-health/docs/inputs/`.
2. Produce a short brief (PR comment or `apps/<slug>/docs/` addendum) with:
   - Confirmed store path `apps/<slug>/`
   - In-scope journeys and explicit **out of scope**
   - Routes to implement
   - Fixture counts and status mix from the contract
   - Session-only state
   - Definition of done: `ng build`, DEMO banner, README run steps
3. Flag any intake contradiction (e.g. a journey that needs a live system).

## Guardrails

- Do not start scaffolding until the brief names the deferred list.
- Mock/stub only. No auth, no production URLs, no invented deploy.
- Humans will run this from Agents Window — include verify steps that work on a Cloud Agent (`ng build`, then browser preview).
- Do not target `apps/examples/project-health/` for a new concept unless the user said to extend it.
