import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { vocabularyApi } from '../api/vocabularyApi';
import ImportExcelModal from '../components/ImportExcelModal';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { JlptLevel } from '../../../auth/types';
import type { Vocabulary, VocabularyPayload } from '../types';

const PAGE_SIZE = 10;

export default function VocabularyManagementPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<JlptLevel | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Vocabulary | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form] = Form.useForm<VocabularyPayload>();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vocabularies', { keyword, level, page }],
    queryFn: () => vocabularyApi.list({ keyword: keyword || undefined, level, page, size: PAGE_SIZE }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-vocabularies'] });

  useEffect(() => {
    if (formOpen) {
      if (editing) {
        form.setFieldsValue({
          word: editing.word,
          meaning: editing.meaning,
          level: editing.level,
          audioUrl: editing.audioUrl ?? undefined,
          exampleSentence: editing.exampleSentence ?? undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [formOpen, editing, form]);

  const saveMutation = useMutation({
    mutationFn: (payload: VocabularyPayload) =>
      editing ? vocabularyApi.update(editing.id, payload) : vocabularyApi.create(payload),
    onSuccess: () => {
      message.success(editing ? 'Đã cập nhật từ vựng' : 'Đã thêm từ vựng');
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vocabularyApi.remove(id),
    onSuccess: () => {
      message.success('Đã xóa từ vựng');
      invalidate();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const columns: ColumnsType<Vocabulary> = [
    { title: 'Từ vựng / Kanji', dataIndex: 'word', width: 160 },
    { title: 'Nghĩa', dataIndex: 'meaning' },
    {
      title: 'Trình độ',
      dataIndex: 'level',
      width: 100,
      render: (value: JlptLevel) => <Tag color={value === 'N5' ? 'blue' : 'purple'}>{value}</Tag>,
    },
    { title: 'Ví dụ', dataIndex: 'exampleSentence', ellipsis: true },
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
          <Popconfirm title="Xóa từ vựng này?" onConfirm={() => deleteMutation.mutate(record.id)}>
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
      <Typography.Title level={3}>Quản lý Từ vựng &amp; Kanji</Typography.Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Tìm theo từ hoặc nghĩa"
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
          Thêm từ vựng
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
        title={editing ? 'Cập nhật từ vựng' : 'Thêm từ vựng mới'}
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
          <Form.Item name="word" label="Từ vựng / Kanji" rules={[{ required: true, max: 50 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="meaning" label="Nghĩa tiếng Việt" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="level" label="Trình độ" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'N5', label: 'N5' },
                { value: 'N4', label: 'N4' },
              ]}
            />
          </Form.Item>
          <Form.Item name="audioUrl" label="Audio URL (tùy chọn)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="exampleSentence" label="Câu ví dụ (tùy chọn)">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <ImportExcelModal open={importOpen} onClose={() => setImportOpen(false)} onImported={invalidate} />
    </div>
  );
}
