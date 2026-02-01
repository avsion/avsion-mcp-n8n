# n8n MCP Client API Documentation

## N8nMCPClient

The main client class for interacting with n8n workflows.

### Constructor

```javascript
const client = new N8nMCPClient({
  apiUrl: 'https://your-n8n-instance.com',
  apiKey: 'your-api-key',
  timeout: 30000
});
```

### Methods

#### listWorkflows()

List all workflows in the n8n instance.

**Returns:** `Promise<Array>` - Array of workflow objects

**Example:**
```javascript
const workflows = await client.listWorkflows();
console.log(`Found ${workflows.length} workflows`);
```

#### getWorkflow(workflowId)

Get details of a specific workflow.

**Parameters:**
- `workflowId` (string) - The workflow ID

**Returns:** `Promise<Object>` - Workflow details

**Example:**
```javascript
const workflow = await client.getWorkflow('workflow-id');
console.log(`Workflow: ${workflow.name}`);
```

#### getWorkflowExecutions(workflowId, limit)

Get execution history for a workflow.

**Parameters:**
- `workflowId` (string) - The workflow ID
- `limit` (number) - Number of executions to return (default: 10)

**Returns:** `Promise<Array>` - Array of execution objects

**Example:**
```javascript
const executions = await client.getWorkflowExecutions('workflow-id', 50);
console.log(`Found ${executions.length} executions`);
```

#### validateWorkflow(workflowId)

Validate a workflow for common issues.

**Parameters:**
- `workflowId` (string) - The workflow ID

**Returns:** `Promise<Object>` - Validation result with issues and warnings

**Example:**
```javascript
const validation = await client.validateWorkflow('workflow-id');
if (validation.valid) {
  console.log('Workflow is valid!');
} else {
  console.log('Issues:', validation.issues);
}
```

## MCPServer

The MCP server that exposes tools for AI assistant interaction.

### Available Tools

| Tool | Description |
|------|-------------|
| `n8n_list_workflows` | List all workflows |
| `n8n_get_workflow` | Get workflow details by ID |
| `n8n_get_executions` | Get execution history |
| `n8n_validate_workflow` | Validate workflow configuration |
| `n8n_analyze_workflow` | Analyze workflow for optimization |

## Error Handling

All methods throw errors on failure. Always wrap in try-catch:

```javascript
try {
  const workflow = await client.getWorkflow('id');
} catch (error) {
  console.error('Error:', error.message);
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_API_URL` | Your n8n instance URL | Yes |
| `N8N_API_KEY` | n8n API key | Yes |
| `API_TIMEOUT_MS` | Request timeout in ms | No (default: 30000) |
