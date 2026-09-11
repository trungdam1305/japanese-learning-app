import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse, PageResponse } from '../../../../shared/types/api';
import type { JlptLevel } from '../../../auth/types';
import type { ImportPreview, ImportResult, Vocabulary, VocabularyPayload } from '../types';

export interface ListVocabularyParams {
  level?: JlptLevel;
  keyword?: string;
  page?: number;
  size?: number;
}

function toFormData(file: File): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const vocabularyApi = {
  list: (params: ListVocabularyParams) =>
    httpClient
      .get<ApiResponse<PageResponse<Vocabulary>>>('/api/admin/vocabularies', { params })
      .then((res) => res.data.data),
  create: (payload: VocabularyPayload) =>
    httpClient.post<ApiResponse<Vocabulary>>('/api/admin/vocabularies', payload).then((res) => res.data.data),
  update: (id: string, payload: VocabularyPayload) =>
    httpClient.put<ApiResponse<Vocabulary>>(`/api/admin/vocabularies/${id}`, payload).then((res) => res.data.data),
  remove: (id: string) => httpClient.delete<ApiResponse<null>>(`/api/admin/vocabularies/${id}`).then((res) => res.data),
  previewImport: (file: File) =>
    httpClient
      .post<ApiResponse<ImportPreview>>('/api/admin/vocabularies/import/preview', toFormData(file))
      .then((res) => res.data.data),
  runImport: (file: File) =>
    httpClient
      .post<ApiResponse<ImportResult>>('/api/admin/vocabularies/import', toFormData(file))
      .then((res) => res.data.data),
  downloadTemplate: async () => {
    const response = await httpClient.get('/api/admin/vocabularies/template', { responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vocabulary-template.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
