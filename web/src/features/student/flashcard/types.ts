import type { JlptLevel } from '../../auth/types';

export type MemoryStatus = 'MASTERED' | 'NOT_MASTERED';

export interface FlashcardItem {
  vocabularyId: string;
  word: string;
  meaning: string;
  level: JlptLevel;
  audioUrl: string | null;
  exampleSentence: string | null;
  memoryStatus: MemoryStatus | null;
}

export interface FlashcardDeck {
  level: JlptLevel;
  totalCount: number;
  masteredCount: number;
  progressPercent: number;
  cards: FlashcardItem[];
}
