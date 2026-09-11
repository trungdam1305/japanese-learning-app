import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse } from '../../../../shared/types/api';
import type { JlptLevel } from '../../../auth/types';
import type { FlashcardDeck, FlashcardItem, MemoryStatus } from '../types';

export const flashcardApi = {
  getDeck: (level: JlptLevel) =>
    httpClient
      .get<ApiResponse<FlashcardDeck>>('/api/students/flashcards', { params: { level } })
      .then((res) => res.data.data),
  getProgress: () =>
    httpClient.get<ApiResponse<FlashcardDeck[]>>('/api/students/flashcards/progress').then((res) => res.data.data),
  markStatus: (vocabularyId: string, status: MemoryStatus) =>
    httpClient
      .put<ApiResponse<FlashcardItem>>(`/api/students/flashcards/${vocabularyId}`, { status })
      .then((res) => res.data.data),
};
