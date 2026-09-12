import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Input, Row, Tag, Typography } from 'antd';
import {
  BookOutlined,
  CameraOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  ReadOutlined,
} from '@ant-design/icons';

interface FeatureCard {
  key: string;
  icon: ReactNode;
  title: string;
  description: string;
  path?: string;
  comingSoon?: boolean;
}

const FEATURES: FeatureCard[] = [
  {
    key: 'vocabularies',
    icon: <ReadOutlined />,
    title: 'Tra cứu Từ vựng & Kanji',
    description: 'Tìm nghĩa, cách đọc và ví dụ cho hàng nghìn từ vựng N5-N4',
    path: '/student/vocabularies',
  },
  {
    key: 'flashcards',
    icon: <CreditCardOutlined />,
    title: 'Học Flashcard',
    description: 'Ôn từ vựng bằng thẻ lật, đánh dấu Đã thuộc / Chưa thuộc',
    path: '/student/flashcards',
  },
  {
    key: 'exams',
    icon: <FileSearchOutlined />,
    title: 'Đề thi / Quiz',
    description: 'Luyện tập với đề thi thử, chấm điểm tự động ngay sau khi nộp',
    path: '/student/exams',
  },
  {
    key: 'error-notebook',
    icon: <BookOutlined />,
    title: 'Sổ tay lỗi sai',
    description: 'Xem lại các câu bạn từng làm sai để ôn tập trọng tâm',
    path: '/student/error-notebook',
  },
  {
    key: 'ocr',
    icon: <CameraOutlined />,
    title: 'Viết tay / OCR tra Kanji',
    description: 'Vẽ hoặc chụp ảnh Kanji để tra nghĩa nhanh',
    comingSoon: true,
  },
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    title: 'Bảng điều khiển',
    description: 'Theo dõi streak, tiến độ học và lịch sử làm bài của bạn',
    path: '/student/dashboard',
  },
  {
    key: 'profile',
    icon: <ProfileOutlined />,
    title: 'Hồ sơ cá nhân',
    description: 'Cập nhật thông tin, đổi mật khẩu, chọn trình độ học tập',
    path: '/student/profile',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/student/vocabularies?q=${encodeURIComponent(trimmed)}` : '/student/vocabularies');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '32px 0 40px' }}>
        <Typography.Title level={2} style={{ marginBottom: 4 }}>
          日本語学習
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ fontSize: 16 }}>
          Học tiếng Nhật N5-N4 mỗi ngày — từ vựng, flashcard, đề thi và hơn thế nữa
        </Typography.Paragraph>
        <Input.Search
          size="large"
          placeholder="Tra từ vựng, Kanji hoặc nghĩa tiếng Việt..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 480, margin: '0 auto' }}
        />
      </div>

      <Row gutter={[16, 16]}>
        {FEATURES.map((feature) => (
          <Col xs={24} sm={12} md={8} key={feature.key}>
            <Card
              hoverable={!feature.comingSoon}
              onClick={() => feature.path && navigate(feature.path)}
              style={{ height: '100%', opacity: feature.comingSoon ? 0.6 : 1, cursor: feature.comingSoon ? 'default' : 'pointer' }}
            >
              <Card.Meta
                avatar={<span style={{ fontSize: 28, color: '#d4380d' }}>{feature.icon}</span>}
                title={
                  <>
                    {feature.title} {feature.comingSoon && <Tag color="default">Sắp ra mắt</Tag>}
                  </>
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
