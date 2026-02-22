import { z } from 'zod';
import { sanitizeField, UNTRUSTED_HEADER } from '../utils/sanitize.js';

export const analyzeWorkflowTool = {
  name: 'n8n_analyze_workflow',
  description: 'Analyze an n8n workflow for optimization opportunities. Provides suggestions for performance, reliability, and best practices.',
  schema: {
    workflowId: z.string().describe('The workflow ID to analyze'),
  },
  handler: async ({ workflowId }, client) => {
    const workflow = await client.getWorkflow(workflowId);
    const suggestions = [];
    const nodes = workflow.nodes || [];

    if (nodes.length > 20) {
      suggestions.push('📊 Large workflow (>20 nodes). Consider splitting into sub-workflows for maintainability.');
    }

    const hasErrorTrigger = nodes.some(n => (n.type || '').toLowerCase().includes('errortrigger'));
    if (!hasErrorTrigger && nodes.length > 3) {
      suggestions.push('🛡️ No Error Trigger node. Consider adding one for error notifications.');
    }

    const httpNodes = nodes.filter(n => {
      const t = (n.type || '').toLowerCase();
      return t.includes('httprequest') || t.includes('http request');
    });
    for (const node of httpNodes) {
      const retryEnabled = node.parameters?.options?.retry || node.retryOnFail;
      if (!retryEnabled) {
        suggestions.push(`🔄 HTTP node "${sanitizeField(node.name)}" has no retry configuration. Consider enabling retries for resilience.`);
      }
    }

    const setNodes = nodes.filter(n => (n.type || '').toLowerCase().includes('set'));
    if (setNodes.length > 3) {
      suggestions.push(`📝 ${setNodes.length} Set nodes found. Consider consolidating to reduce complexity.`);
    }

    const waitNodes = nodes.filter(n => (n.type || '').toLowerCase().includes('wait'));
    if (waitNodes.length > 0) {
      suggestions.push(`⏱️ ${waitNodes.length} Wait node(s) found. Long waits keep executions open and use resources.`);
    }

    if (!workflow.settings?.executionOrder) {
      suggestions.push('⚙️ No explicit execution order set. Consider setting to "v1" for predictable node execution.');
    }

    const text = suggestions.length > 0
      ? `Analysis for workflow "${sanitizeField(workflow.name)}" (${workflowId}):\n\n${suggestions.join('\n')}`
      : `✅ Workflow "${sanitizeField(workflow.name)}" (${workflowId}) looks well-optimized. No suggestions.`;

    return { content: [{ type: 'text', text: UNTRUSTED_HEADER + text }] };
  },
};
