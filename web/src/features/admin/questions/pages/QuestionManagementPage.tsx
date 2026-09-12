import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Popconfirm, Radio, Select, Space, Switch, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { questionApi } from '../api/questionApi';
import ImportExcelModal from '../components/ImportExcelModal';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { JlptLevel } from '../../../auth/types';
import type { Question, QuestionPayload } from '../types';

const PAGE_SIZE = 10;
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionManagementPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<JlptLevel | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Question | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form] = Form.useForm<QuestionPayload>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-questions', { keyword, level, page }],
    queryFn: () => questionApi.list({ keyword: keyword || undefined, level, page, size: PAGE_SIZE }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-questions'] });

  useEffect(() => {
    if (formOpen) {
      if (editing) {
        form.setFieldsValue({
          questionText: editing.questionText,
          options: editing.options,
          correctAnswerIndex: editing.correctAnswerIndex,
          explanation: editing.explanation ?? undefined,
          level: editing.level,
          category: editing.category,
          audioUrl: editing.audioUrl ?? undefined,
          imageUrl: editing.imageUrl ?? undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [formOpen, editing, form]);

  const saveMutation = useMutation({
    mutationFn: (payload: QuestionPayload) =>
      editing ? questionApi.update(editing.id, payload) : questionApi.create(payload),
    onSuccess: () => {
      message.success(editing ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi');
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      questionApi.setStatus(id, active ? 'ACTIVE' : 'INACTIVE'),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái câu hỏi');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionApi.remove(id),
    onSuccess: () => {
      message.success('Đã xóa câu hỏi');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const columns: ColumnsType<Question> = [
    { title: 'Câu hỏi', dataIndex: 'questionText', ellipsis: true },
    {
      title: 'Trình độ',
      dataIndex: 'level',
      width: 90,
      render: (value: JlptLevel) => <Tag color={value === 'N5' ? 'blue' : 'purple'}>{value}</Tag>,
    },
    { title: 'Danh mục', dataIndex: 'category', width: 140 },
    {
      title: 'Đáp án đúng',
      dataIndex: 'correctAnswerIndex',
      width: 100,
      render: (index: number) => <Tag color="green">{OPTION_LABELS[index]}</Tag>,
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'status',
      width: 100,
      render: (status: Question['status'], record) => (
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
          <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => deleteMutation.mutate(record.id)}>
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
      <Typography.Title level={3}>Ngân hàng câu hỏi</Typography.Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Tìm theo nội dung câu hỏi"
          allowClear
          style={{ width: 260 }}
          onSearch={(value) => {
            setKeyword(value);
            setPage(0);
          }}
        />
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
          Thêm câu hỏi
        </Button>
        <Button onClick={() => setImportOpen(true)}>Import Excel</Button>
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
        title={editing ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới'}
        okText="Lưu"
        cancelText="Hủy"
        width={640}
        confirmLoading={saveMutation.isPending}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="questionText" label="Nội dung câu hỏi" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          {OPTION_LABELS.map((label, index) => (
            <Form.Item
              key={label}
              name={['options', index]}
              label={`Phương án ${label}`}
              rules={[{ required: true, message: `Vui lòng nhập phương án ${label}` }]}
            >
              <Input />
            </Form.Item>
          ))}

          <Form.Item name="correctAnswerIndex" label="Đáp án đúng" rules={[{ required: true }]}>
            <Radio.Group optionType="button" buttonStyle="solid">
              {OPTION_LABELS.map((label, index) => (
                <Radio.Button key={label} value={index}>
                  {label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item name="explanation" label="Giải thích (tùy chọn)">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Space.Compact block>
            <Form.Item name="level" label="Trình độ" rules={[{ required: true }]} style={{ width: '50%' }}>
              <Select
                options={[
                  { value: 'N5', label: 'N5' },
                  { value: 'N4', label: 'N4' },
                ]}
              />
            </Form.Item>
            <Form.Item name="category" label="Danh mục" rules={[{ required: true }]} style={{ width: '50%' }}>
              <Input placeholder="Ví dụ: Ngữ pháp, Kanji, Nghe hiểu..." />
            </Form.Item>
          </Space.Compact>

          <Form.Item name="audioUrl" label="Audio URL (tùy chọn)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL (tùy chọn)">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>

      <ImportExcelModal open={importOpen} onClose={() => setImportOpen(false)} onImported={invalidate} />
    </div>
  );
}
