# Wireframe flow config

`build.py` validates this JSON and injects it into `template.html` as `<script type="application/json" id="flow-config">`.

Personas, screens, and systems go in `nodes`. `bots` may be `[]`. Use a `bots` entry only when the concept itself has an agent actor. Do not set `agentId` or `agentName`.

```bash
python3 framework/flow-visualizer/build.py my-flow.json -o my-flow.html
python3 framework/flow-visualizer/build.py my-flow.json --check
python3 framework/flow-visualizer/build.py my-flow.json --strict
```

## Minimal example

```json
{
  "meta": {
    "title": "Portfolio scan",
    "tagline": "Rank jobs, then open one red project",
    "useCase": "J1"
  },
  "bots": [],
  "nodes": [
    { "id": "director", "kind": "human", "name": "Portfolio Director", "sub": "Picks what needs attention", "initials": "PD", "color": "cyan" },
    { "id": "portfolio", "kind": "stage", "name": "Portfolio", "sub": "/portfolio", "icon": "chart", "color": "green" },
    { "id": "project", "kind": "stage", "name": "Project", "sub": "/projects/:id", "icon": "alert", "color": "violet" }
  ],
  "steps": [
    { "id": "open", "title": "Open the hub", "by": "director", "to": "portfolio", "phase": "Scan",
      "detail": "The director starts from the ranked health list.", "artifact": "Morning list" },
    { "id": "pick", "title": "Open a red project", "by": "director", "to": "project",
      "detail": "Two clicks from a needs-attention row to why it is red.",
      "artifact": { "label": "Portfolio screenshot (mock)", "media": "assets/example.png" } },
    { "id": "steer", "title": "Mark needs steer", "by": "director", "finale": true,
      "detail": "Session-only flag. It does not persist.", "say": "This job needs a steer today." }
  ]
}
```

Layout, edges, timing, and the camera are derived. A step with no `after` depends on the previous step.

## Top level

| key | required | meaning |
| --- | --- | --- |
| `meta` | recommended | Title, phases, lanes, layout |
| `bots` | yes, may be `[]` | Agent actors only. Empty for persona/screen flows |
| `nodes` | yes, if `bots` is empty | Personas (`human`), screens (`stage`), systems (`system`) |
| `steps` | yes (≥1) | Playback timeline |
| `edges` | no | Extra canvas edges or a feedback loop |
| `triggers` | no | Pills on edges |

Ids must be unique across bots, nodes, steps, and edges.

## `meta`

| key | default | meaning |
| --- | --- | --- |
| `title` | "Wireframe flow" | Header and document title |
| `tagline` | – | Text after the title |
| `customer`, `useCase` | – | Pills under the title |
| `phases` | – | 3–7 short labels. A step selects one with `phase` |
| `lanes` | – | Horizontal bands for layout. Actors set `lane`. Guide lines/labels start hidden unless `laneGuides` is true; viewers can toggle in the HUD |
| `laneGuides` | false | Initial visibility of lane lines and labels. Does not change layout. Viewer override: toolbar, `G`, `localStorage` (`flow-visualizer-lane-guides`), or `?lanes=1` / `?lanes=0` |
| `layout.columnGap` | auto | Horizontal distance between ranks |
| `layout.rowGap` | 360 | Vertical distance |
| `layout.laneMode` | `auto` | `rows` (aligned columns) or `shift` |
| `stepDuration` | 4600 | Default step length in ms (min 800) |
| `timeline` | `parallel` | `sequential` plays one step per beat |
| `waitingLabel` | "Waiting on a human decision" | Red chip when a step sets `waiting` |
| `helpNote` | – | Fine print in the help overlay |
| `loop` | true | Loop at the end |
| `autoplay` | **false** | Start playing on load. Set `true` or open with `?autoplay=1` |

### `meta.theme`

| key | meaning |
| --- | --- |
| `preset` | `"dark"` (default) · `"light"` |
| `accent` / `accent2` | Palette key or `#hex` (overrides theme accents) |
| `background` | `"plain"` hides aurora blobs |
| `grid` | `false` removes the background grid |

The viewer can still switch theme in the HUD. Choice persists in `localStorage` (`flow-visualizer-theme`). `?theme=light` overrides once on load. A stored or URL value of `grok` falls back to `dark`.

