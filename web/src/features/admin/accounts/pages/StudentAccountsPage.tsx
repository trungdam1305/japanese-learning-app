import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminAccountApi } from '../api/adminAccountApi';
import type { AccountStatus, StudentAccountView } from '../types';
import { getErrorMessage } from '../../../../shared/api/errors';

const STATUS_COLOR: Record<AccountStatus, string> = {
  ACTIVE: 'green',
  LOCKED: 'red',
  LOCKED_PENDING: 'orange',
};

const PAGE_SIZE = 10;

export default function StudentAccountsPage() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<AccountStatus | undefined>(undefined);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students', { username, status, page }],
    queryFn: () => adminAccountApi.list({ username: username || undefined, status, page, size: PAGE_SIZE }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-students'] });

  const lockMutation = useMutation({
    mutationFn: (id: string) => adminAccountApi.lock(id),
    onSuccess: () => {
      message.success('Đã khóa tài khoản');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const unlockMutation = useMutation({
    mutationFn: (id: string) => adminAccountApi.unlock(id),
    onSuccess: () => {
      message.success('Đã mở khóa tài khoản');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => adminAccountApi.resetPassword(id),
    onSuccess: (result) => {
      Modal.success({
        title: 'Đã đặt lại mật khẩu',
        content: (
          <div>
            <p>Username: {result.username}</p>
            <p>
              Mật khẩu tạm thời: <b>{result.temporaryPassword}</b>
            </p>
          </div>
        ),
      });
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const columns: ColumnsType<StudentAccountView> = [
    { title: 'Username', dataIndex: 'username' },
    { title: 'Họ và tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Trình độ', dataIndex: 'currentLevel' },
    { title: 'Streak', dataIndex: 'streakCount' },
    { title: 'Rank points', dataIndex: 'rankPoints' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value: AccountStatus) => <Tag color={STATUS_COLOR[value]}>{value}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'ACTIVE' ? (
            <Popconfirm title="Khóa tài khoản này?" onConfirm={() => lockMutation.mutate(record.id)}>
              <Button danger size="small">
                Khóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm title="Mở khóa tài khoản này?" onConfirm={() => unlockMutation.mutate(record.id)}>
              <Button size="small">Mở khóa</Button>
            </Popconfirm>
          )}
          <Popconfirm title="Đặt lại mật khẩu cho tài khoản này?" onConfirm={() => resetPasswordMutation.mutate(record.id)}>
            <Button size="small">Reset password</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Quản lý tài khoản học viên</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo username"
          allowClear
          onSearch={(value) => {
            setUsername(value);
            setPage(0);
          }}
          style={{ width: 240 }}
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 180 }}
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(0);
          }}
          options={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'LOCKED', label: 'LOCKED' },
            { value: 'LOCKED_PENDING', label: 'LOCKED_PENDING' },
          ]}
        />
      </Space>
      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: page + 1,
          pageSize: PAGE_SIZE,
          total: data?.totalElements ?? 0,
          onChange: (nextPage) => setPage(nextPage - 1),
        }}
      />
    </div>
  );
}
