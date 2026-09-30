# Wireframe flow visualizer

Single-file animated HTML for a wireframe's main process and each flow. Playback, camera follow, and layout come from one JSON config. The page makes no network requests.

```bash
python3 framework/flow-visualizer/build.py path/to/flow.json -o path/to/flow.html
python3 framework/flow-visualizer/build.py path/to/flow.json --check
```

Write the config using [SCHEMA.md](SCHEMA.md). The agent skill is [`.cursor/skills/flow-visualizer/SKILL.md`](../../.cursor/skills/flow-visualizer/SKILL.md).

Do not hand-edit `template.html` per flow. `build.py` only replaces the config block (and inlines artifact media as data URLs).

Worked output for the example app: `apps/examples/project-health/docs/flows/visualizer/`.

## Themes & layout

| Control | Behavior |
| --- | --- |
| Theme selector | Dark (default), Light |
| Persistence | `localStorage` key `flow-visualizer-theme`; `?theme=` overrides once |
| Config default | `meta.theme.preset`: `"dark"` \| `"light"` |
| Autoplay | Off by default. Set `meta.autoplay: true` or open with `?autoplay=1` |
| Arrange | Toolbar toggle: drag nodes; edges update while dragging; edge labels stay mid-path between nodes; offsets in `localStorage` per title + step ids. Not written back to JSON |
| Reset layout | Clears browser-only Arrange offsets and restores the auto-layout baseline |
| Lane guides | Off by default (`meta.laneGuides: true` sets initial on). Viewer toggle: toolbar **Lane labels**, `G`, or `?lanes=1`/`?lanes=0`. Preference in `localStorage` (`flow-visualizer-lane-guides`). `meta.lanes` still drives row layout |
| Artifact media | `{ "label": "…", "media": "assets/shot.png" }` relative to the JSON; inlined offline |

Legend shows **Handoff arrow** (and other edge kinds in use). **Lane (role band)** appears in the legend when lane labels are on. Under-node chips are **Outputs from steps**.
