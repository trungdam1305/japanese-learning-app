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
import StudentProfilePage from './features/student/profile/pages/StudentProfilePage';
import VocabularyLookupPage from './features/student/vocabulary/pages/VocabularyLookupPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#d4380d' } }}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<RequireRole role="ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="accounts" replace />} />
                  <Route path="accounts" element={<StudentAccountsPage />} />
                  <Route path="vocabularies" element={<VocabularyManagementPage />} />
                </Route>
              </Route>

              <Route element={<RequireRole role="STUDENT" />}>
                <Route path="/student" element={<StudentLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="vocabularies" element={<VocabularyLookupPage />} />
                  <Route path="profile" element={<StudentProfilePage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
