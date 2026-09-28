---
name: intake-to-journeys
description: Turn the current app’s docs/inputs (or Project Health example defaults) into ranked prototype journeys plus a deferred list.
---

# Intake → journeys

## When

A human dropped or updated intake for a concept and wants a ranked prototype set (max 3 in-app journeys).

## Do

1. Read the current app’s `docs/inputs/00-README.md` through `03-priority-journeys.md`, plus personas and the concept brief. If they said “use Project Health example defaults,” read `apps/examples/project-health/docs/inputs/` instead.
2. List candidate journeys as **Trigger → steps → Decision → Good enough**.
3. Rank three for the wireframe (P0/P1). Everything else goes under **Deferred**.
4. Check each in-app journey against IA (`04-ia-and-screens.md`). Note screen gaps.
5. Write or replace `apps/<slug>/docs/inputs/03-priority-journeys.md` (or the example’s file if that is the app). Do not implement UI in this skill.

## Guardrails

- Prefer decisions the primary persona can finish without a facilitator.
- Do not add live-integration journeys.
- If intake is thin, ask for the missing persona decision — do not invent an extra in-app journey.
- New concepts: `apps/<slug>/`. Do not overwrite the example unless asked.
