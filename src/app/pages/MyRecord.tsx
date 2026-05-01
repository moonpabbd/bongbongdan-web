import { useState, useEffect } from 'react';
import { Clock, History, ChevronDown, User, Award, CheckCircle, Lock, Sparkles, Star, Trophy, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { prefetchRecord, invalidateRecordCache } from '../../utils/apiCache';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxIm5xbRwSV9f0I0oCfITu6UWr5Zofd8f_CYx90sXl0g4PL_z2B4ATNSVgRjrSbR1mAlw/exec";

const gradeColors: Record<string, { bg: string, text: string, border: string }> = {
  '예비 단원': { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },
  '입문 단원': { bg: '#ECFDF5', text: '#059669', border: '#D1FAE5' },
  '정식 단원': { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
  '숙련 단원': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  '고참 단원': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  '사형/사자': { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
  '원로': { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' },
  '종사': { bg: '#1F2937', text: '#F9FAFB', border: '#374151' },
};

const TIER_BENEFITS: Record<string, string[]> = {
  '예비 단원': ['봉봉단 소속 인정'],
  '입문 단원': ['봉봉단 공식 활동 참여', '봉사 기록 누적 시작'],
  '정식 단원': ['비영리단체 정식 회원 자격', '단체 의결권 행사', '회원 전용 오픈채팅방 초대', '이름 각인 은색 명찰 수여'],
  '숙련 단원': ['간부진(기획·운영·홍보당) 지원 자격', '선봉장 지원 자격'],
  '고참 단원': ['각 당의 당주 지원 자격', '봉사별 부대장 지원 자격'],
  '사형/사자': ['봉사별 대장 직책 지원 자격'],
  '원로': ['자문 및 고문 역할', '공로 증서 수여'],
  '종사': ['봉봉단 최고 명예직', '크리스탈 공로패 수여'],
};

const TIER_ORDER = [
  '예비 단원', '입문 단원', '정식 단원', '숙련 단원',
  '고참 단원', '사형/사자', '원로', '종사'
];

export function MyRecord() { // MyRecord 탭 렌더링 로직 최종 반영 완료
  const { session, profile, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pastLimit, setPastLimit] = useState(5);
  const [cancelingItem, setCancelingItem] = useState<string | null>(null);
  const [changingItem, setChangingItem] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [selectedNewDate, setSelectedNewDate] = useState<string>('');
  const [isChangeProcessing, setIsChangeProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dog' | 'gathering'>('dog');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!profile || !profile.name || !profile.phone || !profile.birthdate) return;
      try {
        const data = await prefetchRecord(profile.name, profile.phone, profile.birthdate);
        if (data.error || data.status === 'fail') throw new Error(data.message || data.error || '기록을 불러올 수 없습니다.');
        setRecord(data);
      } catch (err: any) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (profile) fetchRecord();
  }, [profile]);

  const handleChangeClick = async (scheduleText: string, dday: number | '?') => {
    if (dday !== '?' && dday < 7) {
      alert('일정 변경은 봉사일 기준 최소 1주일(7일) 전까지만 가능합니다.');
      return;
    }
    setChangingItem(scheduleText);
    setIsLoadingDates(true);
    setSelectedNewDate('');
    try {
      const res = await fetch(GAS_URL);
      const data = await res.json();
      if (data && data.dates) {
        const myUpcomingSchedules = record?.upcoming?.map((u: any) => u.text) || [];
        setAvailableDates(data.dates.filter((d: any) => d.remaining > 0 && d.capacity > 0 && !myUpcomingSchedules.includes(d.name)));
      } else {
        setAvailableDates([]);
      }
    } catch (err) {
      alert('일정 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoadingDates(false);
    }
  };

  const submitChange = async () => {
    if (!selectedNewDate) {
      alert('변경할 일정을 선택해주세요.');
      return;
    }
    if (!window.confirm('정말 해당 일정으로 변경하시겠습니까?\n기존에 입력하신 교통수단, 지하철역 등은 그대로 유지됩니다.')) return;

    setIsChangeProcessing(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'changeVolunteer',
          name: profile.name,
          phone: profile.phone,
          oldScheduleText: changingItem,
          newScheduleText: selectedNewDate
        })
      });
      const result = await response.json();
      if (result.status === 'success') {
        alert('일정 변경 처리가 완료되었습니다.\n새로운 일정에서 뵙겠습니다!');
        setRecord((prev: any) => {
          let newDday: number | '?' = '?';
          let newTime = 9999999999999;
          const match = selectedNewDate.match(/(\d{2})년\s*(\d{2})월\s*(\d{2})일/);
          if (match) {
            const year = 2000 + parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const day = parseInt(match[3]);
            const activityDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffTime = activityDate.getTime() - today.getTime();
            newDday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            newTime = activityDate.getTime();
          }

          const newUpcoming = prev.upcoming.map((u: any) => {
            if (u.text === changingItem) {
              return { ...u, text: selectedNewDate, dday: newDday, time: newTime };
            }
            return u;
          });
          newUpcoming.sort((a: any, b: any) => a.time - b.time);
          return { ...prev, upcoming: newUpcoming };
        });
        invalidateRecordCache(profile.name, profile.phone, profile.birthdate);
        setChangingItem(null);
      } else {
        alert(result.message || '일정 변경 중 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsChangeProcessing(false);
    }
  };

  const handleCancel = async (scheduleText: string, category: string = '유기견 봉사', dday: number | '?' = '?') => {
    let confirmMsg = `[${scheduleText}]\n해당 일정을 정말 취소하시겠습니까?`;

    if (category === '모임 활동') {
      if (typeof dday === 'number' && dday >= 14) {
        confirmMsg += `\n\n모임 시작 14일 전 취소이므로 참가비 환불이 가능합니다.\n취소 완료 후 홈페이지 우측 하단의 카카오 문의나 봉봉단 플러스 친구를 검색해서 취소한 모임명과 환불 받으실 계좌번호를 남겨주시면 환불 처리를 도와드리겠습니다.`;
      } else {
        confirmMsg += `\n\n※ 취소 전 반드시 확인해 주세요!\n모임 시작 14일 미만 남은 일정은 노쇼 방지 및 필수 운영비 사용 등의 사유로 참가비 환불이 불가능합니다. (봉봉단 측 사유 예외)\n위 내용을 모두 확인하였으며, 그래도 취소를 진행하시겠습니까?`;
      }
    } else {
      confirmMsg += `\n\n※ 취소 전 반드시 확인해 주세요!\n본 봉사는 신청 인원을 기준으로 사전에 픽업 차량 배정, 봉사 물품 준비, 보호소 지원 등이 진행됩니다. 참가비는 노쇼 방지를 위한 필수 운영비로 사용되므로, 봉봉단 측 사유가 아닌 개인 사정으로 인한 취소 시 참가비 환불이 어렵습니다.\n\n위 내용을 모두 확인하였으며, 그래도 취소를 진행하시겠습니까?`;
    }

    if (!window.confirm(confirmMsg)) return;

    setCancelingItem(scheduleText);
    try {
      const url = GAS_URL;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'cancelVolunteer',
          name: profile.name,
          phone: profile.phone,
          birthdate: profile.birthdate,
          scheduleText: scheduleText,
          category: category
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        const categoryName = category === '모임 활동' ? '모임' : '봉사';
        alert(`집결 취소 처리가 완료되었습니다.\n다른 ${categoryName}에서 또 뵙기를 기다리고 있겠습니다!`);

        invalidateRecordCache(profile.name, profile.phone, profile.birthdate);

        // 캐시 대기 없이 UI 즉각 업데이트 (Optimistic Update)
        setRecord((prev: any) => {
          if (category === '모임 활동') {
            return {
              ...prev,
              upcomingGathering: prev.upcomingGathering.filter((u: any) => u.text !== scheduleText)
            };
          } else {
            return {
              ...prev,
              upcoming: prev.upcoming.filter((u: any) => u.text !== scheduleText)
            };
          }
        });
      } else {
        alert(result.message || '취소 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setCancelingItem(null);
    }
  };

  if (authLoading || !user || !profile) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">로딩 중...</div>;

  const validUpcoming = record?.upcoming?.filter((u: any) => u.text && u.text.trim() !== '') || [];
  const validPast = record?.past?.filter((p: any) => p.text && p.text.trim() !== '') || [];

  const currentRank = record?.currentTier || record?.rank;
  const tierStyle = gradeColors[currentRank] || gradeColors['정식 단원'];

  let currentBenefits: string[] = [];
  const rankIndex = TIER_ORDER.indexOf(currentRank);
  if (rankIndex !== -1) {
    for (let i = 0; i <= rankIndex; i++) {
      currentBenefits = [...currentBenefits, ...TIER_BENEFITS[TIER_ORDER[i]]];
    }
  } else {
    currentBenefits = TIER_BENEFITS[currentRank] || [];
  }

  const nextBenefits = record?.nextTier ? (TIER_BENEFITS[record.nextTier] || []) : [];

  return (
    <div className="min-h-screen bg-[#F4F6F8] pt-28 pb-20">
      <div className="max-w-[1000px] mx-auto px-5">

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1E3A5F]">나의 활동</h1>
          <p className="text-gray-500 mt-2">{profile.name} 님의 눈부신 활동 여정입니다.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">기록 조회 중...</div>
        ) : error && !record ? (
          <div className="text-center py-10 bg-white rounded-2xl text-red-500 shadow-sm">{error}</div>
        ) : record ? (
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:gap-10 items-start animate-[fadeIn_0.4s_ease]">
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* 좌측: 요약 프로필 카드 (데스크톱에서만 Sticky) */}
            <div className="relative lg:sticky lg:top-28 flex flex-col gap-6 z-10 mb-4 lg:mb-0">
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 text-center border-b border-gray-100">
                  <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{profile.name} <span className="text-lg font-medium text-gray-500">단원</span></h3>
                  <div
                    className="inline-block px-5 py-1.5 rounded-full text-sm font-bold border"
                    style={{ background: tierStyle.bg, color: tierStyle.text, borderColor: tierStyle.border }}
                  >
                    {record.currentTier || record.rank}
                  </div>
                </div>

                {record.nextTier && record.nextTierGap != null && (
                  <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex justify-between text-sm font-semibold mb-3">
                      <span className="text-gray-500">다음 직급: <span className="text-gray-800">{record.nextTier}</span></span>
                      <span className="text-blue-600">{record.nextTierGap}회 남음</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(100, Math.max(0, 100 - (record.nextTierGap / (record.count + record.nextTierGap) * 100)))}%` }}
                      />
                    </div>

                    {nextBenefits.length > 0 && (
                      <div className="mt-4 bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                        <p className="text-[13px] font-bold text-gray-800 mb-3 leading-snug">
                          <Lock size={14} className="text-blue-500 inline-block mr-1.5 -mt-0.5" />
                          <span className="text-blue-600">{record.nextTier}</span> 달성 시 열리는 혜택!
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {nextBenefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <Sparkles size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                              <span className="leading-tight">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 종사 달성 시 축하 메시지 */}
                {!record.nextTier && currentRank === '종사' && (
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-b border-yellow-100 text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-3">
                      <Trophy size={20} className="text-white" />
                    </div>
                    <h4 className="text-lg font-black text-yellow-800 mb-2">최고 명예 달성</h4>
                    <p className="text-sm text-yellow-700 font-medium leading-relaxed">
                      봉봉단 최고의 명예에 도달하셨습니다.<br />
                      그동안의 헌신과 열정에 깊이 감사드립니다.
                    </p>
                  </div>
                )}

                {/* 🏆 나의 명예 순위 & 봉사 횟수 */}
                {record.rankings && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy size={18} className="text-blue-500" />
                      <h4 className="text-[15px] font-bold text-gray-800">나의 명예 순위</h4>
                    </div>

                    <div className="flex flex-col gap-3 mb-5">
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <span className="text-[13px] sm:text-sm text-gray-500 font-semibold shrink-0">역대 누적 랭킹</span>
                        <div className="flex items-baseline gap-1 sm:gap-1.5 text-right">
                          {record.rankings.all?.myRank ? (
                            <>
                              <span className="text-lg sm:text-xl font-black text-blue-600">{record.rankings.all.myRank}</span>
                              <span className="text-xs sm:text-sm font-bold text-gray-500">위 <span className="hidden sm:inline text-gray-300 font-normal mx-1">|</span> <span className="block sm:inline text-[11px] sm:text-sm">상위 {record.rankings.all.percentile}%</span></span>
                            </>
                          ) : (
                            <span className="text-xs sm:text-sm font-medium text-gray-400">기록 없음</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <span className="text-[13px] sm:text-sm text-gray-500 font-semibold shrink-0">{record.seasonYear || '2026'} 시즌 랭킹</span>
                        <div className="flex items-baseline gap-1 sm:gap-1.5 text-right">
                          {record.rankings.season?.myRank ? (
                            <>
                              <span className="text-lg sm:text-xl font-black text-blue-600">{record.rankings.season.myRank}</span>
                              <span className="text-xs sm:text-sm font-bold text-gray-500">위 <span className="hidden sm:inline text-gray-300 font-normal mx-1">|</span> <span className="block sm:inline text-[11px] sm:text-sm">상위 {record.rankings.season.percentile}%</span></span>
                            </>
                          ) : (
                            <span className="text-xs sm:text-sm font-medium text-gray-400">기록 없음</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
                        <p className="text-gray-400 text-[11px] font-bold mb-0.5">역대 누적 횟수</p>
                        <div className="text-lg font-black text-gray-700">{record.count}<span className="text-[11px] font-bold text-gray-400 ml-0.5">회</span></div>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
                        <p className="text-gray-400 text-[11px] font-bold mb-0.5">{record.seasonYear || '2026'} 시즌 횟수</p>
                        <div className="text-lg font-black text-gray-700">{record.seasonCount}<span className="text-[11px] font-bold text-gray-400 ml-0.5">회</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 현재 직급 혜택 안내 */}
                {currentBenefits.length > 0 && (
                  <div className="p-6 bg-white">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      현재 누리고 있는 혜택
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {currentBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[14px] text-gray-600 font-medium">
                          <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 우측: 타임라인 & 리스트 영역 */}
            <div className="flex flex-col gap-8">

              {/* 봉사/모임 탭 */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setActiveTab('dog')}
                  className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all ${activeTab === 'dog' ? 'bg-white text-blue-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  봉사 활동
                </button>
                <button 
                  onClick={() => setActiveTab('gathering')}
                  className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all ${activeTab === 'gathering' ? 'bg-white text-yellow-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  모임 활동
                </button>
              </div>

              {activeTab === 'dog' ? (
                <>
                  {/* 예정된 봉사 */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl"><Clock size={20} className="text-blue-500" /></div>
                        <h4 className="text-lg font-bold text-gray-800">예정된 봉사</h4>
                      </div>
                    </div>

                    {validUpcoming.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {validUpcoming.map((u: any, i: number) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition hover:border-blue-100 hover:bg-blue-50/30">
                            {u.dday !== '?' && (
                              <span className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                                {u.dday === 0 ? 'D-Day' : `D-${u.dday}`}
                              </span>
                            )}
                            <div className="flex-1 text-sm font-semibold text-gray-700 leading-relaxed">{u.text}</div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleChangeClick(u.text, u.dday)}
                                disabled={cancelingItem === u.text}
                                className={`text-xs font-bold px-3 py-2 rounded-lg transition border disabled:opacity-50 ${u.dday !== '?' && u.dday < 7
                                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100'
                                  }`}
                              >
                                일정 변경
                              </button>
                              <button
                                onClick={() => handleCancel(u.text)}
                                disabled={cancelingItem === u.text}
                                className="text-xs font-bold px-3 py-2 rounded-lg transition bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 disabled:opacity-50"
                              >
                                {cancelingItem === u.text ? '처리 중...' : '취소하기'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        예정된 봉사가 없습니다.
                      </div>
                    )}

                    <div className="mt-5 px-2">
                      <p className="text-[12px] text-gray-400 leading-relaxed">
                        * 봉사 일정 변경 및 취소는 <strong className="font-semibold text-gray-500">봉사일 기준 최소 1주일 전</strong>까지만 가능합니다.<br />
                        * 일정 변경은 <strong className="font-semibold text-gray-500">현재 모집 중인 봉사</strong>로만 가능합니다.
                      </p>
                    </div>
                  </div>

                  {/* 이전 봉사 기록 (타임라인 구조) */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="p-2 bg-green-50 rounded-xl"><History size={20} className="text-green-600" /></div>
                      <h4 className="text-lg font-bold text-gray-800">이전 봉사 기록</h4>
                      <span className="ml-auto text-sm font-semibold text-gray-400">총 {validPast.length}건</span>
                    </div>

                    {validPast.length > 0 ? (
                      <div className="pl-4">
                        <div className="relative border-l-2 border-gray-100 pb-4">
                          {validPast.slice(0, pastLimit).map((p: any, i: number) => (
                            <div key={i} className="relative pl-6 pb-8 last:pb-2">
                              <div className="absolute w-3.5 h-3.5 bg-white border-2 border-green-500 rounded-full -left-[9px] top-1"></div>
                              <div className="text-sm font-medium text-gray-600 bg-gray-50 inline-block px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                                {p.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {validPast.length > pastLimit && (
                          <button
                            onClick={() => setPastLimit(prev => prev + 5)}
                            className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2 shadow-sm"
                          >
                            이전 기록 더보기 <ChevronDown size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        이전 봉사 기록이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* 예정된 모임 */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-yellow-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-50 rounded-xl"><Clock size={20} className="text-yellow-600" /></div>
                        <h4 className="text-lg font-bold text-gray-800">예정된 모임</h4>
                      </div>
                    </div>

                    {record?.upcomingGathering && record.upcomingGathering.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {record.upcomingGathering.map((u: any, i: number) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition hover:border-yellow-100 hover:bg-yellow-50/30">
                            {u.dday !== '?' && (
                              <span className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg border border-yellow-200">
                                {u.dday === 0 ? 'D-Day' : `D-${u.dday}`}
                              </span>
                            )}
                            <div className="flex-1 text-sm font-semibold text-gray-700 leading-relaxed">{u.text}</div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleCancel(u.text, '모임 활동', u.dday)}
                                disabled={cancelingItem === u.text}
                                className="text-xs font-bold px-3 py-2 rounded-lg transition bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 disabled:opacity-50"
                              >
                                {cancelingItem === u.text ? '처리 중...' : '취소하기'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        예정된 모임이 없습니다.
                      </div>
                    )}
                  </div>

                  {/* 이전 모임 기록 (타임라인 구조) */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="p-2 bg-gray-100 rounded-xl"><History size={20} className="text-gray-500" /></div>
                      <h4 className="text-lg font-bold text-gray-800">이전 모임 기록</h4>
                      <span className="ml-auto text-sm font-semibold text-gray-400">총 {record?.pastGathering?.length || 0}건</span>
                    </div>

                    {record?.pastGathering && record.pastGathering.length > 0 ? (
                      <div className="pl-4">
                        <div className="relative border-l-2 border-gray-100 pb-4">
                          {record.pastGathering.slice(0, pastLimit).map((p: any, i: number) => (
                            <div key={i} className="relative pl-6 pb-8 last:pb-2">
                              <div className="absolute w-3.5 h-3.5 bg-white border-2 border-gray-400 rounded-full -left-[9px] top-1"></div>
                              <div className="text-sm font-medium text-gray-600 bg-gray-50 inline-block px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                                {p.text || p}
                              </div>
                            </div>
                          ))}
                        </div>

                        {record.pastGathering.length > pastLimit && (
                          <button
                            onClick={() => setPastLimit(prev => prev + 5)}
                            className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2 shadow-sm"
                          >
                            이전 기록 더보기 <ChevronDown size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        이전 모임 기록이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        ) : null}
      </div>

      {/* 일정 변경 모달 */}
      {changingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg">봉사 일정 변경</h3>
              <button onClick={() => setChangingItem(null)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <div className="mb-5 bg-blue-50 text-blue-800 text-sm font-semibold p-3 rounded-xl border border-blue-100 leading-snug">
                현재 일정:<br /> <span className="font-bold">{changingItem}</span>
              </div>

              <h4 className="text-sm font-bold text-gray-700 mb-3">변경할 일정을 선택해주세요</h4>

              {isLoadingDates ? (
                <div className="py-10 text-center text-gray-500 text-sm font-medium">봉사 일정을 불러오는 중...</div>
              ) : availableDates.length === 0 ? (
                <div className="py-10 text-center text-red-500 text-sm font-bold bg-red-50 rounded-xl">현재 변경 가능한 모집 중인 일정이 없습니다.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {availableDates.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex flex-col gap-1.5 p-4 border rounded-xl cursor-pointer transition ${selectedNewDate === opt.name ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="newDate"
                          value={opt.name}
                          checked={selectedNewDate === opt.name}
                          onChange={(e) => setSelectedNewDate(e.target.value)}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1 text-sm text-gray-800 font-medium leading-relaxed break-keep">
                          {opt.name}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
              <button
                onClick={() => setChangingItem(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                닫기
              </button>
              <button
                onClick={submitChange}
                disabled={!selectedNewDate || isChangeProcessing || availableDates.length === 0}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangeProcessing ? '변경 중...' : '변경 확정'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}