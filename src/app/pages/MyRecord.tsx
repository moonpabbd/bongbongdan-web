import { useState } from 'react';
import { Search, Download } from 'lucide-react';

const mockData: Record<string, { name: string; grade: string; count: number; hours: number; firstDate: string; lastDate: string; history: { date: string; place: string }[] }> = {
  '김서연-20030415': {
    name: '김서연', grade: '1단', count: 3, hours: 12,
    firstDate: '2026-02-22', lastDate: '2026-03-15',
    history: [
      { date: '2026-02-22', place: '경기 사랑의 보호소' },
      { date: '2026-03-01', place: '행복한 동물 보호센터' },
      { date: '2026-03-15', place: '경기 사랑의 보호소' },
    ],
  },
  '이준호-19991208': {
    name: '이준호', grade: '3단', count: 12, hours: 48,
    firstDate: '2026-02-22', lastDate: '2026-03-22',
    history: [
      { date: '2026-02-22', place: '경기 사랑의 보호소' },
      { date: '2026-03-01', place: '행복한 동물 보호센터' },
      { date: '2026-03-08', place: '희망 유기동물 보호소' },
      { date: '2026-03-15', place: '경기 사랑의 보호소' },
      { date: '2026-03-22', place: '행복한 동물 보호센터' },
    ],
  },
  '박미영-19810325': {
    name: '박미영', grade: '2단', count: 7, hours: 28,
    firstDate: '2026-02-22', lastDate: '2026-03-22',
    history: [
      { date: '2026-02-22', place: '경기 사랑의 보호소' },
      { date: '2026-03-01', place: '행복한 동물 보호센터' },
      { date: '2026-03-22', place: '경기 사랑의 보호소' },
    ],
  },
};

const gradeColors: Record<string, string> = {
  '입문': '#6B7280', '1단': '#4A7C59', '2단': '#1E3A5F',
  '3단': '#C8963E', '4단': '#C24B3B', '5단': '#6B4C8A', '문파주': '#C8963E',
};

const grades = [
  { grade: '입문', range: '1회', color: '#6B7280' },
  { grade: '1단', range: '3회', color: '#4A7C59' },
  { grade: '2단', range: '5회', color: '#1E6B8A' },
  { grade: '3단', range: '10회', color: '#C8963E' },
  { grade: '4단', range: '20회', color: '#C24B3B' },
  { grade: '5단', range: '30회+', color: '#9b70c0' },
];

export function MyRecord() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [result, setResult] = useState<typeof mockData[string] | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!name.trim() || !birthdate.trim()) return;
    setLoading(true);
    setSearched(false);
    setResult(null);

    setTimeout(() => {
      const key = `${name.trim()}-${birthdate.replace(/-/g, '')}`;
      const found = mockData[key] || null;
      setResult(found);
      setSearched(true);
      setLoading(false);
    }, 1000);
  };

  const handlePDF = () => {
    if (!result) return;
    alert(`${result.name}님의 봉사 증명서를 생성 중입니다...\n실제 서비스에서는 PDF가 새 탭에서 열립니다.`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '160px 40px 100px', background: 'linear-gradient(160deg, #0D2240, #1E3A5F)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(107,76,138,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C8963E', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px' }}>무공 기록</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '900', marginBottom: '20px' }}>내 봉사 기록</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            이름과 생년월일만으로 봉사 기록을 확인하고<br />
            봉사 증명서 PDF를 발급받으세요.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '80px 40px', background: '#FDFCFA' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '22px', marginBottom: '8px', textAlign: 'center' }}>기록 조회하기</h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', textAlign: 'center', marginBottom: '36px' }}>
              회원가입·로그인 불필요 — 이름 + 생년월일만 입력하세요
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="홍길동"
                  style={{
                    width: '100%', padding: '14px 18px', border: '2px solid #E5E7EB',
                    borderRadius: '12px', fontSize: '16px', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1E3A5F'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>생년월일</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={e => setBirthdate(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 18px', border: '2px solid #E5E7EB',
                    borderRadius: '12px', fontSize: '16px', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1E3A5F'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !name.trim() || !birthdate}
              style={{
                width: '100%', padding: '16px',
                background: loading || !name.trim() || !birthdate ? '#D1D5DB' : 'linear-gradient(135deg, #1E3A5F, #2d5a8e)',
                color: '#fff', border: 'none', borderRadius: '14px',
                fontSize: '16px', fontWeight: '700', cursor: loading || !name.trim() || !birthdate ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.3s',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  조회 중...
                </>
              ) : (
                <><Search size={18} /> 기록 조회하기</>
              )}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <p style={{ color: '#9CA3AF', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
              테스트: 이름 "김서연" / 생년월일 2003-04-15
            </p>
          </div>

          {/* Not found */}
          {searched && !result && (
            <div style={{ marginTop: '24px', background: '#FFF0EE', border: '1px solid #FECACA', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <Search size={40} color="#FECACA" />
              </div>
              <h3 style={{ color: '#C24B3B', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>기록을 찾을 수 없습니다</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                이름과 생년월일을 다시 확인해주세요.<br />
                문의는 카카오 채널 @봉봉단으로 연락주세요.
              </p>
            </div>
          )}

          {result && (
            <div style={{ marginTop: '24px', animation: 'fadeIn 0.6s ease' }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              {/* Result Card */}
              <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #2d5a8e)', padding: '32px 36px', textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Search size={32} color="#C8963E" />
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '24px', marginBottom: '8px' }}>{result.name} 협객</h3>
                  <div style={{ display: 'inline-block', background: gradeColors[result.grade] + '30', border: `1px solid ${gradeColors[result.grade]}`, color: '#fff', fontSize: '14px', fontWeight: '700', padding: '6px 20px', borderRadius: '50px' }}>
                    {result.grade}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ padding: '28px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', borderBottom: '1px solid #F0F0F0' }}>
                  {[
                    { label: '총 봉사 횟수', value: result.count, suffix: '회' },
                    { label: '총 봉사 시간', value: result.hours, suffix: '시간' },
                    { label: '첫 참여', value: result.firstDate, suffix: '' },
                  ].map(stat => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1E3A5F', fontWeight: '900', fontSize: stat.label === '첫 참여' ? '14px' : '28px' }}>
                        {stat.value}
                        {stat.suffix && <span style={{ fontSize: '14px', color: '#C8963E', marginLeft: '2px' }}>{stat.suffix}</span>}
                      </div>
                      <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* History */}
                <div style={{ padding: '28px 36px', borderBottom: '1px solid #F0F0F0' }}>
                  <h4 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>최근 봉사 기록</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.history.slice(-5).reverse().map((h, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8F9FA', borderRadius: '10px' }}>
                        <span style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>{h.place}</span>
                        <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF Button */}
                <div style={{ padding: '28px 36px' }}>
                  <button
                    onClick={handlePDF}
                    style={{
                      width: '100%', padding: '16px',
                      background: 'linear-gradient(135deg, #4A7C59, #5a9a6e)',
                      color: '#fff', border: 'none', borderRadius: '14px',
                      fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <Download size={18} /> 봉사 증명서 PDF 발급
                  </button>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
                    대학교 봉사활동 인증·공식 증빙에 활용 가능합니다
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade Guide */}
      <div style={{ padding: '80px 40px', background: '#1E3A5F' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#C8963E', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px' }}>단(段) 체계</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', marginBottom: '40px' }}>나의 단(단)은?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {grades.map(g => (
              <div key={g.grade} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${g.color}40`, borderRadius: '16px', padding: '20px 12px', textAlign: 'center' }}>
                <div style={{ color: g.color, fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{g.grade}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>봉사 {g.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}