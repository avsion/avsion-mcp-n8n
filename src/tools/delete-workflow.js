import { z } from 'zod';

export const deleteWorkflowTool = {
  name: 'n8n_delete_workflow',
  description: 'Delete an n8n workflow. Requires confirm: true to execute. This action is irreversible.',
  schema: {
    workflowId: z.string().describe('The workflow ID to delete'),
    confirm: z.boolean().default(false).describe('Set to true to execute. Without confirmation, shows a preview.'),
  },
  handler: async ({ workflowId, confirm }, client) => {
    if (!confirm) {
      let info = '';
      try {
        const workflow = await client.getWorkflow(workflowId);
        info = ` ("${workflow.name}", active: ${workflow.active})`;
      } catch { /* ignore lookup failure */ }
      return {
        content: [{ type: 'text', text:
          `⚠️ This will PERMANENTLY DELETE workflow "${workflowId}"${info}. ` +
          `This action cannot be undone. Call again with confirm: true to proceed.` }],
      };
    }
    await client.deleteWorkflow(workflowId);
    return {
      content: [{ type: 'text', text: `✅ Deleted workflow "${workflowId}".` }],
    };
  },
};
