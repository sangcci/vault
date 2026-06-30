import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type { KnowledgeArchitectConfig } from "./types";

const CARD_PARAMS = Type.Object({
  question: Type.String({ description: "Term name only" }),
  answer: Type.String({ description: "HTML one-line Korean noun-phrase definition" }),
  type: Type.Union([
    Type.Literal("Concept"),
    Type.Literal("Principle"),
    Type.Literal("Phenomenon"),
    Type.Literal("Evidence"),
  ]),
  category: Type.String({ description: "Short domain label, e.g. DB, Java, Spring, Network" }),
  difficulty: Type.Union([Type.Literal("Low"), Type.Literal("Medium"), Type.Literal("High")]),
  code: Type.String({ description: "Korean ASCII diagram or pseudocode" }),
  relatedConcepts: Type.Optional(Type.String({ description: "Comma-separated Korean principle names only" })),
  image: Type.Optional(Type.String({ description: "Optional image field" })),
});

function hasBadEnding(answer: string): boolean {
  return /(입니다|합니다|한다|이다)/.test(answer);
}

function hasMechanism(code: string): boolean {
  return /(->|→|↓|<-|←|if\s+|for\s+|while\s+|request|response|상태|흐름)/i.test(code);
}

function noteExistsForCard(cwd: string, type: string, question: string): boolean {
  const candidates: Record<string, string[]> = {
    Concept: ["03-Concept"],
    Principle: ["04-Principle"],
    Phenomenon: ["02-Phenomenon"],
  };
  const folders = candidates[type] ?? [];
  const lowerQuestion = question.toLowerCase();

  for (const folder of folders) {
    const dir = path.join(cwd, folder);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
    if (files.some((file) => file.toLowerCase().includes(lowerQuestion))) return true;

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), "utf8").toLowerCase();
      if (content.includes(lowerQuestion)) return true;
    }
  }
  return type === "Evidence";
}

function validateCard(params: any, config: KnowledgeArchitectConfig, cwd: string): string[] {
  const violations: string[] = [];
  if (!params.question?.trim()) violations.push("Question은 용어명으로 필수입니다.");
  if ((params.question ?? "").includes("?")) violations.push("Question은 질문문이 아니라 용어명이어야 합니다.");
  if (!params.answer?.trim()) violations.push("Answer는 필수입니다.");
  if (hasBadEnding(params.answer ?? "")) violations.push("Answer는 '~입니다/합니다/한다/이다' 대신 한 줄 명사구를 사용하세요.");
  if (!params.code?.trim()) violations.push("Code는 항상 필수입니다.");
  if (params.code && !hasMechanism(params.code)) violations.push("Code에는 mechanism/contrast/failure mode를 보여주는 ASCII 흐름이 필요합니다.");
  if (!noteExistsForCard(cwd, params.type, params.question)) {
    violations.push(`${params.type} 카드 생성 전 대응 Obsidian 노트가 존재해야 합니다.`);
  }
  if (config.anki.deckName !== "💻::Keyword") {
    violations.push("현재 extension은 💻::Keyword 단일 덱만 지원합니다.");
  }
  return violations;
}

function preview(params: any, config: KnowledgeArchitectConfig): string {
  return [
    `Deck: ${config.anki.deckName}`,
    `Model: ${config.anki.modelName}`,
    `Question: ${params.question}`,
    `Answer: ${params.answer}`,
    `Type: ${params.type}`,
    `Category: ${params.category}`,
    `Difficulty: ${params.difficulty}`,
    `Code:\n${params.code}`,
    `RelatedConcepts: ${params.relatedConcepts ?? ""}`,
  ].join("\n");
}

export function registerAnkiTool(pi: ExtensionAPI, getConfig: () => KnowledgeArchitectConfig) {
  pi.registerTool({
    name: "anki_add_keyword_card",
    label: "Anki Add Keyword Card",
    description: "Validate and add a Korean Keyword card to Anki via AnkiConnect after explicit user approval.",
    promptSnippet: "Create validated Korean Keyword cards in Anki after showing preview and receiving user approval.",
    promptGuidelines: [
      "Use anki_add_keyword_card instead of raw curl calls to AnkiConnect.",
      "Before calling anki_add_keyword_card, summarize the card preview for the user and wait for explicit approval.",
    ],
    parameters: CARD_PARAMS,
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const config = getConfig();
      const violations = validateCard(params, config, ctx.cwd);
      if (violations.length > 0) {
        return {
          isError: true,
          content: [{ type: "text", text: `[ANKI CARD BLOCKED]\n${violations.map((v) => `- ${v}`).join("\n")}` }],
          details: { violations },
        };
      }

      const cardPreview = preview(params, config);
      if (!ctx.hasUI) {
        return {
          isError: true,
          content: [{ type: "text", text: `[ANKI CARD BLOCKED]\nUI가 없어 사용자 승인을 받을 수 없습니다.\n\n${cardPreview}` }],
          details: { preview: cardPreview },
        };
      }

      const ok = await ctx.ui.confirm("Create Anki keyword card?", cardPreview);
      if (!ok) {
        return {
          isError: true,
          content: [{ type: "text", text: "사용자가 Anki 카드 생성을 취소했습니다." }],
          details: { cancelled: true, preview: cardPreview },
        };
      }

      const payload = {
        action: "addNote",
        version: 6,
        params: {
          note: {
            deckName: config.anki.deckName,
            modelName: config.anki.modelName,
            fields: {
              Question: params.question,
              Answer: params.answer,
              Type: params.type,
              Category: params.category,
              Difficulty: params.difficulty,
              Code: params.code,
              RelatedConcepts: params.relatedConcepts ?? "",
              Image: params.image ?? "",
            },
            options: { allowDuplicate: false },
          },
        },
      };

      const response = await fetch(config.anki.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const text = JSON.stringify(result, null, 2);
      return {
        isError: Boolean((result as any).error),
        content: [{ type: "text", text }],
        details: { result, preview: cardPreview },
      };
    },
  });
}
