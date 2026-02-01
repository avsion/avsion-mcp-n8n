/**
 * n8n MCP Client
 * Provides read-only access to n8n workflows for troubleshooting and analysis
 */

import dotenv from 'dotenv';

dotenv.config();

export class N8nMCPClient {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || process.env.N8N_API_URL;
    this.apiKey = config.apiKey || process.env.N8N_API_KEY;
    this.timeout = config.timeout || parseInt(process.env.API_TIMEOUT_MS) || 30000;
  }

  /**
   * List all workflows
   * @returns {Promise<Array>} List of workflows
   */
  async listWorkflows() {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/workflows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw new Error(`Failed to list workflows: ${error.message}`);
    }
  }

  /**
   * Get a specific workflow by ID
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Object>} Workflow details
   */
  async getWorkflow(workflowId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/workflows/${workflowId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw new Error(`Failed to get workflow: ${error.message}`);
    }
  }

  /**
   * Get workflow execution history
   * @param {string} workflowId - The workflow ID
   * @param {number} limit - Number of executions to return
   * @returns {Promise<Array>} Execution history
   */
  async getWorkflowExecutions(workflowId, limit = 10) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(this.timeout),
        }
      );

      if (!response.ok) {
        throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw new Error(`Failed to get executions: ${error.message}`);
    }
  }

  /**
   * Validate workflow configuration
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Object>} Validation results
   */
  async validateWorkflow(workflowId) {
    try {
      const workflow = await this.getWorkflow(workflowId);

      const issues = [];
      const warnings = [];

      // Check for common issues
      if (!workflow.nodes || workflow.nodes.length === 0) {
        issues.push('Workflow has no nodes');
      }

      // Check for unconnected nodes
      const connectedNodes = new Set();
      workflow.connections?.forEach((conn) => {
        conn.forEach((c) => {
          c.forEach((connection) => {
            connectedNodes.add(connection.node);
            connectedNodes.add(connection.index);
          });
        });
      });

      workflow.nodes?.forEach((node) => {
        if (!connectedNodes.has(node.name)) {
          warnings.push(`Node "${node.name}" may be unconnected`);
        }
      });

      return {
        valid: issues.length === 0,
        issues,
        warnings,
        workflowId,
      };
    } catch (error) {
      throw new Error(`Failed to validate workflow: ${error.message}`);
    }
  }
}

export default N8nMCPClient;
