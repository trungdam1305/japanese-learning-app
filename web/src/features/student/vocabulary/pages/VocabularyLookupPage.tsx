import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { studentVocabularyApi } from '../api/studentVocabularyApi';
import type { JlptLevel } from '../../../auth/types';
import type { Vocabulary } from '../../../admin/vocabulary/types';

const PAGE_SIZE = 15;

export default function VocabularyLookupPage() {
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<JlptLevel | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['student-vocabularies', { keyword, level, page }],
    queryFn: () => studentVocabularyApi.search({ keyword: keyword || undefined, level, page, size: PAGE_SIZE }),
  });

  const playAudio = (url: string) => {
    new Audio(url).play().catch(() => undefined);
  };

  const columns: ColumnsType<Vocabulary> = [
    {
      title: 'Từ vựng / Kanji',
      dataIndex: 'word',
      width: 200,
      render: (word: string, record) => (
        <Space>
          <Typography.Text style={{ fontSize: 18 }}>{word}</Typography.Text>
          {record.audioUrl && (
            <Button size="small" type="text" icon={<SoundOutlined />} onClick={() => playAudio(record.audioUrl!)} />
          )}
        </Space>
      ),
    },
    { title: 'Nghĩa', dataIndex: 'meaning' },
    {
      title: 'Trình độ',
      dataIndex: 'level',
      width: 100,
      render: (value: JlptLevel) => <Tag color={value === 'N5' ? 'blue' : 'purple'}>{value}</Tag>,
    },
    { title: 'Ví dụ', dataIndex: 'exampleSentence', ellipsis: true },
  ];

  return (
    <div>
      <Typography.Title level={3}>Tra cứu Từ vựng &amp; Kanji</Typography.Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Nhập từ tiếng Nhật hoặc nghĩa tiếng Việt"
          allowClear
          style={{ width: 320 }}
          onSearch={(value) => {
            setKeyword(value);
            setPage(0);
          }}
        />
        <Select
          allowClear
          placeholder="Lọc theo trình độ"
          style={{ width: 160 }}
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
