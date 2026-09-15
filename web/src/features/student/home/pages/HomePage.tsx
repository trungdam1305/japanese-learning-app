import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Input, Row, Tag, Typography } from 'antd';
import {
  ArrowRightOutlined,
  BookOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  GiftOutlined,
  ProfileOutlined,
  ReadOutlined,
  RocketOutlined,
  TranslationOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { studentVocabularyApi } from '../../vocabulary/api/studentVocabularyApi';
import { useAuthStore } from '../../../../shared/auth/authStore';
import './HomePage.css';

interface FeatureCard {
  key: string;
  icon: ReactNode;
  title: string;
  description: string;
  path?: string;
  comingSoon?: boolean;
  color: string;
  bg: string;
}

const FEATURES: FeatureCard[] = [
  {
    key: 'vocabularies',
    icon: <ReadOutlined />,
    title: 'Tra cứu Từ vựng & Kanji',
    description: 'Tìm nghĩa, cách đọc và ví dụ cho hàng nghìn từ vựng N5-N4',
    path: '/vocabularies',
    color: '#1677ff',
    bg: '#e6f4ff',
  },
  {
    key: 'flashcards',
    icon: <CreditCardOutlined />,
    title: 'Học Flashcard',
    description: 'Ôn từ vựng bằng thẻ lật, đánh dấu Đã thuộc / Chưa thuộc',
    path: '/flashcards',
    color: '#389e0d',
    bg: '#f0f9e8',
  },
  {
    key: 'exams',
    icon: <FileSearchOutlined />,
    title: 'Đề thi / Quiz',
    description: 'Luyện tập với đề thi thử, chấm điểm tự động ngay sau khi nộp',
    path: '/student/exams',
    color: '#722ed1',
    bg: '#f5edff',
  },
  {
    key: 'error-notebook',
    icon: <BookOutlined />,
    title: 'Sổ tay lỗi sai',
    description: 'Xem lại các câu bạn từng làm sai để ôn tập trọng tâm',
    path: '/student/error-notebook',
    color: '#d46b08',
    bg: '#fff3e0',
  },
  {
    key: 'ocr',
    icon: <CameraOutlined />,
    title: 'Viết tay / OCR tra Kanji',
    description: 'Vẽ hoặc chụp ảnh Kanji để tra nghĩa nhanh',
    comingSoon: true,
    color: '#8c8c8c',
    bg: '#f5f5f5',
  },
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    title: 'Bảng điều khiển',
    description: 'Theo dõi streak, tiến độ học và lịch sử làm bài của bạn',
    path: '/student/dashboard',
    color: '#08979c',
    bg: '#e6fffb',
  },
  {
    key: 'profile',
    icon: <ProfileOutlined />,
    title: 'Hồ sơ cá nhân',
    description: 'Cập nhật thông tin, đổi mật khẩu, chọn trình độ học tập',
    path: '/student/profile',
    color: '#c41d7f',
    bg: '#fff0f6',
  },
];

