import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Empty, Space, Table, Tabs, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { examApi } from '../api/examApi';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { AttemptHistoryItem, ExamListItem } from '../types';

const PAGE_SIZE = 10;

export default function ExamListPage() {
  const navigate = useNavigate();
  const [historyPage, setHistoryPage] = useState(0);

  const { data: exams, isLoading: examsLoading } = useQuery({
    queryKey: ['student-available-exams'],
    queryFn: () => examApi.listAvailable(),
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['student-exam-history', historyPage],
    queryFn: () => examApi.history({ page: historyPage, size: PAGE_SIZE }),
  });

  const startMutation = useMutation({
    mutationFn: (templateId: string) => examApi.start(templateId),
    onSuccess: (result) => {
      navigate(`/student/exams/attempts/${result.attemptId}/take`, { state: result });
    },
    onError: (error) => message.error(getErrorMessage(error, 'Không thể bắt đầu làm bài')),
  });

  const historyColumns: ColumnsType<AttemptHistoryItem> = [
    { title: 'Đề thi', dataIndex: 'examTemplateName' },
    { title: 'Trình độ', dataIndex: 'level', width: 90 },
    {
      title: 'Điểm',
      key: 'score',
      width: 140,
      render: (_, record) => `${record.score}/${record.totalQuestions} (${record.scorePercentage.toFixed(0)}%)`,
    },
    {
      title: 'Kết quả',
      dataIndex: 'passed',
      width: 100,
      render: (passed: boolean) => <Tag color={passed ? 'green' : 'red'}>{passed ? 'Đạt' : 'Chưa đạt'}</Tag>,
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submittedAt',
      render: (value: string) => new Date(value).toLocaleString('vi-VN'),
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" onClick={() => navigate(`/student/exams/attempts/${record.attemptId}/result`)}>
          Xem lại
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Đề thi / Quiz</Typography.Title>

      <Tabs
        items={[
          {
            key: 'available',
            label: 'Đề thi khả dụng',
            children: examsLoading ? (
              <div>Đang tải...</div>
            ) : !exams || exams.length === 0 ? (
              <Empty description="Hiện chưa có đề thi nào khả dụng" />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {exams.map((exam: ExamListItem) => (
                  <Card key={exam.id}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
                      <div>
                        <Typography.Text strong style={{ fontSize: 16 }}>
                          {exam.name}
                        </Typography.Text>
                        <div>
                          <Tag color={exam.level === 'N5' ? 'blue' : 'purple'}>{exam.level}</Tag>
                          {exam.category && <Tag>{exam.category}</Tag>}
                          <Typography.Text type="secondary">
                            {exam.numberOfQuestions} câu · {exam.totalTimeMinutes} phút · Đạt từ {exam.passingScorePercentage}%
                          </Typography.Text>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        loading={startMutation.isPending}
                        onClick={() => startMutation.mutate(exam.id)}
                      >
                        Bắt đầu làm bài
                      </Button>
                    </Space>
                  </Card>
                ))}
              </Space>
            ),
          },
          {
            key: 'history',
            label: 'Lịch sử làm bài',
            children: (
              <Table
                rowKey="attemptId"
                loading={historyLoading}
                columns={historyColumns}
                dataSource={history?.content ?? []}
                pagination={{
                  current: historyPage + 1,
                  pageSize: PAGE_SIZE,
                  total: history?.totalElements ?? 0,
                  onChange: (nextPage) => setHistoryPage(nextPage - 1),
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
