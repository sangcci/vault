export type NoteType = "Question" | "Phenomenon" | "Concept" | "Principle" | "Case" | "Heuristic";

export interface KnowledgeArchitectConfig {
  language: "ko";
  vault: {
    root: string;
  };
  notes: {
    requireCitation: boolean;
    requireVisualEvidence: boolean;
    requireSlideSeparator: boolean;
    folders: Record<NoteType, string>;
  };
  anki: {
    url: string;
    deckName: string;
    modelName: string;
  };
  obsidian: {
    command: string;
  };
}

export interface ValidationResult {
  ok: boolean;
  violations: string[];
}
