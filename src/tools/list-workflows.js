import { z } from 'zod';
import { sanitizeField, UNTRUSTED_HEADER } from '../utils/sanitize.js';

export const listWorkflowsTool = {
  name: 'n8n_list_workflows',
  description: 'List all n8n workflows. Optionally filter by active status or limit results.',
  schema: {
    active: z.boolean().optional().describe('Filter by active status'),
    limit: z.number().optional().describe('Max number of workflows to return'),
  },
  handler: async ({ active, limit }, client) => {
    const result = await client.listWorkflows({ active, limit });
    const workflows = result.data || result;
    const summary = Array.isArray(workflows)
      ? workflows.map(w => `• [${sanitizeField(w.id)}] ${sanitizeField(w.name)} (active: ${w.active})`).join('\n')
      : JSON.stringify(workflows, null, 2);
    return {
      content: [{ type: 'text', text: UNTRUSTED_HEADER + (summary || 'No workflows found.') }],
    };
  },
};
