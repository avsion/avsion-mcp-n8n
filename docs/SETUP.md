# Setup Guide

## Prerequisites

- Node.js 18+ installed
- n8n instance (self-hosted or cloud)
- n8n API key

## Getting Your n8n API Key

1. Log in to your n8n instance
2. Go to **Settings** → **API**
3. Click **Create API Key**
4. Give it a name and copy the key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/avsion/avsion-mcp-n8n.git
cd avn-mcp-n8n
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start the server:
```bash
npm start
```

## Development

Run in watch mode for automatic restarts:
```bash
npm run dev
```

## Usage with Claude Code

1. Ensure the MCP server is running
2. In Claude Code, the n8n tools will be available
3. Ask Claude to:
   - List your workflows
   - Analyze specific workflows
   - Troubleshoot execution issues

## Troubleshooting

### Connection Issues

If you can't connect to n8n:
- Verify `N8N_API_URL` is correct
- Check your API key is valid
- Ensure network access to your n8n instance

### Authentication Errors

If you get 401/403 errors:
- Regenerate your API key in n8n
- Verify the key has proper permissions
- Check the key hasn't expired
