import { Link } from 'react-router-dom';
import { Col, Row, Typography } from 'antd';

export default function PublicFooter() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #f0f0f0', marginTop: 48 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 24px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={8}>
            <Typography.Title level={4} style={{ marginTop: 0 }}>
              日本語学習
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ maxWidth: 320 }}>
              Dự án học tiếng Nhật N5-N4 miễn phí: tra cứu từ vựng, flashcard, đề thi thử và theo
              dõi tiến độ học tập của riêng bạn.
            </Typography.Paragraph>
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Typography.Title level={5}>Chức năng</Typography.Title>
            <FooterLinks
              links={[
                { label: 'Tra cứu Từ vựng & Kanji', to: '/vocabularies' },
                { label: 'Học Flashcard', to: '/flashcards' },
                { label: 'Đề thi / Quiz', to: '/student/exams' },
                { label: 'Viết tay / OCR (sắp ra mắt)', to: '/' },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Typography.Title level={5}>Tài khoản</Typography.Title>
            <FooterLinks
              links={[
                { label: 'Đăng nhập', to: '/login' },
                { label: 'Đăng ký', to: '/register' },
                { label: 'Bảng điều khiển', to: '/student/dashboard' },
                { label: 'Hồ sơ cá nhân', to: '/student/profile' },
              ]}
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Typography.Title level={5}>Về dự án</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Đây là dự án cá nhân xây dựng để phục vụ việc tự học và luyện thi JLPT N5-N4, đang
              được tiếp tục phát triển thêm tính năng.
            </Typography.Paragraph>
          </Col>
        </Row>
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0' }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} 日本語学習. Dự án học tập cá nhân.
          </Typography.Text>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: { label: string; to: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {links.map((link) => (
        <Link key={link.label} to={link.to} style={{ color: 'rgba(0,0,0,0.65)' }}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
