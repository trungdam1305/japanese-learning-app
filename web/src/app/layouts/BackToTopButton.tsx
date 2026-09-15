import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      shape="circle"
      type="primary"
      icon={<ArrowUpOutlined />}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
    />
  );
}
