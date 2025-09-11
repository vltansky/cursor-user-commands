#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerCommandsPrompts } from './prompts/commands-prompts.js';

const server = new McpServer({ name: 'cursor-user-commands', version: '0.1.0' });

// Register prompt handlers before connecting so capabilities are advertised
await registerCommandsPrompts(server);

const transport = new StdioServerTransport();
await server.connect(transport);
