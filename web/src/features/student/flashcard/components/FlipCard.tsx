import { Button, Space, Tag, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import type { FlashcardItem } from '../types';

interface Props {
  card: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
}

const FACE_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  borderRadius: 12,
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  textAlign: 'center',
};

export default function FlipCard({ card, flipped, onFlip }: Props) {
  const playAudio = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (card.audioUrl) {
      new Audio(card.audioUrl).play().catch(() => undefined);
    }
  };

  return (
    <div
      onClick={onFlip}
      style={{ perspective: 1200, height: 280, cursor: 'pointer', userSelect: 'none' }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s',
          transform: flipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        <div style={FACE_STYLE}>
          <Tag color={card.level === 'N5' ? 'blue' : 'purple'} style={{ position: 'absolute', top: 16, left: 16 }}>
            {card.level}
          </Tag>
          <Typography.Title level={1} style={{ margin: 0 }}>
            {card.word}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ marginTop: 12 }}>
            Bấm vào thẻ để lật xem nghĩa
          </Typography.Text>
        </div>

        <div style={{ ...FACE_STYLE, transform: 'rotateY(180deg)' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {card.meaning}
          </Typography.Title>
          {card.exampleSentence && (
            <Typography.Paragraph style={{ marginTop: 16, fontSize: 16 }}>
              {card.exampleSentence}
            </Typography.Paragraph>
          )}
          {card.audioUrl && (
            <Space style={{ marginTop: 8 }}>
              <Button icon={<SoundOutlined />} onClick={playAudio}>
                Phát âm
              </Button>
            </Space>
          )}
        </div>
      </div>
    </div>
  );
}
