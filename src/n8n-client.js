export class N8nClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async request(method, path, body = undefined) {
    const url = `${this.baseUrl}/api/v1${path}`;
    const options = {
      method,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Accept': 'application/json',
      },
    };
    if (body !== undefined) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`n8n API ${method} ${path} failed (${res.status}): ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  // ── Read methods ──

  async listWorkflows({ active, limit } = {}) {
    const params = new URLSearchParams();
    if (active !== undefined) params.set('active', String(active));
    if (limit !== undefined) params.set('limit', String(limit));
    const qs = params.toString();
    return this.request('GET', `/workflows${qs ? '?' + qs : ''}`);
  }

  async getWorkflow(id) {
    return this.request('GET', `/workflows/${id}`);
  }

  async getExecutions({ workflowId, status, limit } = {}) {
    const params = new URLSearchParams();
    if (workflowId !== undefined) params.set('workflowId', String(workflowId));
    if (status !== undefined) params.set('status', status);
    if (limit !== undefined) params.set('limit', String(limit));
    const qs = params.toString();
    return this.request('GET', `/executions${qs ? '?' + qs : ''}`);
  }

  // ── Write methods ──

  async createWorkflow(data) {
    return this.request('POST', '/workflows', data);
  }

  async updateWorkflow(id, data) {
    return this.request('PATCH', `/workflows/${id}`, data);
  }

  async deleteWorkflow(id) {
    return this.request('DELETE', `/workflows/${id}`);
  }

  async activateWorkflow(id, active) {
    return this.request('PATCH', `/workflows/${id}`, { active });
  }

  async deleteExecution(id) {
    return this.request('DELETE', `/executions/${id}`);
  }
}
