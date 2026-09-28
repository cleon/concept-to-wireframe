---
name: feasibility-readout
description: After walkthrough notes, draft a Phase-1 feasibility briefing from stub metrics and stakeholder reactions. Use when the eval needs a go / no-go note.
---

# Feasibility readout

## When

Walkthrough or Slack triage notes exist. Someone asked “can we build Phase 1?”

## Do

1. Read the **current app’s** source map, feasibility questions, and success metrics (`apps/<slug>/docs/inputs/` — or `apps/examples/project-health/docs/inputs/` if that is the app / defaults).
2. Map notes onto the open feasibility questions. Mark answered vs still open.
3. Recommend a small Phase-1 integration slice (not every domain) and name join-key / stewardship risks.
4. Separate: UX validated on stubs vs. claims that need real data.
5. Write a one-page readout. Optionally append unanswered items to that app’s `08-feasibility-questions.md`.

## Guardrails

- A pretty wireframe is not evidence that source-system integration is easy.
- Do not open a production repo or add connectors.
- If notes are vague, list the missing scorecard items instead of a fake green light.
