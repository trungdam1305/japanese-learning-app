import type { JlptLevel } from '../../auth/types';

export interface ExamListItem {
  id: string;
  name: string;
  level: JlptLevel;
  category: string | null;
  numberOfQuestions: number;
  totalTimeMinutes: number;
  passingScorePercentage: number;
}

export interface AttemptQuestionView {
  questionId: string;
  questionText: string;
  options: string[];
  audioUrl: string | null;
  imageUrl: string | null;
}

export interface StartAttemptResult {
  attemptId: string;
  examTemplateName: string;
  totalTimeMinutes: number;
  questions: AttemptQuestionView[];
}

export interface AnswerSubmissionPayload {
  questionId: string;
  selectedAnswerIndex: number | null;
}

export interface AttemptQuestionReview extends AttemptQuestionView {
  correctAnswerIndex: number;
  selectedAnswerIndex: number | null;
  explanation: string | null;
}

export interface AttemptResult {
  attemptId: string;
  examTemplateName: string;
  level: JlptLevel;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  questions: AttemptQuestionReview[];
}

export interface AttemptHistoryItem {
  attemptId: string;
  examTemplateName: string;
  level: JlptLevel;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passed: boolean;
  submittedAt: string;
}

export interface ErrorNotebookItem {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string | null;
  wrongCount: number;
  lastWrongAt: string;
}
