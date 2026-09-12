import type { JlptLevel } from '../../auth/types';

export type QuestionStatus = 'ACTIVE' | 'INACTIVE';

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string | null;
  level: JlptLevel;
  category: string;
  audioUrl: string | null;
  imageUrl: string | null;
  status: QuestionStatus;
}

export interface QuestionPayload {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  level: JlptLevel;
  category: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface ImportRowError {
  row: number;
  message: string;
}

export interface ImportPreview {
  totalRows: number;
  previewRows: QuestionPayload[];
  errors: ImportRowError[];
}

export interface ImportResult {
  totalRows: number;
  insertedCount: number;
  failedCount: number;
  errors: ImportRowError[];
}
