import { useState, useLayoutEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, UserPlus, CheckCircle2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { G } from '../styles/gradients';
import { logoImg } from '../imageAssets';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useAuth } from '../context/AuthContext';
import { formatPhoneNumber } from '../../utils/format';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;



interface FormState {
  // 계정 정보
  username: string;
  password: string;
  passwordConfirm: string;
  // 기본 정보
  name: string;
  gender: string;
  birthdate: string;
  phone: string;
  kakaoId: string;

  // 약관
  privacyAgreement: boolean;
  marketingAgreement: boolean;
}

export function Signup() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [memberNumber, setMemberNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [marketingExpanded, setMarketingExpanded] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [usernameMsg, setUsernameMsg] = useState('');

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    gender: '',
    birthdate: '',
    phone: '',
    kakaoId: '',

    privacyAgreement: false,
    marketingAgreement: false,
  });

  // 생년월일 별도 state
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  // 연/월/일 변경 시 form.birthdate 동기화
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

  // 아이디 중복 확인
  const checkUsername = async () => {
    const val = form.username.trim();
    if (!val) return;
    if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(val)) {
      setUsernameStatus('error');
      setUsernameMsg('영문 시작, 4~20자 영문/숫자/언더스코어만 가능합니다.');
      return;
    }
    setUsernameStatus('checking');
    setUsernameMsg('확인 중...');
    try {
      const res = await fetch(`${SERVER}/auth/check-username?username=${encodeURIComponent(val)}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();
      if (data.available) {
        setUsernameStatus('ok');
        setUsernameMsg('사용 가능한 아이디입니다.');
      } else {
        setUsernameStatus('error');
        setUsernameMsg('이미 사용 중인 아이디입니다.');
      }
    } catch {
      setUsernameStatus('error');
      setUsernameMsg('확인 중 오류가 발생했습니다.');
    }
  };

  const validate = (): string => {
    if (!form.username.trim()) return '아이디를 입력해주세요.';
    if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(form.username)) return '아이디 형식이 올바르지 않습니다.';
    if (usernameStatus === 'error') return '아이디를 다시 확인해주세요.';
    if (usernameStatus !== 'ok') return '아이디 중복 확인을 해주세요.';
    if (!form.password) return '비밀번호를 입력해주세요.';
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    if (!form.name.trim()) return '이름을 입력해주세요.';
    if (!form.gender) return '성별을 선택해주세요.';
    if (!form.birthdate) return '생년월일을 입력해주세요.';
    if (!form.phone.trim()) return '연락처를 입력해주세요.';
    if (!form.kakaoId.trim()) return '카카오톡 ID를 입력해주세요.';
    if (!form.privacyAgreement) return '개인정보 수집 및 이용에 동의해주세요.';
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const validErr = validate();
    if (validErr) { setError(validErr); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          name: form.name.trim(),
          gender: form.gender,
          phone: form.phone.trim(),
          birthdate: form.birthdate,
          kakaoId: form.kakaoId.trim(),
          marketingAgreement: form.marketingAgreement,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '회원가입 중 오류가 발생했습니다.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMemberNumber(data.memberNumber);
        setStep('done');
      }
    } catch (err) {
      setError(`네트워크 오류: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── 완료 화면 ───────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: G.darkHero, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: G.heroOrb1, filter: 'blur(80px)' }} />
        <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            border: '1px solid rgba(200,150,62,0.3)',
            borderRadius: '24px',
            padding: '48px 40px',
            textAlign: 'center',
          }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(200,150,62,0.3), rgba(200,150,62,0.1))', border: '2px solid rgba(200,150,62,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={40} color="#F5C875" strokeWidth={1.5} />
              </div>
            </div>
            <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
              🎉 입문을 환영합니다!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '28px', lineHeight: '1.7' }}>
              봉봉단의 새로운 단원이 되셨습니다.<br />
              아래 회원 고유번호를 꼭 기억해주세요.
            </p>
            <div style={{
              background: 'linear-gradient(135deg, rgba(200,150,62,0.15), rgba(200,150,62,0.05))',
              border: '1px solid rgba(200,150,62,0.4)',
              borderRadius: '14px',
              padding: '24px',
              marginBottom: '32px',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '10px' }}>
                회원 고유번호
              </p>
              <p style={{ color: '#F5C875', fontSize: '30px', fontWeight: '800', letterSpacing: '3px' }}>
                {memberNumber}
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                background: G.goldBtn,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(200,150,62,0.35)',
              }}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 회원가입 폼 ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: G.darkHero, padding: '100px 20px 100px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: G.heroOrb1, filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '-50px', right: '-100px', width: '350px', height: '350px', background: G.heroOrb3, filter: 'blur(80px)' }} />

      <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>회원가입</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '36px' }}>봉봉단 단원이 되어 함께해요</p>

        {error && (
          <div style={{
            background: 'rgba(194,75,59,0.15)',
            border: '1px solid rgba(194,75,59,0.4)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            color: '#FF8070',
            fontSize: '14px',
            lineHeight: '1.5',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* ── 계정 정보 ── */}
          <SectionLabel>계정 정보</SectionLabel>

          {/* 아이디 */}
          <div>
            <label style={labelStyle}>아이디 <Required /></label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={form.username}
                onChange={e => {
                  setField('username', e.target.value);
                  setUsernameStatus('idle');
                  setUsernameMsg('');
                }}
                placeholder="영문으로 시작, 4~20자"
                autoComplete="username"
                style={{
                  ...inputStyle,
                  flex: 1,
                  borderColor: usernameStatus === 'ok'
                    ? 'rgba(74,124,89,0.6)'
                    : usernameStatus === 'error'
                      ? 'rgba(194,75,59,0.6)'
                      : 'rgba(255,255,255,0.12)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => {
                  if (usernameStatus === 'ok') e.currentTarget.style.borderColor = 'rgba(74,124,89,0.6)';
                  else if (usernameStatus === 'error') e.currentTarget.style.borderColor = 'rgba(194,75,59,0.6)';
                  else e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              />
              <button
                type="button"
                onClick={checkUsername}
                style={{
                  padding: '0 16px',
                  background: 'rgba(200,150,62,0.15)',
                  border: '1px solid rgba(200,150,62,0.4)',
                  borderRadius: '10px',
                  color: '#F5C875',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                중복 확인
              </button>
            </div>
            {usernameMsg && (
              <p style={{
                fontSize: '12px', marginTop: '6px',
                color: usernameStatus === 'ok' ? '#6AB88A' : usernameStatus === 'error' ? '#FF8070' : 'rgba(255,255,255,0.5)',
              }}>
                {usernameStatus === 'ok' && '✓ '}{usernameMsg}
              </p>
            )}
            {!usernameMsg && (
              <p style={{ fontSize: '12px', marginTop: '6px', color: 'rgba(255,255,255,0.35)' }}>
                영문으로 시작하는 4~20자 (영문/숫자/언더스코어)
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label style={labelStyle}>비밀번호 <Required /> <span style={{ fontWeight: '400', color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>8자 이상</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setField('password', e.target.value)}
                placeholder="8자 이상 입력"
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <EyeToggle show={showPw} onToggle={() => setShowPw(!showPw)} />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label style={labelStyle}>비밀번호 확인 <Required /></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwConfirm ? 'text' : 'password'}
                value={form.passwordConfirm}
                onChange={e => setField('passwordConfirm', e.target.value)}
                placeholder="비밀번호 재입력"
                autoComplete="new-password"
                style={{
                  ...inputStyle,
                  paddingRight: '48px',
                  borderColor: form.passwordConfirm
                    ? form.password === form.passwordConfirm ? 'rgba(74,124,89,0.6)' : 'rgba(194,75,59,0.6)'
                    : 'rgba(255,255,255,0.12)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => {
                  if (form.passwordConfirm) {
                    e.currentTarget.style.borderColor = form.password === form.passwordConfirm
                      ? 'rgba(74,124,89,0.6)' : 'rgba(194,75,59,0.6)';
                  } else {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  }
                }}
              />
              <EyeToggle show={showPwConfirm} onToggle={() => setShowPwConfirm(!showPwConfirm)} />
            </div>
            {form.passwordConfirm && (
              <p style={{ fontSize: '12px', marginTop: '6px', color: form.password === form.passwordConfirm ? '#6AB88A' : '#FF8070' }}>
                {form.password === form.passwordConfirm ? '✓ 비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>

          {/* ── 기본 정보 ── */}
          <SectionLabel>기본 정보</SectionLabel>

          {/* 이름 */}
          <div>
            <label style={labelStyle}>이름 <Required /></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="홍길동"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>

          {/* 성별 */}
          <div>
            <label style={labelStyle}>성별 <Required /></label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['남성', '여성'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setField('gender', g)}
                  style={{
                    flex: 1,
                    padding: '13px',
                    borderRadius: '10px',
                    border: form.gender === g ? '2px solid #C8963E' : '1px solid rgba(255,255,255,0.12)',
                    background: form.gender === g ? 'rgba(200,150,62,0.15)' : 'rgba(255,255,255,0.04)',
                    color: form.gender === g ? '#F5C875' : 'rgba(255,255,255,0.6)',
                    fontSize: '15px',
                    fontWeight: form.gender === g ? '700' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {form.gender === g && <Check size={14} />}
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label style={labelStyle}>생년월일 <Required /></label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* 연도 */}
              <select
                value={birthYear}
                onChange={e => { setBirthYear(e.target.value); updateBirthdate(e.target.value, birthMonth, birthDay); }}
                style={{ ...selectStyle, flex: '2' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              >
                <option value="" style={{ background: '#0D2240' }}>연도</option>
                {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 10 - i).map(y => (
                  <option key={y} value={y} style={{ background: '#0D2240' }}>{y}년</option>
                ))}
              </select>
              {/* 월 */}
              <select
                value={birthMonth}
                onChange={e => { setBirthMonth(e.target.value); updateBirthdate(birthYear, e.target.value, birthDay); }}
                style={{ ...selectStyle, flex: '1.2' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              >
                <option value="" style={{ background: '#0D2240' }}>월</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m} style={{ background: '#0D2240' }}>{m}월</option>
                ))}
              </select>
              {/* 일 */}
              <select
                value={birthDay}
                onChange={e => { setBirthDay(e.target.value); updateBirthdate(birthYear, birthMonth, e.target.value); }}
                style={{ ...selectStyle, flex: '1.2' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              >
                <option value="" style={{ background: '#0D2240' }}>일</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d} style={{ background: '#0D2240' }}>{d}일</option>
                ))}
              </select>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <label style={labelStyle}>연락처 <Required /></label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setField('phone', formatPhoneNumber(e.target.value))}
              placeholder="010-0000-0000"
              style={inputStyle}
              maxLength={13}
              onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>

          {/* 카카오톡 ID */}
          <div>
            <label style={labelStyle}>카카오톡 ID <Required /></label>
            <input
              type="text"
              value={form.kakaoId}
              onChange={e => setField('kakaoId', e.target.value)}
              placeholder="카카오톡 아이디 입력"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#C8963E')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <p style={{ fontSize: '12px', marginTop: '6px', color: 'rgba(255,255,255,0.35)' }}>
              봉사 일정 안내 및 소통에 사용됩니다
            </p>
          </div>

          {/* ── 약관 동의 ── */}
          <SectionLabel>약관 동의</SectionLabel>

          {/* 개인정보 수집 이용 동의 (필수) */}
          <div style={{
            border: `1px solid ${form.privacyAgreement ? 'rgba(200,150,62,0.4)' : 'rgba(255,255,255,0.10)'}`,
            borderRadius: '14px',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}>
            {/* 체크 헤더 */}
            <div
              onClick={() => setForm(prev => ({ ...prev, privacyAgreement: !prev.privacyAgreement }))}
              style={{
                padding: '16px 18px',
                background: form.privacyAgreement ? 'rgba(200,150,62,0.08)' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                userSelect: 'none',
                transition: 'background 0.2s',
              }}
            >
              <Checkbox checked={form.privacyAgreement} />
              <span style={{ color: form.privacyAgreement ? '#F5C875' : 'rgba(255,255,255,0.75)', fontSize: '14px', fontWeight: '600', flex: 1 }}>
                개인정보 수집 및 이용 동의 <span style={{ color: '#C8963E', fontSize: '12px' }}>(필수)</span>
              </span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setPrivacyExpanded(!privacyExpanded); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '4px 8px' }}
              >
                {privacyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {privacyExpanded ? '접기' : '전문 보기'}
              </button>
            </div>
            {/* 상세 내용 */}
            {privacyExpanded && (
              <div style={{
                padding: '16px 18px',
                background: 'rgba(0,0,0,0.2)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <tbody>
                    {[
                      ['수집 항목', '이름, 성별, 생년월일, 연락처, 카카오톡 ID, 봉사 기록'],
                      ['수집 목적', '봉사 활동 운영, 회원 식별 및 관리, 봉사 확인서 발급'],
                      ['보유 기간', '회원 탈퇴 시까지 (법령에 따라 일부 보존될 수 있음)'],
                      ['제3자 제공', '원칙적으로 제3자에게 제공하지 않습니다'],
                      ['동의 거부 권리', '동의를 거부할 수 있으나, 회원 가입이 불가합니다'],
                    ].map(([key, val]) => (
                      <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{key}</td>
                        <td style={{ padding: '8px 10px', lineHeight: '1.6' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 마케팅 수신 동의 (선택) */}
          <div style={{
            border: `1px solid ${form.marketingAgreement ? 'rgba(200,150,62,0.4)' : 'rgba(255,255,255,0.10)'}`,
            borderRadius: '14px',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}>
            <div
              onClick={() => setForm(prev => ({ ...prev, marketingAgreement: !prev.marketingAgreement }))}
              style={{
                padding: '16px 18px',
                background: form.marketingAgreement ? 'rgba(200,150,62,0.08)' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                userSelect: 'none',
                transition: 'background 0.2s',
              }}
            >
              <Checkbox checked={form.marketingAgreement} />
              <span style={{ color: form.marketingAgreement ? '#F5C875' : 'rgba(255,255,255,0.75)', fontSize: '14px', fontWeight: '600', flex: 1 }}>
                마케팅 및 안내 문자 수신 동의 <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>(선택)</span>
              </span>
            </div>
            {/* 항상 보이는 혜택 설명 */}
            <div style={{
              padding: '16px 18px',
              background: 'rgba(0,0,0,0.2)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                <li style={{ marginBottom: '4px' }}>새로운 봉사 모집이 시작될 때 <strong style={{ color: '#F5C875', fontWeight: '500' }}>가장 먼저</strong> 알려드려요!</li>
                <li style={{ marginBottom: '4px' }}>봉사 외 다양한 목적의 기획 활동 및 단원 친목 교류 행사 초대</li>
                <li>기타 유익한 봉사 관련 특별 이벤트 소식 안내</li>
              </ul>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              background: loading ? 'rgba(200,150,62,0.4)' : G.goldBtn,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '18px',
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
            <UserPlus size={18} />
            {loading ? '가입 중...' : '봉봉단 입문하기'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle('/onboarding')}
            style={{
              background: '#fff',
              color: '#333',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'none')}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google Logo" />
            구글 계정으로 시작하기
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#C8963E', fontWeight: '700', textDecoration: 'none' }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 서브 컴포넌트 ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(200,150,62,0.2)', paddingBottom: '8px', marginTop: '6px' }}>
      <span style={{ color: '#C8963E', fontSize: '11px', fontWeight: '800', letterSpacing: '2.5px' }}>
        {children}
      </span>
    </div>
  );
}

function Required() {
  return <span style={{ color: '#C8963E', marginLeft: '2px' }}>*</span>;
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center',
      }}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
      background: checked ? G.goldBtn : 'rgba(255,255,255,0.08)',
      border: checked ? 'none' : '1px solid rgba(255,255,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s',
    }}>
      {checked && <Check size={13} color="#fff" strokeWidth={3} />}
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

const selectStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '13px 12px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  appearance: 'none',
  cursor: 'pointer',
  width: '100%',
};