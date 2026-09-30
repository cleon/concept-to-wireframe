# MCP setup for this playbook (forks)

MCP servers are **per Cursor instance**. Forking this repo does **not** copy another user’s account MCP or Figma auth. Configure what you need locally (or for your Cloud Agent environment).

## Ships with the repo

[`.vscode/mcp.json`](../.vscode/mcp.json) already declares **Angular CLI** MCP (`npx @angular/cli mcp`). That is why **Angular (latest)** is the default wireframe stack at intake: the playbook and example tooling assume Angular is ready without extra setup.

Enable / approve the Angular CLI MCP in Cursor if your client prompts for it. No secrets belong in the repo.

## Optional: Figma MCP (for design links)

If someone pastes a Figma file URL during intake, the agent may offer to pull design context via **Figma MCP**. That only works when **this** Cursor user has Figma MCP installed and authenticated.

### Enable Figma MCP (high level)

1. In Cursor, add the **official Figma MCP** (Cursor Settings → MCP, or the Figma plugin / docs for the current install path).
2. Authenticate with the Figma account that can open the file (private files need access).
3. Confirm tools such as `get_screenshot` / `get_design_context` appear for the agent.
4. Re-run or continue intake; when asked, choose **use Figma MCP** for that link.

Do **not** commit Figma tokens, OAuth secrets, or personal MCP configs with credentials into git.

### If Figma MCP is missing

Intake falls back to: attach exported frame PNGs or a PDF, or invent UI from the Flow Spec. Build is never blocked on Figma.

## Other MCP (Jira, Slack, etc.)

Team-configured connectors are optional and not required for a mock wireframe. See [cursor-components.md](cursor-components.md).
