import { Button, Card, Form, Input, Radio, Typography, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../../shared/auth/authStore';
import { getErrorMessage } from '../../../shared/api/errors';
import type { RegisterPayload } from '../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
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
      message.success('Đăng ký thành công!');
      navigate('/student', { replace: true });
    },
    onError: (error) => {
      message.error(getErrorMessage(error, 'Đăng ký thất bại'));
    },
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '24px 0' }}>
      <Card style={{ width: 420 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Đăng ký tài khoản học viên
        </Typography.Title>
        <Form
          layout="vertical"
          initialValues={{ initialLevel: 'N5' }}
          onFinish={(values: RegisterPayload) => registerMutation.mutate(values)}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên (5-30 ký tự, không số)' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Vui lòng nhập username (>= 8 ký tự, có chữ thường và số)' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Vui lòng nhập password (>= 8 ký tự, có hoa/thường/số)' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="initialLevel" label="Trình độ mục tiêu ban đầu" rules={[{ required: true }]}>
            <Radio.Group optionType="button" buttonStyle="solid" block>
              <Radio.Button value="N5" style={{ width: '50%', textAlign: 'center' }}>
                N5
              </Radio.Button>
              <Radio.Button value="N4" style={{ width: '50%', textAlign: 'center' }}>
                N4
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={registerMutation.isPending}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
