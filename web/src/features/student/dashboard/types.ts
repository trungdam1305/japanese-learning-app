import type { JlptLevel } from '../../auth/types';

export interface FlashcardProgressSummary {
  level: JlptLevel;
  totalCount: number;
  masteredCount: number;
  progressPercent: number;
}

export interface QuizStatsSummary {
  totalAttempts: number;
  averageScorePercentage: number;
  passRatePercentage: number;
}

export interface RecentAttempt {
  attemptId: string;
  examTemplateName: string;
  level: JlptLevel;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passed: boolean;
  submittedAt: string;
}

export interface WeakVocabularyItem {
  vocabularyId: string;
  word: string;
  meaning: string;
  level: JlptLevel;
  lastReviewedAt: string;
}

export interface DashboardSummary {
  streakCount: number;
  rankPoints: number;
  flashcardProgress: FlashcardProgressSummary[];
  quizStats: QuizStatsSummary;
  recentAttempts: RecentAttempt[];
  weakVocabulary: WeakVocabularyItem[];
}
