import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse, PageResponse } from '../../../../shared/types/api';
import type { AccountStatus, StudentAccountView } from '../types';

export interface ListStudentsParams {
  username?: string;
  status?: AccountStatus;
  page?: number;
  size?: number;
}

export interface ResetPasswordResult {
  username: string;
  temporaryPassword: string;
}

export const adminAccountApi = {
  list: (params: ListStudentsParams) =>
    httpClient
      .get<ApiResponse<PageResponse<StudentAccountView>>>('/api/admin/students', { params })
      .then((res) => res.data.data),
  lock: (id: string, reason?: string) =>
    httpClient
      .patch<ApiResponse<StudentAccountView>>(`/api/admin/students/${id}/lock`, { reason })
      .then((res) => res.data.data),
  unlock: (id: string) =>
    httpClient
      .patch<ApiResponse<StudentAccountView>>(`/api/admin/students/${id}/unlock`)
      .then((res) => res.data.data),
  resetPassword: (id: string) =>
    httpClient
      .post<ApiResponse<ResetPasswordResult>>(`/api/admin/students/${id}/reset-password`)
      .then((res) => res.data.data),
};
