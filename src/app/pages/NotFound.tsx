import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Ghost, Home, ArrowLeft } from 'lucide-react';
import { G, gradientText } from '../styles/gradients';

export function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FDFCFA',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Helmet>
        <title>페이지를 찾을 수 없습니다 - 봉봉단</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{
        background: 'rgba(200, 150, 62, 0.05)',
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <Ghost size={56} color="#C8963E" />
      </div>

      <h1 style={{
        fontSize: 'clamp(32px, 6vw, 48px)',
        fontWeight: '900',
        color: '#1E3A5F',
        marginBottom: '16px'
      }}>
        404 <span style={{ color: '#C8963E' }}>Not Found</span>
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#6B7280',
        marginBottom: '8px',
        fontWeight: '500'
      }}>
        앗! 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <p style={{
        fontSize: '14px',
        color: '#9CA3AF',
        marginBottom: '40px',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        주소가 잘못 입력되었거나, 페이지가 변경 혹은 삭제되었을 수 있습니다.
        다시 한번 확인해 주세요.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            color: '#4B5563',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F9FAFB';
            e.currentTarget.style.borderColor = '#D1D5DB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
        >
          <ArrowLeft size={18} />
          이전 페이지
        </button>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: G.goldBtn,
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '700',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(200, 150, 62, 0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Home size={18} />
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
