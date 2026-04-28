import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { projectId } from '/utils/supabase/info';
import { G } from '../styles/gradients';
import { formatPhoneNumber } from '../../utils/format';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

export function EditProfile() {
  const { user, profile, session, refreshProfile, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [kakaoId, setKakaoId] = useState('');
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // 로그인이 안되어 있으면 로그인 페이지로 이동
        navigate('/login');
      } else if (profile) {
        setName(profile.name || '');
        setUsername(profile.username || '');
        setBirthdate(profile.birthdate || '');
        setPhone(profile.phone || '');
        setKakaoId(profile.kakaoId || '');
        setMarketingAgreement(profile.marketingAgreement || false);
      }
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>데이터를 불러오는 중입니다...</div>;
  if (!user) return null;
  
  // 인증은 되었으나 DB에 프로필(KV) 데이터가 유실되었거나 없는 비정상 계정일 경우
  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
      <h2 style={{ color: '#1E3A5F', marginBottom: '12px' }}>회원 정보를 찾을 수 없습니다.</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>가입 정보가 손상되었거나 이전 시스템의 테스트 계정일 수 있습니다.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#C8963E', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>홈으로 돌아가기</button>
        <button 
          onClick={async () => {
            if (confirm('이 손상된 계정을 완전히 삭제하시겠습니까? 삭제 후 다시 정상적으로 회원가입할 수 있습니다.')) {
              try {
                const res = await fetch(`${SERVER}/auth/profile`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${session?.access_token}` }
                });
                if (!res.ok) {
                  const data = await res.json();
                  throw new Error(data.error || '계정 삭제 실패');
                }
                await logout();
                alert('계정이 삭제되었습니다.');
                navigate('/signup');
              } catch (e: any) {
                alert(`계정 삭제 중 오류가 발생했습니다: ${e.message}`);
              }
            }
          }}
          style={{ padding: '10px 20px', background: '#EF4444', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          이 계정 삭제하기
        </button>
      </div>
    </div>
  );

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 탈퇴하시겠습니까? 탈퇴 후에는 모든 봉사 기록과 정보가 삭제되며 복구할 수 없습니다.')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/auth/profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) {
        alert('회원 탈퇴가 완료되었습니다. 그동안 봉봉단과 함께 해주셔서 감사합니다.');
        await logout();
        navigate('/');
      } else {
        const data = await res.json();
        setError(data.error || '회원 탈퇴 처리에 실패했습니다.');
      }
    } catch (err: any) {
      setError(`서버와 통신 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) { setError('이름을 입력해주세요.'); return; }
    if (!username.trim()) { setError('아이디를 입력해주세요.'); return; }
    if (!birthdate.trim()) { setError('생년월일을 입력해주세요.'); return; }
    if (!phone.trim()) { setError('연락처를 입력해주세요.'); return; }
    if (!kakaoId.trim()) { setError('카카오톡 ID를 입력해주세요.'); return; }
    
    if (newPassword && newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword && newPassword !== newPasswordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          birthdate: birthdate.trim(),
          phone: phone.trim(),
          kakaoId: kakaoId.trim(),
          marketingAgreement,
          newPassword: newPassword ? newPassword : undefined
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || '정보 수정에 실패했습니다.');
      } else {
        await refreshProfile();
        setSuccessMsg('정보가 성공적으로 수정되었습니다.');
        setNewPassword('');
        setNewPasswordConfirm('');
        
        // 비밀번호를 변경한 경우, 세션이 끊길 수 있으므로 로그아웃 처리 유도
        if (newPassword) {
          alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
          await logout();
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>
      <main style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1E3A5F', marginBottom: '8px' }}>
              내 정보 변경
            </h1>
            <p style={{ color: '#6B7280', fontSize: '15px' }}>
              연락처, 카카오톡 ID 및 비밀번호를 변경할 수 있습니다.
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '40px 32px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* 변경 가능 정보 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                이름 <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                아이디 <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="아이디"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
              {username !== profile.username && (
                <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '6px' }}>아이디 변경 시 로그아웃되며 새 아이디로 다시 로그인해야 합니다.</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                생년월일 <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                type="date" 
                value={birthdate}
                onChange={e => setBirthdate(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                연락처 <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={phone}
                onChange={e => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="010-0000-0000"
                maxLength={13}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                카카오톡 ID <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={kakaoId}
                onChange={e => setKakaoId(e.target.value)}
                placeholder="카카오톡 ID를 입력해주세요"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                새 비밀번호 <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '13px' }}>(변경할 경우에만 입력)</span>
              </label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="새로운 비밀번호 (8자 이상)"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  marginBottom: '12px'
                }}
              />
              <input 
                type="password" 
                value={newPasswordConfirm}
                onChange={e => setNewPasswordConfirm(e.target.value)}
                placeholder="새로운 비밀번호 확인"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />

            <div style={{ background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={marketingAgreement}
                  onChange={e => setMarketingAgreement(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                  마케팅 및 안내 문자 수신 동의 (선택)
                </span>
              </label>
              <div style={{ paddingLeft: '28px', fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
                비영리 목적의 행사 공유, 봉사 외 친목 모임, 유익한 봉사 관련 정보 등을 받아보실 수 있습니다.<br/>
                <span style={{ color: '#9CA3AF', fontSize: '12px', display: 'inline-block', marginTop: '4px' }}>
                  ※ 수신을 거부하셔도 봉봉단 봉사 참여와 관련된 필수적인 기본 안내는 정상 발송됩니다.
                </span>
              </div>
            </div>

            {error && (
              <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', background: '#FEF2F2', padding: '12px', borderRadius: '8px', fontWeight: '500' }}>
                {error}
              </div>
            )}
            {successMsg && (
              <div style={{ color: '#059669', fontSize: '14px', textAlign: 'center', background: '#D1FAE5', padding: '12px', borderRadius: '8px', fontWeight: '500' }}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: G.goldBtn,
                color: '#fff',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '10px',
                boxShadow: '0 8px 20px rgba(200,150,62,0.3)'
              }}
            >
              {loading ? '처리 중...' : '변경 사항 저장'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '13px',
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline'
              }}
            >
              회원 탈퇴하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
