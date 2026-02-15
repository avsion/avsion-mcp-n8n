import { z } from 'zod';

export const validateWorkflowTool = {
  name: 'n8n_validate_workflow',
  description: 'Validate an n8n workflow configuration. Checks for common issues like disconnected nodes, missing credentials, and inactive triggers.',
  schema: {
    workflowId: z.string().describe('The workflow ID to validate'),
  },
  handler: async ({ workflowId }, client) => {
    const workflow = await client.getWorkflow(workflowId);
    const issues = [];
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};

    if (nodes.length === 0) {
      issues.push('⚠️ Workflow has no nodes.');
    }

    // Check for trigger node
    const triggerNodes = nodes.filter(n =>
      n.type?.toLowerCase().includes('trigger') ||
      n.type?.toLowerCase().includes('webhook') ||
      n.type?.toLowerCase().includes('cron') ||
      n.type?.toLowerCase().includes('schedule')
    );
    if (nodes.length > 0 && triggerNodes.length === 0) {
      issues.push('⚠️ No trigger node found. Workflow may not start automatically.');
    }

    // Check for disconnected nodes
    const connectedNodeNames = new Set();
    for (const [sourceName, outputs] of Object.entries(connections)) {
      connectedNodeNames.add(sourceName);
      for (const output of Object.values(outputs)) {
        for (const conns of output) {
          for (const conn of conns) {
            connectedNodeNames.add(conn.node);
          }
        }
      }
    }
    const disconnected = nodes.filter(n => !connectedNodeNames.has(n.name) && nodes.length > 1);
    if (disconnected.length > 0) {
      issues.push(`⚠️ Disconnected nodes: ${disconnected.map(n => n.name).join(', ')}`);
    }

    // Check for disabled nodes
    const disabled = nodes.filter(n => n.disabled);
    if (disabled.length > 0) {
      issues.push(`ℹ️ Disabled nodes: ${disabled.map(n => n.name).join(', ')}`);
    }

    // Check for nodes without credentials where type suggests they need them
    const credentialTypes = ['api', 'oauth', 'smtp', 'database', 'sql', 'mysql', 'postgres', 'mongo', 'redis', 'slack', 'telegram', 'gmail', 'http'];
    for (const node of nodes) {
      const typeLower = (node.type || '').toLowerCase();
      const needsCreds = credentialTypes.some(ct => typeLower.includes(ct));
      if (needsCreds && !node.credentials && !node.disabled) {
        issues.push(`⚠️ Node "${node.name}" (${node.type}) may need credentials but none are configured.`);
      }
    }

    const text = issues.length > 0
      ? `Validation for workflow "${workflow.name}" (${workflowId}):\n\n${issues.join('\n')}`
      : `✅ Workflow "${workflow.name}" (${workflowId}) looks good. No issues found.`;

    return { content: [{ type: 'text', text }] };
  },
};
