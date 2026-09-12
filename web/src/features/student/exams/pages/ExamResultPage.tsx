import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Result, Space, Statistic, Tag, Typography } from 'antd';
import { examApi } from '../api/examApi';

export default function ExamResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading } = useQuery({
    queryKey: ['student-exam-attempt', attemptId],
    queryFn: () => examApi.detail(attemptId!),
    enabled: !!attemptId,
  });

  if (isLoading || !result) {
    return <div>Đang tải kết quả...</div>;
  }

  return (
    <div>
      <Result
        status={result.passed ? 'success' : 'error'}
        title={result.passed ? 'Chúc mừng, bạn đã đạt!' : 'Chưa đạt, cố gắng lần sau nhé!'}
        subTitle={`${result.examTemplateName} — ${result.level}`}
        extra={[
          <Button key="list" onClick={() => navigate('/student/exams')}>
            Quay lại danh sách đề thi
          </Button>,
        ]}
      />

      <Space size={32} style={{ marginBottom: 24, justifyContent: 'center', width: '100%' }}>
        <Statistic title="Điểm số" value={`${result.score}/${result.totalQuestions}`} />
        <Statistic title="Tỷ lệ đúng" value={result.scorePercentage} suffix="%" precision={1} />
        <Statistic title="Thời gian làm bài" value={`${Math.floor(result.timeTakenSeconds / 60)}p ${result.timeTakenSeconds % 60}s`} />
      </Space>

      <Typography.Title level={4}>Xem lại bài làm</Typography.Title>
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        {result.questions.map((question, index) => {
          const isCorrect = question.selectedAnswerIndex === question.correctAnswerIndex;
          return (
            <Card
              key={question.questionId}
              title={`Câu ${index + 1}`}
              extra={<Tag color={isCorrect ? 'green' : 'red'}>{isCorrect ? 'Đúng' : 'Sai'}</Tag>}
            >
              <Typography.Paragraph strong>{question.questionText}</Typography.Paragraph>
              <Space direction="vertical">
                {question.options.map((option, optionIndex) => {
                  let color: string | undefined;
                  if (optionIndex === question.correctAnswerIndex) color = 'green';
                  else if (optionIndex === question.selectedAnswerIndex) color = 'red';
                  return (
                    <Typography.Text key={optionIndex} style={color ? { color, fontWeight: 600 } : undefined}>
                      {String.fromCharCode(65 + optionIndex)}. {option}
                      {optionIndex === question.correctAnswerIndex && ' (Đáp án đúng)'}
                      {optionIndex === question.selectedAnswerIndex && optionIndex !== question.correctAnswerIndex && ' (Bạn đã chọn)'}
                    </Typography.Text>
                  );
                })}
              </Space>
              {question.explanation && (
                <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                  Giải thích: {question.explanation}
                </Typography.Paragraph>
              )}
            </Card>
          );
        })}
      </Space>
    </div>
  );
}
