#!/usr/bin/env node

/**
 * GitHub MCP Server
 * Provides tools for interacting with GitHub API
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE = 'https://api.github.com';

// Create MCP server
const server = new Server(
  {
    name: 'github-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Make authenticated request to GitHub API
 */
async function githubRequest(endpoint, options = {}) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'github-mcp-server',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${error}`);
  }

  return response.json();
}

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_user',
        description: 'Get authenticated user profile information',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_repo',
        description: 'Get repository information',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner (username or organization)',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'list_repos',
        description: 'List repositories for the authenticated user or an organization',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Repository type to return: all, owner, member. Default: owner',
              enum: ['all', 'owner', 'member'],
            },
            visibility: {
              type: 'string',
              description: 'Visibility filter: all, public, private. Default: all',
              enum: ['all', 'public', 'private'],
            },
            limit: {
              type: 'number',
              description: 'Maximum number of repositories to return (default: 30, max: 100)',
            },
          },
        },
      },
      {
        name: 'get_issues',
        description: 'Get issues for a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            state: {
              type: 'string',
              description: 'Issue state: open, closed, or all',
              enum: ['open', 'closed', 'all'],
            },
            limit: {
              type: 'number',
              description: 'Maximum number of issues to return (default: 20, max: 100)',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'get_pull_requests',
        description: 'Get pull requests for a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            state: {
              type: 'string',
              description: 'PR state: open, closed, or all',
              enum: ['open', 'closed', 'all'],
            },
            limit: {
              type: 'number',
              description: 'Maximum number of PRs to return (default: 20, max: 100)',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'get_file',
        description: 'Get file content from a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            path: {
              type: 'string',
              description: 'File path in the repository',
            },
            branch: {
              type: 'string',
              description: 'Branch name (default: default branch)',
            },
          },
          required: ['owner', 'repo', 'path'],
        },
      },
      {
        name: 'search_code',
        description: 'Search for code across repositories',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "useState in:file language:js")',
            },
            limit: {
              type: 'number',
              description: 'Maximum results (default: 10, max: 100)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_branches',
        description: 'List branches in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            protectedOnly: {
              type: 'boolean',
              description: 'Filter for protected branches only',
            },
            limit: {
              type: 'number',
              description: 'Maximum branches to return (default: 30, max: 100)',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'get_commit',
        description: 'Get a specific commit from a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            ref: {
              type: 'string',
              description: 'Commit SHA or branch/tag name',
            },
          },
          required: ['owner', 'repo', 'ref'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_user': {
        const user = await githubRequest('/user');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      }

      case 'get_repo': {
        const { owner, repo } = args;
        const repository = await githubRequest(`/repos/${owner}/${repo}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(repository, null, 2),
            },
          ],
        };
      }

      case 'list_repos': {
        const { type = 'owner', visibility = 'all', limit = 30 } = args;
        const perPage = Math.min(limit, 100);
        const repos = await githubRequest(
          `/user/repos?type=${type}&visibility=${visibility}&per_page=${perPage}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(repos, null, 2),
            },
          ],
        };
      }

      case 'get_issues': {
        const { owner, repo, state = 'open', limit = 20 } = args;
        const perPage = Math.min(limit, 100);
        const issues = await githubRequest(
          `/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issues, null, 2),
            },
          ],
        };
      }

      case 'get_pull_requests': {
        const { owner, repo, state = 'open', limit = 20 } = args;
        const perPage = Math.min(limit, 100);
        const prs = await githubRequest(
          `/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(prs, null, 2),
            },
          ],
        };
      }

      case 'get_file': {
        const { owner, repo, path, branch } = args;
        const queryParams = branch ? `?ref=${branch}` : '';
        const file = await githubRequest(
          `/repos/${owner}/${repo}/contents/${path}${queryParams}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(file, null, 2),
            },
          ],
        };
      }

      case 'search_code': {
        const { query, limit = 10 } = args;
        const perPage = Math.min(limit, 100);
        const results = await githubRequest(
          `/search/code?q=${encodeURIComponent(query)}&per_page=${perPage}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_branches': {
        const { owner, repo, protected: protectedOnly, limit = 30 } = args;
        const perPage = Math.min(limit, 100);
        const protectedParam = protectedOnly ? '&protected=1' : '';
        const branches = await githubRequest(
          `/repos/${owner}/${repo}/branches?per_page=${perPage}${protectedParam}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(branches, null, 2),
            },
          ],
        };
      }

      case 'get_commit': {
        const { owner, repo, ref } = args;
        const commit = await githubRequest(`/repos/${owner}/${repo}/commits/${ref}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(commit, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  if (!GITHUB_TOKEN) {
    console.error('Error: GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error starting GitHub MCP server:', error);
  process.exit(1);
});
