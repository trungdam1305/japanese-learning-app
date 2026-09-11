import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse } from '../../../../shared/types/api';
import type { ChangePasswordPayload, StudentProfile, UpdateProfilePayload } from '../types';

export const studentProfileApi = {
  getMe: () => httpClient.get<ApiResponse<StudentProfile>>('/api/students/me').then((res) => res.data.data),
  updateMe: (payload: UpdateProfilePayload) =>
    httpClient.put<ApiResponse<StudentProfile>>('/api/students/me', payload).then((res) => res.data.data),
  changePassword: (payload: ChangePasswordPayload) =>
    httpClient.put<ApiResponse<null>>('/api/students/me/password', payload).then((res) => res.data),
};
