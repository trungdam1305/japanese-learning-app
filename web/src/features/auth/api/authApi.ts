import { httpClient } from '../../../shared/api/httpClient';
import type { ApiResponse } from '../../../shared/types/api';
import type { AuthResponseDto, LoginPayload, RegisterPayload } from '../types';

export const authApi = {
  login: (payload: LoginPayload) =>
    httpClient
      .post<ApiResponse<AuthResponseDto>>('/api/auth/login', payload)
      .then((res) => res.data.data),
  register: (payload: RegisterPayload) =>
    httpClient
      .post<ApiResponse<AuthResponseDto>>('/api/auth/register', payload)
      .then((res) => res.data.data),
};
