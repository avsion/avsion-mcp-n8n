/**
 * n8n MCP Client
 * Provides read-only access to n8n workflows for troubleshooting and analysis
 */

export class N8nMCPClient {
  constructor(config = {}) {
    // Ensure API URL doesn't end with /api/v1 - we'll add it dynamically
    let apiUrl = config.apiUrl || process.env.N8N_API_URL || '';
    this.apiBaseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
    this.apiKey = config.apiKey || process.env.N8N_API_KEY;
    this.timeout = config.timeout || parseInt(process.env.API_TIMEOUT_MS) || 30000;
  }

  /**
   * Get full API URL with path
   */
  _apiUrl(path) {
    return `${this.apiBaseUrl}/api/v1${path}`;
  }

  /**
   * List all workflows
   * @returns {Promise<Array>} List of workflows
   */
  async listWorkflows() {
    try {
      const response = await fetch(this._apiUrl('/workflows'), {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': this.apiKey,
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
      const response = await fetch(this._apiUrl(`/workflows/${workflowId}`), {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': this.apiKey,
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
        this._apiUrl(`/executions?workflowId=${workflowId}&limit=${limit}`),
        {
          method: 'GET',
          headers: {
            'X-N8N-API-KEY': this.apiKey,
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
      const sourceNodes = new Set();

      // connections is an object: {nodeName: {connectionType: [[{node, type, index}]]}}
      Object.entries(workflow.connections || {}).forEach(([sourceName, connTypes]) => {
        sourceNodes.add(sourceName);
        Object.values(connTypes).forEach((connectionsArray) => {
          connectionsArray.forEach((connections) => {
            connections.forEach((connection) => {
              connectedNodes.add(connection.node);
            });
          });
        });
      });

      // Check for nodes with no connections (sources or destinations)
      workflow.nodes?.forEach((node) => {
        const hasOutgoing = sourceNodes.has(node.name);
        const hasIncoming = connectedNodes.has(node.name);
        // Trigger nodes don't need incoming connections
        const isTrigger = node.type?.includes('Trigger') || node.type?.includes('trigger');

        if (!hasOutgoing && !hasIncoming) {
          warnings.push(`Node "${node.name}" has no connections`);
        } else if (!hasOutgoing && !isTrigger && hasIncoming) {
          warnings.push(`Node "${node.name}" has no outgoing connections`);
        } else if (!hasIncoming && !isTrigger && hasOutgoing) {
          // This might be intentional for some nodes
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

  /**
   * Get workflow statistics
   * @param {string} workflowId - The workflow ID
   * @returns {Promise<Object>} Workflow statistics
   */
  async getWorkflowStats(workflowId) {
    try {
      const workflow = await this.getWorkflow(workflowId);
      const executions = await this.getWorkflowExecutions(workflowId, 100);

      const successful = executions.filter((e) => e.finished && !e.stoppedAt && !e.error).length;
      const failed = executions.filter((e) => e.error).length;
      const times = executions
        .filter((e) => e.finishedAt && e.startedAt)
        .map((e) => new Date(e.finishedAt) - new Date(e.startedAt));

      return {
        workflowId,
        name: workflow.name,
        active: workflow.active,
        nodeCount: workflow.nodes?.length || 0,
        totalExecutions: executions.length,
        successfulExecutions: successful,
        failedExecutions: failed,
        successRate: executions.length > 0 ? ((successful / executions.length) * 100).toFixed(2) + '%' : 'N/A',
        avgExecutionTime: times.length > 0 ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(2) + 's' : 'N/A',
      };
    } catch (error) {
      throw new Error(`Failed to get workflow stats: ${error.message}`);
    }
  }
}

export default N8nMCPClient;
