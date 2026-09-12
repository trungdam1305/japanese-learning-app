import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Empty, List, Progress, Row, Statistic, Tag, Typography } from 'antd';
import { dashboardApi } from '../api/dashboardApi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: dashboardApi.getSummary,
  });

  if (isLoading || !data) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <Typography.Title level={3}>Bảng điều khiển học tập</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Streak" value={data.streakCount} suffix="ngày" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Rank points" value={data.rankPoints} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Điểm Quiz trung bình" value={data.quizStats.averageScorePercentage} suffix="%" precision={1} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ đạt"
              value={data.quizStats.passRatePercentage}
              suffix={`% (${data.quizStats.totalAttempts} lượt thi)`}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Tiến độ Flashcard theo trình độ">
            {data.flashcardProgress.map((progress) => (
              <div key={progress.level} style={{ marginBottom: 16 }}>
                <Typography.Text>
                  {progress.level}: {progress.masteredCount}/{progress.totalCount} từ đã thuộc
                </Typography.Text>
                <Progress percent={progress.progressPercent} />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Từ vựng cần ôn lại (Chưa thuộc)">
            {data.weakVocabulary.length === 0 ? (
              <Empty description="Không có từ nào cần ôn lại" />
            ) : (
              <List
                dataSource={data.weakVocabulary}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => navigate('/flashcards')}
                    style={{ cursor: 'pointer' }}
                  >
                    <List.Item.Meta
                      title={item.word}
                      description={item.meaning}
                    />
                    <Tag color={item.level === 'N5' ? 'blue' : 'purple'}>{item.level}</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Các bài thi gần đây">
        {data.recentAttempts.length === 0 ? (
          <Empty description="Bạn chưa làm bài thi nào" />
        ) : (
          <List
            dataSource={data.recentAttempts}
            renderItem={(attempt) => (
              <List.Item
                onClick={() => navigate(`/student/exams/attempts/${attempt.attemptId}/result`)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  title={attempt.examTemplateName}
                  description={new Date(attempt.submittedAt).toLocaleString('vi-VN')}
                />
                <Tag color={attempt.passed ? 'green' : 'red'}>
                  {attempt.score}/{attempt.totalQuestions} ({attempt.scorePercentage.toFixed(0)}%)
                </Tag>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
