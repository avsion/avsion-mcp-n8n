import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

const required = ['N8N_API_URL', 'N8N_API_KEY'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('n8n MCP server running on stdio');
