import { z } from 'zod';

export const deleteExecutionTool = {
  name: 'n8n_delete_execution',
  description: 'Delete an n8n execution record. Requires confirm: true to execute.',
  schema: {
    executionId: z.string().describe('The execution ID to delete'),
    confirm: z.boolean().default(false).describe('Set to true to execute. Without confirmation, shows a preview.'),
  },
  handler: async ({ executionId, confirm }, client) => {
    if (!confirm) {
      return {
        content: [{ type: 'text', text:
          `⚠️ This will DELETE execution record "${executionId}". ` +
          `Call again with confirm: true to proceed.` }],
      };
    }
    await client.deleteExecution(executionId);
    return {
      content: [{ type: 'text', text: `✅ Deleted execution "${executionId}".` }],
    };
  },
};
