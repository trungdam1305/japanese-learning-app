import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse, PageResponse } from '../../../../shared/types/api';
import type { JlptLevel } from '../../../auth/types';
import type { Vocabulary } from '../../../admin/vocabulary/types';

export interface LookupParams {
  level?: JlptLevel;
  keyword?: string;
  page?: number;
  size?: number;
}

export const studentVocabularyApi = {
  search: (params: LookupParams) =>
    httpClient
      .get<ApiResponse<PageResponse<Vocabulary>>>('/api/students/vocabularies', { params })
      .then((res) => res.data.data),
};
