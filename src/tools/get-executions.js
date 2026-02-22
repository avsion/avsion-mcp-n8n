import { z } from 'zod';
import { sanitizeField, UNTRUSTED_HEADER } from '../utils/sanitize.js';

export const getExecutionsTool = {
  name: 'n8n_get_executions',
  description: 'Get execution history for n8n workflows. Optionally filter by workflow ID, status, or limit.',
  schema: {
    workflowId: z.string().optional().describe('Filter by workflow ID'),
    status: z.enum(['success', 'error', 'waiting', 'running']).optional().describe('Filter by execution status'),
    limit: z.number().optional().describe('Max number of executions to return'),
  },
  handler: async ({ workflowId, status, limit }, client) => {
    const result = await client.getExecutions({ workflowId, status, limit });
    const executions = result.data || result;
    const summary = Array.isArray(executions)
      ? executions.map(e =>
          `• [${sanitizeField(e.id)}] workflow:${sanitizeField(e.workflowId)} status:${sanitizeField(e.status)} ${sanitizeField(e.startedAt)}`
        ).join('\n')
      : JSON.stringify(executions, null, 2);
    return {
      content: [{ type: 'text', text: UNTRUSTED_HEADER + (summary || 'No executions found.') }],
    };
  },
};