## Actors

| key | meaning |
| --- | --- |
| `id` | Required, unique, snake_case |
| `kind` | `human`, `stage`, `system`, or (rare) `bot` |
| `name` | Card title |
| `sub` | Line under the name. For a screen, use the route |
| `lane` | Lane id from `meta.lanes` |
| `color` | `cyan` `blue` `violet` `green` `orange` `yellow` `magenta` `red` `brown` `gray` `black`, or `#hex` |
| `icon` | Stages: `chart` `alert` `doc` `check` `funnel` `gate` `clock` `lock` `search` `folder` `ticket` `shield` |
| `logo` | Systems: `email` `calendar` `docs` `database` `chat` `web` `analytics`, or a short name |
| `initials` | Humans. Default is taken from `name` |
| `description` | Detail panel |
| `col`, `row`, `dx`, `dy` | Layout hints. Leave unset unless a build looks cramped |

Do not invent employee names. Use the role labels already in the app's docs.

## `steps`

| key | meaning |
| --- | --- |
| `id` | Unique |
| `title` | Transport bar. Keep it under ~28 characters |
| `detail` | One sentence |
| `by` | Actor id (required) |
| `to` | Actor id. Draws a handoff packet |
| `artifact` / `artifacts` | Output chip(s) that stay on the receiver. String, or `{ "label": "…", "media": "assets/shot.png" }` |
| `say` | Speech bubble. Under ~110 characters |
| `after` | Step ids this waits on. Omitted = previous step. `[]` = root. Several steps with the same `after` play in parallel |
| `phase` | Phase id or label |
| `waiting` | Human pause. Red chip |
| `kind` | `hitl` for an approval packet, `cond` for an edge state |
| `finale` | Closing beat. Put it on the success step only. It lights the canvas and fits the camera |

### Artifact media

- `media` is a path **relative to the JSON file** (png / webp / jpeg only).
- `build.py` inlines it as `mediaDataUrl` so the HTML stays single-file and offline.
- Missing files are errors. Files over ~500KB warn.
- Use fictional / mock screenshots only.
- Prefer human labels. All-caps ids like `RUN_ID` get a build warning and the viewer rewrites edge labels that look like internal ids.

Steps at the same dependency depth play together as one beat.

The dependency graph must be acyclic. A rework loop is its own later step, or an edge with `"loop": true` from the later step back to the earlier one. A loop edge does not reorder playback.

## `edges` (optional)

`from` and `to` are actor or step ids. `kind`: `flow` (solid), `cond` (dashed), `hitl` (red), `feedback` (amber, with `loop: true` on a step→step edge).

Prefer an explicit `label` / `handoffs[].label`. The viewer falls back to phrases like “hands off to …” when a label looks like an internal id (`/^[A-Z][A-Z0-9_]+$/`).

**Edge labels are always centered** at the midpoint of the connector between the two elements (`text-anchor: middle`, path `t = 0.5`), with only a small fixed offset off the stroke so the text does not sit on the line. Do not use `labelAt`, `labelDx`, or `labelDy` to move them; `build.py` warns and the viewer ignores those fields.

## Viewer

Space plays and pauses. Left and right arrows step. `0` fits the canvas. Drag pans, wheel zooms, click a card for details.

**Arrange** (toolbar): drag nodes; edge paths and labels re-center mid-path while dragging; offsets persist in `localStorage` for that HTML file on that machine. Layout is not written back to JSON.

**Reset layout** (toolbar): clears browser-only Arrange offsets and restores the auto-layout baseline.

**Theme** (toolbar): Dark / Light.

Chips under nodes are **Outputs from steps** (what the actor leaves behind during playback). Lane lines are role bands, not handoff arrows; toggle them with the **Lane labels** toolbar control or `G`.

URL params: `?step=N`, `?fit`, `?paused`, `?autoplay=1`, `?speed=2`, `?theme=light|dark`, `?lanes=1|0`.

## Validation errors

`build.py` refuses to write HTML for invalid JSON, duplicate ids, unknown actor references, bad colors, bad `theme.preset`, missing media files, durations under 800ms, or a dependency cycle. Warnings (unknown fields, internal-id labels, a bot that never acts, large media) still write HTML unless you pass `--strict`.
