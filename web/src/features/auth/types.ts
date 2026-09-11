import type { Role } from '../../shared/auth/authStore';

export type JlptLevel = 'N5' | 'N4';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  username: string;
  password: string;
  initialLevel: JlptLevel;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  fullName: string;
  role: Role;
}
