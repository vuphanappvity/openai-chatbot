import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerWorkspacesTool } from './tools/workspaces.tool.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerUsersTool } from './tools/users.tool.js';
import { registerVectorKnowledgeTool } from './tools/vectorKnowledge.tool.js';

const server = new McpServer({
	name: '360-aware-mcp-server',
	version: '1.0.0',
});

/**
 * Register available tool and handle tool calls
 */
registerWorkspacesTool(server);
registerUsersTool(server);
registerVectorKnowledgeTool(server);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.info('360Aware MCP Server running on stdio');
}

main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
