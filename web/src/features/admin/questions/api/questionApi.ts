import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse, PageResponse } from '../../../../shared/types/api';
import type { JlptLevel } from '../../../auth/types';
import type { ImportPreview, ImportResult, Question, QuestionPayload, QuestionStatus } from '../types';

export interface ListQuestionParams {
  level?: JlptLevel;
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

function toFormData(file: File): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const questionApi = {
  list: (params: ListQuestionParams) =>
    httpClient
      .get<ApiResponse<PageResponse<Question>>>('/api/admin/questions', { params })
      .then((res) => res.data.data),
  create: (payload: QuestionPayload) =>
    httpClient.post<ApiResponse<Question>>('/api/admin/questions', payload).then((res) => res.data.data),
  update: (id: string, payload: QuestionPayload) =>
    httpClient.put<ApiResponse<Question>>(`/api/admin/questions/${id}`, payload).then((res) => res.data.data),
  setStatus: (id: string, status: QuestionStatus) =>
    httpClient
      .patch<ApiResponse<Question>>(`/api/admin/questions/${id}/status`, null, { params: { status } })
      .then((res) => res.data.data),
  remove: (id: string) => httpClient.delete<ApiResponse<null>>(`/api/admin/questions/${id}`).then((res) => res.data),
  previewImport: (file: File) =>
    httpClient
      .post<ApiResponse<ImportPreview>>('/api/admin/questions/import/preview', toFormData(file))
      .then((res) => res.data.data),
  runImport: (file: File) =>
    httpClient
      .post<ApiResponse<ImportResult>>('/api/admin/questions/import', toFormData(file))
      .then((res) => res.data.data),
  downloadTemplate: async () => {
    const response = await httpClient.get('/api/admin/questions/template', { responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'question-template.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
