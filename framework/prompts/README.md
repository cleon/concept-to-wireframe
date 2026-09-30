# Prompts

For your first run, paste the **Prompt to paste** block from `[00-main-intake.md](00-main-intake.md)` (or `@` that file) in the Cursor Agents Window / Cloud Agents. Mock data only; a classic IDE is not required.

- Agent path = this main prompt → wireframe under `apps/<slug>/`
- Phase A stack default is **Angular (latest)** (repo ships Angular CLI MCP). Other stacks are opt-in.
- After the Flow Spec is confirmed, the main prompt optionally asks for design (screenshots, mockups, or Figma). If a Figma link is given, the agent offers Figma MCP **only when that MCP is available in this Cursor**; forks must enable it themselves ([mcp-setup.md](../mcp-setup.md)). Never required to proceed.
- After the first flow is built, the main prompt can ask for an animated flowchart (`flow-visualizer`) of the main process and each flow.
- Manual / workshop path = `[framework/inputs/templates/](../inputs/templates/)`
- Worked example defaults = `[apps/examples/project-health/docs/inputs/](../../apps/examples/project-health/docs/inputs/)`
