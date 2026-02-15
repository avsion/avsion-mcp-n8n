import { z } from 'zod';

export const getWorkflowTool = {
  name: 'n8n_get_workflow',
  description: 'Get full details of an n8n workflow by ID, including nodes and connections.',
  schema: {
    workflowId: z.string().describe('The workflow ID'),
  },
  handler: async ({ workflowId }, client) => {
    const workflow = await client.getWorkflow(workflowId);
    return {
      content: [{ type: 'text', text: JSON.stringify(workflow, null, 2) }],
    };
  },
};
