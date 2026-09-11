import type { JlptLevel } from '../../auth/types';

export interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  level: JlptLevel;
  audioUrl: string | null;
  exampleSentence: string | null;
}

export interface VocabularyPayload {
  word: string;
  meaning: string;
  level: JlptLevel;
  audioUrl?: string;
  exampleSentence?: string;
}

export interface ImportRowError {
  row: number;
  message: string;
}

export interface ImportPreview {
  totalRows: number;
  previewRows: VocabularyPayload[];
  errors: ImportRowError[];
}

export interface ImportResult {
  totalRows: number;
  insertedCount: number;
  failedCount: number;
  errors: ImportRowError[];
}
