import { useQuery } from '@tanstack/react-query';
import { Card, Empty, Space, Tag, Typography } from 'antd';
import { examApi } from '../api/examApi';

export default function ErrorNotebookPage() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['student-error-notebook'],
    queryFn: examApi.errorNotebook,
  });

  return (
    <div>
      <Typography.Title level={3}>Sổ tay lỗi sai</Typography.Title>
      <Typography.Paragraph type="secondary">
        Tổng hợp các câu hỏi bạn từng trả lời sai qua các lần làm bài, xếp theo số lần sai nhiều nhất.
      </Typography.Paragraph>

      {isLoading ? (
        <div>Đang tải...</div>
      ) : !items || items.length === 0 ? (
        <Empty description="Bạn chưa có câu nào trả lời sai — làm vài bài Quiz để ôn tập nhé!" />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {items.map((item) => (
            <Card
              key={item.questionId}
              title={item.questionText}
              extra={<Tag color="red">Sai {item.wrongCount} lần</Tag>}
            >
              <Space direction="vertical">
                {item.options.map((option, index) => (
                  <Typography.Text
                    key={index}
                    style={index === item.correctAnswerIndex ? { color: 'green', fontWeight: 600 } : undefined}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                    {index === item.correctAnswerIndex && ' (Đáp án đúng)'}
                  </Typography.Text>
                ))}
              </Space>
              {item.explanation && (
                <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                  Giải thích: {item.explanation}
                </Typography.Paragraph>
              )}
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
}
