import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse, PageResponse } from '../../../../shared/types/api';
import type { JlptLevel } from '../../../auth/types';
import type { ExamTemplate, ExamTemplatePayload, ExamTemplateStatus } from '../types';

export interface ListExamTemplateParams {
  level?: JlptLevel;
  page?: number;
  size?: number;
}

export const examTemplateApi = {
  list: (params: ListExamTemplateParams) =>
    httpClient
      .get<ApiResponse<PageResponse<ExamTemplate>>>('/api/admin/exam-templates', { params })
      .then((res) => res.data.data),
  create: (payload: ExamTemplatePayload) =>
    httpClient.post<ApiResponse<ExamTemplate>>('/api/admin/exam-templates', payload).then((res) => res.data.data),
  update: (id: string, payload: ExamTemplatePayload) =>
    httpClient.put<ApiResponse<ExamTemplate>>(`/api/admin/exam-templates/${id}`, payload).then((res) => res.data.data),
  setStatus: (id: string, status: ExamTemplateStatus) =>
    httpClient
      .patch<ApiResponse<ExamTemplate>>(`/api/admin/exam-templates/${id}/status`, null, { params: { status } })
      .then((res) => res.data.data),
  remove: (id: string) =>
    httpClient.delete<ApiResponse<null>>(`/api/admin/exam-templates/${id}`).then((res) => res.data),
};
