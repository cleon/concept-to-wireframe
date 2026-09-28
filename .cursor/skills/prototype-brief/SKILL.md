---
name: prototype-brief
description: Lock scope, mock contracts, and definition of done before coding the Angular hub. Use when starting or re-scoping a wireframe run.
---

# Prototype brief

## When

Before `/wireframe` or any new screen work. After intake-to-journeys.

## Do

1. Read `docs/inputs/` (especially journeys, IA, mock contracts, Angular constraints, non-goals).
2. Produce a short brief (PR comment or `docs/inputs/` addendum) with:
   - In-scope journeys (J1–J3) and explicit **out of scope**
   - Routes to implement
   - Fixture counts (8–12 projects; ≥2 red, ≥3 amber; red has ≥2 drivers)
   - Session-only state (`needsSteer`, review flags)
   - Definition of done: `ng build`, DEMO banner, README run steps
3. Flag any intake contradiction (e.g. a journey that needs a live system).

## Guardrails

- Do not start scaffolding until the brief names the deferred list.
- Mock/stub only. No auth, no production URLs.
- Humans will run this from Agents Window — include verify steps that work on a Cloud Agent (`ng build`, then browser preview).
