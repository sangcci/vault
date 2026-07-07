import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { KnowledgeArchitectConfig, NoteType, ValidationResult } from "./types";

const TYPE_BY_FOLDER: Array<{ folder: string; type: NoteType; tag: string; prefix?: string; numericPrefix?: boolean }> = [
  { folder: "01-Problem", type: "Problem", tag: "문제", numericPrefix: true },
  { folder: "02-Principle", type: "Principle", tag: "본질", prefix: "본질-" },
  { folder: "03-Question", type: "Question", tag: "탐구", prefix: "탐구-" },
];

function normalizePath(cwd: string, inputPath: string): string {
  return path.isAbsolute(inputPath) ? inputPath : path.join(cwd, inputPath);
}

function relativePath(cwd: string, absolutePath: string): string {
  return path.relative(cwd, absolutePath).split(path.sep).join("/");
}

function getNoteKind(cwd: string, inputPath: string) {
  const rel = relativePath(cwd, normalizePath(cwd, inputPath));
  return TYPE_BY_FOLDER.find((entry) => rel === entry.folder || rel.startsWith(`${entry.folder}/`));
}

function hasWikiLink(content: string): boolean {
  return /\[\[[^\]]+\]\]/.test(content);
}

function hasCitation(content: string): boolean {
  return />\s*"[^"]+"\s*—\s*\[[^\]]+\]\([^\)]+\)/.test(content) || /\[[^\]]+\]\(https?:\/\/[^\)]+\)/.test(content);
}

function hasVisualEvidence(content: string): boolean {
  const fenced = /```[\s\S]*?(->|→|↓|<-|←|if\s+|for\s+|while\s+|class\s+|function\s+|request|response)[\s\S]*?```/i.test(content);
  const asciiArrows = /(^|\n)\s*[^\n]*(->|→|↓|<-|←)[^\n]*(\n|$)/.test(content);
  return fenced || asciiArrows;
}

function hasSlideSeparator(content: string): boolean {
  const body = content.replace(/^---[\s\S]*?---\s*/, "");
  return /\n---\n/.test(body);
}

function requiredSections(type: NoteType): string[] {
  switch (type) {
    case "Problem":
      return ["## 상황", "## 관찰된 증거", "## 원인", "## 해결 방향", "## 연결되는 본질", "## 참고"];
    case "Principle":
      return ["**핵심 질문**:", "## 한 문장 정의", "## 판단 기준", "## 대표 문제", "## 참고"];
    case "Question":
      return ["## 핵심 질문", "## 파생 노트"];
  }
}

function validateFileName(baseName: string, kind: { folder: string; prefix?: string; numericPrefix?: boolean }): string | undefined {
  if (kind.numericPrefix) {
    if (!/^\d{2,}-/.test(baseName)) return `[Naming] ${kind.folder} 노트 파일명은 '01-', '02-' 같은 숫자 prefix로 시작해야 합니다.`;
    return undefined;
  }
  if (kind.prefix && !baseName.startsWith(kind.prefix)) {
    return `[Naming] ${kind.folder} 노트 파일명은 '${kind.prefix}' prefix로 시작해야 합니다.`;
  }
  return undefined;
}

export function validateKnowledgeNote(
  cwd: string,
  filePath: string,
  content: string,
  config: KnowledgeArchitectConfig,
): ValidationResult {
  const kind = getNoteKind(cwd, filePath);
  const violations: string[] = [];
  if (!kind) return { ok: true, violations };

  const baseName = path.basename(filePath);
  const namingViolation = validateFileName(baseName, kind);
  if (namingViolation) violations.push(namingViolation);

  if (!content.startsWith("---")) {
    violations.push("[YAML] 파일 최상단에 YAML frontmatter가 필요합니다.");
  }
  if (!content.includes(`type: ${kind.type}`)) {
    violations.push(`[YAML] type은 '${kind.type}'이어야 합니다.`);
  }
  if (!content.includes(`tags: [${kind.tag}`)) {
    violations.push(`[YAML] tags에 '${kind.tag}'가 포함되어야 합니다.`);
  }
  for (const section of requiredSections(kind.type)) {
    if (!content.includes(section)) {
      violations.push(`[Section] '${section}' 섹션이 필요합니다.`);
    }
  }

  if (config.notes.requireVisualEvidence && !hasVisualEvidence(content)) {
    violations.push("[Evidence] ASCII diagram 또는 pseudo code 같은 Visual/Logic Evidence가 필요합니다.");
  }
  if (!hasWikiLink(content)) {
    violations.push("[Reference] 관련 노트 wikilink([[...]])가 최소 1개 필요합니다.");
  }
  if (config.notes.requireSlideSeparator && !hasSlideSeparator(content)) {
    violations.push("[Slide] 주요 ## 섹션 사이에 slide separator '---'가 필요합니다.");
  }
  if (config.notes.requireCitation && !hasCitation(content)) {
    violations.push("[Citation] factual claim에는 출처 링크 또는 quote citation이 필요합니다.");
  }

  return { ok: violations.length === 0, violations };
}

function applyEditPreview(original: string, edits: Array<{ oldText: string; newText: string }>): string | undefined {
  let next = original;
  for (const edit of edits) {
    if (!edit.oldText || typeof edit.newText !== "string") return undefined;
    const first = next.indexOf(edit.oldText);
    if (first === -1 || next.indexOf(edit.oldText, first + edit.oldText.length) !== -1) {
      return undefined;
    }
    next = next.replace(edit.oldText, edit.newText);
  }
  return next;
}

export function registerNoteGuard(pi: ExtensionAPI, getConfig: () => KnowledgeArchitectConfig) {
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName !== "write" && event.toolName !== "edit") return undefined;

    const input = event.input as any;
    const filePath = input?.path;
    if (typeof filePath !== "string") return undefined;
    if (!getNoteKind(ctx.cwd, filePath)) return undefined;

    let previewContent: string | undefined;
    if (event.toolName === "write") {
      previewContent = typeof input.content === "string" ? input.content : undefined;
    } else {
      const absolutePath = normalizePath(ctx.cwd, filePath);
      if (!fs.existsSync(absolutePath)) {
        return { block: true, reason: `[Knowledge Architect] edit 대상 파일이 없습니다: ${filePath}` };
      }
      const original = fs.readFileSync(absolutePath, "utf8");
      previewContent = applyEditPreview(original, Array.isArray(input.edits) ? input.edits : []);
      if (previewContent === undefined) {
        return {
          block: true,
          reason: "[Knowledge Architect] edit preview를 만들 수 없습니다. oldText가 유일하게 매칭되는지 확인하세요.",
        };
      }
    }

    if (previewContent === undefined) return undefined;
    const result = validateKnowledgeNote(ctx.cwd, filePath, previewContent, getConfig());
    if (!result.ok) {
      const reason = `[Knowledge Architect] 노트 규칙 위반:\n${result.violations.map((v) => `- ${v}`).join("\n")}`;
      if (ctx.hasUI) ctx.ui.notify("Knowledge note validation failed", "warning");
      return { block: true, reason };
    }

    return undefined;
  });
}
