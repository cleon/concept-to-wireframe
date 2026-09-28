# Automation: Daily feasibility digest

**Recreate in:** [cursor.com/automations](https://cursor.com/automations)  
**Trigger:** Schedule (daily during the eval window)  
**Purpose:** Keep Phase-1 go / no-go questions visible so the loop does not depend on a single hero session.

Paste the prompt below into the Automation.

---

## Prompt

Produce a short **feasibility digest** for the Project Health Command Hub demo (mock wireframe only).

Read:

- `docs/inputs/08-feasibility-questions.md`
- `docs/inputs/06-source-system-map.md`
- `docs/inputs/09-success-metrics.md`
- `docs/inputs/03-priority-journeys.md`
- Open PR comments / review notes if available

### Output (keep it scannable)

1. **Open questions** — copy the still-unanswered items from `08-feasibility-questions.md`; mark any that walkthrough notes already closed.
2. **New notes from the last day** — cluster PR comments and review remarks into decision-log bullets (not a transcript).
3. **Phase 1 implication** — which two domains (schedule / cost / safety / change) look like integration candidates, and what is still blocked.
4. **Scope creep watch** — flag any request that implies live ERP/P6/EHS wiring, auth/SSO, mobile-native, or deferred journeys J4–J6.

End with 3 suggested next asks for the next Cloud Agent run. Do not write production integration code.
