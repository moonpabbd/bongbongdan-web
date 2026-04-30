import { useState, useEffect } from 'react';
import { Lock, Search, Download, Users } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { G } from '../styles/gradients';
import { AdminAnalytics } from '../components/AdminAnalytics';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;
const ADMIN_PASSWORD = 'pjb0812';

export function AdminDB() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [mainTab, setMainTab] = useState<'members' | 'analytics' | 'alimtalk'>('analytics');
  const [alimtalkLogs, setAlimtalkLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
      fetchMembers();
      fetchAlimtalkLogs();
    } else {
      setError(true);
      setPassword('');
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/admin/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Password': ADMIN_PASSWORD
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.warn('Backend not deployed yet, falling back to mock data for local testing.');
        setMembers([
          { memberNumber: 'BBD-2026-0001', name: '박진범', username: 'pjb_test', gender: '남성', phone: '010-1234-5678', birthdate: '1990-08-12', kakaoId: 'pjb_kakao', joinPath: '지인 소개', createdAt: new Date().toISOString() },
          { memberNumber: 'BBD-2026-0002', name: '김테스트', username: 'kim_test', gender: '여성', phone: '010-9876-5432', birthdate: '1995-05-05', kakaoId: 'kim_kakao', joinPath: '인스타그램', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { memberNumber: 'BBD-2026-0003', name: '이로컬', username: 'lee_local', gender: '남성', phone: '010-1111-2222', birthdate: '1992-12-25', kakaoId: 'lee_kakao', joinPath: '소모임', createdAt: new Date(Date.now() - 172800000).toISOString() },
        ]);
      } else if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.warn('CORS or Network error (Backend not deployed yet), falling back to mock data.');
      setMembers([
        { memberNumber: 'BBD-2026-0001', name: '박진범', username: 'pjb_test', gender: '남성', phone: '010-1234-5678', birthdate: '1990-08-12', kakaoId: 'pjb_kakao', joinPath: '지인 소개', createdAt: new Date().toISOString() },
        { memberNumber: 'BBD-2026-0002', name: '김테스트', username: 'kim_test', gender: '여성', phone: '010-9876-5432', birthdate: '1995-05-05', kakaoId: 'kim_kakao', joinPath: '인스타그램', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { memberNumber: 'BBD-2026-0003', name: '이로컬', username: 'lee_local', gender: '남성', phone: '010-1111-2222', birthdate: '1992-12-25', kakaoId: 'lee_kakao', joinPath: '소모임', createdAt: new Date(Date.now() - 172800000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (userId: string, memberName: string) => {
    if (!confirm(`정말로 '${memberName}' 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;
    
    try {
      const res = await fetch(`${SERVER}/admin/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Password': ADMIN_PASSWORD
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        alert('성공적으로 삭제되었습니다.');
        fetchMembers(); // 새로고침
      } else {
        const data = await res.json();
        alert(`삭제 실패: ${data.error}`);
      }
    } catch (err) {
      alert(`네트워크 오류가 발생했습니다: ${err}`);
    }
  };

  const fetchAlimtalkLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch(`${SERVER}/alimtalk/logs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Password': ADMIN_PASSWORD
        }
      });
      const data = await res.json();
      if (res.ok && data.logs) {
        setAlimtalkLogs(data.logs);
      }
    } catch (err) {
      console.error('Alimtalk logs fetch error:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const filteredMembers = members.filter(m => 
    (m.name || '').includes(search) || 
    (m.phone || '').includes(search) ||
    (m.username || '').includes(search)
  );

  // CSV 다운로드 함수
  const downloadCSV = () => {
    if (members.length === 0) return;
    
    // 헤더 추출
    const headers = ['이름', '아이디', '성별', '연락처', '생년월일', '고유번호', '가입경로', '상세경로', '카카오ID', '마케팅동의', '가입일'];
    
    // 데이터 추출
    const csvData = filteredMembers.map(m => [
      m.name || '',
      m.username || '',
      m.gender || '',
      m.phone || '',
      m.birthdate || '',
      m.memberNumber || m.member_number || '',
      m.joinPath || m.join_path || '',
      m.joinPathDetail || m.join_path_detail || '',
      m.kakaoId || m.kakao_id || '',
      m.marketingAgreement ? '동의' : '미동의',
      new Date(m.createdAt || m.created_at || 0).toLocaleDateString()
    ].map(val => `"${val}"`).join(','));
    
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `봉봉단_회원명단_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDFCFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #1E3A5F, #0D2240)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Lock size={28} color="#fff" />
          </div>
          <h2 style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '22px', marginBottom: '8px' }}>운영진 데이터베이스</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '28px' }}>접근 권한이 필요합니다.</p>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호 입력"
            style={{
              width: '100%', padding: '16px 20px',
              border: `2px solid ${error ? '#C24B3B' : '#E5E7EB'}`,
              borderRadius: '12px', fontSize: '18px',
              textAlign: 'center', outline: 'none',
              boxSizing: 'border-box', marginBottom: '16px'
            }}
          />
          {error && <p style={{ color: '#C24B3B', fontSize: '13px', marginBottom: '16px' }}>비밀번호가 올바르지 않습니다.</p>}

          <button
            onClick={handleLogin}
            style={{
              width: '100%', padding: '16px',
              background: '#1E3A5F', color: '#fff', border: 'none',
              borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            입장하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* 상위 탭 (회원 / 통계) */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid #E5E7EB' }}>
          <button 
            onClick={() => setMainTab('analytics')}
            style={{ 
              padding: '12px 24px', background: 'none', border: 'none', 
              borderBottom: mainTab === 'analytics' ? '3px solid #1E3A5F' : '3px solid transparent',
              color: mainTab === 'analytics' ? '#1E3A5F' : '#9CA3AF',
              fontSize: '18px', fontWeight: '800', cursor: 'pointer', marginBottom: '-2px'
            }}
          >
            트래픽 & 행동 분석
          </button>
          <button 
            onClick={() => setMainTab('members')}
            style={{ 
              padding: '12px 24px', background: 'none', border: 'none', 
              borderBottom: mainTab === 'members' ? '3px solid #1E3A5F' : '3px solid transparent',
              color: mainTab === 'members' ? '#1E3A5F' : '#9CA3AF',
              fontSize: '18px', fontWeight: '800', cursor: 'pointer', marginBottom: '-2px'
            }}
          >
            전체 회원 데이터베이스
          </button>
          <button 
            onClick={() => setMainTab('alimtalk')}
            style={{ 
              padding: '12px 24px', background: 'none', border: 'none', 
              borderBottom: mainTab === 'alimtalk' ? '3px solid #1E3A5F' : '3px solid transparent',
              color: mainTab === 'alimtalk' ? '#1E3A5F' : '#9CA3AF',
              fontSize: '18px', fontWeight: '800', cursor: 'pointer', marginBottom: '-2px'
            }}
          >
            알림톡 발송 현황
          </button>
        </div>

        {mainTab === 'analytics' ? (
          <AdminAnalytics adminPassword={password} />
        ) : mainTab === 'members' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ color: '#1E3A5F', fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={28} color="#C8963E" />
              전체 회원 데이터베이스
            </h1>
            <p style={{ color: '#6B7280', fontSize: '15px', marginTop: '8px' }}>
              총 {members.length}명의 가입자가 있습니다. (개인정보 보호에 유의해주세요)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="이름, 연락처, 아이디 검색..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '12px 16px 12px 40px', borderRadius: '10px', border: '1px solid #E5E7EB', width: '250px', outline: 'none' }}
              />
            </div>
            <button 
              onClick={downloadCSV}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: G.goldBtn, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
            >
              <Download size={16} /> 엑셀 다운로드
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>데이터를 불러오는 중입니다...</div>
          ) : members.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
              데이터를 불러오지 못했거나 가입자가 없습니다.<br/>
              (Supabase RLS 설정 또는 테이블 이름 확인 필요)
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#F3F4F6', color: '#374151', textAlign: 'left' }}>
                    <th style={{ padding: '16px', fontWeight: '700' }}>고유번호</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>이름</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>아이디</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>성별</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>생년월일</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>연락처</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>카카오ID</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>계정 유형</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>마케팅동의</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>가입일</th>
                    <th style={{ padding: '16px', fontWeight: '700' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #E5E7EB', color: '#4B5563' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#1E3A5F' }}>{m.memberNumber || m.member_number || '-'}</td>
                      <td style={{ padding: '16px', fontWeight: '600' }}>{m.name || '-'}</td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>{m.username || '-'}</td>
                      <td style={{ padding: '16px' }}>{m.gender || '-'}</td>
                      <td style={{ padding: '16px' }}>{m.birthdate || '-'}</td>
                      <td style={{ padding: '16px' }}>{m.phone || '-'}</td>
                      <td style={{ padding: '16px' }}>{m.kakaoId || m.kakao_id || '-'}</td>
                      <td style={{ padding: '16px' }}>
                        {(m.joinPath?.includes('구글') || m.join_path?.includes('구글')) ? (
                          <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            구글 연동
                          </span>
                        ) : (
                          <span style={{ background: '#F3F4F6', color: '#4B5563', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            일반 가입
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          background: m.marketingAgreement ? '#D1FAE5' : '#F3F4F6', 
                          color: m.marketingAgreement ? '#065F46' : '#6B7280', 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' 
                        }}>
                          {m.marketingAgreement ? '동의' : '미동의'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#9CA3AF', fontSize: '13px' }}>
                        {m.createdAt || m.created_at ? new Date(m.createdAt || m.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button 
                          onClick={() => handleDeleteMember(m.userId || m.user_id, m.name)}
                          style={{
                            background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 12px',
                            borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        ) : mainTab === 'alimtalk' ? (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ color: '#1E3A5F', fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={28} color="#C8963E" />
                알림톡 발송 현황
              </h1>
              <p style={{ color: '#6B7280', fontSize: '15px', marginTop: '8px' }}>
                봉사 집결 신청 시 자동 발송된 솔라피 알림톡 내역입니다.
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              {loadingLogs ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>데이터를 불러오는 중입니다...</div>
              ) : alimtalkLogs.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                  알림톡 발송 기록이 없습니다.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    <thead>
                      <tr style={{ background: '#F3F4F6', color: '#374151', textAlign: 'left' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>발송 일시</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>수신자</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>연락처</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>봉사명</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>상태</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>상세 결과</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alimtalkLogs.map((log, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #E5E7EB', color: '#4B5563' }}>
                          <td style={{ padding: '16px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                          <td style={{ padding: '16px', fontWeight: '600' }}>{log.userName}</td>
                          <td style={{ padding: '16px' }}>{log.phone}</td>
                          <td style={{ padding: '16px', color: '#1E3A5F', fontWeight: '500' }}>{log.volunteerDate}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ 
                              background: log.success ? '#D1FAE5' : '#FEE2E2', 
                              color: log.success ? '#065F46' : '#991B1B', 
                              padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' 
                            }}>
                              {log.success ? '성공' : '실패'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', color: '#9CA3AF', fontSize: '12px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {log.success ? '정상 발송' : (() => {
                              try {
                                const parsed = JSON.parse(log.response);
                                return parsed.errorMessage || parsed.error || log.response;
                              } catch (e) {
                                return log.response || '-';
                              }
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}
