import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { G } from '../styles/gradients';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: G.darkHero,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: G.heroOrb1, filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', background: G.heroOrb2, filter: 'blur(80px)' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo 제거 - Navbar에서 표시 */}

        {/* Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            border: '1px solid rgba(200,150,62,0.25)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>
            로그인
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
            봉봉단 계정으로 로그인하세요
          </p>

          {error && (
            <div style={{
              background: 'rgba(194,75,59,0.15)',
              border: '1px solid rgba(194,75,59,0.4)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#FF8070',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 아이디 */}
            <div>
              <label style={labelStyle}>아이디</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="아이디 입력"
                autoComplete="username"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label style={labelStyle}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                background: loading ? 'rgba(200,150,62,0.4)' : G.goldBtn,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(200,150,62,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(200,150,62,0.4)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(200,150,62,0.35)';
              }}
            >
              <LogIn size={18} />
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" style={{ color: '#C8963E', fontWeight: '700', textDecoration: 'none' }}>
                회원가입
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
            ← 홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '8px',
  letterSpacing: '0.3px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '13px 16px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};