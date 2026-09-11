import type { JlptLevel } from '../../auth/types';

export interface StudentProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  currentLevel: JlptLevel;
  quizSubscriptionExpiry: string | null;
  streakCount: number;
  rankPoints: number;
}

export interface UpdateProfilePayload {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  currentLevel?: JlptLevel;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
