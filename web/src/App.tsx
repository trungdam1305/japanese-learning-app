import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireRole from './app/RequireRole';
import AdminLayout from './app/layouts/AdminLayout';
import StudentLayout from './app/layouts/StudentLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import StudentAccountsPage from './features/admin/accounts/pages/StudentAccountsPage';
import VocabularyManagementPage from './features/admin/vocabulary/pages/VocabularyManagementPage';
import QuestionManagementPage from './features/admin/questions/pages/QuestionManagementPage';
import ExamTemplateManagementPage from './features/admin/examTemplates/pages/ExamTemplateManagementPage';
import StudentProfilePage from './features/student/profile/pages/StudentProfilePage';
import VocabularyLookupPage from './features/student/vocabulary/pages/VocabularyLookupPage';
import FlashcardPage from './features/student/flashcard/pages/FlashcardPage';
import ExamListPage from './features/student/exams/pages/ExamListPage';
import ExamTakingPage from './features/student/exams/pages/ExamTakingPage';
import ExamResultPage from './features/student/exams/pages/ExamResultPage';
import ErrorNotebookPage from './features/student/exams/pages/ErrorNotebookPage';
import DashboardPage from './features/student/dashboard/pages/DashboardPage';
import HomePage from './features/student/home/pages/HomePage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#d4380d' } }}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<RequireRole role="ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="accounts" replace />} />
                  <Route path="accounts" element={<StudentAccountsPage />} />
                  <Route path="vocabularies" element={<VocabularyManagementPage />} />
                  <Route path="questions" element={<QuestionManagementPage />} />
                  <Route path="exam-templates" element={<ExamTemplateManagementPage />} />
                </Route>
              </Route>

              <Route path="/student" element={<StudentLayout />}>
                {/* Miễn phí — xem được mà không cần đăng nhập */}
                <Route path="flashcards" element={<FlashcardPage />} />
                <Route path="vocabularies" element={<VocabularyLookupPage />} />

                {/* Yêu cầu đăng nhập */}
                <Route element={<RequireRole role="STUDENT" />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="exams" element={<ExamListPage />} />
                  <Route path="exams/attempts/:attemptId/take" element={<ExamTakingPage />} />
                  <Route path="exams/attempts/:attemptId/result" element={<ExamResultPage />} />
                  <Route path="error-notebook" element={<ErrorNotebookPage />} />
                  <Route path="profile" element={<StudentProfilePage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
