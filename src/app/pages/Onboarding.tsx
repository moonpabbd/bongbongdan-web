import { useState, useLayoutEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { G } from '../styles/gradients';
import { projectId } from '/utils/supabase/info';
import { formatPhoneNumber } from '../../utils/format';
import { useAuth } from '../context/AuthContext';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

interface FormState {
  name: string;
  gender: string;
  birthdate: string;
  phone: string;
  kakaoId: string;
  privacyAgreement: boolean;
  marketingAgreement: boolean;
}

export function Onboarding() {
  const navigate = useNavigate();
  const { user, needsOnboarding, refreshProfile } = useAuth();
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [memberNumber, setMemberNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [marketingExpanded, setMarketingExpanded] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // 구글 로그인 후 user_metadata.name이 있으면 기본값으로 사용
  const initialName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';

  const [form, setForm] = useState<FormState>({
    name: initialName,
    gender: '',
    birthdate: '',
    phone: '',
    kakaoId: '',
    privacyAgreement: false,
    marketingAgreement: false,
  });

  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const updateBirthdate = (y: string, m: string, d: string) => {
    if (y && m && d) {
      setField('birthdate', `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    } else {
      setField('birthdate', '');
    }
  };

  const setField = (field: keyof FormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!form.name.trim()) return setError('이름을 입력해주세요.');
    if (!form.gender) return setError('성별을 선택해주세요.');
    if (!form.birthdate) return setError('생년월일을 모두 선택해주세요.');
    if (!form.phone.trim()) return setError('연락처를 입력해주세요.');
    if (!form.kakaoId.trim()) return setError('카카오톡 ID를 입력해주세요.');
    if (!form.privacyAgreement) return setError('개인정보 수집 및 이용에 동의해야 합니다.');

    setLoading(true);
    try {
      const sessionRes = await user?.id ? window.localStorage.getItem('oauth_provider_token') : null;
      // We will just use the Supabase session token
      const sessionStr = window.localStorage.getItem(`sb-${projectId}-auth-token`);
      let token = '';
      if (sessionStr) {
        const sessionData = JSON.parse(sessionStr);
        token = sessionData.access_token;
      }

      if (!token) {
        setError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${SERVER}/auth/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '정보 저장 중 오류가 발생했습니다.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMemberNumber(data.memberNumber);
        await refreshProfile(); // Refresh profile so needsOnboarding becomes false
        setStep('done');
      }
    } catch (err) {
      setError(`네트워크 오류: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: G.darkHero, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: G.heroOrb1, filter: 'blur(80px)' }} />
        <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(200,150,62,0.3)', borderRadius: '24px', padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(200,150,62,0.3), rgba(200,150,62,0.1))', border: '2px solid rgba(200,150,62,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={40} color="#F5C875" strokeWidth={1.5} />
              </div>
            </div>
            <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
              🎉 가입을 환영합니다!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '28px', lineHeight: '1.7' }}>
              봉봉단의 새로운 단원이 되셨습니다.<br />
              아래 회원 고유번호를 꼭 기억해주세요.
            </p>
            <div style={{ background: 'linear-gradient(135deg, rgba(200,150,62,0.15), rgba(200,150,62,0.05))', border: '1px solid rgba(200,150,62,0.4)', borderRadius: '14px', padding: '24px', marginBottom: '32px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '10px' }}>
                회원 고유번호
              </p>
              <p style={{ color: '#F5C875', fontSize: '30px', fontWeight: '800', letterSpacing: '3px' }}>
                {memberNumber}
              </p>
            </div>
            <button onClick={() => navigate('/')} style={{ width: '100%', background: G.goldBtn, color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(200,150,62,0.35)' }}>
              메인으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: G.darkHero, padding: '100px 20px 100px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: G.heroOrb1, filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '-50px', right: '-100px', width: '350px', height: '350px', background: G.heroOrb3, filter: 'blur(80px)' }} />

      <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>추가 정보 입력</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '36px' }}>활동을 위해 추가적인 인적 사항을 작성해주세요.</p>

        {error && (
          <div style={{ background: 'rgba(194,75,59,0.15)', border: '1px solid rgba(194,75,59,0.4)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#FF8070', fontSize: '14px', lineHeight: '1.5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 섹션 2: 기본 인적 사항 */}
          <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ color: '#F5C875', fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(200,150,62,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#F5C875' }}>1</div>
              기본 정보
            </h2>

            {/* 이름 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>이름 (실명)</label>
              <input type="text" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="홍길동" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
            </div>

            {/* 성별 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>성별</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['남성', '여성'].map(g => (
                  <button type="button" key={g} onClick={() => setField('gender', g)} style={{ flex: 1, padding: '14px', background: form.gender === g ? 'rgba(200,150,62,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${form.gender === g ? 'rgba(200,150,62,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: form.gender === g ? '#F5C875' : '#fff', fontSize: '15px', fontWeight: form.gender === g ? '700' : '400', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 생년월일 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>생년월일</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select value={birthYear} onChange={e => { setBirthYear(e.target.value); updateBirthdate(e.target.value, birthMonth, birthDay); }} style={{ flex: 1.5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}>
                  <option value="" style={{ color: '#000' }}>년도</option>
                  {Array.from({ length: 60 }, (_, i) => 2006 - i).map(y => (
                    <option key={y} value={y} style={{ color: '#000' }}>{y}년</option>
                  ))}
                </select>
                <select value={birthMonth} onChange={e => { setBirthMonth(e.target.value); updateBirthdate(birthYear, e.target.value, birthDay); }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}>
                  <option value="" style={{ color: '#000' }}>월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m} style={{ color: '#000' }}>{m}월</option>
                  ))}
                </select>
                <select value={birthDay} onChange={e => { setBirthDay(e.target.value); updateBirthdate(birthYear, birthMonth, e.target.value); }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}>
                  <option value="" style={{ color: '#000' }}>일</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d} style={{ color: '#000' }}>{d}일</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 연락처 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>휴대폰 번호 ( - 생략 )</label>
              <input type="tel" value={form.phone} onChange={e => setField('phone', formatPhoneNumber(e.target.value))} placeholder="01012345678" maxLength={13} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }} />
            </div>

            {/* 카카오 ID */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                카카오톡 ID <span style={{ color: '#F5C875', fontSize: '11px', background: 'rgba(200,150,62,0.1)', padding: '2px 6px', borderRadius: '4px' }}>봉사 집결 및 안내용</span>
              </label>
              <input type="text" value={form.kakaoId} onChange={e => setField('kakaoId', e.target.value)} placeholder="카카오톡 ID를 입력해주세요" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }} />
            </div>
          </div>

          {/* 섹션 3: 약관 동의 */}
          <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
            <h2 style={{ color: '#F5C875', fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(200,150,62,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#F5C875' }}>2</div>
              약관 동의
            </h2>

            {/* 필수 동의 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setField('privacyAgreement', !form.privacyAgreement)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${form.privacyAgreement ? '#F5C875' : 'rgba(255,255,255,0.2)'}`, background: form.privacyAgreement ? '#F5C875' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {form.privacyAgreement && <Check size={16} color="#000" strokeWidth={3} />}
                  </div>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}><span style={{ color: '#F5C875' }}>[필수]</span> 개인정보 수집 및 이용 동의</span>
                </div>
                <div onClick={(e) => { e.stopPropagation(); setPrivacyExpanded(!privacyExpanded); }} style={{ padding: '4px', color: 'rgba(255,255,255,0.4)', hover: { color: '#fff' } }}>
                  {privacyExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {privacyExpanded && (
                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.6', marginTop: '-4px' }}>
                  1. 수집 목적 : 봉사활동 기록 관리 및 단원 운영<br />
                  2. 수집 항목 : 이름, 성별, 생년월일, 연락처, 카카오톡 ID 등<br />
                  3. 보유 기간 : 회원 탈퇴 시까지
                </div>
              )}
            </div>

            {/* 선택 동의 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setField('marketingAgreement', !form.marketingAgreement)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${form.marketingAgreement ? '#F5C875' : 'rgba(255,255,255,0.2)'}`, background: form.marketingAgreement ? '#F5C875' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {form.marketingAgreement && <Check size={16} color="#000" strokeWidth={3} />}
                  </div>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>[선택]</span> 마케팅 및 이벤트 수신 동의</span>
                </div>
                <div onClick={(e) => { e.stopPropagation(); setMarketingExpanded(!marketingExpanded); }} style={{ padding: '4px', color: 'rgba(255,255,255,0.4)' }}>
                  {marketingExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {marketingExpanded && (
                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.6', marginTop: '-4px' }}>
                  봉사 모집 알림, 이벤트, 공지사항 등을 카카오톡이나 문자로 수신하는 데 동의합니다.
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(200,150,62,0.5)' : G.goldBtn, color: '#fff', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(200,150,62,0.25)' }}>
            {loading ? '처리 중...' : '가입 완료하기'}
          </button>
        </form>

      </div>
    </div>
  );
}
