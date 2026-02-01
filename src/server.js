/**
 * MCP Server for n8n
 * Provides Model Context Protocol tools for n8n workflow interaction
 */

import { N8nMCPClient } from './client.js';

export class MCPServer {
  constructor() {
    this.client = new N8nMCPClient();
    this.tools = this.registerTools();
  }

  /**
   * Register available MCP tools
   */
  registerTools() {
    return [
      {
        name: 'n8n_list_workflows',
        description: 'List all n8n workflows with read-only access',
        inputSchema: {
          type: 'object',
          properties: {},
        },
        handler: async () => {
          const workflows = await this.client.listWorkflows();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(workflows, null, 2),
              },
            ],
          };
        },
      },
      {
        name: 'n8n_get_workflow',
        description: 'Get details of a specific n8n workflow by ID',
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
        handler: async (params) => {
          const workflow = await this.client.getWorkflow(params.workflowId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(workflow, null, 2),
              },
            ],
          };
        },
      },
      {
        name: 'n8n_get_executions',
        description: 'Get execution history for a specific workflow',
        inputSchema: {
          type: 'object',
          properties: {
            workflowId: {
              type: 'string',
              description: 'The ID of the workflow',
            },
            limit: {
              type: 'number',
              description: 'Number of executions to return (default: 10)',
            },
          },
          required: ['workflowId'],
        },
        handler: async (params) => {
          const executions = await this.client.getWorkflowExecutions(
            params.workflowId,
            params.limit || 10
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(executions, null, 2),
              },
            ],
          };
        },
      },
      {
        name: 'n8n_validate_workflow',
        description: 'Validate a workflow configuration for common issues',
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
        handler: async (params) => {
          const validation = await this.client.validateWorkflow(params.workflowId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(validation, null, 2),
              },
            ],
          };
        },
      },
      {
        name: 'n8n_analyze_workflow',
        description: 'Analyze a workflow for troubleshooting and optimization suggestions',
        inputSchema: {
          type: 'object',
          properties: {
            workflowId: {
              type: 'string',
              description: 'The ID of the workflow to analyze',
            },
          },
          required: ['workflowId'],
        },
        handler: async (params) => {
          const workflow = await this.client.getWorkflow(params.workflowId);
          const executions = await this.client.getWorkflowExecutions(params.workflowId, 50);

          const analysis = {
            workflowId: params.workflowId,
            name: workflow.name,
            nodeCount: workflow.nodes?.length || 0,
            connectionCount: Object.keys(workflow.connections || {}).length,
            recentExecutions: executions.length,
            successRate: this.calculateSuccessRate(executions),
            avgExecutionTime: this.calculateAvgExecutionTime(executions),
            suggestions: this.generateSuggestions(workflow, executions),
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(analysis, null, 2),
              },
            ],
          };
        },
      },
    ];
  }

  /**
   * Calculate success rate from executions
   */
  calculateSuccessRate(executions) {
    if (!executions || executions.length === 0) return null;
    const successful = executions.filter((e) => e.finished && !e.stoppedAt && !e.error).length;
    return ((successful / executions.length) * 100).toFixed(2) + '%';
  }

  /**
   * Calculate average execution time
   */
  calculateAvgExecutionTime(executions) {
    if (!executions || executions.length === 0) return null;
    const times = executions
      .filter((e) => e.finished && e.startedAt)
      .map((e) => new Date(e.finishedAt) - new Date(e.startedAt));
    if (times.length === 0) return null;
    return (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(2) + 's';
  }

  /**
   * Generate optimization suggestions
   */
  generateSuggestions(workflow, executions) {
    const suggestions = [];

    // Check for performance issues
    const avgTime = this.calculateAvgExecutionTime(executions);
    if (avgTime && parseFloat(avgTime) > 30) {
      suggestions.push({
        type: 'performance',
        message: 'Average execution time exceeds 30 seconds. Consider optimizing node configurations.',
      });
    }

    // Check for error patterns
    const recentErrors = executions.filter((e) => e.error).slice(0, 5);
    if (recentErrors.length > 0) {
      suggestions.push({
        type: 'reliability',
        message: `Recent errors detected: ${recentErrors.length} in last executions. Check error logs.`,
      });
    }

    // Check for complex workflows
    if (workflow.nodes && workflow.nodes.length > 20) {
      suggestions.push({
        type: 'maintainability',
        message: 'Workflow has many nodes. Consider breaking into sub-workflows for better maintainability.',
      });
    }

    return suggestions;
  }
}

export default MCPServer;
