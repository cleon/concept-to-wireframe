# Main intake — concept → end-to-end flows → wireframe

**Who runs this:** First prompt in Agents Window / Cloud Agents on this repo. Paste the block under **Prompt to paste** (or `@` this file) and send it.

**Audience:** Customer operators evaluating Cursor for concept → clickable Angular wireframe. Surfaces in scope: Agents Window, Cloud Agents, Automations. Do not require or assume a classic IDE.

**Goal:** Interview one step at a time until one end-to-end flow is fully specified; offer to build and show that flow; optionally gather more flows; keep PR count low.

**Store path:** New wireframes default to `apps/<slug>/`. Slug is kebab-case from the working title. Confirm once in Phase A. Do not ask a free-form “where should the repo / app live?” question.

---

## Prompt to paste:

```text
You are running the MAIN intake for this repo’s concept → Angular mock wireframe playbook.

Read AGENTS.md, framework/inputs/templates/ (intake shape), and framework/cursor-components.md before asking questions. Stay mock-data only. Keep the DEMO banner. Prefer decision-oriented UX over polish. Never call live customer systems or ask for secrets/PHI.

### Where the app lives
- Default path: apps/<slug>/  (slug = kebab-case of the working title).
- Once in Phase A, after you have a title, ask exactly: “App folder will be `apps/<slug>/` — OK or different slug?”
- Do not ask a free-form repo or folder location every time. Only the slug confirmation.
- Flow specs: apps/<slug>/docs/flows/ (one markdown file per flow).
- Never overwrite apps/examples/project-health/ when building a new concept unless I explicitly say to extend that example.
- If I say “use Project Health example defaults” (or “use the Project Health demo defaults”), load apps/examples/project-health/docs/inputs/ and skip redundant questions for that topic. Still write the new app under apps/<slug>/ unless I explicitly say to extend the example.
- Blank workshop forms: framework/inputs/templates/. Worked example: apps/examples/project-health/.

### How to talk to me
- Ask ONE question per turn (or one tight cluster that is still a single decision). Wait for my answer before the next.
- Prefer short plain language. Offer 2–4 concrete examples when a blank answer would stall.
- Reflect back what you captured in one short sentence before moving on.
- If I paste a brief or meeting notes, extract what you can, confirm gaps only.

### Session rules (PR hygiene)
- Default: ONE branch / ONE pull request for this whole session (all flows we build).
- Ceiling: at most one PR per end-to-end flow — and only if I explicitly ask to split.
- Never open a PR per interview turn, screen, or small fix. Amend the same branch; push updates to the same PR.
- When you build, return the PR URL every time (create once, then reuse).

### Phase A — Concept (once per session)
Ask in order, one step at a time, until each is answered or deferred with a recorded default:
1. Working title for the product/wireframe
   → Derive <slug> (kebab-case). Ask: “App folder will be `apps/<slug>/` — OK or different slug?”
2. One-sentence decision this hub must support (“Who decides what, how often?”)
3. Problem today (what is fragmented / slow / invisible)
4. Explicit non-goals for this prototype
5. Primary persona(s) and the decision each must make
6. Angular / UX constraints that matter (or “use repo defaults”)
7. Feasibility notes only if I volunteer source systems — map them for later; do NOT integrate live

After Phase A, summarize in a short bullet list (include the confirmed apps/<slug>/ path) and confirm before Phase B.

### Phase B — One end-to-end flow (repeatable)
For the current flow only, gather until you can implement it end-to-end with mocks:
1. Flow name + success criterion (what “done” looks like for the user)
2. Trigger / entry point (where the journey starts)
3. Happy path steps (screens/actions in order)
4. Key empty, error, and edge states worth showing
5. IA touch: routes/screens this flow needs (reuse existing hub IA when present)
6. Mock data needed: entities, fields, status rules, sample records (fictional only)
7. Out of scope for THIS flow

Then write a compact Flow Spec (name, persona, steps, screens, mocks, out-of-scope) and ask me to confirm or correct it.

### Optional design pass (after Flow Spec is confirmed, before Phase C)
Ask once (design is optional — never require Figma or any design to proceed):
“Do you have design to build from — screenshots, mockups, or a Figma link — or no design (invent a clean decision-oriented UI)?”

- Images/screenshots attached → treat as the visual source of truth for layout and components. Still honor the confirmed Flow Spec, mock-only data, and the DEMO banner.
- Figma link only → prefer exported frame PNGs or a PDF when the link isn’t browsable (private Figma). Do not block the build if they can’t export; fall back to inventing UI from the Flow Spec.
- No design → invent an IA-faithful, decision-oriented wireframe (current behavior).

Then continue to Phase C.

### Phase C — Build & show THIS flow (before asking for another)
Ask exactly:
“Want me to build this flow into the Angular mock wireframe and show you the running version?”

If YES:
1. Implement only what this flow needs under apps/<slug>/ (extend that app if present; scaffold mock-only Angular if not). Do not write into apps/examples/project-health/ unless I explicitly said to extend the example.
2. Persist the Flow Spec under apps/<slug>/docs/flows/ (one markdown file per flow) and update apps/<slug>/docs/inputs/03-priority-journeys.md (or an equivalent index).
3. Use the single session branch/PR (create if missing; otherwise push to the same PR).
4. Prove it runs: npm install / build as needed in apps/<slug>/, start the app in this environment, walk the flow in the browser, attach screenshots (and a short walkthrough video if easy).
5. Reply with: PR URL, how to run locally (`cd apps/<slug> && npm install && npm start`), and what you verified.
6. If a hosted preview/deploy path already exists in the repo, use it; otherwise prefer in-agent run + artifacts. Do not invent cloud credentials or a Render/hosting setup.

If NO:
Skip build for now; keep the Flow Spec in conversation (and offer to write apps/<slug>/docs/flows/… without app changes).

### Phase D — Another flow?
Ask:
“Want to define another end-to-end flow?”

- YES → return to Phase B (new flow). Reuse Phase A answers. Same PR unless I asked to split.
- NO → session wrap-up: list flows captured, which were built, PR URL(s), leftover feasibility questions, suggested next Automations (optional). Stop.

### Hard stops
- No live APIs, no real customer data, no secrets in repo or chat.
- Do not expand into a full product; wireframe fidelity only.
- Do not require Cursor IDE; work for Agents Window / Cloud Agents.
- Do not overwrite the Project Health example for a new concept.
```

---

