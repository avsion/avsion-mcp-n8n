/**
 * avn-mcp-n8n - MCP Server for n8n Workflow Integration
 *
 * This server provides read-only access to n8n workflows for
 * troubleshooting, analysis, and optimization using AI assistants.
 */

import { MCPServer } from './server.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['N8N_API_URL', 'N8N_API_KEY'];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please configure your .env file with the required values.');
  process.exit(1);
}

// Initialize and start the MCP server
async function main() {
  try {
    console.log('🚀 Starting avn-mcp-n8n MCP Server...');
    console.log(`📡 n8n API URL: ${process.env.N8N_API_URL}`);

    const server = new MCPServer();

    console.log(`✅ MCP Server initialized with ${server.tools.length} tools:`);
    server.tools.forEach((tool) => {
      console.log(`   - ${tool.name}`);
    });

    console.log('\n📚 Available tools:');
    console.log('   n8n_list_workflows      - List all workflows');
    console.log('   n8n_get_workflow        - Get workflow details');
    console.log('   n8n_get_executions      - Get execution history');
    console.log('   n8n_validate_workflow   - Validate workflow configuration');
    console.log('   n8n_analyze_workflow    - Analyze workflow for issues');

    console.log('\n✨ Server ready to handle MCP requests');
    console.log('ℹ️  Press Ctrl+C to stop\n');

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down gracefully...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start MCP server:', error.message);
    process.exit(1);
  }
}

// Start the server
main();

export { MCPServer, N8nMCPClient } from './server.js';
export { N8nMCPClient } from './client.js';
