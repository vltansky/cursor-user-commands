import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import os from 'os';

type PromptDescriptor = {
  name: string;
  description?: string;
  filePath: string;
};

const COMMANDS_DIR = path.join(os.homedir(), '.cursor', 'commands');

async function listMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
      .map((e) => path.join(dir, e.name));
  } catch {
    return [];
  }
}

async function readFileSafe(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, 'utf8');
  } catch {
    return null;
  }
}

function extractDescription(markdown: string): string | undefined {
  const lines = markdown.split(/\r?\n/);
  // Prefer first ATX heading as description, else first non-empty line
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) {
      // Remove leading #'s and whitespace
      return trimmed.replace(/^#+\s*/, '').trim() || undefined;
    }
    // Otherwise use first non-empty text
    return trimmed;
  }
  return undefined;
}

async function discoverPrompts(): Promise<PromptDescriptor[]> {
  const files = await listMarkdownFiles(COMMANDS_DIR);
  files.sort((a, b) => a.localeCompare(b));
  const descriptors: PromptDescriptor[] = [];
  for (const filePath of files) {
    const base = path.basename(filePath, path.extname(filePath));
    const content = await readFileSafe(filePath);
    const description = content ? extractDescription(content) : undefined;
    descriptors.push({ name: base, description, filePath });
  }
  return descriptors;
}

export async function registerCommandsPrompts(server: McpServer) {
  const prompts = await discoverPrompts();

  for (const p of prompts) {
    server.registerPrompt(
      p.name,
      {
        title: p.name,
        description: p.description,
      },
      async () => {
        const content = await readFileSafe(p.filePath);
        if (content == null) {
          throw new Error(`Failed to read prompt file: ${p.filePath}`);
        }
        return {
          description: p.description,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: content,
              },
            },
          ],
        };
      }
    );
  }
}
