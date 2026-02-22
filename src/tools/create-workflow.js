import { z } from 'zod';
import { sanitizeField } from '../utils/sanitize.js';

export const createWorkflowTool = {
  name: 'n8n_create_workflow',
  description: 'Create a new n8n workflow. Requires confirm: true to execute.',
  schema: {
    name: z.string().describe('Name for the new workflow'),
    nodes: z.array(z.object({}).passthrough()).optional().describe('Array of node definitions'),
    connections: z.record(z.any()).optional().describe('Node connections object'),
    confirm: z.boolean().default(false).describe('Set to true to execute. Without confirmation, shows a preview.'),
  },
  handler: async ({ name, nodes, connections, confirm }, client) => {
    if (!confirm) {
      const nodeCount = nodes ? nodes.length : 0;
      return {
        content: [{ type: 'text', text:
          `⚠️ This will CREATE a new workflow "${name}" with ${nodeCount} node(s). ` +
          `Call again with confirm: true to proceed.` }],
      };
    }
    const data = { name };
    if (nodes) data.nodes = nodes;
    if (connections) data.connections = connections;
    const result = await client.createWorkflow(data);
    return {
      content: [{ type: 'text', text: `✅ Created workflow "${sanitizeField(result.name)}" (ID: ${sanitizeField(result.id)})` }],
    };
  },
};
