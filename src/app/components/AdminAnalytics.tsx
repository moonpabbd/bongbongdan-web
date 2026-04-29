import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Eye, MousePointerClick, Clock, UserCheck, Activity, Map, Layout, Filter } from 'lucide-react';
import { projectId } from '/utils/supabase/info';
import { G } from '../styles/gradients';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

const COLORS = ['#1E3A5F', '#C8963E', '#F5C875', '#4B5563', '#9CA3AF'];

export function AdminAnalytics({ adminPassword }: { adminPassword: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [days, setDays] = useState(7);
  const [heatmapDevice, setHeatmapDevice] = useState<'Desktop'|'Mobile'>('Desktop');
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchStats();
  }, [days]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 로컬 개발이거나 세션이 없어도 어드민 패스워드로 임시 우회 (Production에선 JWT 권장)
      const res = await fetch(`${SERVER}/analytics/stats?days=${days}`, {
        headers: { 'X-Admin-Password': adminPassword }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setStats({ trend: [], referrers: {}, devices: {}, countries: {}, events: {}, heatmap: [] });
      }
    } catch (e) {
      console.error('Fetch stats error', e);
      setStats({ trend: [], referrers: {}, devices: {}, countries: {}, events: {}, heatmap: [] });
    } finally {
      setLoading(false);
    }
  };

  // 얼리 리턴을 여기에서 아래로 이동 (Hook 규칙 준수)

  const renderHeatmapInIframe = () => {
    if (!iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!doc) return;
      
      const oldContainer = doc.getElementById('bbd-heatmap-overlay');
      if (oldContainer) oldContainer.remove();

      const container = doc.createElement('div');
      container.id = 'bbd-heatmap-overlay';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '999999';

      const filteredDots = stats.heatmap?.filter((h: any) => h.device === heatmapDevice) || [];
      filteredDots.forEach((dot: any) => {
        const div = doc.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${dot.x}%`;
        // dot.y가 100 이하면 예전 방식(퍼센트)일 수 있으나 일단 px로 처리
        div.style.top = `${dot.y > 100 ? dot.y : dot.y + 100}px`; 
        div.style.width = '24px';
        div.style.height = '24px';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.background = 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0) 70%)';
        div.style.borderRadius = '50%';
        div.style.mixBlendMode = 'multiply';
        container.appendChild(div);
      });

      doc.body.appendChild(container);
    } catch (e) {
      console.warn("Iframe DOM access failed (CORS or loading)", e);
    }
  };

  // 탭 변경이나 디바이스 변경 시 iframe 내부에 점 다시 그리기
  useEffect(() => {
    if (activeTab === 'heatmap' && stats && !loading) {
      const timer = setTimeout(renderHeatmapInIframe, 1000); // 로드 대기
      return () => clearTimeout(timer);
    }
  }, [activeTab, heatmapDevice, stats, loading]);

  if (loading || !stats) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>분석 데이터를 불러오는 중입니다...</div>;
  }

  // 데이터 가공
  const totalVisitors = stats.trend.reduce((acc: number, cur: any) => acc + cur.visitors, 0);
  const totalPageviews = stats.trend.reduce((acc: number, cur: any) => acc + cur.pageviews, 0);
  
  const referrerData = Object.entries(stats.referrers || {}).map(([name, value]) => ({ name, value }));
  const deviceData = Object.entries(stats.devices || {}).map(([name, value]) => ({ name, value }));
  const countryData = Object.entries(stats.countries || {}).map(([name, value]) => ({ name, value }));
  const eventData = Object.entries(stats.events || {}).map(([name, value]) => ({ name, value }));

  // 탭 네비게이션
  const tabs = [
    { id: 'overview', label: '종합 요약', icon: Activity },
    { id: 'heatmap', label: '히트맵 분석', icon: MousePointerClick },
    { id: 'behavior', label: '사용자 행동', icon: Eye },
    { id: 'acquisition', label: '유입 및 환경', icon: Map },
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      {/* 탭 네비게이션 */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
              background: activeTab === tab.id ? '#1E3A5F' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#6B7280',
              border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#9CA3AF" />
          <select 
            value={days} 
            onChange={e => setDays(Number(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
          >
            <option value={7}>최근 7일</option>
            <option value={30}>최근 30일</option>
            <option value={90}>최근 90일</option>
          </select>
        </div>
      </div>

      {/* 탭: 종합 요약 */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 요약 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
              <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>총 방문자 수 ({days}일)</div>
              <div style={{ color: '#1E3A5F', fontSize: '28px', fontWeight: '800' }}>{totalVisitors.toLocaleString()}명</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
              <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>총 페이지뷰 ({days}일)</div>
              <div style={{ color: '#1E3A5F', fontSize: '28px', fontWeight: '800' }}>{totalPageviews.toLocaleString()}회</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
              <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>주요 유입 경로</div>
              <div style={{ color: '#1E3A5F', fontSize: '24px', fontWeight: '800' }}>{referrerData.sort((a,b)=>b.value-a.value)[0]?.name || 'Direct'}</div>
            </div>
          </div>

          {/* 추이 차트 */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', height: '400px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '20px' }}>방문자 및 페이지뷰 추이</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#6B7280'}} tickLine={false} axisLine={false} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="visitors" name="방문자" stroke="#C8963E" strokeWidth={3} dot={{r: 4, fill: '#C8963E'}} />
                <Line type="monotone" dataKey="pageviews" name="페이지뷰" stroke="#1E3A5F" strokeWidth={3} dot={{r: 4, fill: '#1E3A5F'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 탭: 히트맵 분석 */}
      {activeTab === 'heatmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>오늘 접속한 유저들의 실제 클릭 좌표를 시각화합니다. (기기별로 다르게 보일 수 있습니다)</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setHeatmapDevice('Desktop')} style={{ padding: '6px 12px', background: heatmapDevice === 'Desktop' ? '#1E3A5F' : '#E5E7EB', color: heatmapDevice === 'Desktop' ? '#fff' : '#4B5563', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>PC</button>
              <button onClick={() => setHeatmapDevice('Mobile')} style={{ padding: '6px 12px', background: heatmapDevice === 'Mobile' ? '#1E3A5F' : '#E5E7EB', color: heatmapDevice === 'Mobile' ? '#fff' : '#4B5563', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>모바일</button>
            </div>
          </div>
          
          <div style={{ 
            position: 'relative', 
            width: heatmapDevice === 'Desktop' ? '100%' : '375px', 
            height: '800px', 
            margin: '0 auto', 
            border: '8px solid #1E3A5F', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <iframe 
              ref={iframeRef}
              src="/" 
              onLoad={renderHeatmapInIframe}
              style={{ width: '100%', height: '100%', border: 'none' }} 
            />
          </div>
        </div>
      )}

      {/* 탭: 행동 분석 */}
      {activeTab === 'behavior' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '20px' }}>주요 버튼 클릭(전환) 순위</h3>
            {eventData.length === 0 ? <p style={{color: '#9CA3AF'}}>데이터가 없습니다.</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {eventData.sort((a,b)=>b.value-a.value).map((e, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>{e.name === 'Apply_Volunteer' ? '봉사 신청 버튼' : e.name === 'Kakao_Inquiry' ? '카카오톡 문의' : e.name}</span>
                    <span style={{ color: '#C8963E', fontWeight: '700' }}>{e.value}회</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '20px' }}>스크롤 뎁스 (준비 중)</h3>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>유저들이 페이지를 어디까지 읽고 나갔는지 나타내는 퍼널 차트가 들어갈 자리입니다.</p>
          </div>
        </div>
      )}

      {/* 탭: 유입 및 환경 */}
      {activeTab === 'acquisition' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', height: '300px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '10px', textAlign: 'center' }}>유입 경로 비율</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={referrerData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                  {referrerData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', height: '300px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '10px', textAlign: 'center' }}>기기 비율</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                  {deviceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '20px' }}>지역별 접속자</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {countryData.sort((a,b)=>b.value-a.value).map((c, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ color: '#4B5563' }}>{c.name === 'KR' ? '대한민국' : c.name === 'Unknown' ? '알 수 없음' : c.name}</span>
                  <span style={{ fontWeight: '600' }}>{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
