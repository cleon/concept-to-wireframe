# Framework — concept → mock wireframe

This is a reusable playbook for taking a concept through to a mock wireframe. Stack is chosen at intake; **Angular (latest) is the default** (Angular CLI MCP ships in-repo). Alternatives: Vanilla JS, React + TypeScript, or a validated Other.


| Path                                                     | Role                                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `[prompts/00-main-intake.md](prompts/00-main-intake.md)` | Contains the first prompt to paste in Agents Window / Cloud Agents to get started |
| `[inputs/templates/](inputs/templates/)`                 | Blank intake + flow-spec forms                                                    |
| `[automations/](automations/)`                           | Paste-ready Automation prompts                                                    |
| `[cursor-components.md](cursor-components.md)`           | Rules / skills / hooks / Automations guide                                        |
| `[mcp-setup.md](mcp-setup.md)`                           | Angular CLI MCP (ships) + optional Figma MCP for people who fork the repo         |
| `[flow-visualizer/](flow-visualizer/)`                   | Animated HTML flowchart of the main process and each flow                         |


New wireframes go in `apps/<slug>/`. 

An Angular reference implementation can be found in `apps/examples/project-health/`.
