
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.info("MCP Client initialized...");

const client = new Client(
    {
        name: "mcp-client",
        version: "1.0.0",
    },
    {
        capabilities: {
        tools: {},
        },
    }
);

async function connectLocalMCPServer() {
    const serverPath = path.resolve(__dirname, '../../mcp-server/server.js'); // Adjust the path as necessary
    const transport = new StdioClientTransport({
        command: 'node',
        args: [serverPath],
    });

    await client.connect(transport);
    return client;
}

async function getTools(name = []) {
    const response = await client.listTools();
    
    const tools = name.length === 0 ? response.tools : response.tools.filter(tool => name.includes(tool.name));
    
    // Transform MCP tool format to OpenAI function calling format if needed
    return tools.map(tool => {
        // If inputSchema exists, use it as parameters; otherwise keep original
        if (tool.inputSchema) {
            return {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema
            };
        }
        return tool;
    });
}

async function callTool(toolName, parameters = {}) {
    
    try {
        const response = await client.callTool({
            name: toolName,
            arguments: parameters,
        });
        
        return response;
    } catch (error) {
        console.error("Error calling tool:", error);
        throw error;
    }
}

export { connectLocalMCPServer, getTools, callTool };