# Automation: Slack walkthrough triage

**Recreate in:** [cursor.com/automations](https://cursor.com/automations)  
**Trigger:** Slack message in the eval / walkthrough channel  
**Purpose:** Turn raw walkthrough chatter into decision-log bullets the prototype can act on.

Paste the prompt below into the Automation. The Automation should read the triggering thread, not the whole workspace.

---

## Prompt

A stakeholder just left walkthrough feedback on the **Project Health Command Hub** clickable wireframe (mock data only).

### Cluster the notes into

| Bucket | Include |
| --- | --- |
| **Decision moment** | Agree / disagree on escalate, needs-steer, cost flag, driver taxonomy |
| **Journey friction** | Where J1–J3 stalled (filter, two-clicks-to-why, tab jump, empty state) |
| **Feasibility** | Integration, health-rollup rules, join key, stub metric credibility |
| **Out of scope** | Live APIs, J4–J6, SSO, mobile, BI replacement — log and do not implement |

### Output

1. 5–10 decision-log bullets (verb first: *Keep*, *Change*, *Defer*, *Validate*).
2. Map each bullet to J1, J2, J3, or Deferred.
3. If a change is wireframe-sized (copy, fixture, empty state, filter), propose a single Cloud Agent follow-up prompt.
4. If the note asks for a live system, reply with the mock-only constraint and a fixture alternative.

Do not invent stakeholder quotes. If the thread is ambiguous, list the clarifying question instead of a fake decision.
