import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse, PageResponse } from '../../../../shared/types/api';
import type { JlptLevel } from '../../../auth/types';
import type {
  AnswerSubmissionPayload,
  AttemptHistoryItem,
  AttemptResult,
  ErrorNotebookItem,
  ExamListItem,
  StartAttemptResult,
} from '../types';

export const examApi = {
  listAvailable: (level?: JlptLevel) =>
    httpClient
      .get<ApiResponse<ExamListItem[]>>('/api/students/exams', { params: { level } })
      .then((res) => res.data.data),
  start: (templateId: string) =>
    httpClient
      .post<ApiResponse<StartAttemptResult>>(`/api/students/exams/${templateId}/start`)
      .then((res) => res.data.data),
  submit: (attemptId: string, answers: AnswerSubmissionPayload[]) =>
    httpClient
      .post<ApiResponse<AttemptResult>>(`/api/students/exams/attempts/${attemptId}/submit`, { answers })
      .then((res) => res.data.data),
  history: (params: { page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResponse<AttemptHistoryItem>>>('/api/students/exams/attempts', { params })
      .then((res) => res.data.data),
  detail: (attemptId: string) =>
    httpClient
      .get<ApiResponse<AttemptResult>>(`/api/students/exams/attempts/${attemptId}`)
      .then((res) => res.data.data),
  errorNotebook: () =>
    httpClient
      .get<ApiResponse<ErrorNotebookItem[]>>('/api/students/exams/error-notebook')
      .then((res) => res.data.data),
};
