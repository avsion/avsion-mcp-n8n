# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Personal Assistant Core is an MCP (Model Context Protocol) server that enables Claude Code and other AI assistants to interact with n8n workflow automation platforms via read-only tools. It serves as the central logic hub managing context, MCP server connections, and secure configuration.

**Current state**: Source code was removed from the repo (Feb 2026). The repository now contains only documentation and secure configuration templates. Full implementation history is preserved in git.

## Architecture

- **Runtime**: Node.js (>=18), ES Modules (`import`/`export`)
- **Protocol**: MCP server exposing 5 read-only tools to Claude Code
- **Key components** (in git history):
  - `src/index.js` - Entry point, env validation, server startup
  - `src/server.js` - MCPServer class, registers MCP tools and handles invocation
  - `src/client.js` - N8nMCPClient, wraps n8n REST API with auth and error handling
  - `src/github-server.js` - GitHub MCP server integration

## MCP Tools Exposed

All tools are **read-only** (no workflow modifications):
1. `n8n_list_workflows` - List all workflows
2. `n8n_get_workflow` - Get workflow details by ID
3. `n8n_get_executions` - Get execution history
4. `n8n_validate_workflow` - Validate workflow configuration
5. `n8n_analyze_workflow` - Analyze for optimization opportunities

## Configuration

- **Sensitive config**: `.claude/settings.local.json` (gitignored, never commit)
- **Template**: `.claude/settings.local.json.example` (safe to commit)
- **Environment variables**: `N8N_API_URL`, `N8N_API_KEY`, `ANTHROPIC_AUTH_TOKEN` (required)
- **Backup/restore**: `cb` alias runs `safe_backup.sh` (strips API keys before saving to `~/Documents/Claude_Backup/`); `cr` alias restores

## Git Conventions

- Conventional Commits format
- Co-author attribution in commits
