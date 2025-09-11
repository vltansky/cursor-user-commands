# cursor-user-commands

An MCP server that exposes markdown files in `~/.cursor/commands/*.md` as prompts via the MCP `server/prompts` API.

[![Cursor Quick Install](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=cursor-user-commands&config=ewogICJjb21tYW5kIjogIm5weCIsCiAgImFyZ3MiOiBbCiAgICAiY3Vyc29yLXVzZXItY29tbWFuZHMiCiAgXQp9Cg==)

## Install

```bash
npm install -g cursor-user-commands
```

## Configure (Cursor or any MCP client)

Add to `~/.cursor/mcp.json` (or your client’s config):

```json
{
  "mcpServers": {
    "cursor-user-commands": {
      "command": "npx",
      "args": ["cursor-user-commands"]
    }
  }
}
```

## Usage

- Create markdown files under `~/.cursor/commands/` (e.g., `~/.cursor/commands/my-template.md`).
- Each file is exposed as a prompt named by its filename (without extension).
- Description is taken from the first `# Heading` or the first non-empty line.

Clients can call:

- `prompts/list` → returns all available prompt names and descriptions.
- `prompts/get` with `{ "name": "my-template" }` → returns a single `user` text message containing the file’s markdown.

## Add New Commands

Create or edit markdown files in your commands folder:

```bash
# Ensure the folder exists
mkdir -p ~/.cursor/commands

# Quick single-line example
echo '# Hello\nWrite a friendly greeting.' > ~/.cursor/commands/hello.md

# Or open the folder in Cursor (if the `cursor` CLI is available)
cursor ~/.cursor/commands
```

Notes:

- Files must have the `.md` extension to be recognized.
- Prompts are registered at server startup; after adding files, restart the server or reconnect the MCP client to refresh the list.

## Develop

```bash
yarn install
yarn build
yarn start
```

## Project Structure

```
src/
├── server.ts                  # Minimal MCP server setup
└── prompts/
    └── commands-prompts.ts    # Reads ~/.cursor/commands and registers prompts
```

## Publish

This package is ready for publishing:

- `prepublishOnly` builds and marks `dist/server.js` executable.
- Binary name: `cursor-user-commands`.
