# Cursor components for repeatable concept→wireframe prototypes

**Audience:** Cursor users  
**Surfaces in this evaluation pattern:** Agents Window, Cloud Agents, Automations  
**Out of scope for the live eval narrative:** Classic Cursor IDE workflows (do not demo)

This document lists the Cursor building blocks a team should standardize so **any** concept can become a clickable mock wireframe quickly. Stack is chosen at intake (Angular, Vanilla JS, React + TypeScript, or a validated Other). The Project Health Command Hub under `apps/examples/project-health/` is the worked **Angular** example — not the only stack or shape.

---

## 1. Human orchestration surfaces


| Component                  | Role in this pattern                                                                                  | Demo reference                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Agents Window**          | Primary place humans dispatch work, review diffs/PRs, preview forwarded ports, and steer Cloud Agents | [https://cursor.com/docs/agent/agents-window](https://cursor.com/docs/agent/agents-window) |
| **cursor.com/agents**      | Same Cloud Agent fleet from web/mobile                                                                | Start / monitor mock wireframe builds                                                      |
| **cursor.com/automations** | Configure scheduled/event Automations without sitting in a session                                    | Feasibility digests, PR review, Slack triage                                               |


---



## 2. Cloud Agents (execution)


| Capability                                              | Why it matters for wireframes                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| Isolated VM + full dev environment                      | `npm start` / stack build / browser verification without local IDE        |
| Branch + PR handoff                                     | Reviewable prototype increments                                           |
| Artifacts / screenshots / desktop                       | PM walkthrough evidence                                                   |
| MCP (team-configured)                                   | Optional. Angular CLI MCP ships in `.vscode/mcp.json`. Figma MCP is per-user for design links — see [mcp-setup.md](mcp-setup.md) |
| Environment setup (`.cursor/environment.json` / Builds) | Make Node + toolchain ready so agents do not waste turns installing deps  |


**Setup docs:** [https://cursor.com/docs/cloud-agent](https://cursor.com/docs/cloud-agent) · [https://cursor.com/docs/cloud-agent/setup](https://cursor.com/docs/cloud-agent/setup)

**Repeatability tip:** Commit a known-good Cloud Agent environment for the prototype repo (Node version, `npm ci`, optional `npm start`) so every regeneration starts warm.

---



## 3. Automations (multipliers)


| Example Automation          | Trigger                            | Purpose                                                                        |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| Prototype PR review         | PR opened/pushed on wireframe repo | Check mock-data rules, no live API URLs, build / run instructions present      |
| Feasibility digest          | Schedule (e.g. daily during eval)  | Summarize open feasibility questions from the current app’s docs + PR comments |
| Walkthrough feedback triage | Slack message in eval channel      | Cluster notes into decision-log bullets                                        |
| Non-goals reminder          | Weekly schedule                    | Post “still mock / not production” reminder to avoid scope creep               |


**Docs:** [https://cursor.com/docs/cloud-agent/automations](https://cursor.com/docs/cloud-agent/automations)

---



## 4. Repo-local agent configuration (commit these)

These live in the repository so **every** Cloud Agent / Automation run inherits the same playbook. They are the main lever for *repeatable* prototypes.

### 4.1 Rules (`.cursor/rules/` or project rules)

Recommended rules for this pattern:

1. `prototype-mock-only.mdc` — Never add live API clients, real credentials, or production URLs. All data from the current app’s `src/assets/mock` (or equivalent). Banner must say DEMO.
2. `decision-oriented-ux.mdc` — Prefer decision verbs and journey completion over visual polish; implement empty/error states for stub gaps.
3. `mock-wireframe.mdc` — Stack from intake / `07-frontend-constraints.md`, routes from the current flow spec / IA, accessibility baseline, production build + `npm start` must work.
4. `docs-sync.mdc` — When journeys change, update `apps/<slug>/docs/` (flows + inputs) in the same PR when practical.



### 4.2 Skills (`.cursor/skills/*/SKILL.md`)

Repo skills Cloud Agents can invoke (or that humans reference by name in Agents Window):


| Skill                 | When to use                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `intake-to-journeys`  | Turn the current app’s `docs/inputs/*` (or example defaults) into ranked journey markdown + deferred list |
| `prototype-brief`     | Lock scope, mock contracts, DoD before coding                                                             |
| `wireframe-scaffold`  | Generate/update the clickable hub under `apps/<slug>/` from brief + fixtures (branches on confirmed stack) |
| `flow-visualizer`     | After flows exist, build an animated HTML flowchart of the main process and each flow                     |
| `feasibility-readout` | After walkthrough notes, produce feasibility briefing                                                     |
| `handoff-brief`       | Package validated learning for a future production build                                                  |



### 4.3 Commands / custom modes (optional but powerful)

If the team uses slash/custom modes backed by skills:


| Command / mode   | Intent                                    |
| ---------------- | ----------------------------------------- |
| `/intake`        | Run intake-to-journeys skill              |
| `/brief`         | Produce/refresh prototype brief           |
| `/wireframe`     | Implement or extend mock wireframe journeys (confirmed stack) |
| `/flows`         | Animated flowchart of the main process and each flow |
| `/feasibility`   | Draft feasibility readout                 |
| `/automate-eval` | Propose Automations for the eval week     |


(Exact slash UX depends on team configuration; document the *intent* even if names differ.)

### 4.4 Hooks (`.cursor/hooks.json`)

Lightweight guardrails for Cloud Agent shell/edit loops:


| Hook idea                                                                                    | Purpose                      |
| -------------------------------------------------------------------------------------------- | ---------------------------- |
| **beforeShellExecution** deny/warn on `curl`/`fetch` to unknown hosts during prototype phase | Keep mock-only discipline    |
| **afterFileEdit** remind if `environment.ts` gains API base URLs                             | Catch accidental live wiring |
| **sessionStart** inject “read AGENTS.md + rules + current `apps/<slug>/`” checklist          | Reduce missed constraints    |


Hooks are optional for a first demo; prioritize rules + skills first.

### 4.5 AGENTS.md / repo instructions

Short top-level instructions:

- Purpose of repo (playbook + mock wireframes; stack chosen at intake)
- New apps live in `apps/<slug>/`; Angular example is `apps/examples/project-health/`
- How to run (`cd apps/<slug> && npm start`, or the stack’s documented command)
- Non-goals and ban on live integrations
- Link to this components doc and `framework/prompts/00-main-intake.md`

---



## 5. Suggested Automations as code-adjacent assets

Store Automation *prompts* in `framework/automations/` so they can be recreated in cursor.com/automations:

- `pr-prototype-review.md`
- `daily-feasibility-digest.md`
- `slack-walkthrough-triage.md`

---



## 6. What this pattern should prove about productivity

1. **Inputs in → Cloud Agent out:** intake (interview or filled docs) becomes a clickable mock hub without classic IDE time.
2. **Rules/skills encode the pattern:** next concept reuses this playbook under a new `apps/<slug>/` with the stack chosen at intake. Never overwrite the example unless asked.
3. **Automations keep the loop alive:** review and feasibility do not depend on a single hero session.
4. **Prototype→build path is credible:** confirmed-stack structure + mock contracts are intentionally “real enough” to evolve.

---



## 7. Official references

- Agents Window: [https://cursor.com/docs/agent/agents-window](https://cursor.com/docs/agent/agents-window)
- Cloud Agents: [https://cursor.com/docs/cloud-agent](https://cursor.com/docs/cloud-agent)
- Cloud agent setup: [https://cursor.com/docs/cloud-agent/setup](https://cursor.com/docs/cloud-agent/setup)
- Automations: [https://cursor.com/docs/cloud-agent/automations](https://cursor.com/docs/cloud-agent/automations)
