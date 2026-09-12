import { Button, Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/authStore';

const { Header, Sider, Content } = Layout;

/** Các mục này sống ở URL gốc (trang riêng, công khai), không nằm trong /student/*. */
const ROOT_LEVEL_KEYS = new Set(['flashcards', 'vocabularies']);

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const selectedKey = location.pathname.split('/')[2] ?? 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div
          style={{ color: '#fff', padding: 16, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          日本語学習
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'dashboard', label: 'Bảng điều khiển' },
            { key: 'flashcards', label: 'Học Flashcard' },
            { key: 'vocabularies', label: 'Tra cứu từ vựng' },
            { key: 'exams', label: 'Đề thi / Quiz' },
            { key: 'error-notebook', label: 'Sổ tay lỗi sai' },
            { key: 'profile', label: 'Hồ sơ cá nhân' },
          ]}
          onClick={({ key }) => navigate(ROOT_LEVEL_KEYS.has(key) ? `/${key}` : `/student/${key}`)}
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
