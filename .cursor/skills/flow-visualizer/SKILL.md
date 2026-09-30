---
name: flow-visualizer
description: >-
  Build an animated single-file HTML flowchart of a wireframe's main process
  and each flow. Use when a concept already has flow specs or ranked journeys,
  or when the user asks for a flow visualization, animated flowchart, or
  playback of the journeys.
---

# Flow visualizer

Turns the current app's flows into animated HTML. One overview of the main process, plus one file per flow. The clickable wireframe stays the interactive prototype. This is a separate playback page.

Engine and schema: `framework/flow-visualizer/` (`build.py`, `SCHEMA.md`, `template.html`).

## When

Flows exist under `apps/<slug>/docs/flows/`, or ranked journeys exist in `docs/inputs/03-priority-journeys.md`. Do this after the wireframe flows are specified. Do not block the clickable wireframe build on it.

## Do

1. Confirm `apps/<slug>/`. Do not write a new concept into `apps/examples/project-health/` unless the user explicitly said to extend that example.
2. Read that app's flow specs (`docs/flows/*.md`), journeys (`docs/inputs/03-priority-journeys.md`), personas, and IA. If there is no flow spec yet, use the ranked in-app journeys and skip deferred ones.
3. Read `framework/flow-visualizer/SCHEMA.md` before writing JSON.
4. Write configs under `apps/<slug>/docs/flows/visualizer/`:
   - `overview.json` — the main process across the in-app flows. Phases are the flow names. Reuse one actor per screen. Branch where a later flow starts from a shared screen (`after` points at that step).
   - `<flow-id>.json` — one file per flow. Happy path in story order. Include an empty or error step only when that flow spec says it is worth showing (`kind: "cond"`).
5. Map actors into `nodes`, with `"bots": []`:
   - Persona → `kind: "human"` (role label, not a person's name)
   - Screen or route → `kind: "stage"`, `sub` = route, `icon` set
   - Named source system → `kind: "system"` only if the flow spec says the step touches it. Do not draw live integrations the prototype does not have.
6. End each config with one `"finale": true` step (the flow's success criterion). No `agentId`. No secrets. No production URLs.
7. Use human artifact and handoff labels (not `RUN_ID`-style ids). Optional screenshot: `"artifact": { "label": "…", "media": "assets/mock.png" }` relative to the JSON (png/webp/jpeg). `build.py` inlines media into the HTML.
8. **Edge / handoff labels on connector lines** are always centered between the two linked elements (path midpoint, `text-anchor: middle`). Do not set `labelAt`, `labelDx`, or `labelDy`. After Arrange drag, labels stay mid-edge. Under-node output chips and lane labels are not connection-line labels.
9. Optional theme default: `meta.theme.preset` = `"dark"` \| `"light"`. Autoplay stays off unless `meta.autoplay: true`. Lane row layout uses `meta.lanes`. Authors may set `meta.laneGuides: true` as the **initial** show/hide for swimlane lines; viewers can still toggle lane labels in the HUD (toolbar or `G`, persists in `localStorage`, `?lanes=1` / `?lanes=0` overrides once).
10. Build each file:

```bash
python3 framework/flow-visualizer/build.py apps/<slug>/docs/flows/visualizer/overview.json \
  -o apps/<slug>/docs/flows/visualizer/overview.html
```

Repeat for each flow JSON. Fix every `error:` and rebuild. `--check` validates without writing. Warnings for cryptic labels or large media still build unless `--strict`.

11. Verify in a browser:
    - HTML opens **paused** (Space starts playback).
    - Theme control switches Dark / Light; graph stays readable.
    - Legend shows handoff arrows. **Lane labels** toolbar (or `G`) toggles swimlane lines on/off when the config has `meta.lanes`.
    - Connector-line labels sit mid-edge between the two cards (not slid along the path for collision).
    - Arrange: drag a node (edges and mid-edge labels follow while dragging), refresh, position sticks (local to the browser). Reset layout clears those offsets.
    - If a step has media, open the preview from the chip or side panel.

## Guardrails

- Mock story only. Session-only flags must say they do not persist. Mock screenshots only for artifact media.
- Do not edit `template.html` to change one demo.
- Do not overwrite the Project Health example app (Angular worked example). Adding `docs/flows/visualizer/` there is allowed only when the user asked to extend that example.
- If the chart is cramped, set `meta.lanes` and `layout.laneMode` to `rows` before nudging `dx`/`dy`. Arrange mode is for local presentation layout, not a substitute for authored `dx`/`dy` in JSON.
- 2–12 actors and 3–20 steps read well. Compress the overview. Put screen-level detail in the per-flow file.
