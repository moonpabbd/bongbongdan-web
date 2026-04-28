import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, LogIn, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { G } from '../styles/gradients';
import { projectId } from '/utils/supabase/info';
import { formatPhoneNumber } from '../../utils/format';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 아이디 찾기 상태
  const [findIdModal, setFindIdModal] = useState(false);
  const [findIdForm, setFindIdForm] = useState({ name: '', phone: '', kakaoId: '' });
  const [foundId, setFoundId] = useState('');
  const [findIdError, setFindIdError] = useState('');
  const [findIdLoading, setFindIdLoading] = useState(false);

  // 비밀번호 찾기 상태
  const [findPwModal, setFindPwModal] = useState(false);
  const [findPwForm, setFindPwForm] = useState({ username: '', name: '', phone: '', newPassword: '', newPasswordConfirm: '' });
  const [pwResetSuccess, setPwResetSuccess] = useState(false);
  const [findPwError, setFindPwError] = useState('');
  const [findPwLoading, setFindPwLoading] = useState(false);

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

  const handleFindId = async (e: FormEvent) => {
    e.preventDefault();
    setFindIdError('');
    setFoundId('');
    if (!findIdForm.name || !findIdForm.phone || !findIdForm.kakaoId) {
      setFindIdError('모든 항목을 입력해주세요.');
      return;
    }
    setFindIdLoading(true);
    try {
      const res = await fetch(`${SERVER}/auth/find-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findIdForm)
      });
      const data = await res.json();
      if (res.ok) {
        setFoundId(data.username);
      } else {
        setFindIdError(data.error || '계정을 찾을 수 없습니다.');
      }
    } catch (err) {
      setFindIdError('서버 오류가 발생했습니다.');
    } finally {
      setFindIdLoading(false);
    }
  };

  const handleResetPw = async (e: FormEvent) => {
    e.preventDefault();
    setFindPwError('');
    if (!findPwForm.username || !findPwForm.name || !findPwForm.phone || !findPwForm.newPassword) {
      setFindPwError('모든 항목을 입력해주세요.');
      return;
    }
    if (findPwForm.newPassword.length < 8) {
      setFindPwError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (findPwForm.newPassword !== findPwForm.newPasswordConfirm) {
      setFindPwError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setFindPwLoading(true);
    try {
      const res = await fetch(`${SERVER}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findPwForm)
      });
      const data = await res.json();
      if (res.ok) {
        setPwResetSuccess(true);
      } else {
        setFindPwError(data.error || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (err) {
      setFindPwError('서버 오류가 발생했습니다.');
    } finally {
      setFindPwLoading(false);
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '-4px', marginBottom: '8px' }}>
              <button type="button" onClick={() => setFindIdModal(true)} style={linkBtnStyle}>아이디 찾기</button>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>|</span>
              <button type="button" onClick={() => setFindPwModal(true)} style={linkBtnStyle}>비밀번호 찾기</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
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

      {/* 아이디 찾기 모달 */}
      {findIdModal && (
        <Modal onClose={() => setFindIdModal(false)} title="아이디 찾기">
          {foundId ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#6B7280', marginBottom: '12px', fontSize: '15px' }}>회원님의 아이디는 아래와 같습니다.</p>
              <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '12px', fontSize: '20px', fontWeight: '700', color: '#1E3A5F', marginBottom: '24px' }}>
                {foundId}
              </div>
              <button
                onClick={() => { setUsername(foundId); setFindIdModal(false); }}
                style={modalBtnStyle}
              >
                로그인하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleFindId} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>가입 시 입력한 정보를 정확히 입력해주세요.</p>
              <div>
                <label style={modalLabelStyle}>이름</label>
                <input type="text" value={findIdForm.name} onChange={e => setFindIdForm(p => ({ ...p, name: e.target.value }))} style={modalInputStyle} placeholder="이름" />
              </div>
              <div>
                <label style={modalLabelStyle}>연락처</label>
                <input type="tel" value={findIdForm.phone} onChange={e => setFindIdForm(p => ({ ...p, phone: formatPhoneNumber(e.target.value) }))} style={modalInputStyle} placeholder="010-0000-0000" maxLength={13} />
              </div>
              <div>
                <label style={modalLabelStyle}>카카오톡 ID</label>
                <input type="text" value={findIdForm.kakaoId} onChange={e => setFindIdForm(p => ({ ...p, kakaoId: e.target.value }))} style={modalInputStyle} placeholder="카카오톡 ID" />
              </div>
              {findIdError && <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{findIdError}</p>}
              <button type="submit" disabled={findIdLoading} style={modalBtnStyle}>
                {findIdLoading ? '확인 중...' : '아이디 찾기'}
              </button>
            </form>
          )}
        </Modal>
      )}

      {/* 비밀번호 찾기 모달 */}
      {findPwModal && (
        <Modal onClose={() => setFindPwModal(false)} title="비밀번호 찾기 (초기화)">
          {pwResetSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#059669', fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>변경 완료!</p>
              <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '15px' }}>새로운 비밀번호로 성공적으로 변경되었습니다.</p>
              <button
                onClick={() => { setFindPwModal(false); }}
                style={modalBtnStyle}
              >
                새 비밀번호로 로그인하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPw} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>가입 시 정보를 확인하고 비밀번호를 새로 설정합니다.</p>
              <div>
                <label style={modalLabelStyle}>아이디</label>
                <input type="text" value={findPwForm.username} onChange={e => setFindPwForm(p => ({ ...p, username: e.target.value }))} style={modalInputStyle} placeholder="아이디" />
              </div>
              <div>
                <label style={modalLabelStyle}>이름</label>
                <input type="text" value={findPwForm.name} onChange={e => setFindPwForm(p => ({ ...p, name: e.target.value }))} style={modalInputStyle} placeholder="이름" />
              </div>
              <div>
                <label style={modalLabelStyle}>연락처</label>
                <input type="tel" value={findPwForm.phone} onChange={e => setFindPwForm(p => ({ ...p, phone: formatPhoneNumber(e.target.value) }))} style={modalInputStyle} placeholder="010-0000-0000" maxLength={13} />
              </div>
              
              <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
              
              <div>
                <label style={modalLabelStyle}>새 비밀번호</label>
                <input type="password" value={findPwForm.newPassword} onChange={e => setFindPwForm(p => ({ ...p, newPassword: e.target.value }))} style={modalInputStyle} placeholder="새로운 비밀번호 (8자 이상)" />
              </div>
              <div>
                <label style={modalLabelStyle}>새 비밀번호 확인</label>
                <input type="password" value={findPwForm.newPasswordConfirm} onChange={e => setFindPwForm(p => ({ ...p, newPasswordConfirm: e.target.value }))} style={modalInputStyle} placeholder="비밀번호 확인" />
              </div>

              {findPwError && <p style={{ color: '#EF4444', fontSize: '13px', margin: 0 }}>{findPwError}</p>}
              <button type="submit" disabled={findPwLoading} style={modalBtnStyle}>
                {findPwLoading ? '처리 중...' : '비밀번호 재설정'}
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal Component
function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E3A5F' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
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

const linkBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '13px',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
};

const modalLabelStyle: React.CSSProperties = {
  display: 'block',
  color: '#374151',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '6px',
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  padding: '12px 14px',
  color: '#1F2937',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const modalBtnStyle: React.CSSProperties = {
  width: '100%',
  background: '#1E3A5F',
  color: '#fff',
  border: 'none',
  padding: '14px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '8px',
};