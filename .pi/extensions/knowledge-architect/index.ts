import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { loadConfig } from "./config";
import type { KnowledgeArchitectConfig } from "./types";
import { KNOWLEDGE_ARCHITECT_RULES } from "./rules";
import { registerNoteGuard } from "./note-guard";
import { registerAnkiTool } from "./anki-tool";
import { registerObsidianTools } from "./obsidian-tool";

export default function knowledgeArchitectExtension(pi: ExtensionAPI) {
  let config: KnowledgeArchitectConfig | undefined;
  const getConfig = () => {
    if (!config) throw new Error("Knowledge Architect config is not loaded yet.");
    return config;
  };

  pi.on("session_start", (_event, ctx) => {
    config = loadConfig(ctx.cwd);
    if (ctx.hasUI) {
      ctx.ui.setStatus("knowledge-architect", "KA:on");
      ctx.ui.notify("Knowledge Architect extension loaded for this vault.", "info");
    }
  });

  pi.on("before_agent_start", async (event) => {
    return {
      systemPrompt: `${event.systemPrompt}\n\n${KNOWLEDGE_ARCHITECT_RULES}`,
    };
  });

  pi.registerCommand("knowledge-architect-status", {
    description: "Show Knowledge Architect extension status and loaded config.",
    handler: async (_args, ctx) => {
      config = loadConfig(ctx.cwd);
      ctx.ui.notify(JSON.stringify(config, null, 2), "info");
    },
  });

  registerNoteGuard(pi, getConfig);
  registerAnkiTool(pi, getConfig);
  registerObsidianTools(pi, getConfig);
}
