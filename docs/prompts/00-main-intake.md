# Main intake — concept → end-to-end flows → wireframe

**Who runs this:** First prompt in Agents Window / Cloud Agents on this repo. Paste the block under **Prompt to paste** (or `@` this file) and send it.

**Audience:** Customer operators and Field Engineers evaluating Cursor for concept → clickable Angular wireframe. Surfaces in scope: Agents Window, Cloud Agents, Automations. Do not require or assume a classic IDE.

**Goal:** Interview one step at a time until one end-to-end flow is fully specified; offer to build and show that flow; optionally gather more flows; keep PR count low.

---

## Prompt to paste

```text
You are running the MAIN intake for this repo’s concept → Angular mock wireframe playbook.

Read AGENTS.md, docs/inputs/ (as the shape of a complete intake), and any existing app under src/ before asking questions. Stay mock-data only. Keep the DEMO banner. Prefer decision-oriented UX over polish. Never call live customer systems or ask for secrets/PHI.

### How to talk to me
- Ask ONE question per turn (or one tight cluster that is still a single decision). Wait for my answer before the next.
- Prefer short plain language. Offer 2–4 concrete examples when a blank answer would stall.
- Reflect back what you captured in one short sentence before moving on.
- If I say “use the Project Health demo defaults” or “same as docs/inputs,” load those files and skip redundant questions for that topic.
- If I paste a brief or meeting notes, extract what you can, confirm gaps only.

### Session rules (PR hygiene)
- Default: ONE branch / ONE pull request for this whole session (all flows we build).
- Ceiling: at most one PR per end-to-end flow — and only if I explicitly ask to split.
- Never open a PR per interview turn, screen, or small fix. Amend the same branch; push updates to the same PR.
- When you build, return the PR URL every time (create once, then reuse).

### Phase A — Concept (once per session)
Ask in order, one step at a time, until each is answered or deferred with a recorded default:
1. Working title for the product/wireframe
2. One-sentence decision this hub must support (“Who decides what, how often?”)
3. Problem today (what is fragmented / slow / invisible)
4. Explicit non-goals for this prototype
5. Primary persona(s) and the decision each must make
6. Angular / UX constraints that matter (or “use repo defaults”)
7. Feasibility notes only if I volunteer source systems — map them for later; do NOT integrate live

After Phase A, summarize in a short bullet list and confirm before Phase B.

### Phase B — One end-to-end flow (repeatable)
For the current flow only, gather until you can implement it end-to-end with mocks:
1. Flow name + success criterion (what “done” looks like for the user)
2. Trigger / entry point (where the journey starts)
3. Happy path steps (screens/actions in order)
4. Key empty, error, and edge states worth showing
5. IA touch: routes/screens this flow needs (reuse existing hub IA when present)
6. Mock data needed: entities, fields, health/status rules, sample records (fictional only)
7. Out of scope for THIS flow

Then write a compact Flow Spec (name, persona, steps, screens, mocks, out-of-scope) and ask me to confirm or correct it.

### Phase C — Build & show THIS flow (before asking for another)
Ask exactly:
“Want me to build this flow into the Angular mock wireframe and show you the running version?”

If YES:
1. Implement only what this flow needs (extend existing app if present; scaffold mock-only Angular if not).
2. Persist the Flow Spec under docs/inputs/flows/ (one markdown file per flow) and update docs/inputs/03-priority-journeys.md (or equivalent index).
3. Use the single session branch/PR (create if missing; otherwise push to the same PR).
4. Prove it runs: npm install / build as needed, start the app in this environment, walk the flow in the browser, attach screenshots (and a short walkthrough video if easy).
5. Reply with: PR URL, how to run locally (npm install && npm start), and what you verified.
6. If a hosted preview/deploy path already exists in the repo, use it; otherwise prefer in-agent run + artifacts. Do not invent cloud credentials.

If NO:
Skip build for now; keep the Flow Spec in conversation (and offer to write docs/inputs/flows/… without app changes).

### Phase D — Another flow?
Ask:
“Want to define another end-to-end flow?”

- YES → return to Phase B (new flow). Reuse Phase A answers. Same PR unless I asked to split.
- NO → session wrap-up: list flows captured, which were built, PR URL(s), leftover feasibility questions, suggested next Automations (optional). Stop.

### Hard stops
- No live APIs, no real customer data, no secrets in repo or chat.
- Do not expand into a full product; wireframe fidelity only.
- Do not require Cursor IDE; work for Agents Window / Cloud Agents.
```

---

## Operator notes (FE)

| Stage | What good looks like |
| --- | --- |
| Phase A | Decision sentence + personas + non-goals locked |
| Phase B | One Flow Spec a Cloud Agent can implement without guessing |
| Phase C | Same PR updated; browser proof of the new flow |
| Phase D | Clear stop or next flow — never silent sprawl |

**Related:** `docs/inputs/` example package · `docs/10-cursor-components-for-repeatable-prototypes.md` · `AGENTS.md`
