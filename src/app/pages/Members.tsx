import { useState } from 'react';
import { Lock, Download, FileText, Bell, LogIn } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const MEMBERS_PASSWORD = 'bbd2026';

const members = [
  { name: '박진범', grade: '문파주', count: 50, joinDate: '2026-02-22' },
  { name: '운영진A', grade: '5단', count: 32, joinDate: '2026-02-22' },
  { name: '운영진B', grade: '5단', count: 30, joinDate: '2026-02-22' },
  { name: '운영진C', grade: '5단', count: 28, joinDate: '2026-02-22' },
  { name: '김서연', grade: '1단', count: 3, joinDate: '2026-02-22' },
  { name: '이준호', grade: '3단', count: 12, joinDate: '2026-02-22' },
  { name: '박미영', grade: '2단', count: 7, joinDate: '2026-02-22' },
  { name: '최다은', grade: '2단', count: 6, joinDate: '2026-03-01' },
  { name: '정우진', grade: '1단', count: 4, joinDate: '2026-03-01' },
  { name: '한소라', grade: '2단', count: 5, joinDate: '2026-03-01' },
];

const resources = [
  {
    title: '운영진 매뉴얼',
    desc: '아임웹, 구글 시트, PDF 발급 사용법 가이드',
    color: '#1E3A5F',
    items: ['아임웹 페이지 수정 방법', '구글 시트 봉사 기록 등록', 'PDF 자동 발급 확인', '공지사항 업로드 방법'],
  },
  {
    title: '활동 예정표',
    desc: '월별 봉사 일정 및 보호소 배정 현황',
    color: '#4A7C59',
    items: ['3월 4주차: 행복한 동물 보호센터', '4월 1주차: 경기 사랑의 보호소', '4월 2주차: 희망 유기동물 보호소', '4월 3주차: TBD'],
  },
  {
    title: '내부 공지사항',
    desc: '회의록, 정책 변경, 예산 관련 내부 공지',
    color: '#6B4C8A',
    items: ['2026.03 회의록 (운영진 회의)', '비밀번호 변경 안내', '봉사 인원 최대 20명 제한 정책', '3월 예산 집행 내역'],
  },
];

const gradeColors: Record<string, string> = {
  '문파주': '#C8963E', '5단': '#6B4C8A', '4단': '#C24B3B',
  '3단': '#C8963E', '2단': '#1E3A5F', '1단': '#4A7C59', '입문': '#6B7280',
};

