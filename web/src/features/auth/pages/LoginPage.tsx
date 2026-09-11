import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../../shared/auth/authStore';
import { getErrorMessage } from '../../../shared/api/errors';
import type { LoginPayload } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.userId,
          username: data.username,
          fullName: data.fullName,
          role: data.role,
        },
      });
      navigate(data.role === 'ADMIN' ? '/admin' : '/student', { replace: true });
    },
    onError: (error) => {
      message.error(getErrorMessage(error, 'Đăng nhập thất bại'));
    },
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 380 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Đăng nhập
        </Typography.Title>
        <Form layout="vertical" onFinish={(values: LoginPayload) => loginMutation.mutate(values)}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập username' }]}>
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng nhập password' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loginMutation.isPending}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
