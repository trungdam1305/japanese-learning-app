import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, Form, Input, Radio, Row, Statistic, Typography, message } from 'antd';
import { studentProfileApi } from '../api/studentProfileApi';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { ChangePasswordPayload, UpdateProfilePayload } from '../types';

export default function StudentProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: studentProfileApi.getMe,
  });

  const [profileForm] = Form.useForm<UpdateProfilePayload>();
  const [passwordForm] = Form.useForm<ChangePasswordPayload>();

  useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        username: profile.username,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl ?? undefined,
        currentLevel: profile.currentLevel,
      });
    }
  }, [profile, profileForm]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => studentProfileApi.updateMe(payload),
    onSuccess: () => {
      message.success('Cập nhật hồ sơ thành công');
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => studentProfileApi.changePassword(payload),
    onSuccess: () => {
      message.success('Đổi mật khẩu thành công');
      passwordForm.resetFields();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  return (
    <div>
      <Typography.Title level={3}>Hồ sơ cá nhân</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Streak (ngày liên tục)" value={profile?.streakCount ?? 0} suffix="ngày" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Rank points" value={profile?.rankPoints ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Gói Quiz Premium"
              value={profile?.quizSubscriptionExpiry ? new Date(profile.quizSubscriptionExpiry).toLocaleDateString('vi-VN') : 'Chưa đăng ký'}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Cập nhật thông tin" loading={isLoading} style={{ marginBottom: 24 }}>
        <Form layout="vertical" form={profileForm} onFinish={(values) => updateMutation.mutate(values)}>
          <Form.Item name="username" label="Username">
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Họ và tên">
            <Input />
          </Form.Item>
          <Form.Item name="avatarUrl" label="Ảnh đại diện (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="currentLevel" label="Trình độ học tập">
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value="N5">N5</Radio.Button>
              <Radio.Button value="N4">N4</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            Lưu thay đổi
          </Button>
        </Form>
      </Card>

      <Card title="Đổi mật khẩu">
        <Form layout="vertical" form={passwordForm} onFinish={(values) => changePasswordMutation.mutate(values)}>
          <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={changePasswordMutation.isPending}>
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
