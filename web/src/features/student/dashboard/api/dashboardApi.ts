import { httpClient } from '../../../../shared/api/httpClient';
import type { ApiResponse } from '../../../../shared/types/api';
import type { DashboardSummary } from '../types';

export const dashboardApi = {
  getSummary: () =>
    httpClient.get<ApiResponse<DashboardSummary>>('/api/students/dashboard').then((res) => res.data.data),
};
