import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Eye, MousePointerClick, Clock, UserCheck, Activity, Map, Layout, Filter } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
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
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Password': adminPassword 
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setStats({ trend: [], referrers: {}, devices: {}, countries: {}, events: {}, heatmap: [], pages: {}, scrollDepth: {} });
      }
    } catch (e) {
      console.error('Fetch stats error', e);
      setStats({ trend: [], referrers: {}, devices: {}, countries: {}, events: {}, heatmap: [], pages: {}, scrollDepth: {} });
    } finally {
      setLoading(false);
    }
  };

  const renderHeatmapInIframe = () => {
    if (!iframeRef.current || !stats) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!doc) return;
      
      const oldContainer = doc.getElementById('bbd-scroll-heatmap');
      if (oldContainer) oldContainer.remove();

      const container = doc.createElement('div');
      container.id = 'bbd-scroll-heatmap';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      // iframe의 전체 스크롤 높이 가져오기
      const scrollHeight = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
      const windowHeight = iframeRef.current.clientHeight;
      const scrollableHeight = Math.max(0, scrollHeight - windowHeight);
      
      container.style.height = `${scrollHeight}px`;
      container.style.pointerEvents = 'none';
      container.style.zIndex = '999999';

      const scrollDataArray = Object.entries(stats.scrollDepth || {}).map(([name, value]) => ({ name: parseInt(name), value: value as number }));
      const maxValue = Math.max(...scrollDataArray.map(s => s.value), 1);
      
      // 첫 번째 영역: 스크롤 없이도 보이는 영역 (0% 도달)
      const topDiv = doc.createElement('div');
      topDiv.style.height = `${windowHeight}px`;
      topDiv.style.width = '100%';
      // 가장 많이 본 곳이므로 가장 빨간색
      topDiv.style.background = `hsla(0, 100%, 50%, 0.4)`;
      topDiv.style.display = 'flex';
      topDiv.style.alignItems = 'flex-end';
      topDiv.style.justifyContent = 'center';
      topDiv.style.paddingBottom = '20px';
      
      if (maxValue > 0) {
        const topLabel = doc.createElement('div');
        topLabel.innerText = `기본 노출 영역 (${maxValue}회)`;
        topLabel.style.background = 'rgba(0,0,0,0.7)';
        topLabel.style.color = '#fff';
        topLabel.style.padding = '4px 12px';
        topLabel.style.borderRadius = '8px';
        topLabel.style.fontSize = '12px';
        topLabel.style.fontWeight = 'bold';
        topDiv.appendChild(topLabel);
      }
      container.appendChild(topDiv);

      // 나머지 영역: 스크롤을 해야 보이는 영역 (1% ~ 100%)
      if (scrollableHeight > 0) {
        for (let depth = 1; depth <= 100; depth++) {
          const entry = scrollDataArray.find(s => s.name === depth);
          const value = entry ? entry.value : 0;
          const ratio = value / maxValue;
          
          let bg = 'transparent';
          if (ratio > 0) {
            const hue = (1 - ratio) * 240; 
            bg = `hsla(${hue}, 100%, 50%, 0.4)`;
          }

          const div = doc.createElement('div');
          div.style.height = `${scrollableHeight / 100}px`;
          div.style.width = '100%';
          div.style.background = bg;
          div.style.display = 'flex';
          div.style.alignItems = 'center';
          div.style.justifyContent = 'center';
          
          if (value > 0 && depth % 25 === 0) {
              const label = doc.createElement('div');
              label.innerText = `상위 ${depth}% 도달 (${value}회)`;
              label.style.background = 'rgba(0,0,0,0.7)';
              label.style.color = '#fff';
              label.style.padding = '4px 12px';
              label.style.borderRadius = '8px';
              label.style.fontSize = '12px';
              label.style.fontWeight = 'bold';
              div.appendChild(label);
          }
          
          container.appendChild(div);
        }
      }

      doc.body.appendChild(container);
    } catch (e) {
      console.warn("Iframe DOM access failed", e);
    }
  };

  useEffect(() => {
    if (activeTab === 'heatmap' && stats && !loading) {
      const timer = setTimeout(renderHeatmapInIframe, 1500);
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
  const pageData = Object.entries(stats.pages || {}).map(([name, value]) => ({ name, value }));
  const scrollData = Object.entries(stats.scrollDepth || {}).map(([name, value]) => ({ name: `${name}% 도달`, value })).sort((a,b) => parseInt(a.name) - parseInt(b.name));

  // 탭 네비게이션
  const tabs = [
    { id: 'overview', label: '종합 요약', icon: Activity },
    { id: 'behavior', label: '사용자 행동', icon: Eye },
    { id: 'heatmap', label: '어텐션(이탈률) 분석', icon: MousePointerClick },
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

      {/* 탭: 어텐션 분석 (스크롤 뎁스) */}
      {activeTab === 'heatmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>실제 홈페이지 화면 위에 사용자들이 어디까지 스크롤을 내렸는지 색상으로 표시합니다.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setHeatmapDevice('Desktop')} style={{ padding: '6px 12px', background: heatmapDevice === 'Desktop' ? '#1E3A5F' : '#E5E7EB', color: heatmapDevice === 'Desktop' ? '#fff' : '#4B5563', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>PC</button>
              <button onClick={() => setHeatmapDevice('Mobile')} style={{ padding: '6px 12px', background: heatmapDevice === 'Mobile' ? '#1E3A5F' : '#E5E7EB', color: heatmapDevice === 'Mobile' ? '#fff' : '#4B5563', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>모바일</button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', background: '#F9FAFB', padding: '40px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ 
              position: 'relative', 
              width: heatmapDevice === 'Desktop' ? '100%' : '375px', 
              height: '800px', 
              background: '#fff', 
              borderRadius: '24px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
              border: '8px solid #1E3A5F',
              overflow: 'hidden'
            }}>
              <iframe 
                ref={iframeRef}
                src="/" 
                onLoad={renderHeatmapInIframe}
                style={{ width: '100%', height: '100%', border: 'none' }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* 탭: 행동 분석 */}
      {activeTab === 'behavior' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '20px' }}>인기 페이지 랭킹</h3>
            {pageData.length === 0 ? <p style={{color: '#9CA3AF'}}>데이터가 없습니다.</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pageData.sort((a,b)=>b.value-a.value).slice(0, 10).map((p, idx) => {
                  let pathName = p.name;
                  if (pathName === '/') pathName = '메인 페이지';
                  else if (pathName.includes('/about')) pathName = '보호소 소개';
                  else if (pathName.includes('/news')) pathName = '소식/일정';
                  else if (pathName.includes('/apply')) pathName = '봉사 신청';
                  else if (pathName.includes('/faq')) pathName = 'FAQ';
                  return (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>{idx + 1}. {pathName}</span>
                      <span style={{ color: '#1E3A5F', fontWeight: '700' }}>{p.value} view</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A5F', marginBottom: '20px' }}>상세 버튼 클릭(전환) 순위</h3>
            {eventData.length === 0 ? <p style={{color: '#9CA3AF'}}>데이터가 없습니다.</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {eventData.sort((a,b)=>b.value-a.value).slice(0, 10).map((e, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#374151', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '12px' }}>
                      {e.name === 'Apply_Volunteer' ? '봉사 신청 버튼 (외부)' : e.name === 'Kakao_Inquiry' ? '카카오톡 문의' : e.name}
                    </span>
                    <span style={{ color: '#C8963E', fontWeight: '700', flexShrink: 0 }}>{e.value}회</span>
                  </li>
                ))}
              </ul>
            )}
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
