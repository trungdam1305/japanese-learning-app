import type { JlptLevel } from '../../auth/types';

export type ExamTemplateStatus = 'ACTIVE' | 'INACTIVE';

export interface ExamTemplate {
  id: string;
  name: string;
  level: JlptLevel;
  category: string | null;
  numberOfQuestions: number;
  totalTimeMinutes: number;
  passingScorePercentage: number;
  shuffleQuestions: boolean;
  status: ExamTemplateStatus;
}

export interface ExamTemplatePayload {
  name: string;
  level: JlptLevel;
  category?: string;
  numberOfQuestions: number;
  totalTimeMinutes: number;
  passingScorePercentage: number;
  shuffleQuestions: boolean;
}
