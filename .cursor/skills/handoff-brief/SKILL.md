---
name: handoff-brief
description: Package validated prototype learning for a future production Angular build. Use when the eval is ending or a build team is taking over.
---

# Handoff brief

## When

Priority flows have been walked. Feasibility notes exist. A later team will build for real.

## Do

1. Summarize what the wireframe **proved** (decision moments, taxonomy, depth) vs what it **did not** (live freshness, auth, rollup rules).
2. Point at: `apps/<slug>/` routes, fixture contracts, session-state flags, and `apps/<slug>/docs/`.
3. List transferrable Angular pieces (standalone shell, route table, types) vs throwaway styling.
4. Phase-1 suggested slice: fewest domains that unlock the primary decision + ownership + join key.
5. Explicit non-goals to carry forward (no SSO in slice 1, no deferred journeys, no BI replacement unless asked).

## Guardrails

- Do not “helpfully” add a real API layer as part of handoff.
- Keep the DEMO banner story: this repo stays a mock reference.
- Link Automations the team should keep (`framework/automations/`) rather than inventing new process.
