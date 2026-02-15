import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { N8nClient } from './n8n-client.js';

// Read tools
import { listWorkflowsTool } from './tools/list-workflows.js';
import { getWorkflowTool } from './tools/get-workflow.js';
import { getExecutionsTool } from './tools/get-executions.js';
import { validateWorkflowTool } from './tools/validate-workflow.js';
import { analyzeWorkflowTool } from './tools/analyze-workflow.js';

// Write tools
import { createWorkflowTool } from './tools/create-workflow.js';
import { updateWorkflowTool } from './tools/update-workflow.js';
import { deleteWorkflowTool } from './tools/delete-workflow.js';
import { activateWorkflowTool } from './tools/activate-workflow.js';
import { deleteExecutionTool } from './tools/delete-execution.js';

const ALL_TOOLS = [
  listWorkflowsTool,
  getWorkflowTool,
  getExecutionsTool,
  validateWorkflowTool,
  analyzeWorkflowTool,
  createWorkflowTool,
  updateWorkflowTool,
  deleteWorkflowTool,
  activateWorkflowTool,
  deleteExecutionTool,
];

export function createServer() {
  const apiUrl = process.env.N8N_API_URL;
  const apiKey = process.env.N8N_API_KEY;

  const client = new N8nClient(apiUrl, apiKey);

  const server = new McpServer({
    name: 'n8n-mcp-server',
    version: '1.0.0',
  });

  for (const tool of ALL_TOOLS) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      async (params) => {
        try {
          return await tool.handler(params, client);
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true,
          };
        }
      }
    );
  }

  return server;
}