const STATS = [
  {
    key: 'vocab',
    icon: <TranslationOutlined />,
    color: '#1677ff',
    bg: '#e6f4ff',
    label: 'Từ vựng & Kanji',
  },
  {
    key: 'levels',
    icon: <TrophyOutlined />,
    color: '#722ed1',
    bg: '#f5edff',
    number: '2',
    label: 'Cấp độ JLPT (N5 · N4)',
  },
  {
    key: 'free',
    icon: <GiftOutlined />,
    color: '#389e0d',
    bg: '#f0f9e8',
    number: '2',
    label: 'Tính năng miễn phí',
  },
  {
    key: 'anytime',
    icon: <ClockCircleOutlined />,
    color: '#d46b08',
    bg: '#fff3e0',
    number: '24/7',
    label: 'Học mọi lúc, mọi nơi',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [searchValue, setSearchValue] = useState('');

  const { data: vocabPage } = useQuery({
    queryKey: ['home-vocab-count'],
    queryFn: () => studentVocabularyApi.search({ page: 0, size: 1 }),
  });
  const vocabCount = vocabPage?.totalElements;

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/vocabularies?q=${encodeURIComponent(trimmed)}` : '/vocabularies');
  };

  return (
    <div>
      <div className="home-hero">
        <div className="home-hero-content">
          <Typography.Title level={2} className="home-hero-title">
            日本語学習
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 24 }}>
            Học tiếng Nhật N5-N4 mỗi ngày — từ vựng, flashcard, đề thi và hơn thế nữa
          </Typography.Paragraph>
          <Input.Search
            size="large"
            className="home-hero-search"
            placeholder="Tra từ vựng, Kanji hoặc nghĩa tiếng Việt..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <Row gutter={[16, 16]} className="stats-section">
        {STATS.map((stat, i) => (
          <Col xs={12} md={6} key={stat.key}>
            <Card className="stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="stat-icon-badge" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-number">
                {stat.key === 'vocab' ? (vocabCount ? `${vocabCount}+` : '...') : stat.number}
              </div>
              <div className="stat-label">{stat.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Khám phá tính năng
      </Typography.Title>

      <Row gutter={[16, 16]}>
        {FEATURES.map((feature, i) => (
          <Col xs={24} sm={12} md={8} key={feature.key}>
            <Card
              className={`feature-card${feature.comingSoon ? ' feature-card-disabled' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => feature.path && navigate(feature.path)}
            >
              <Card.Meta
                avatar={
                  <div className="feature-icon-badge" style={{ background: feature.bg, color: feature.color }}>
                    {feature.icon}
                  </div>
                }
                title={
                  <div className="feature-card-title">
                    {feature.title}
                    {feature.comingSoon && <Tag color="default">Sắp ra mắt</Tag>}
                    {!feature.comingSoon && <ArrowRightOutlined className="feature-arrow" />}
                  </div>
                }
                description={feature.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} align="middle" className="showcase-section">
        <Col xs={24} md={11}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="showcase-panel" style={{ background: '#e6f4ff' }}>
                <div className="showcase-panel-icon">
                  <CreditCardOutlined style={{ color: '#1677ff' }} />
                </div>
                <Typography.Text strong>Flashcard thông minh</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Lật thẻ, đánh dấu Đã thuộc / Chưa thuộc để tập trung ôn đúng trọng tâm.
                </Typography.Text>
                <Typography.Link onClick={() => navigate('/flashcards')} style={{ fontSize: 13 }}>
                  Học ngay →
                </Typography.Link>
              </div>
            </Col>
            <Col span={12}>
              <div className="showcase-graphic">
                <div className="showcase-graphic-blob" style={{ width: 140, height: 140, top: -30, left: -30 }} />
                <div className="showcase-graphic-blob" style={{ width: 100, height: 100, bottom: -20, right: -20 }} />
                <div className="showcase-graphic-chip">あ</div>
              </div>
            </Col>
            <Col span={24}>
              <div className="showcase-panel" style={{ background: '#f5edff' }}>
                <div className="showcase-panel-icon">
                  <FileSearchOutlined style={{ color: '#722ed1' }} />
                </div>
                <Typography.Text strong>Luyện đề thi thử JLPT</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Câu hỏi được chọn ngẫu nhiên từ ngân hàng đề, chấm điểm và giải thích ngay sau khi nộp bài.
                </Typography.Text>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={13}>
          <Typography.Title level={2}>Vì sao học cùng chúng tôi?</Typography.Title>
          <Typography.Paragraph type="secondary" style={{ fontSize: 16 }}>
            Một nền tảng gọn nhẹ, tập trung đúng vào những gì người học N5-N4 thực sự cần: từ vựng
            chuẩn, ôn tập chủ động và luyện đề sát với kỳ thi thật.
          </Typography.Paragraph>
          <Typography.Paragraph>
            ✅ <b>Miễn phí thực sự</b> — tra từ vựng và học Flashcard không cần đăng ký tài khoản.
          </Typography.Paragraph>
          <Typography.Paragraph>
            ✅ <b>Bám sát JLPT</b> — nội dung phân theo đúng cấp độ N5 và N4.
          </Typography.Paragraph>
          <Typography.Paragraph>
            ✅ <b>Theo dõi tiến độ</b> — streak, tỷ lệ ghi nhớ và lịch sử làm bài rõ ràng.
          </Typography.Paragraph>
          <Button type="primary" size="large" onClick={() => navigate(user ? '/student/dashboard' : '/register')}>
            {user ? 'Vào Dashboard' : 'Đăng ký miễn phí'}
          </Button>
        </Col>
      </Row>

      <div className="cta-banner">
        <Typography.Title level={2} style={{ color: '#fff', marginBottom: 8 }}>
          Sẵn sàng chinh phục N5-N4?
        </Typography.Title>
        <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 24 }}>
          Bắt đầu ngay hôm nay — miễn phí, không cần thẻ tín dụng.
        </Typography.Paragraph>
        <Row justify="center" gutter={12}>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              style={{ background: '#fff', color: '#4b3fa8', borderColor: '#fff' }}
              onClick={() => navigate(user ? '/student/dashboard' : '/register')}
            >
              {user ? 'Vào Dashboard' : 'Đăng ký miễn phí'}
            </Button>
          </Col>
          <Col>
            <Button
              size="large"
              ghost
              onClick={() => navigate('/vocabularies')}
            >
              Khám phá tính năng
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
