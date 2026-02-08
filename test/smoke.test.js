// Basic smoke test for the MCP server
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('avn-mcp-n8n smoke tests', () => {
  it('should have a package.json with correct fields', async () => {
    const pkg = await import('../package.json', { with: { type: 'json' } });
    assert.equal(pkg.default.name, 'avn-mcp-n8n');
    assert.equal(pkg.default.type, 'module');
    assert.ok(pkg.default.version);
  });

  it('should export main entry point', async () => {
    const index = await import('../src/index.js');
    assert.ok(index);
  });

  it('should export MCP server', async () => {
    const server = await import('../src/server.js');
    assert.ok(server);
  });

  it('should export n8n client', async () => {
    const client = await import('../src/client.js');
    assert.ok(client);
  });
});
