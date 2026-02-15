import { z } from 'zod';

export const activateWorkflowTool = {
  name: 'n8n_activate_workflow',
  description: 'Activate or deactivate an n8n workflow. Requires confirm: true to execute.',
  schema: {
    workflowId: z.string().describe('The workflow ID'),
    active: z.boolean().describe('true to activate, false to deactivate'),
    confirm: z.boolean().default(false).describe('Set to true to execute. Without confirmation, shows a preview.'),
  },
  handler: async ({ workflowId, active, confirm }, client) => {
    const action = active ? 'ACTIVATE' : 'DEACTIVATE';
    if (!confirm) {
      let info = '';
      try {
        const workflow = await client.getWorkflow(workflowId);
        info = ` ("${workflow.name}", currently active: ${workflow.active})`;
      } catch { /* ignore lookup failure */ }
      return {
        content: [{ type: 'text', text:
          `⚠️ This will ${action} workflow "${workflowId}"${info}. ` +
          `Call again with confirm: true to proceed.` }],
      };
    }
    const result = await client.activateWorkflow(workflowId, active);
    return {
      content: [{ type: 'text', text: `✅ Workflow "${result.name}" (${workflowId}) is now ${active ? 'active' : 'inactive'}.` }],
    };
  },
};
