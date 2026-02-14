#!/usr/bin/env node

/**
 * avn-mcp-n8n - MCP Server for n8n Workflow Integration
 *
 * This server provides read-only access to n8n workflows for
 * troubleshooting, analysis, and optimization using AI assistants.
 *
 * Usage: node src/index.js
 */

import dotenv from 'dotenv';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMCPServer } from './server.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['N8N_API_URL', 'N8N_API_KEY'];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('\nPlease configure your .env file with the required values.');
  console.error('\nRequired:');
  console.error('  N8N_API_URL    - Your n8n instance URL (e.g., https://n8n.example.com)');
  console.error('  N8N_API_KEY    - Your n8n API key from Settings → API');
  process.exit(1);
}

/**
 * Main entry point - starts the MCP server with STDIO transport
 */
async function main() {
  const server = createMCPServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Server is now running, listening for MCP messages via STDIO
  // Error handling is managed by the MCP SDK
}

main().catch((error) => {
  console.error('Fatal error starting MCP server:', error);
  process.exit(1);
});
