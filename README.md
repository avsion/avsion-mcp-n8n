# AI Personal Assistant Core (n8n Integrated)

This repository contains the core logic and configuration for an AI Assistant integrated with n8n agentic workflows.

## 🛠 Developer Setup
To protect sensitive data, this project uses local configuration files that are ignored by Git.

### 1. API Configuration
1. Copy `.claude/settings.local.json.example` to `.claude/settings.local.json`.
2. Add your `ANTHROPIC_AUTH_TOKEN` and any n8n/MCP server keys to the new file.

### 2. Custom Status Bar
The project includes a custom Claude Code status bar located at `~/.claude/scripts/statusline.sh`. It displays:
* Active AI Model
* Token Usage %
* Current Git Branch
* Latest Commit Message

## 💾 Maintenance & Backups
We use a **Safe Backup** system to sync settings while redacting private keys.

**To backup your configuration:**
Type `cb` in your terminal (using the alias in your `~/.zshrc`).
* **Source Script:** `~/Documents/Claude_Backup/safe_backup.sh`
* **Outputs:** Redacted JSON files in the backup folder.

## 🚀 n8n Integration
(Add details here about your specific n8n workflows and how the AI interacts with them.)