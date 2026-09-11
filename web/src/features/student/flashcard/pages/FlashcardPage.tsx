import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Empty, Progress, Radio, Space, Tag, Typography, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { flashcardApi } from '../api/flashcardApi';
import FlipCard from '../components/FlipCard';
import { getErrorMessage } from '../../../../shared/api/errors';
import type { JlptLevel } from '../../../auth/types';
import type { MemoryStatus } from '../types';

export default function FlashcardPage() {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState<JlptLevel>('N5');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data: deck, isLoading } = useQuery({
    queryKey: ['flashcard-deck', level],
    queryFn: () => flashcardApi.getDeck(level),
  });

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [level]);

  const markMutation = useMutation({
    mutationFn: ({ vocabularyId, status }: { vocabularyId: string; status: MemoryStatus }) =>
      flashcardApi.markStatus(vocabularyId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-deck', level] });
      goNext();
    },
    onError: (error) => message.error(getErrorMessage(error)),
  });

  const cards = deck?.cards ?? [];
  const current = cards[index];

  const goNext = () => {
    setFlipped(false);
    setIndex((prev) => (cards.length === 0 ? 0 : Math.min(prev + 1, cards.length - 1)));
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div>
      <Typography.Title level={3}>Học Flashcard</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={level}
          onChange={(event) => setLevel(event.target.value as JlptLevel)}
        >
          <Radio.Button value="N5">Bộ từ vựng N5</Radio.Button>
          <Radio.Button value="N4">Bộ từ vựng N4</Radio.Button>
        </Radio.Group>
      </Space>

      <Card style={{ marginBottom: 16 }} loading={isLoading}>
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Typography.Text>
            Tiến độ ghi nhớ: <b>{deck?.masteredCount ?? 0}</b>/{deck?.totalCount ?? 0} từ đã thuộc
          </Typography.Text>
          <Progress percent={deck?.progressPercent ?? 0} status="active" />
        </Space>
      </Card>

      {!isLoading && cards.length === 0 && (
        <Empty description={`Chưa có từ vựng ${level} nào trong hệ thống`} />
      )}

      {current && (
        <Card>
          <Space orientation="vertical" style={{ width: '100%' }} size={16}>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Typography.Text type="secondary">
                Thẻ {index + 1}/{cards.length}
              </Typography.Text>
              {current.memoryStatus && (
                <Tag color={current.memoryStatus === 'MASTERED' ? 'green' : 'red'}>
                  {current.memoryStatus === 'MASTERED' ? 'Đã thuộc' : 'Chưa thuộc'}
                </Tag>
              )}
            </Space>

            <FlipCard card={current} flipped={flipped} onFlip={() => setFlipped((prev) => !prev)} />

            <Space style={{ width: '100%', justifyContent: 'center' }} size={12}>
              <Button icon={<LeftOutlined />} onClick={goPrev} disabled={index === 0}>
                Thẻ trước
              </Button>
              <Button
                style={{ background: '#52c41a', color: '#fff' }}
                loading={markMutation.isPending}
                onClick={() => markMutation.mutate({ vocabularyId: current.vocabularyId, status: 'MASTERED' })}
              >
                Đã thuộc
              </Button>
              <Button
                danger
                type="primary"
                loading={markMutation.isPending}
                onClick={() => markMutation.mutate({ vocabularyId: current.vocabularyId, status: 'NOT_MASTERED' })}
              >
                Chưa thuộc
              </Button>
              <Button onClick={goNext} disabled={index >= cards.length - 1}>
                Thẻ sau <RightOutlined />
              </Button>
            </Space>
          </Space>
        </Card>
      )}
    </div>
  );
}
