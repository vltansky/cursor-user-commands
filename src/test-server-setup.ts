import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Create a test server instance for integration testing
 * This mirrors the main server.ts configuration but returns the server instance
 */
export function createServer() {
  const server = new McpServer({
    name: 'cursor-user-commands',
    version: '0.1.0',
  });

  return server;
}
