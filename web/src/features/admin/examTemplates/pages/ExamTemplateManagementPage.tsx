import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { examTemplateApi } from '../api/examTemplateApi';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { JlptLevel } from '../../../auth/types';
import type { ExamTemplate, ExamTemplatePayload } from '../types';

const PAGE_SIZE = 10;

export default function ExamTemplateManagementPage() {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState<JlptLevel | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<ExamTemplate | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm<ExamTemplatePayload>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-exam-templates', { level, page }],
    queryFn: () => examTemplateApi.list({ level, page, size: PAGE_SIZE }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-exam-templates'] });

  useEffect(() => {
    if (formOpen) {
      if (editing) {
        form.setFieldsValue({
          name: editing.name,
          level: editing.level,
          category: editing.category ?? undefined,
          numberOfQuestions: editing.numberOfQuestions,
          totalTimeMinutes: editing.totalTimeMinutes,
          passingScorePercentage: editing.passingScorePercentage,
          shuffleQuestions: editing.shuffleQuestions,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ shuffleQuestions: true, passingScorePercentage: 60 });
      }
    }
  }, [formOpen, editing, form]);

  const saveMutation = useMutation({
    mutationFn: (payload: ExamTemplatePayload) =>
      editing ? examTemplateApi.update(editing.id, payload) : examTemplateApi.create(payload),
    onSuccess: () => {
      message.success(editing ? 'Đã cập nhật đề thi' : 'Đã tạo đề thi');
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      examTemplateApi.setStatus(id, active ? 'ACTIVE' : 'INACTIVE'),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái đề thi');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => examTemplateApi.remove(id),
    onSuccess: () => {
      message.success('Đã xóa đề thi');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const columns: ColumnsType<ExamTemplate> = [
    { title: 'Tên đề thi', dataIndex: 'name' },
    {
      title: 'Trình độ',
      dataIndex: 'level',
      width: 90,
      render: (value: JlptLevel) => <Tag color={value === 'N5' ? 'blue' : 'purple'}>{value}</Tag>,
    },
    { title: 'Danh mục', dataIndex: 'category', render: (v: string | null) => v ?? <i>Tất cả</i> },
    { title: 'Số câu', dataIndex: 'numberOfQuestions', width: 90 },
    { title: 'Thời gian (phút)', dataIndex: 'totalTimeMinutes', width: 120 },
    { title: 'Điểm đạt (%)', dataIndex: 'passingScorePercentage', width: 110 },
    {
      title: 'Xáo trộn',
      dataIndex: 'shuffleQuestions',
      width: 90,
      render: (v: boolean) => (v ? 'Có' : 'Không'),
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'status',
      width: 100,
      render: (status: ExamTemplate['status'], record) => (
        <Switch
          checked={status === 'ACTIVE'}
          loading={statusMutation.isPending}
          onChange={(checked) => statusMutation.mutate({ id: record.id, active: checked })}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditing(record);
              setFormOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm title="Xóa đề thi này?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Quản lý đề thi / Quiz</Typography.Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          allowClear
          placeholder="Trình độ"
          style={{ width: 140 }}
          value={level}
          onChange={(value) => {
            setLevel(value);
            setPage(0);
          }}
          options={[
            { value: 'N5', label: 'N5' },
            { value: 'N4', label: 'N4' },
          ]}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Tạo đề thi
        </Button>
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

      <Modal
        open={formOpen}
        title={editing ? 'Cập nhật đề thi' : 'Tạo đề thi mới'}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={saveMutation.isPending}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="name" label="Tên đề thi" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Mock Exam N5 - Đề 1" />
          </Form.Item>
          <Form.Item name="level" label="Trình độ" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'N5', label: 'N5' },
                { value: 'N4', label: 'N4' },
              ]}
            />
          </Form.Item>
          <Form.Item name="category" label="Danh mục (tùy chọn — bỏ trống = lấy từ mọi danh mục)">
            <Input placeholder="Ví dụ: Ngữ pháp" />
          </Form.Item>
          <Form.Item name="numberOfQuestions" label="Số lượng câu hỏi" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="totalTimeMinutes" label="Thời gian làm bài (phút)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="passingScorePercentage" label="Điểm đạt (%)" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="shuffleQuestions" label="Xáo trộn thứ tự câu hỏi" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
