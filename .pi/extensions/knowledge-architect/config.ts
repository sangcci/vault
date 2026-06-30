import * as fs from "node:fs";
import * as path from "node:path";
import type { KnowledgeArchitectConfig } from "./types";

export const DEFAULT_CONFIG: KnowledgeArchitectConfig = {
  language: "ko",
  vault: {
    root: ".",
  },
  notes: {
    requireCitation: true,
    requireVisualEvidence: true,
    requireSlideSeparator: true,
    folders: {
      Question: "01-Question",
      Phenomenon: "02-Phenomenon",
      Concept: "03-Concept",
      Principle: "04-Principle",
      Case: "05-Case",
      Heuristic: "06-Heuristic",
    },
  },
  anki: {
    url: "http://localhost:8765",
    deckName: "💻::Keyword",
    modelName: "🧑🏻‍💻 Interview v2",
  },
  obsidian: {
    command: "obsidian",
  },
};

function mergeConfig(base: KnowledgeArchitectConfig, patch: Partial<KnowledgeArchitectConfig>): KnowledgeArchitectConfig {
  return {
    ...base,
    ...patch,
    vault: { ...base.vault, ...(patch.vault ?? {}) },
    notes: {
      ...base.notes,
      ...(patch.notes ?? {}),
      folders: { ...base.notes.folders, ...(patch.notes?.folders ?? {}) },
    },
    anki: { ...base.anki, ...(patch.anki ?? {}) },
    obsidian: { ...base.obsidian, ...(patch.obsidian ?? {}) },
  };
}

export function loadConfig(cwd: string): KnowledgeArchitectConfig {
  const candidates = [
    path.join(cwd, ".pi", "knowledge-architect.json"),
    path.join(cwd, "knowledge-architect.json"),
  ];

  let config = DEFAULT_CONFIG;
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    try {
      const patch = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<KnowledgeArchitectConfig>;
      config = mergeConfig(config, patch);
    } catch (error) {
      // 설정 파일 오류가 extension 전체 로드를 막지 않도록 기본값으로 계속 진행한다.
      console.warn(`[knowledge-architect] failed to read config: ${file}`, error);
    }
  }
  return config;
}
