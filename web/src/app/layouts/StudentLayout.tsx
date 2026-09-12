import { Button, Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/authStore';

const { Header, Sider, Content } = Layout;

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const selectedKey = location.pathname.split('/')[2] ?? 'flashcards';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ color: '#fff', padding: 16, fontWeight: 'bold' }}>日本語学習</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'flashcards', label: 'Học Flashcard' },
            { key: 'vocabularies', label: 'Tra cứu từ vựng' },
            { key: 'exams', label: 'Đề thi / Quiz' },
            { key: 'error-notebook', label: 'Sổ tay lỗi sai' },
            { key: 'profile', label: 'Hồ sơ cá nhân' },
          ]}
          onClick={({ key }) => navigate(`/student/${key}`)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
          <span>{user?.fullName}</span>
          <Button
            onClick={() => {
              clearAuth();
              navigate('/login');
            }}
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
