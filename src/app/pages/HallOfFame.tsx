import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import * as Tabs from '@radix-ui/react-tabs';
import { Trophy, Medal, Flame, Calendar, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { G, gradientText } from '../styles/gradients';
import { prefetchRankings, prefetchRecord } from '../../utils/apiCache';

import { NoticesTab } from '../components/NoticesTab';
import { SchedulesTab } from '../components/SchedulesTab';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxIm5xbRwSV9f0I0oCfITu6UWr5Zofd8f_CYx90sXl0g4PL_z2B4ATNSVgRjrSbR1mAlw/exec";

export function HallOfFame() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab') as 'notices' | 'schedules' | 'halloffame';

  const { session, profile, user } = useAuth();
  const [mainTab, setMainTab] = useState<'notices' | 'schedules' | 'halloffame'>(tabParam || 'notices');
  const [activeTab, setActiveTab] = useState('season');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam && tabParam !== mainTab) {
      setMainTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId: string) => {
    setMainTab(tabId as any);
    navigate(`/news?tab=${tabId}`, { replace: true });
  };

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        let d;
        if (profile && profile.name) {
          d = await prefetchRecord(profile.name, profile.phone || '', profile.birthdate || '');
        } else {
          d = await prefetchRankings();
        }
        setData(d);
      } catch (err) {
        console.error("GAS Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [profile]);

  return (
    <>
      <Helmet>
        <title>봉봉단 소식 & 명예·혜택</title>
        <meta name="description" content="봉봉단을 빛낸 단원들의 명예의 전당과 다양한 소식을 확인해보세요. 우수 봉사자를 위한 특별한 혜택을 제공합니다." />
        <meta property="og:title" content="명예의 전당 - 봉봉단" />
        <meta property="og:description" content="봉봉단과 함께 땀 흘린 우수 봉사자들의 랭킹과 특별한 혜택을 확인하세요." />
      </Helmet>
      <div>
        {/* 페이지 히어로 (다크 테마 유지) */}
        <div className="pt-[140px] px-5 md:px-10" style={{
          background: G.darkHero,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', background: G.heroOrb1, filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>
              BONGBONGDAN NEWS
            </p>
            <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.2' }}>
              소식
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: '1.7' }}>
              봉봉단의 다양한 소식과 <br className="hidden md:block" /> 단원들의 빛나는 명예를 확인해보세요
            </p>
          </div>

          {/* 탭 바 */}
          <div style={{
            position: 'relative', zIndex: 1,
            maxWidth: '700px', margin: '48px auto 0',
            display: 'flex', gap: '4px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px 18px 0 0',
            padding: '6px 6px 0',
            overflowX: 'auto',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { id: 'notices', label: '공지사항', icon: Flame },
              { id: 'schedules', label: '주요일정', icon: Calendar },
              { id: 'halloffame', label: '명예·혜택', icon: Trophy }
            ].map((tab) => {
              const isActive = mainTab === tab.id;
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    flex: '1 1 0',
                    minWidth: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(4px, 1.5vw, 7px)',
                    padding: '13px clamp(4px, 2vw, 16px)',
                    borderRadius: '13px 13px 0 0',
                    textDecoration: 'none',
                    fontSize: 'clamp(12px, 3.5vw, 14px)',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#F5C875' : 'rgba(255,255,255,0.5)',
                    background: isActive ? 'rgba(200,150,62,0.15)' : 'transparent',
                    borderBottom: isActive ? '2px solid #C8963E' : '2px solid transparent',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* 본문 영역 (프리미엄 라이트 모드) */}
        <div className="min-h-screen bg-[#F4F6F8] pt-12 pb-24 px-5">
          <div className="max-w-[760px] mx-auto">

            {mainTab === 'notices' && <NoticesTab />}

            {mainTab === 'schedules' && <SchedulesTab />}

            {mainTab === 'halloffame' && (
              <>
                {(loading) && <div className="flex items-center justify-center gap-2 text-gray-500 font-medium py-20"><Trophy size={18} /> 랭킹 데이터를 불러오는 중입니다...</div>}

                {(!loading && data) && (
                  <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                    <Tabs.List className="flex bg-gray-200/50 p-1.5 rounded-2xl mb-10 w-full max-w-[400px] mx-auto border border-gray-200/50">
                      <Tabs.Trigger
                        value="season"
                        className={`flex-1 py-3 text-[15px] rounded-xl font-bold transition-all outline-none ${activeTab === 'season' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <div className="flex items-center justify-center gap-1.5"><Flame size={16} /> {data.seasonYear || '2026'} 시즌</div>
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="all"
                        className={`flex-1 py-3 text-[15px] rounded-xl font-bold transition-all outline-none ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <div className="flex items-center justify-center gap-1.5"><Crown size={16} /> 역대 누적</div>
                      </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="season" className="outline-none">
                      <RankingList items={data.rankings?.season?.top10 || []} profile={profile} />
                    </Tabs.Content>

                    <Tabs.Content value="all" className="outline-none">
                      <RankingList items={data.rankings?.all?.top10 || []} profile={profile} />
                    </Tabs.Content>
                  </Tabs.Root>
                )}
              </>
            )}

          </div>
        </div>

        {/* 홍보 배너 섹션 (명예의 전당 탭에서만 보임) */}
        {(mainTab === 'halloffame' && !loading && data) && (
          <div className="w-full bg-white py-12 md:py-20 px-4 md:px-5 border-t border-gray-100">
            <div className="max-w-[760px] mx-auto">
              {/* 운영진 혜택 안내 배너 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-[1.5rem] md:rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden mb-6 md:mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                    <Crown size={32} color="#fff" />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center justify-center mb-2 md:hidden">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-full">운영진 전용 혜택</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-gray-800 mb-2">핵심 운영진 특별 혜택</h3>
                    <p className="text-gray-600 leading-relaxed text-[13px] md:text-sm break-keep">
                      봉봉단을 이끌어가는 <strong className="text-gray-800">핵심 운영진(선봉대 제외)</strong>이 봉사에 참여할 시, 감사와 격려의 마음을 담아 해당 봉사의 <strong className="text-amber-700">참가비를 100% 전액 환급</strong>해 드립니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[1.5rem] md:rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />

                <div className="relative z-10">
                  <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[11px] md:text-xs font-bold rounded-full">봉봉단 전용 기능</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2 break-keep">단원이 되면 더 많은 것을 누릴 수 있어요!</h3>
                    <p className="text-gray-600 leading-relaxed text-[13px] md:text-sm break-keep">
                      봉봉단에 가입하고 '나의 봉사' 메뉴에서 특별한 혜택들을 확인해 보세요.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white flex gap-3">
                      <div className="p-2 bg-blue-100/50 rounded-xl h-fit"><Medal size={20} className="text-blue-600" /></div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">내 순위 확인</h4>
                        <p className="text-xs text-gray-500 leading-snug">전체 단원 중 나의 위치와 목표를 확인하세요.</p>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white flex gap-3">
                      <div className="p-2 bg-purple-100/50 rounded-xl h-fit"><Trophy size={20} className="text-purple-600" /></div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">직급 승급 및 특별 혜택</h4>
                        <p className="text-xs text-gray-500 leading-snug">봉사 횟수에 따라 새로운 혜택이 열립니다.</p>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white flex gap-3">
                      <div className="p-2 bg-green-100/50 rounded-xl h-fit"><Calendar size={20} className="text-green-600" /></div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">체계적인 일정 관리</h4>
                        <p className="text-xs text-gray-500 leading-snug">예정된 봉사의 디데이와 지난 기록을 한눈에 확인하세요.</p>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white flex gap-3">
                      <div className="p-2 bg-yellow-100/50 rounded-xl h-fit"><Flame size={20} className="text-yellow-600" /></div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">역대 누적 횟수</h4>
                        <p className="text-xs text-gray-500 leading-snug">지금까지의 모든 봉사 기록을 체계적으로 관리합니다.</p>
                      </div>
                    </div>
                  </div>

                  {!user && (
                    <div className="mt-6 text-center">
                      <p className="text-[14px] font-medium text-gray-500">
                        아직 봉봉단 단원이 아니신가요? <Link to="/signup" className="text-blue-600 font-bold hover:underline ml-1">회원가입 하러가기</Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function RankingList({ items, profile }: any) {
  if (!items || items.length === 0) return <div className="text-center py-20 text-gray-400">랭킹 데이터가 없습니다.</div>;

  const top3 = items.slice(0, 3);
  // 2위, 1위, 3위 순으로 시상대 정렬
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const rest = items.slice(3);

  return (
    <div className="animate-[fadeIn_0.5s_ease]">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* 1~3위 시상대 (Podium) */}
      {top3.length > 0 && (
        <div className="flex justify-center items-end gap-3 md:gap-6 mb-12 mt-6">
          {podiumOrder.map((item: any, i: number) => {
            const isRank1 = item.rank === 1;
            const isRank2 = item.rank === 2;

            let height = isRank1 ? 'h-32' : isRank2 ? 'h-28' : 'h-24';
            let bg = isRank1 ? 'bg-gradient-to-t from-[#FFF8E1] to-white border-[#FFE082]' :
              isRank2 ? 'bg-gradient-to-t from-gray-100 to-white border-gray-200' :
                'bg-gradient-to-t from-[#FFF3E0] to-white border-[#FFCC80]';
            let medalColor = isRank1 ? 'text-[#F5A623]' : isRank2 ? 'text-gray-400' : 'text-[#D97706]';
            let orderClass = isRank1 ? 'order-2 z-10' : isRank2 ? 'order-1' : 'order-3';

            return (
              <div key={i} className={`flex flex-col items-center w-[30%] md:w-36 relative ${orderClass} transform transition hover:-translate-y-2`}>
                <div className="mb-4 text-center">
                  <div className={`text-4xl mb-2 flex justify-center drop-shadow-sm ${medalColor}`}>
                    {isRank1 ? <Crown size={52} strokeWidth={2} /> : <Medal size={36} strokeWidth={2} />}
                  </div>
                  <div className="font-extrabold text-gray-800 text-sm md:text-[17px] break-keep leading-tight flex flex-col items-center gap-1">
                    {item.displayName}
                  </div>
                  <div className="text-[11px] md:text-xs font-semibold text-gray-500 mt-1">{item.tier}</div>
                </div>

                <div className={`w-full ${height} ${bg} border rounded-t-3xl shadow-[0_8px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-end pb-6 relative overflow-hidden`}>
                  <div className={`text-3xl md:text-4xl font-black opacity-30 ${medalColor}`}>{item.rank}</div>
                  <div className="text-sm md:text-base font-bold text-gray-700 mt-2">{item.count}회</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4~10위 리스트 */}
      {rest.length > 0 && (
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-3 md:p-6 flex flex-col gap-2">
          {rest.map((item: any, i: number) => {
            return (
              <div key={i} className="flex items-center px-4 md:px-6 py-4 md:py-5 rounded-2xl border transition-all bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100">
                <div className="w-10 md:w-12 text-center font-black text-gray-300 text-lg md:text-xl italic">{item.rank}</div>
                <div className="flex-1 ml-2 md:ml-4">
                  <div className="font-bold text-gray-800 text-base md:text-[17px] flex items-center gap-2">
                    {item.displayName}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 mt-1">{item.tier}</div>
                </div>
                <div className="font-black text-xl text-gray-800">
                  {item.count}<span className="text-sm font-semibold text-gray-400 ml-1">회</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-gray-400 text-xs font-medium mt-10">데이터는 매일 자정에 갱신됩니다.</p>
    </div>
  );
}
