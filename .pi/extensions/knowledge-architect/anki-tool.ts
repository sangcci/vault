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
  code: Type.String({ description: "Korean ASCII diagram or pseudocode" }),
  relatedConcepts: Type.Optional(Type.String({ description: "Comma-separated Korean principle names only" })),
});

const KEYWORD_MODEL_EXPORT = [".anki", "models", "keyword-current.json"];
const KEYWORD_CARD_TAG = "ka_keyword_keep";

function hasBadEnding(answer: string): boolean {
  return /(입니다|합니다|한다|이다)/.test(answer);
}

function hasMechanism(code: string): boolean {
  return /(->|→|↓|<-|←|if\s+|for\s+|while\s+|request|response|상태|흐름)/i.test(code);
}

function noteExistsForCard(cwd: string, type: string, question: string): boolean {
  const candidates: Record<string, string[]> = {
    Concept: ["02-Principle", "01-Problem"],
    Principle: ["02-Principle"],
    Phenomenon: ["01-Problem"],
    Evidence: ["01-Problem", "02-Principle"],
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

function loadExpectedKeywordFields(cwd: string, modelName: string): string[] | undefined {
  const modelPath = path.join(cwd, ...KEYWORD_MODEL_EXPORT);
  if (!fs.existsSync(modelPath)) return undefined;

  try {
    const model = JSON.parse(fs.readFileSync(modelPath, "utf8")) as { modelName?: unknown; fields?: unknown };
    if (model.modelName !== modelName || !Array.isArray(model.fields) || !model.fields.every((field) => typeof field === "string")) {
      return undefined;
    }
    return model.fields;
  } catch {
    return undefined;
  }
}

async function validateKeywordModelSchema(config: KnowledgeArchitectConfig, cwd: string): Promise<string | undefined> {
  const expectedFields = loadExpectedKeywordFields(cwd, config.anki.modelName);
  if (!expectedFields) {
    return `[Anki] ${KEYWORD_MODEL_EXPORT.join("/")}에서 '${config.anki.modelName}' 모델 필드를 읽을 수 없습니다.`;
  }

  const response = await fetch(config.anki.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "modelFieldNames",
      version: 6,
      params: { modelName: config.anki.modelName },
    }),
  });
  const result = await response.json() as { result?: unknown; error?: unknown };
  const actualFields = result.result;
  if (result.error || !Array.isArray(actualFields) || !actualFields.every((field) => typeof field === "string")) {
    return `[Anki] '${config.anki.modelName}'의 필드 목록을 조회하지 못했습니다: ${String(result.error ?? "invalid response")}`;
  }

  if (expectedFields.join("\u0000") !== actualFields.join("\u0000")) {
    return `[Anki] 모델 필드가 .anki export와 다릅니다. expected=${expectedFields.join(", ")}; actual=${actualFields.join(", ")}`;
  }
  return undefined;
}

function preview(params: any, config: KnowledgeArchitectConfig): string {
  return [
    `Deck: ${config.anki.deckName}`,
    `Model: ${config.anki.modelName}`,
    `Question: ${params.question}`,
    `Answer: ${params.answer}`,
    `SourceNoteType: ${params.type} (Obsidian 검증용, Anki에 저장하지 않음)`,
    `Category: ${params.category}`,
    `Code:\n${params.code}`,
    `RelatedConcepts: ${params.relatedConcepts ?? ""}`,
    `Tags: ${KEYWORD_CARD_TAG}`,
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

      const schemaViolation = await validateKeywordModelSchema(config, ctx.cwd);
      if (schemaViolation) {
        return {
          isError: true,
          content: [{ type: "text", text: `[ANKI CARD BLOCKED]\n- ${schemaViolation}` }],
          details: { schemaViolation },
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
              Category: params.category,
              Code: params.code,
              RelatedConcepts: params.relatedConcepts ?? "",
            },
            tags: [KEYWORD_CARD_TAG],
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
