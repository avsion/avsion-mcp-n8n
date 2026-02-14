# AI Personal Assistant Core (n8n Integrated)

This repository serves as the central logic hub for an AI Assistant integrated with **n8n** agentic workflows. It manages context, MCP server connections, and secure configuration.

## 🛠 Project Structure
* `.claudecode/`: Local Claude settings and MCP configurations.
* `.gitignore`: Ensures private API tokens and env files stay local.
* `*.example`: Templates for setting up the environment on new machines.

## 🔐 Security & Maintenance
We use a custom redaction system to prevent API key leaks.

### The `cb` Command
To backup your latest statusline logic and settings safely, use the terminal alias:
`cb`
This runs `safe_backup.sh`, which strips your `ANTHROPIC_AUTH_TOKEN` before saving to `~/Documents/Claude_Backup`.

## 📊 Developer Experience
The environment is enhanced with a custom **Claude Code Status Line**:
* **Real-time Stats**: Model name, token window usage, and project name.
* **Git Context**: Displays the current branch and last commit subject.

## 🕸 n8n & MCP Integration
This assistant is designed to connect to n8n via MCP servers. 
*Configure your n8n nodes in `.claudecode/settings.json` under the `mcpServers` block.*