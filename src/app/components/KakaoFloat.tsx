import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function KakaoFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="http://pf.kakao.com/_zxcZIX/chat"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: hovered ? '8px' : '0',
        background: '#FEE500',
        color: '#191919',
        padding: hovered ? '14px 20px' : '14px',
        borderRadius: '50px',
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.25)'
          : '0 4px 16px rgba(0,0,0,0.15)',
        textDecoration: 'none',
        fontWeight: '700',
        fontSize: '14px',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
      title="카카오 채널 문의"
    >
      <MessageCircle size={20} fill="#191919" />
      <span
        style={{
          maxWidth: hovered ? '100px' : '0',
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s',
        }}
      >
        카카오 문의
      </span>
    </a>
  );
}
