import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type { KnowledgeArchitectConfig } from "./types";

const execFileAsync = promisify(execFile);

async function runObsidian(config: KnowledgeArchitectConfig, args: string[], cwd: string) {
  const { stdout, stderr } = await execFileAsync(config.obsidian.command, args, {
    cwd,
    maxBuffer: 1024 * 1024 * 10,
  });
  return { stdout, stderr };
}

export function registerObsidianTools(pi: ExtensionAPI, getConfig: () => KnowledgeArchitectConfig) {
  pi.registerTool({
    name: "obsidian_search_notes",
    label: "Obsidian Search Notes",
    description: "Search the current Obsidian vault for duplicate or related knowledge notes.",
    promptSnippet: "Search Obsidian vault filenames, aliases, and body text before proposing knowledge note creation.",
    promptGuidelines: [
      "Use obsidian_search_notes before proposing CREATE for a knowledge note in this vault.",
      "Use obsidian_search_context when a search result needs surrounding context before deciding UPDATE or SKIP.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "Core Korean or English keyword to search" }),
      path: Type.Optional(Type.String({ description: "Optional folder scope, e.g. 03-Concept" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const args = ["search", `query=${params.query}`, "format=json"];
      if (params.path) args.push(`path=${params.path}`);
      const { stdout, stderr } = await runObsidian(getConfig(), args, ctx.cwd);
      return {
        content: [{ type: "text", text: stdout || stderr || "No output" }],
        details: { args, stderr },
      };
    },
  });

  pi.registerTool({
    name: "obsidian_search_context",
    label: "Obsidian Search Context",
    description: "Search the current Obsidian vault and return matched context snippets.",
    promptSnippet: "Inspect Obsidian search result context before choosing UPDATE, SKIP, or CREATE.",
    parameters: Type.Object({
      query: Type.String({ description: "Keyword to inspect with context" }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const args = ["search:context", `query=${params.query}`, "format=json"];
      const { stdout, stderr } = await runObsidian(getConfig(), args, ctx.cwd);
      return {
        content: [{ type: "text", text: stdout || stderr || "No output" }],
        details: { args, stderr },
      };
    },
  });
}
