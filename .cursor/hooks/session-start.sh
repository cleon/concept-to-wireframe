#!/usr/bin/env bash
# Inject the prototype checklist at session start (IDE / worker sessions).
# Cloud Agents may skip sessionStart; rules + AGENTS.md still apply.
printf '%s\n' '{"additional_context":"Project Health Command Hub is a mock-data Angular wireframe. Read AGENTS.md, docs/inputs/, and .cursor/rules/ before editing. No live APIs, secrets, or production URLs. Keep the DEMO banner visible. Implement J1–J3 only; J4–J6 stay docs-only. Prefer fixtures in src/assets/mock/."}'
