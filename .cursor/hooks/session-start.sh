#!/usr/bin/env bash
# Inject the prototype checklist at session start (IDE / worker sessions).
# Cloud Agents may skip sessionStart; rules + AGENTS.md still apply.
printf '%s\n' '{"additional_context":"This repo is a concept → Angular mock wireframe playbook. Read AGENTS.md, framework/prompts/00-main-intake.md, and .cursor/rules/ before editing. New apps go in apps/<slug>/. Do not overwrite apps/examples/project-health/ unless the user explicitly extends that example. No live APIs, secrets, or production URLs. Keep the DEMO banner visible. Prefer fixtures in the current app src/assets/mock/."}'
