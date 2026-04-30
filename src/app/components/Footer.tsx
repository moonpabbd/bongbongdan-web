import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Mail, Instagram, ExternalLink } from 'lucide-react';
import { logoSloganImg } from '../imageAssets';
import { G, gradientText } from '../styles/gradients';

const footerLinks = [
  { label: '공지사항', path: '/news?tab=notices' },
  { label: '주요 일정', path: '/news?tab=schedules' },
  { label: '봉사 문파', path: '/about?tab=intro' },
  { label: '직급·직책', path: '/about?tab=ranks' },
  { label: '조직도', path: '/about?tab=orgchart' },
  { label: '명예·혜택', path: '/news' },
  { label: '봉사 안내', path: '/activities?tab=method' },
  { label: '보호소 소개', path: '/activities?tab=shelters' },
  { label: 'FAQ', path: '/faq' },
];

const policyLinks = [
  { label: '이용약관', path: '/terms' },
  { label: '개인정보처리방침', path: '/privacy' },
];

export function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <footer style={{ background: G.warmSection, color: '#1E3A5F', padding: '64px 40px 32px', borderTop: '1px solid rgba(200,150,62,0.15)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Footer Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          {/* Logo & Info */}
          <div>
            <img
              src={logoSloganImg}
              alt="봉봉단"
              style={{ height: '56px', objectFit: 'contain', marginBottom: '20px' }}
            />
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', marginBottom: '12px', fontWeight: '500' }}>
              의협을 실천하는 봉사문파<br />
              봉봉단
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.6' }}>
              설립: 2026년 2월<br />
              대표: 박진범<br />
              사업자등록번호: 660-80-03378
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 style={{ color: '#A87830', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', marginBottom: '20px' }}>
              문파 구역도
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{ color: '#4B5563', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s', fontWeight: '500' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C8963E'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4B5563'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <h4 style={{ color: '#A87830', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', marginBottom: '20px' }}>
              정책 및 약관
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {policyLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{ color: '#4B5563', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s', fontWeight: '500' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C8963E'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4B5563'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: isMobile ? '0' : '33px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('Info@bbd.or.kr');
                  alert('이메일 주소(Info@bbd.or.kr)가 복사되었습니다.');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4B5563', background: 'none', border: 'none', padding: 0, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <Mail size={16} color="#C8963E" />
                Info@bbd.or.kr
              </button>
              <a
                href="https://instagram.com/bongbongdan_official"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
              >
                <Instagram size={16} color="#C8963E" />
                @bongbongdan_official
              </a>
              <a
                href="https://blog.naver.com/moonpabbd"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '1.5px solid #C8963E',
                  color: '#C8963E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: '900',
                  lineHeight: 1,
                  flexShrink: 0
                }}>N</div>
                Naver Blog
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(200,150,62,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
            © 2026 봉봉단(BBD). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}