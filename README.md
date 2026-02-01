# avsion-mcp-n8n

MCP server enabling Claude Code to safely access and troubleshoot self-hosted n8n workflows via read-only tools.

## Overview

This project provides Model Context Protocol (MCP) integration between AI assistants (like Claude) and n8n workflow automation, enabling:
- Code maintenance and troubleshooting
- Workflow analysis and debugging
- Enhancement suggestions and improvements
- Read-only access to workflow configurations

## Setup

### Prerequisites

- n8n instance (self-hosted or cloud)
- GitHub account (for MCP server integration)
- VS Code with GitHub Copilot and MCP extensions

### Installation

1. Clone this repository:
```bash
git clone https://github.com/avsion/avsion-mcp-n8n.git
cd avn-mcp-n8n
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your n8n API credentials
```

3. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_AUTH_TOKEN` | Anthropic API authentication token | Yes |
| `ANTHROPIC_BASE_URL` | Anthropic API base URL | No |
| `API_TIMEOUT_MS` | API request timeout in milliseconds | No |
| `N8N_API_URL` | Your n8n instance URL | Yes |
| `N8N_API_KEY` | n8n API key for authentication | Yes |

### GitHub MCP Server

The project includes GitHub MCP server integration for:
- Reading repository code
- Creating and managing issues
- Pull request reviews
- Code search and analysis

## Usage

### With Claude Code

1. Open your project in VS Code
2. Ensure GitHub MCP server is configured
3. Ask Claude to:
   - Analyze workflows
   - Troubleshoot issues
   - Suggest improvements

### Direct API Access

```javascript
import { N8nMCPClient } from './src/client';

const client = new N8nMCPClient({
  apiUrl: process.env.N8N_API_URL,
  apiKey: process.env.N8N_API_KEY
});

// List workflows
const workflows = await client.listWorkflows();

// Get specific workflow
const workflow = await client.getWorkflow('workflow-id');
```

## Project Structure

```
avsion-mcp-n8n/
├── .env                  # Environment variables (not tracked)
├── .env.example          # Example environment configuration
├── .gitignore           # Git ignore rules
├── README.md            # This file
├── src/                 # Source code
├── workflows/           # n8n workflow definitions
└── docs/                # Documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: [@avsion](https://github.com/avsion)

## Acknowledgments

- [n8n](https://n8n.io) - Workflow automation platform
- [Anthropic](https://www.anthropic.com) - AI model provider
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
