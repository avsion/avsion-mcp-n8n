# Claude Context for avn-mcp-n8n

## Project Overview

This is an **MCP (Model Context Protocol) server** that enables Claude Code to safely interact with n8n workflow automation via read-only tools.

**Key characteristics:**
- Read-only access to n8n workflows (no modifications)
- MCP server implementation using `@modelcontextprotocol/sdk`
- ES modules (type: "module" in package.json)
- Node.js >= 18.0.0 required

## Project Structure

```
avn-mcp-n8n/
├── src/
│   ├── index.js         # Main entry point, CLI invocation
│   ├── server.js        # MCP server for n8n integration
│   ├── client.js        # n8n API client wrapper
│   └── github-server.js # GitHub MCP server integration
├── workflows/           # n8n workflow definitions/examples
├── test/               # Node.js built-in test runner
└── .claude/            # Project-local Claude config
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Run the MCP server |
| `npm run dev` | Run with --watch for development |
| `npm test` | Run tests (Node.js built-in test runner) |
| `npm run lint` | ESLint on src/ |
| `npm run format` | Prettier format |

## Environment Variables

Required in `.env`:
- `N8N_API_URL` - n8n instance URL
- `N8N_API_KEY` - n8n API key
- `ANTHROPIC_AUTH_TOKEN` - Anthropic API token

Optional:
- `ANTHROPIC_BASE_URL` - Custom Anthropic API URL
- `API_TIMEOUT_MS` - Request timeout override

## MCP Tools Available

The server exposes these read-only tools for n8n:
- List workflows
- Get workflow details
- Search workflows
- Get execution history
- Validate workflow configuration

## GitHub Integration

The project includes GitHub MCP server for:
- Reading repository code
- Creating/managing issues
- Pull request reviews
- Code search

## Code Conventions

- **ES modules** - Use `import`/`export`, not CommonJS
- **Async/await** - Prefer over promise chaining
- **Error handling** - All API calls should be wrapped with proper error handling
- **Read-only design** - No write operations to n8n workflows

## Testing

Uses Node.js built-in test runner (`node --test`). Test files should be in `test/` with `.test.js` extension.

## Git Workflow

- Main branch: `main`
- Feature branches: `feature/Description`
- Commit format: conventional commits preferred
- PRs to main branch
