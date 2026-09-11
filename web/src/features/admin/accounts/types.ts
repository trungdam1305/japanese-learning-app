import type { JlptLevel } from '../../auth/types';

export type AccountStatus = 'ACTIVE' | 'LOCKED' | 'LOCKED_PENDING';

export interface StudentAccountView {
  id: string;
  username: string;
  fullName: string;
  email: string;
  currentLevel: JlptLevel;
  status: AccountStatus;
  quizSubscriptionExpiry: string | null;
  streakCount: number;
  rankPoints: number;
  createdAt: string;
}
