# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Personal Assistant Core is an MCP (Model Context Protocol) server that enables Claude Code and other AI assistants to interact with n8n workflow automation platforms. It serves as the central logic hub managing context, MCP server connections, and secure configuration.

## Architecture

- **Runtime**: Node.js (>=18), ES Modules (`import`/`export`)
- **Protocol**: MCP server using `@modelcontextprotocol/sdk` with stdio transport
- **Key components**:
  - `src/index.js` - Entry point, env validation, stdio transport setup
  - `src/server.js` - McpServer creation, registers all tools
  - `src/n8n-client.js` - HTTP client wrapping n8n REST API v1 (native `fetch`)
  - `src/tools/` - Individual tool modules (read and write)

## MCP Tools Exposed

### Read Tools (execute directly)
1. `n8n_list_workflows` - List all workflows (optional: active filter, limit)
2. `n8n_get_workflow` - Get workflow details by ID
3. `n8n_get_executions` - Get execution history (optional: workflowId, status, limit)
4. `n8n_validate_workflow` - Validate workflow configuration (local analysis)
5. `n8n_analyze_workflow` - Analyze for optimization opportunities (local analysis)

### Write Tools (require `confirm: true`)
6. `n8n_create_workflow` - Create a new workflow
7. `n8n_update_workflow` - Update an existing workflow
8. `n8n_delete_workflow` - Delete a workflow (irreversible)
9. `n8n_activate_workflow` - Activate or deactivate a workflow
10. `n8n_delete_execution` - Delete an execution record

**Safety model**: All write tools require a `confirm: true` parameter. Without it, they return a preview of what would happen, giving the user a chance to review before any change executes.

## Configuration

- **Sensitive config**: `.claude/settings.local.json` (gitignored, never commit)
- **Template**: `.claude/settings.local.json.example` (safe to commit)
- **Environment variables**: `N8N_API_URL`, `N8N_API_KEY` (required, injected via mcpServers env config)
- **Backup/restore**: `cb` alias runs `safe_backup.sh` (strips API keys before saving to `~/Documents/Claude_Backup/`); `cr` alias restores

## Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `zod` - Schema validation for tool parameters

## Git Conventions

- Conventional Commits format
- Co-author attribution in commits
