import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../shared/auth/authStore';
import PublicFooter from './PublicFooter';
import BackToTopButton from './BackToTopButton';

export default function PublicLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const goToApp = () => {
    if (!user) return;
    navigate(user.role === 'ADMIN' ? '/admin' : '/student/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          background: '#fff',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Typography.Text
          strong
          style={{ fontSize: 18, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          日本語学習
        </Typography.Text>
        {user ? (
          <Space>
            <Typography.Text>Xin chào, {user.fullName}</Typography.Text>
            <Button type="primary" icon={<DashboardOutlined />} onClick={goToApp}>
              {user.role === 'ADMIN' ? 'Vào trang quản trị' : 'Vào Dashboard'}
            </Button>
            <Button
              onClick={() => {
                clearAuth();
                navigate('/login');
              }}
            >
              Đăng xuất
            </Button>
          </Space>
        ) : (
          <Space>
            <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Đăng ký
            </Button>
          </Space>
        )}
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 48px', width: '100%', flex: 1 }}>
        <Outlet />
      </div>

      <PublicFooter />
      <BackToTopButton />
    </div>
  );
}
