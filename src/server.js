/**
 * n8n MCP Server
 * Model Context Protocol server for n8n workflow interaction
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { N8nMCPClient } from './client.js';

/**
 * Create and configure the MCP server with n8n tools
 */
export function createMCPServer() {
  const client = new N8nMCPClient();

  const server = new Server(
    {
      name: 'avn-mcp-n8n',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  /**
   * List available resources
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'status://n8n',
          name: 'n8n Connection Status',
          description: 'Current connection status to n8n instance',
          mimeType: 'application/json',
        },
      ],
    };
  });

  /**
   * Read resource content
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === 'status://n8n') {
      try {
        // Check connection by fetching workflow count
        const workflows = await client.listWorkflows();
        const activeWorkflows = workflows.filter((w) => w.active).length;

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  status: 'connected',
                  api_url: process.env.N8N_API_URL,
                  total_workflows: workflows.length,
                  active_workflows: activeWorkflows,
                  timestamp: new Date().toISOString(),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  status: 'error',
                  error: error.message,
                  api_url: process.env.N8N_API_URL,
                  timestamp: new Date().toISOString(),
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
  });

  /**
   * List available tools
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'n8n_list_workflows',
          description: 'List all n8n workflows in your instance. Returns workflow IDs, names, and active status.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'n8n_get_workflow',
          description: 'Get detailed information about a specific workflow including nodes, connections, and settings.',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: {
                type: 'string',
                description: 'The ID of the workflow to retrieve',
              },
            },
            required: ['workflowId'],
          },
        },
        {
          name: 'n8n_get_workflow_stats',
          description: 'Get statistics for a workflow including execution counts, success rate, and average execution time.',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: {
                type: 'string',
                description: 'The ID of the workflow',
              },
            },
            required: ['workflowId'],
          },
        },
        {
          name: 'n8n_get_executions',
          description: 'Get recent execution history for a workflow. Useful for troubleshooting failed runs.',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: {
                type: 'string',
                description: 'The ID of the workflow',
              },
              limit: {
                type: 'number',
                description: 'Number of executions to return (default: 10, max: 100)',
                default: 10,
              },
            },
            required: ['workflowId'],
          },
        },
        {
          name: 'n8n_validate_workflow',
          description: 'Validate a workflow configuration for common issues like unconnected nodes or missing required parameters.',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: {
                type: 'string',
                description: 'The ID of the workflow to validate',
              },
            },
            required: ['workflowId'],
          },
        },
        {
          name: 'n8n_search_workflows',
          description: 'Search for workflows by name. Useful for finding specific workflows without knowing their IDs.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query to match against workflow names',
              },
            },
            required: ['query'],
          },
        },
      ],
    };
  });

  /**
   * Handle tool calls
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'n8n_list_workflows': {
          const workflows = await client.listWorkflows();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    count: workflows.length,
                    workflows: workflows.map((w) => ({
                      id: w.id,
                      name: w.name,
                      active: w.active,
                      updatedAt: w.updatedAt,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'n8n_get_workflow': {
          const { workflowId } = args;
          const workflow = await client.getWorkflow(workflowId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(workflow, null, 2),
              },
            ],
          };
        }

        case 'n8n_get_workflow_stats': {
          const { workflowId } = args;
          const stats = await client.getWorkflowStats(workflowId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(stats, null, 2),
              },
            ],
          };
        }

        case 'n8n_get_executions': {
          const { workflowId, limit = 10 } = args;
          const executions = await client.getWorkflowExecutions(workflowId, Math.min(limit, 100));
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    count: executions.length,
                    workflowId,
                    executions: executions.map((e) => ({
                      id: e.id,
                      finished: e.finished,
                      mode: e.mode,
                      startedAt: e.startedAt,
                      finishedAt: e.finishedAt,
                      error: e.error ? { message: e.error.message, type: e.error.name } : null,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'n8n_validate_workflow': {
          const { workflowId } = args;
          const validation = await client.validateWorkflow(workflowId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(validation, null, 2),
              },
            ],
          };
        }

        case 'n8n_search_workflows': {
          const { query } = args;
          const workflows = await client.listWorkflows();
          const filtered = workflows.filter(
            (w) => w.name && w.name.toLowerCase().includes(query.toLowerCase())
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    query,
                    count: filtered.length,
                    workflows: filtered.map((w) => ({
                      id: w.id,
                      name: w.name,
                      active: w.active,
                      updatedAt: w.updatedAt,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Error executing tool ${name}: ${error.message}`);
    }
  });

  return server;
}

export default createMCPServer;