export function Members() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const { user, profile } = useAuth();

  // 로그인 사용자는 자동 인증
  const isAuthenticated = authenticated || !!user;

  const handleLogin = () => {
    if (password === MEMBERS_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '160px 40px 100px', background: 'linear-gradient(160deg, #0D2240, #1E3A5F)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(107,76,138,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C8963E', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px' }}>단원 전용</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '900', marginBottom: '20px' }}>회원 전용 공간</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            5회 이상 봉사자 전용 공간입니다.<br />
            {user ? `${profile?.name || ''} 단원님, 환영합니다! 🎉` : '로그인하거나 비밀번호를 입력해주세요.'}
          </p>
        </div>
      </div>

      {!isAuthenticated ? (
        /* Password Gate */
        <div style={{ padding: '80px 40px 120px', background: '#FDFCFA', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 로그인 유도 */}
            <div style={{
              background: 'linear-gradient(135deg, #EEF4FF, #E0EDFF)',
              border: '1px solid rgba(30,58,95,0.2)',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}>
              <div>
                <p style={{ color: '#1E3A5F', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>봉봉단 회원이신가요?</p>
                <p style={{ color: '#6B7280', fontSize: '13px' }}>로그인하면 비밀번호 없이 바로 입장할 수 있어요.</p>
              </div>
              <Link
                to="/login"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #0D2240, #1E3A5F)',
                  color: '#fff', textDecoration: 'none',
                  padding: '10px 16px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap',
                }}
              >
                <LogIn size={14} /> 로그인
              </Link>
            </div>

            {/* 비밀번호 입력 */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #6B4C8A, #9b70c0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Lock size={28} color="#fff" />
              </div>
              <h2 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '22px', marginBottom: '8px' }}>단원 비밀번호</h2>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
                봉사 5회 이상 단원만 입장 가능합니다.<br />
                비밀번호는 운영진에게 문의하세요.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="비밀번호 입력"
                  style={{
                    width: '100%', padding: '16px 20px',
                    border: `2px solid ${error ? '#C24B3B' : '#E5E7EB'}`,
                    borderRadius: '12px', fontSize: '18px',
                    textAlign: 'center', letterSpacing: '4px', outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                />
                {error && (
                  <p style={{ color: '#C24B3B', fontSize: '13px', marginTop: '8px' }}>
                    비밀번호가 올바르지 않습니다.
                  </p>
                )}
              </div>

              <button
                onClick={handleLogin}
                style={{
                  width: '100%', padding: '16px',
                  background: 'linear-gradient(135deg, #6B4C8A, #9b70c0)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                입장하기
              </button>

              <p style={{ color: '#D1D5DB', fontSize: '12px', marginTop: '24px' }}>
                힌트: bbd + 창단연도
              </p>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F0F0F0' }}>
                <a
                  href="https://pf.kakao.com/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none' }}
                >
                  비밀번호 문의 → 카카오 채널 @봉봉단
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Members Content */
        <div style={{ background: '#FDFCFA' }}>
          {/* Welcome */}
          <div style={{ padding: '48px 40px 0', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #6B4C8A, #9b70c0)', borderRadius: '20px', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '4px' }}>환영합니다, 단원님</p>
                <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '22px' }}>문파 내부에 입장하셨습니다</h2>
              </div>
              <button
                onClick={() => setAuthenticated(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}
              >
                로그아웃
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div style={{ padding: '64px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '24px', marginBottom: '32px' }}>단원 명단</h2>
            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      {['단원명', '직급', '봉사 횟수', '입단일'].map(h => (
                        <th key={h} style={{ padding: '16px 24px', textAlign: 'left', color: '#6B7280', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.name} style={{ borderTop: '1px solid #F0F0F0' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', background: '#F0F0F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A5F', fontWeight: '700', fontSize: '14px' }}>
                              {member.name[0]}
                            </div>
                            <span style={{ color: '#1E3A5F', fontWeight: '600', fontSize: '15px' }}>{member.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ background: gradeColors[member.grade] + '15', color: gradeColors[member.grade], fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '50px' }}>
                            {member.grade}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', color: '#374151', fontWeight: '600' }}>{member.count}회</td>
                        <td style={{ padding: '16px 24px', color: '#9CA3AF', fontSize: '13px' }}>{member.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div style={{ padding: '0 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '24px', marginBottom: '32px' }}>자료실</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {resources.map(res => (
                <div key={res.title} style={{ background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>{res.title}</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>{res.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {res.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#F8F9FA', borderRadius: '10px' }}>
                        <FileText size={14} color={res.color} />
                        <span style={{ color: '#374151', fontSize: '14px' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ width: '100%', padding: '12px', background: res.color, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Download size={16} /> 전체 보기
                  </button>
                </div>
              ))}
            </div>

            {/* Internal Notices */}
            <div style={{ marginTop: '40px', background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Bell size={20} color="#C8963E" />
                <h3 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '18px' }}>운영진 전용 공지</h3>
                <span style={{ background: '#C24B3B', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '50px' }}>2 NEW</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: '4월 봉사 일정 배정표 공유', date: '2026-03-25', isNew: true },
                  { title: '3월 예산 집행 내역 공유', date: '2026-03-20', isNew: true },
                  { title: '홈페이지 콘텐츠 업데이트 가이드', date: '2026-03-10', isNew: false },
                  { title: '단원 비밀번호 변경 예정 안내', date: '2026-03-01', isNew: false },
                ].map((notice, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8F9FA', borderRadius: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {notice.isNew && <span style={{ background: '#C24B3B', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '50px' }}>NEW</span>}
                      <span style={{ color: '#374151', fontWeight: '600', fontSize: '14px' }}>{notice.title}</span>
                    </div>
                    <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{notice.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}