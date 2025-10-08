const MCP_PORT = process.env.MCP_PORT || 8330;
const MCP_ENABLED = process.env.MCP_ENABLED === 'true' || true;

export { MCP_PORT, MCP_ENABLED };