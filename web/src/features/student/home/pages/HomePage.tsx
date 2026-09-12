import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Input, Row, Tag, Typography } from 'antd';
import {
  ArrowRightOutlined,
  BookOutlined,
  CameraOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  ReadOutlined,
} from '@ant-design/icons';
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

export default function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

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
          <div className="home-stats">
            <span className="home-stat-chip">📚 1000+ Từ vựng</span>
            <span className="home-stat-chip">🎯 N5 · N4</span>
            <span className="home-stat-chip">🆓 Tra từ &amp; Flashcard miễn phí</span>
          </div>
        </div>
      </div>

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
    </div>
  );
}
