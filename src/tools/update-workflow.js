import { z } from 'zod';
import { sanitizeField } from '../utils/sanitize.js';

export const updateWorkflowTool = {
  name: 'n8n_update_workflow',
  description: 'Update an existing n8n workflow. Requires confirm: true to execute.',
  schema: {
    workflowId: z.string().describe('The workflow ID to update'),
    name: z.string().optional().describe('New name for the workflow'),
    nodes: z.array(z.object({}).passthrough()).optional().describe('Updated node definitions'),
    connections: z.record(z.any()).optional().describe('Updated connections object'),
    settings: z.record(z.any()).optional().describe('Updated workflow settings'),
    confirm: z.boolean().default(false).describe('Set to true to execute. Without confirmation, shows a preview.'),
  },
  handler: async ({ workflowId, name, nodes, connections, settings, confirm }, client) => {
    const changes = [];
    if (name) changes.push(`name → "${name}"`);
    if (nodes) changes.push(`${nodes.length} nodes`);
    if (connections) changes.push('connections');
    if (settings) changes.push('settings');

    if (!confirm) {
      return {
        content: [{ type: 'text', text:
          `⚠️ This will UPDATE workflow "${workflowId}" with changes: ${changes.join(', ') || 'none specified'}. ` +
          `Call again with confirm: true to proceed.` }],
      };
    }

    const data = {};
    if (name) data.name = name;
    if (nodes) data.nodes = nodes;
    if (connections) data.connections = connections;
    if (settings) data.settings = settings;
    const result = await client.updateWorkflow(workflowId, data);
    return {
      content: [{ type: 'text', text: `✅ Updated workflow "${sanitizeField(result.name)}" (ID: ${sanitizeField(result.id)})` }],
    };
  },
};
