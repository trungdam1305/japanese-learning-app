import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Radio, Result, Space, Statistic, Typography, message } from 'antd';
import { examApi } from '../api/examApi';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { StartAttemptResult } from '../types';

export default function ExamTakingPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state as StartAttemptResult | undefined;

  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [secondsLeft, setSecondsLeft] = useState(attempt ? attempt.totalTimeMinutes * 60 : 0);
  const autoSubmitted = useRef(false);

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = Object.entries(answers).map(([questionId, selectedAnswerIndex]) => ({
        questionId,
        selectedAnswerIndex,
      }));
      return examApi.submit(attemptId!, payload);
    },
    onSuccess: () => {
      navigate(`/student/exams/attempts/${attemptId}/result`, { replace: true });
    },
    onError: (error) => message.error(getErrorMessage(error, 'Nộp bài thất bại')),
  });

  useEffect(() => {
    if (!attempt) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt]);

  useEffect(() => {
    if (attempt && secondsLeft === 0 && !autoSubmitted.current && !submitMutation.isPending) {
      autoSubmitted.current = true;
      message.warning('Đã hết thời gian làm bài, tự động nộp bài');
      submitMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, attempt]);

  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [secondsLeft]);

  if (!attempt) {
    return (
      <Result
        status="warning"
        title="Không tìm thấy dữ liệu bài thi"
        subTitle="Vui lòng bắt đầu lại từ danh sách đề thi."
        extra={
          <Button type="primary" onClick={() => navigate('/student/exams')}>
            Quay lại danh sách đề thi
          </Button>
        }
      />
    );
  }

  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined).length;

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {attempt.examTemplateName}
        </Typography.Title>
        <Statistic title="Thời gian còn lại" value={timeDisplay} valueStyle={{ color: secondsLeft < 60 ? '#cf1322' : undefined }} />
      </Space>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message={`Đã trả lời ${answeredCount}/${attempt.questions.length} câu`}
      />

      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        {attempt.questions.map((question, index) => (
          <Card key={question.questionId} title={`Câu ${index + 1}`}>
            <Typography.Paragraph strong>{question.questionText}</Typography.Paragraph>
            {question.imageUrl && <img src={question.imageUrl} alt="" style={{ maxWidth: 300, marginBottom: 12 }} />}
            {question.audioUrl && (
              <audio controls src={question.audioUrl} style={{ display: 'block', marginBottom: 12 }} />
            )}
            <Radio.Group
              value={answers[question.questionId] ?? null}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [question.questionId]: e.target.value }))}
            >
              <Space direction="vertical">
                {question.options.map((option, optionIndex) => (
                  <Radio key={optionIndex} value={optionIndex}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>
        ))}
      </Space>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button type="primary" size="large" loading={submitMutation.isPending} onClick={() => submitMutation.mutate()}>
          Nộp bài
        </Button>
      </div>
    </div>
  );
}
