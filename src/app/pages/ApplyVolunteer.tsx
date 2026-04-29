import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CheckCircle2, ChevronRight, Calendar, User, Phone, AlertCircle, MapPin, Car, Info, Shield, Heart, Copy } from 'lucide-react';
import { G } from '../styles/gradients';
import { useAuth } from '../context/AuthContext';
import { SUBWAY_STATIONS } from '../constants/subwayStations';
import { projectId } from '/utils/supabase/info';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxIm5xbRwSV9f0I0oCfITu6UWr5Zofd8f_CYx90sXl0g4PL_z2B4ATNSVgRjrSbR1mAlw/exec";
const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

export function ApplyVolunteer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dog');

  // 1~7번 문항 State
  const [formData, setFormData] = useState({
    date: '',                 // 1. 어느 날짜에 참여하시겠소?
    name: '',                 // 2. 성함을 알려주세요.
    gender: '',               // 3. 성별은 무엇인가요?
    phone: '',                // 4. 연락처를 알려주세요.
    birthdate: '',            // 5. 생년월일이 무엇인가요?
    isFirstTime: '',          // 6. 봉봉단에 처음 오시나요?
    discoverySource: [] as string[], // 7. 봉봉단을 어떻게 알게 되셨나요?
    discoveryNickname: '',    // 7-1. 닉네임
    discoveryRecommender: '', // 7-2. 추천인
    discoveryOther: '',       // 7-3. 알게 된 경로 직접 입력
    q8: '',                   // 8. 어떻게 오실 예정이신가요?
    q9: '',                   // 9. 봉사 당일 출발지 기준 지하철역은 어디인가요?
    q9_1: '',                 // 9-1. 위 문항에 지하철역이 없으신가요?
    q10: '',                  // 10. 몇 분까지 태워주실 수 있나요?
    q11: false,               // 11. 유류비 지원 정책 동의 여부
    q12: false,               // 12. 참가비 환불 동의
    q13: false,               // 13. 참가비 입금 완료
    q14: '',                  // 14. 알려주실 내용이 있으신가요?
    q15: '',                  // 15. 봉사 활동 사진 SNS 게시에 동의하시나요?
    q16: '',                  // 16. 봉사 집결 안내를 위한 카카오톡 ID
    q17: false                // 17. 개인정보 수집 및 이용 동의
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isQ9Focused, setIsQ9Focused] = useState(false);
  const [step, setStep] = useState(1);
  type VolunteerDateOption = {
    name: string;
    capacity: number;
    current: number;
    remaining: number;
  };
  const [availableDates, setAvailableDates] = useState<VolunteerDateOption[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);

  // 현재 선택된 봉사가 '픽업 가능한 운전자' 전용인지 확인
  const isDriverOnly = formData.date.includes("픽업 가능한 운전자");

  const formRef = useRef<HTMLDivElement>(null);

  // 단계(step)가 변경될 때마다 스크롤 이동 (모바일은 폼 상단으로, PC는 최상단으로)
  useEffect(() => {
    if (window.innerWidth < 768 && formRef.current) {
      const yOffset = -80;
      const y = formRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // 구글 시트에서 날짜 목록(formRanger 기능) 가져오기
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(GAS_URL);
        const data = await res.json();
        if (data && data.dates) {
          setAvailableDates(data.dates);
        } else {
          setAvailableDates([
            { name: '26년 05월 17일 (일) 11:00~14:00 - (파주) 아크보호소', capacity: 20, current: 0, remaining: 20 },
            { name: '26년 05월 23일 (토) 10:30~13:30 - (포천) 이용녀배우 보호소', capacity: 30, current: 0, remaining: 30 },
            { name: '26년 05월 24일 (일) 10:00~13:00 - (오산) 원브리스', capacity: 15, current: 0, remaining: 15 },
            { name: '26년 05월 31일 (일) 10:00~12:00 - (남양주) 동물자유연대', capacity: 20, current: 0, remaining: 20 }
          ]);
        }
      } catch (err) {
        console.error('날짜 로딩 실패:', err);
        setAvailableDates([
            { name: '26년 05월 17일 (일) 11:00~14:00 - (파주) 아크보호소', capacity: 20, current: 0, remaining: 20 },
            { name: '26년 05월 23일 (토) 10:30~13:30 - (포천) 이용녀배우 보호소', capacity: 30, current: 0, remaining: 30 },
            { name: '26년 05월 24일 (일) 10:00~13:00 - (오산) 원브리스', capacity: 15, current: 0, remaining: 15 },
            { name: '26년 05월 31일 (일) 10:00~12:00 - (남양주) 동물자유연대', capacity: 20, current: 0, remaining: 20 }
        ]);
      } finally {
        setIsLoadingDates(false);
      }
    };
    fetchDates();
  }, []);

  // 상단 네비게이션바 등에서 같은 링크(/apply)를 다시 클릭했을 때 폼 초기화 (페이지 진입 시마다 초기화)
  useEffect(() => {
    setSuccess(false);
    setStep(1);
    setErrorMsg('');
    window.scrollTo(0, 0);
  }, [location.key]);

  // 회원 정보 자동 연동 (값이 비어있을 때만 채움)
  useEffect(() => {
    if (profile) {
      const mappedGender = profile.gender === '여성' ? '여자' : profile.gender === '남성' ? '남자' : profile.gender;
      setFormData(prev => ({
        ...prev,
        name: prev.name || profile.name || '',
        gender: prev.gender || mappedGender || '',
        phone: prev.phone || (profile.phone ? profile.phone.replace(/-/g, '') : ''),
        birthdate: prev.birthdate || (profile.birthdate ? profile.birthdate.replace(/-/g, '') : ''),
        q16: prev.q16 || profile.kakaoId || profile.kakao_id || ''
      }));
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'q11' || name === 'q12' || name === 'q13' || name === 'q17') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => {
          const current = prev.discoverySource;
          if (checked) {
            return { ...prev, discoverySource: [...current, value] };
          } else {
            return { ...prev, discoverySource: current.filter(s => s !== value) };
          }
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'dog') setActiveTab(tab);
    else alert('현재 준비 중인 봉사입니다. 멋진 기획으로 곧 찾아뵙겠습니다!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.date) return setErrorMsg('참여하실 날짜를 선택해주세요.');
      if (!formData.name) return setErrorMsg('성함을 입력해주세요.');
      if (!/^[a-zA-Z가-힣]+$/.test(formData.name)) return setErrorMsg('이름은 공백이나 특수문자 없이 입력해 주세요.');
      if (!formData.gender) return setErrorMsg('성별을 선택해주세요.');
      if (!formData.phone) return setErrorMsg('연락처를 입력해주세요.');
      if (!/^\d{11}$/.test(formData.phone)) return setErrorMsg('"01012345678" 형식으로 하이픈(-) 없이 숫자만 입력해주세요.');
      if (!formData.birthdate) return setErrorMsg('생년월일을 입력해주세요.');
      if (!/^(19|20)\d{6}$/.test(formData.birthdate)) return setErrorMsg('생년월일은 "19900101" 형식으로 8자리를 입력해주세요.');
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.isFirstTime) return setErrorMsg('봉봉단 첫 방문 여부를 선택해주세요.');
      if (formData.isFirstTime === '네, 처음입니다 (예비 단원)') {
        if (formData.discoverySource.length === 0) {
          return setErrorMsg('봉봉단을 어떻게 알게 되셨는지 선택해주세요.');
        }
        if (formData.discoverySource.includes('직접 입력') && !formData.discoveryOther.trim()) {
          return setErrorMsg('봉봉단을 알게 된 경로를 직접 입력해주세요.');
        }
      }
      if (!formData.q8) return setErrorMsg('이동 수단을 선택해주세요.');
      if (!formData.q9) return setErrorMsg('출발지 기준 지하철역을 입력해주세요.');
      if (!SUBWAY_STATIONS.includes(formData.q9)) return setErrorMsg('목록에 있는 정확한 지하철역 이름을 선택해주세요. (예: 강남역)');

      const isDriver = formData.q8 === '자차로 가요 (다른 분들 태워줄 수 있어요)' || formData.q8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)';
      if (isDriver) {
        setStep(3);
        return;
      } else {
        setStep(4);
        return;
      }
    }

    if (step === 3) {
      if (!formData.q10) return setErrorMsg('몇 명까지 태워주실 수 있는지 선택해주세요.');
      if (!formData.q11) return setErrorMsg('유류비 지원 정책에 동의해주세요.');
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!formData.q12) return setErrorMsg('참가비 환불 불가 정책에 동의해주세요.');
      if (!formData.q13) return setErrorMsg('참가비 입금 확인에 체크해주세요.');
      setStep(5);
      return;
    }

    if (step === 5) {
      if (!formData.q15) return setErrorMsg('SNS 사진 게시 동의 여부를 선택해주세요.');
      if (!formData.q16) return setErrorMsg('카카오톡 ID를 입력해주세요.');
      if (!formData.q17) return setErrorMsg('개인정보 수집 및 이용에 동의해주세요.');
    }

    setLoading(true);

    try {
      let finalQ8 = formData.q8;
      if (finalQ8 === '자차로 가요 (다른 분들 태워줄 수 있어요)') {
        finalQ8 = '자차로 가요 (다른 분들 태워줄 수 있어요) → 기름비 추후 지급';
      } else if (finalQ8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)') {
        finalQ8 = '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요) → 기름비 추후 지급';
      }

      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ ...formData, q8: finalQ8, category: '유기견 봉사' })
      });

      // 백엔드(Supabase Edge Function)로 알림톡 발송 요청
      try {
        await fetch(`${SERVER}/alimtalk/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: formData.phone.replace(/[^0-9]/g, ""),
            userName: formData.name,
            volunteerDate: formData.date
          })
        });
      } catch (alimtalkErr) {
        console.error("알림톡 발송 요청 실패:", alimtalkErr);
      }

      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMsg('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F2EB', padding: '120px 20px 60px', fontFamily: '"Noto Serif KR", serif' }}>
        <div style={{ background: '#FAF8F5', padding: '50px 40px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%', border: '1px solid #E5D5B5', position: 'relative' }}>

          {/* 장식용 모서리 포인트 */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #C8963E', borderLeft: '2px solid #C8963E' }} />
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #C8963E', borderRight: '2px solid #C8963E' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #C8963E', borderLeft: '2px solid #C8963E' }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #C8963E', borderRight: '2px solid #C8963E' }} />

          {/* 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1E3A5F', margin: '0 0 20px 0', letterSpacing: '2px', wordBreak: 'keep-all' }}>
              집결 신청이 완료되었소!
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '1px', background: '#C8963E' }} />
              <div style={{ width: '8px', height: '8px', background: '#C8963E', transform: 'rotate(45deg)' }} />
              <div style={{ width: '40px', height: '1px', background: '#C8963E' }} />
            </div>
          </div>

          {/* 메인 텍스트 */}
          <div style={{ textAlign: 'center', fontSize: '16px', color: '#374151', lineHeight: '1.8', marginBottom: '40px' }}>
            <p style={{ margin: '0 0 16px', fontWeight: '900', color: '#1E3A5F', fontSize: '18px' }}>입금 확인 시 최종 확정되오.</p>
            <p style={{ margin: '0 0 16px', fontFamily: '"Pretendard", sans-serif' }}>
              이후 별도 안내가 없다면 정상 확정된 것이니 그대로 참여하시면 되오.<br />
              인원 마감이나 변경 등 예외 상황이 있을 때만 개별 연락드리겠소.
            </p>
            <p style={{ margin: 0, fontWeight: '700', color: '#8B5A19', fontFamily: '"Pretendard", sans-serif' }}>
              봉사일 약 1주일 전에 팀 채팅방으로 초대드려 집결 관련 안내를 드리겠소.
            </p>
          </div>

          {/* 봉사비 입금 안내 */}
          <div style={{ borderTop: '1px solid #C8963E', borderBottom: '1px solid #C8963E', padding: '30px 0', marginBottom: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1E3A5F', marginBottom: '16px', letterSpacing: '1px' }}>
              봉사비(운영비) 입금 안내
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#8B5A19', fontWeight: '700', wordBreak: 'keep-all', fontFamily: '"Pretendard", sans-serif' }}>
              혹시 깜빡하고 아직 입금을 안 하셨다면, 지금 바로 입금 부탁드립니다!
            </p>
            <div style={{ background: '#fff', padding: '20px 30px', border: '1px dashed #D1C4A9', display: 'inline-block', textAlign: 'center', fontFamily: '"Pretendard", sans-serif' }}>
              <div style={{ color: '#1E3A5F', fontSize: '15px', lineHeight: '1.8', fontWeight: '700' }}>
                <div style={{ marginBottom: '4px' }}>국민은행 349401-04-363779 봉봉단(BBD)</div>
                <div style={{ marginBottom: '4px' }}>12,000원 <span style={{ fontSize: '13px', fontWeight: '400' }}>(본인 이름으로 입금)</span></div>
                <div style={{ color: '#991B1B', fontWeight: '400', fontSize: '14px' }}>노쇼 방지로 취소 시 환불 불가</div>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div style={{ textAlign: 'center', paddingTop: '10px' }}>
            <p style={{ fontSize: '18px', fontWeight: '900', color: '#8B5A19', margin: '0 0 40px 0', lineHeight: '1.6', letterSpacing: '1px' }}>
              함께 의협을 실천할 그날을 기다리겠소!<br />
              강호에서 만나요!
            </p>

            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', padding: '18px', background: '#1E3A5F', color: '#FDFBF7', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', fontFamily: '"Pretendard", sans-serif', letterSpacing: '1px', transition: 'background 0.2s' }}
            >
              본부로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 닉네임 입력 필요 조건 확인
  const needsNickname = formData.discoverySource.some(src => ['소모임', '스레드', '당근', '솜씨당'].includes(src));
  // 추천인 입력 필요 조건 확인
  const needsRecommender = formData.discoverySource.includes('지인 소개');
  const needsDirectInput = formData.discoverySource.includes('직접 입력');

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* 상단 타이틀 */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1E3A5F', marginBottom: '16px' }}>집결 신청하기</h1>

          {/* 카테고리 탭 */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleTabClick('dog')}
              style={{ padding: '12px 24px', background: activeTab === 'dog' ? '#1E3A5F' : '#fff', color: activeTab === 'dog' ? '#fff' : '#6B7280', border: activeTab === 'dog' ? 'none' : '1px solid #E5E7EB', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            >
              🐶 유기견 봉사
            </button>
            <button
              onClick={() => handleTabClick('plogging')}
              style={{ padding: '12px 24px', background: '#fff', color: '#9CA3AF', border: '1px solid #E5E7EB', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🌱 플로깅 (준비중)
            </button>
            <button
              onClick={() => handleTabClick('mural')}
              style={{ padding: '12px 24px', background: '#fff', color: '#9CA3AF', border: '1px solid #E5E7EB', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🎨 벽화 봉사 (준비중)
            </button>
          </div>
        </div>

        {/* 2단 레이아웃 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>

          {/* 왼쪽: 안내 문구 (공식 출정서 스타일) */}
          <div style={{
            background: '#FAF8F5',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: 'inset 0 0 60px rgba(200, 150, 62, 0.06), 0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid #E5D5B5',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 모서리 금박 장식 */}
            <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '2px solid #C8963E', borderLeft: '2px solid #C8963E', opacity: 0.7 }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '2px solid #C8963E', borderRight: '2px solid #C8963E', opacity: 0.7 }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '2px solid #C8963E', borderLeft: '2px solid #C8963E', opacity: 0.7 }} />
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '2px solid #C8963E', borderRight: '2px solid #C8963E', opacity: 0.7 }} />

            {/* 안쪽 테두리 */}
            <div style={{ border: '1px solid rgba(200, 150, 62, 0.25)', padding: '40px 32px', height: '100%', position: 'relative', zIndex: 1 }}>

              {/* 제목 */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span style={{ color: '#A87830', fontSize: '13px', letterSpacing: '4px', fontWeight: '800' }}>천하제일 봉사문파</span>
                <h2 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '30px', fontWeight: '900', color: '#1E3A5F', marginTop: '12px', letterSpacing: '1px' }}>
                  봉봉단 출정 안내서
                </h2>
                <div style={{ width: '40px', height: '2px', background: '#C8963E', margin: '24px auto 0', opacity: 0.8 }} />
              </div>

              <p style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '18px', fontWeight: '700', color: '#2B3B4C', lineHeight: '1.6', textAlign: 'center', marginBottom: '40px', wordBreak: 'keep-all' }}>
                "강호의 동지들, 정예 고수를 모집하오!"
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* 섹션 1 */}
                <div>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                    <span style={{ color: '#C8963E' }}>◈</span> 활동 내용
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                    유기견 보호소에서 견사 청소, 산책, 사회화 훈련, 일손 부족 해결, 보호소 수리 등을 돕는 봉사 활동
                  </p>
                </div>

                {/* 섹션 2 */}
                <div>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                    <span style={{ color: '#C8963E' }}>◈</span> 제공 물품
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                    방진복, 목장갑, 신발커버, 음료, 마스크 제공!<br />
                    <span style={{ color: '#8892B0', fontSize: '13px' }}>(*개인 장화가 있으면 더 편해요)</span>
                  </p>
                </div>

                {/* 섹션 3 */}
                <div style={{ background: 'rgba(200, 150, 62, 0.08)', padding: '24px', borderLeft: '3px solid #C8963E' }}>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '17px', fontWeight: '900', color: '#8B5A19', marginBottom: '12px' }}>
                    참가비 (금 1.2만냥)
                  </h3>
                  <ul style={{ color: '#5C4A3D', fontSize: '14px', lineHeight: '1.7', margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>운영비 및 노쇼 방지 목적</li>
                    <li>픽업 제공자는 이동거리 만큼 유류비 지원해 드립니다.</li>
                    <li style={{ color: '#B91C1C', fontWeight: '700' }}>노쇼 방지로 봉사 취소 시 환불이 불가합니다.</li>
                  </ul>
                </div>

                {/* 섹션 4 */}
                <div>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                    <span style={{ color: '#C8963E' }}>◈</span> 신청 방법
                  </h3>
                  <div style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '600', wordBreak: 'keep-all' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>1</span>
                      <div>우측의 <span style={{ color: '#1E3A5F', fontWeight: '800' }}>봉사 집결 신청서</span> 작성</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>2</span>
                      <div>참가비 1.2만원 입금 (반드시 본인 이름으로!)</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>3</span>
                      <div>
                        집결 신청서 제출 완료!<br />
                        <span style={{ fontSize: '13px', color: '#8892B0', fontWeight: '400', display: 'block' }}>(인원 마감이나 픽업 부족 시, 개별 연락드립니다.)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 섹션 5 */}
                <div style={{ borderTop: '1px dashed #D1C4A9', paddingTop: '24px' }}>
                  <h4 style={{ color: '#991B1B', fontSize: '14px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} /> 필독 주의사항
                  </h4>
                  <ul style={{ color: '#991B1B', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '24px', opacity: 0.9, listStyleType: 'disc' }}>
                    <li>반드시 본인 이름으로 입금해주세요.</li>
                    <li>입금 후 본 폼을 제출해야 신청 완료됩니다.</li>
                    <li>더러워질 수 있으니 편한 옷 착용을 권장합니다.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* 오른쪽: 입력 폼 */}
          <div ref={formRef} style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* 진행률 표시줄 */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', fontWeight: '800', color: '#1E3A5F' }}>
                  <span>신청서 작성</span>
                  <span>{step} / 5</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(step / 5) * 100}%`, height: '100%', background: '#C8963E', transition: 'width 0.4s ease-in-out' }} />
                </div>
              </div>

              {/* === 1페이지 === */}
              {step === 1 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '30px', height: '2px', background: '#C8963E', margin: '0 auto 12px', opacity: 0.8 }} />
                    <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '24px', fontWeight: '900', color: '#1E3A5F', margin: 0, letterSpacing: '0.5px' }}>
                      신청서 작성
                    </h3>
                  </div>

                  {profile && (
                    <div style={{
                      padding: '20px',
                      background: '#FAF8F5',
                      borderRadius: '8px',
                      marginBottom: '32px',
                      border: '1px solid #E5D5B5',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ color: '#C8963E', marginTop: '2px' }}>
                          <Info size={20} />
                        </div>
                        <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all' }}>
                          <span style={{ color: '#8B5A19', fontWeight: '800' }}>기본 정보 자동 기입 완료</span><br />
                          회원님의 인적사항이 자동으로 기록되었소.<br />
                          수정이 필요하다면 직접 입력칸을 눌러 변경하시구려.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 1. 날짜 선택 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      어느 날짜에 참여하시겠소? <span style={{ color: '#DC2626' }}>*</span>
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {isLoadingDates ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                          봉사 일정을 불러오는 중입니다...
                        </div>
                      ) : availableDates.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#DC2626', fontSize: '14px', fontWeight: '700' }}>
                          현재 모집 중인 봉사 일정이 없습니다.
                        </div>
                      ) : (
                        availableDates.map((opt, i) => {
                          const isClosed = opt.remaining <= 0 || opt.capacity === 0;
                          return (
                            <label 
                              key={i} 
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', 
                                border: formData.date === opt.name ? '2px solid #C8963E' : '1px solid #E5E7EB', 
                                borderRadius: '12px', cursor: isClosed ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                background: formData.date === opt.name ? '#FDFBF7' : isClosed ? '#F3F4F6' : '#fff',
                                opacity: isClosed ? 0.7 : 1
                              }}
                            >
                              <input 
                                type="radio" 
                                name="date" 
                                value={opt.name}
                                checked={formData.date === opt.name} 
                                onChange={handleChange} 
                                disabled={isClosed}
                                style={{ width: '18px', height: '18px', accentColor: '#C8963E', flexShrink: 0 }} 
                              />
                              <div style={{ fontSize: '14px', color: isClosed ? '#9CA3AF' : '#374151', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                  {isClosed ? (
                                    <span style={{ flexShrink: 0, background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', marginTop: '2px' }}>[모집 완료]</span>
                                  ) : (
                                    <span style={{ flexShrink: 0, color: '#065F46', fontWeight: '800', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginTop: '2px' }}>
                                      [모집 중]
                                    </span>
                                  )}
                                  <span style={{ fontWeight: formData.date === opt.name ? '700' : '500', textDecoration: isClosed ? 'line-through' : 'none', wordBreak: 'keep-all' }}>
                                    {opt.name}
                                  </span>
                                </div>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* 2. 이름 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      성함을 알려주세요. <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} placeholder="홍길동"
                      style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>공백이나 특수문자 없이 입력해 주세요.</p>
                  </div>

                  {/* 3. 성별 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      성별은 무엇인가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
                      {['여자', '남자'].map((opt) => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                          <input type="radio" name="gender" value={opt} checked={formData.gender === opt} onChange={handleChange} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 4. 연락처 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      연락처를 알려주세요. <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01012345678"
                      style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>"01012345678" 형식으로 하이픈(-) 없이 숫자만 입력해주세요.</p>
                  </div>

                  {/* 5. 생년월일 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      생년월일이 무엇인가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="YYYYMMDD"
                      style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>"19900101" 형식으로 8자리를 입력해주세요.</p>
                  </div>
                </>
              )}

              {/* === 2페이지 === */}
              {step === 2 && (
                <>
                  {/* 6. 처음 오시나요? */}
                  <div style={{ borderTop: step === 2 ? 'none' : '1px solid #E5E7EB', paddingTop: step === 2 ? '0' : '24px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      봉봉단에 첫 봉사이신가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                        <input type="radio" name="isFirstTime" value="네, 처음입니다 (예비 단원)" checked={formData.isFirstTime === '네, 처음입니다 (예비 단원)'} onChange={handleChange} />
                        네, 처음입니다 (예비 단원)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                        <input type="radio" name="isFirstTime" value="아니요, 기존 단원입니다" checked={formData.isFirstTime === '아니요, 기존 단원입니다'} onChange={handleChange} />
                        아니요, 기존 단원입니다
                      </label>
                    </div>
                  </div>

                  {/* 7. 처음 오신 분 추가 질문 */}
                  {formData.isFirstTime === '네, 처음입니다 (예비 단원)' && (
                    <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                      {/* 7. 알게 된 경로 */}
                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                          봉봉단을 어떻게 알게 되셨나요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {['지인 소개', '인스타그램', '소모임', '스레드', '당근', '블로그', '솜씨당', '검색', '직접 입력'].map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                              <input type="checkbox" name="discoverySource" value={opt} checked={formData.discoverySource.includes(opt)} onChange={handleChange} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 7-1. 닉네임 (소모임/스레드/당근/솜씨당) */}
                      {needsNickname && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <label style={{ display: 'block', color: '#1E3A5F', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                            닉네임이 무엇인가요? <span style={{ color: '#6B7280', fontWeight: '400' }}>(선택한 플랫폼 기준)</span>
                          </label>
                          <input
                            type="text" name="discoveryNickname" value={formData.discoveryNickname} onChange={handleChange} placeholder="기재된 닉네임을 작성해주세요."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      )}

                      {/* 7-2. 추천인 (지인 소개) */}
                      {needsRecommender && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <label style={{ display: 'block', color: '#1E3A5F', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                            누가 소개해주셨나요?
                          </label>
                          <input
                            type="text" name="discoveryRecommender" value={formData.discoveryRecommender} onChange={handleChange} placeholder="소개해준 단원 이름을 알려주세요."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      )}

                      {/* 7-3. 직접 입력 */}
                      {needsDirectInput && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <label style={{ display: 'block', color: '#1E3A5F', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                            알게 된 경로를 알려주세요. <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="text" name="discoveryOther" value={formData.discoveryOther} onChange={handleChange} placeholder="경로를 직접 입력해주세요."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                          />
                        </div>
                      )}

                    </div>
                  )}

                  {/* 8. 이동 수단 */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      어떻게 오실 예정이신가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>

                      {/* 1번 라디오 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                          <input type="radio" name="q8" value="자차로 가요 (다른 분들 태워줄 수 있어요)" checked={formData.q8 === '자차로 가요 (다른 분들 태워줄 수 있어요)'} onChange={handleChange} style={{ marginTop: '2px' }} />
                          <span style={{ fontWeight: '600' }}>자차로 가요 (다른 분들 태워줄 수 있어요)</span>
                        </label>
                        {formData.q8 === '자차로 가요 (다른 분들 태워줄 수 있어요)' && (
                          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', animation: 'fadeIn 0.3s', marginLeft: '24px' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#1E3A5F', lineHeight: '1.5', fontWeight: '600' }}>
                              픽업 제공이 가능한 운전자로 우선 분류되어 픽업 배차 대상이 됩니다.
                            </p>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1E3A5F', margin: '0 0 8px 0' }}>[유류비 지원 안내]</h4>
                            <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.6', margin: '0 0 8px 0' }}>
                              봉사 당일 실제 픽업이 이루어진 구간만을 기준으로 산정되며, 운전자 단독 이동 구간이나, 동승자가 없는 구간은 정산 대상에 포함되지 않습니다.<br />
                              거리 기준은 첫 번째 동승자를 태운 시점(지하철역 기준)부터 봉사지까지의 이동 구간 및 봉사지에서 마지막 동승자를 하차시킨 시점(지하철역 기준)까지의 이동 구간이며, 네이버 지도 무료 도로 우선 거리에서 확인된 이동 거리입니다.
                            </p>
                            <ul style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.6', margin: '0 0 8px 0', paddingLeft: '20px' }}>
                              <li>연비 기준: 11km/L 기준 적용</li>
                              <li>유류비 단가: 지급 시점 전국 유류비 평균 가격</li>
                            </ul>
                            <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#374151', margin: '0 0 4px 0' }}>동승 인원별 지급 비율 (편도 기준)</h5>
                            <ul style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                              <li>동승자 1명: 유류비의 <strong>80%</strong> 지급</li>
                              <li>동승자 2명: 유류비의 <strong>90%</strong> 지급</li>
                              <li>동승자 3명 이상: 유류비의 <strong>100%</strong> 지급</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* 2번 라디오 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                          <input type="radio" name="q8" value="자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)" checked={formData.q8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)'} onChange={handleChange} style={{ marginTop: '2px' }} />
                          <span style={{ fontWeight: '600' }}>자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)</span>
                        </label>
                        {formData.q8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)' && (
                          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', animation: 'fadeIn 0.3s', marginLeft: '24px' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#1E3A5F', lineHeight: '1.5', fontWeight: '600' }}>
                              기본적으로 개인 이동으로 방문하되, 픽업 제공자가 부족한 경우에 한해 픽업자로 배차될 수 있습니다.
                            </p>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1E3A5F', margin: '0 0 8px 0' }}>[유류비 지원 안내]</h4>
                            <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.6', margin: '0 0 8px 0' }}>
                              봉사 당일 실제 픽업이 이루어진 구간만을 기준으로 산정되며, 운전자 단독 이동 구간이나, 동승자가 없는 구간은 정산 대상에 포함되지 않습니다.<br />
                              거리 기준은 첫 번째 동승자를 태운 시점(지하철역 기준)부터 봉사지까지의 이동 구간 및 봉사지에서 마지막 동승자를 하차시킨 시점(지하철역 기준)까지의 이동 구간이며, 네이버 지도 무료 도로 우선 거리에서 확인된 이동 거리입니다.
                            </p>
                            <ul style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.6', margin: '0 0 8px 0', paddingLeft: '20px' }}>
                              <li>연비 기준: 11km/L 기준 적용</li>
                              <li>유류비 단가: 지급 시점 전국 유류비 평균 가격</li>
                            </ul>
                            <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#374151', margin: '0 0 4px 0' }}>동승 인원별 지급 비율 (편도 기준)</h5>
                            <ul style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                              <li>동승자 1명: 유류비의 <strong>80%</strong> 지급</li>
                              <li>동승자 2명: 유류비의 <strong>90%</strong> 지급</li>
                              <li>동승자 3명 이상: 유류비의 <strong>100%</strong> 지급</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* 3번 라디오 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: isDriverOnly ? 0.5 : 1 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: isDriverOnly ? 'not-allowed' : 'pointer', fontSize: '14px', color: '#374151' }}>
                          <input type="radio" name="q8" value="자차로 가요 (혼자 타고 가요)" checked={formData.q8 === '자차로 가요 (혼자 타고 가요)'} onChange={handleChange} disabled={isDriverOnly} style={{ marginTop: '2px' }} />
                          <span style={{ fontWeight: '600', textDecoration: isDriverOnly ? 'line-through' : 'none' }}>자차로 가요 (혼자 타고 가요)</span>
                        </label>
                        {isDriverOnly && (
                           <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700', marginLeft: '28px' }}>※ 선택하신 봉사는 '픽업 가능한 운전자'만 신청할 수 있습니다.</div>
                        )}
                        {formData.q8 === '자차로 가요 (혼자 타고 가요)' && (
                          <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FCA5A5', animation: 'fadeIn 0.3s', marginLeft: '28px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#991B1B', lineHeight: '1.5', fontWeight: '600' }}>
                              자차 단독 이동 시에는 유류비가 지원되지 않습니다.<br />다만, 봉사 종료 후 현장 상황(식사 및 카페 방문 등)에 따라 운영진이 귀가 픽업을 조심스레 부탁드릴 수 있습니다. 편하게 거절하셔도 무방하며, 만약 픽업을 도와주실 경우 귀가 편도 유류비를 지원해 드립니다.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 4번 라디오 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: isDriverOnly ? 0.5 : 1 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: isDriverOnly ? 'not-allowed' : 'pointer', fontSize: '14px', color: '#374151' }}>
                          <input type="radio" name="q8" value="픽업이 필요해요 (뚜벅이)" checked={formData.q8 === '픽업이 필요해요 (뚜벅이)'} onChange={handleChange} disabled={isDriverOnly} style={{ marginTop: '2px' }} />
                          <span style={{ fontWeight: '600', textDecoration: isDriverOnly ? 'line-through' : 'none' }}>픽업이 필요해요 (뚜벅이)</span>
                        </label>
                        {isDriverOnly && (
                           <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700', marginLeft: '28px' }}>※ 선택하신 봉사는 '픽업 가능한 운전자'만 신청할 수 있습니다.</div>
                        )}
                        {formData.q8 === '픽업이 필요해요 (뚜벅이)' && (
                          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', animation: 'fadeIn 0.3s', marginLeft: '28px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: '1.6' }}>
                              봉사지로 이동할 때는 전원 픽업 배차를 확정해 드립니다. 다만, 봉사 종료 후에는 식사나 카페 방문 등 현장 변수가 많아 사전 배차가 불가합니다.<br />
                              차량 지원은 자발적인 봉사이므로 운전자에게 귀가 픽업을 강제할 수 없습니다. 귀가 시에는 현장에서 운전자의 일정에 맞춰 동승하시거나 대중교통을 이용하셔야 할 수 있으니, 당일 개인 일정을 사전에 여유롭게 계획해 주시길 권장합니다.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 5번 라디오 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: isDriverOnly ? 0.5 : 1 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: isDriverOnly ? 'not-allowed' : 'pointer', fontSize: '14px', color: '#374151' }}>
                          <input type="radio" name="q8" value="대중교통으로 직접 갈게요" checked={formData.q8 === '대중교통으로 직접 갈게요'} onChange={handleChange} disabled={isDriverOnly} style={{ marginTop: '2px' }} />
                          <span style={{ fontWeight: '600', textDecoration: isDriverOnly ? 'line-through' : 'none' }}>대중교통으로 직접 갈게요</span>
                        </label>
                        {isDriverOnly && (
                           <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700', marginLeft: '28px' }}>※ 선택하신 봉사는 '픽업 가능한 운전자'만 신청할 수 있습니다.</div>
                        )}
                        {formData.q8 === '대중교통으로 직접 갈게요' && (
                          <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FCA5A5', animation: 'fadeIn 0.3s', marginLeft: '28px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#991B1B', lineHeight: '1.5', fontWeight: '600' }}>
                              유기견 보호소 특성상 대부분 대중교통으로 접근하기 다소 어려운 외곽에 위치해 있습니다. (단, 포캣멍센터 등 일부 도심 소재 보호소 제외)<br />대중교통이나 택시 등 개별 수단을 이용하여 직접 방문하시는 것이 맞으실지 다시 한번 확인 부탁드립니다.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 9. 지하철역 */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      봉사 당일 출발지 기준 지하철역은 어디인가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="q9"
                        value={formData.q9}
                        onChange={handleChange}
                        onFocus={() => setIsQ9Focused(true)}
                        onBlur={() => setIsQ9Focused(false)}
                        placeholder="지하철역 검색 (예: 강남역)"
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '15px', color: '#111827', boxSizing: 'border-box', background: '#fff' }}
                        autoComplete="off"
                      />
                      {isQ9Focused && formData.q9.length > 0 && (
                        <ul style={{
                          position: 'absolute', top: '100%', left: 0, right: 0,
                          maxHeight: '200px', overflowY: 'auto', background: '#fff',
                          border: '1px solid #D1D5DB', borderRadius: '8px',
                          marginTop: '4px', zIndex: 10, padding: 0, margin: '4px 0 0 0', listStyle: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                          {SUBWAY_STATIONS.filter(s => s.includes(formData.q9)).length > 0 ? (
                            SUBWAY_STATIONS.filter(s => s.includes(formData.q9)).map(station => (
                              <li
                                key={station}
                                onMouseDown={(e) => {
                                  e.preventDefault(); // prevents input onBlur
                                  setFormData(prev => ({ ...prev, q9: station }));
                                  setIsQ9Focused(false);
                                }}
                                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F3F4F6', fontSize: '14px', color: '#374151', transition: 'background 0.2s' }}
                                onMouseOver={(e) => (e.currentTarget.style.background = '#F3F4F6')}
                                onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
                              >
                                {station}
                              </li>
                            ))
                          ) : (
                            <li style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280', textAlign: 'center' }}>
                              검색된 지하철역이 없습니다.
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* 9-1. 기타 지하철역 */}
                  <div style={{ paddingBottom: '24px' }}>
                    <label style={{ display: 'block', color: '#4B5563', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                      위 목록에 지하철역이 없으신가요? (선택)
                    </label>
                    <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>
                      위 문항은 아무 역이나 선택하시고, 아래에 실제 탑승하실 역을 "OO역"으로 작성해주세요.
                    </p>
                    <input
                      type="text"
                      name="q9_1"
                      value={formData.q9_1}
                      onChange={handleChange}
                      placeholder="예: 봉봉역"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827', boxSizing: 'border-box', background: '#F9FAFB' }}
                    />
                  </div>
                </>
              )}

              {/* === 3페이지 (운전자 픽업 정보) === */}
              {step === 3 && (
                <>
                  {/* 10. 몇 명까지 태워주실 수 있나요? */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      몇 명까지 태워주실 수 있나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                      본인(운전자)을 제외한 실제 동승 가능한 인원 수만 체크해 주세요.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '8px 0' }}>
                      {['1', '2', '3', '4', '5', '6'].map(num => (
                        <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151', background: formData.q10 === num ? '#F0F9FF' : '#fff', border: formData.q10 === num ? '1px solid #BAE6FD' : '1px solid #E5E7EB', padding: '12px', borderRadius: '8px', transition: 'all 0.2s' }}>
                          <input type="radio" name="q10" value={num} checked={formData.q10 === num} onChange={handleChange} />
                          {num}명
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 11. 유류비 지원 정책 동의 */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      아래 유류비 지원 정책을 확인하셨으며, 해당 기준에 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>

                    <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13.5px', color: '#4B5563', lineHeight: '1.6', marginBottom: '16px' }}>
                      <p style={{ margin: '0 0 16px', fontWeight: '800', color: '#1E3A5F', fontSize: '14.5px' }}>봉봉단은 봉사 당일 단원 픽업에 참여한 운전자에게 아래 기준으로 유류비를 지원합니다.</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '-1px' }}>•</span>
                          <div><strong style={{ color: '#374151' }}>정산 대상:</strong> 동승자 1명 이상인 실제 픽업 구간만 해당 <span style={{ color: '#6B7280' }}>(단독 이동 구간 제외)</span></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '-1px' }}>•</span>
                          <div><strong style={{ color: '#374151' }}>거리 기준:</strong> 첫 동승자 탑승 지점 ~ 봉사지, 봉사지 ~ 마지막 동승자 하차 지점<br /><span style={{ color: '#6B7280', fontSize: '12.5px' }}>(네이버 지도 '무료 도로 우선' 기준, 유료 도로 통행료 미지원)</span></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '-1px' }}>•</span>
                          <div><strong style={{ color: '#374151' }}>산정 기준:</strong> 연비 11km/L, 지급 시점 전국 기름비 평균 가격</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '-1px' }}>•</span>
                          <div><strong style={{ color: '#374151' }}>동승 인원별 지급 비율 (편도 기준):</strong> 1명 80% / 2명 90% / 3명 이상 100%</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '-1px' }}>•</span>
                          <div><strong style={{ color: '#374151' }}>제출 기한:</strong> 봉사 종료 후 3일 이내 <span style={{ color: '#DC2626' }}>(미제출 시 정산 불가)</span></div>
                        </div>
                      </div>

                      <p style={{ margin: 0, color: '#B91C1C', fontWeight: '700', fontSize: '14px' }}>*미동의 시, 유류비 지원이 어려울 수 있습니다.</p>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                      <input type="checkbox" name="q11" checked={formData.q11} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                      네, 동의합니다.
                    </label>
                  </div>
                </>
              )}

              {/* === 4페이지 (참가비 입금) === */}
              {step === 4 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '30px', height: '2px', background: '#C8963E', margin: '0 auto 12px', opacity: 0.8 }} />
                    <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '24px', fontWeight: '900', color: '#1E3A5F', margin: 0, letterSpacing: '0.5px' }}>
                      참가비 입금
                    </h3>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '18px' }}>💰</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '800', color: '#1E3A5F', fontSize: '16px' }}>참가비: 12,000원</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>(운영비/노쇼방지)</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '800', color: '#1E3A5F' }}>입금 계좌</p>
                      <p style={{ margin: 0, fontSize: '15px', color: '#374151', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>국민은행 <strong style={{ color: '#1E3A5F' }}>349401-04-363779</strong> 봉봉단(BBD)</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('349401-04-363779');
                            alert('계좌번호가 복사되었습니다.');
                          }}
                          style={{
                            background: '#F3F4F6',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#4B5563',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </p>
                    </div>

                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span>⚠️</span>
                        <span>반드시 <strong style={{ color: '#1E3A5F' }}>본인 이름으로 입금</strong>해주세요. (대리 입금 ❌)</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span>⚠️</span>
                        <span>입금 후 본 폼을 제출해야 신청이 완료됩니다.</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span>⚠️</span>
                        <span>"픽업 가능한 운전자만 신청 가능"으로 표기된 봉사에 픽업 불가능으로 신청하신 경우, 참가비 환불은 불가하며 다른 봉사 일정으로 변경만 가능합니다.</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span>❌</span>
                        <span style={{ color: '#B91C1C', fontWeight: '700' }}>노쇼 방지로 봉사 취소 시 환불이 불가합니다.</span>
                      </li>
                    </ul>
                  </div>

                  {/* 12. 참가비 환불 동의 */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      참가비 환불이 어려운 점에 대해 확인하고 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FCA5A5', fontSize: '13px', color: '#991B1B', lineHeight: '1.6', marginBottom: '12px' }}>
                      본 봉사는 신청 인원을 기준으로 픽업 차량 배정, 봉사 물품 준비, 보호소 지원 등으로 운영이 진행되며, 참가비는 노쇼 방지를 위한 운영비로 사용됩니다.<br /><br />
                      이에 따라 개인 사정으로 인한 취소 시 참가비 환불이 불가하며, 해당 내용에 동의하지 않을 경우 봉사 참여가 불가능함을 확인합니다.
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                      <input type="checkbox" name="q12" checked={formData.q12} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                      위 내용을 확인하였으며, 참가비 환불 불가에 동의합니다.
                    </label>
                  </div>

                  {/* 13. 입금 확인 */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      참가비를 입금하셨나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                      <input type="checkbox" name="q13" checked={formData.q13} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                      네, 본인 이름으로 입금 완료했습니다.
                    </label>
                  </div>
                </>
              )}

              {/* === 5페이지 (마지막 추가 문항) === */}
              {step === 5 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '30px', height: '2px', background: '#C8963E', margin: '0 auto 12px', opacity: 0.8 }} />
                    <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '24px', fontWeight: '900', color: '#1E3A5F', margin: 0, letterSpacing: '0.5px' }}>
                      추가 확인 사항
                    </h3>
                  </div>

                  {/* 14. 알려주실 내용 */}
                  <div style={{ paddingBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      알려주실 내용이 있으신가요? <span style={{ color: '#6B7280', fontWeight: '400' }}>(선택)</span>
                    </label>
                    <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>
                      알레르기, 건강상 주의사항, 기타 전달사항이 있으면 편하게 적어주세요.
                    </p>
                    <textarea
                      name="q14"
                      value={formData.q14}
                      onChange={handleChange}
                      placeholder="내용을 입력해주세요."
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827', boxSizing: 'border-box', background: '#F9FAFB', minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  {/* 15. SNS 사진 게시 동의 */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      봉사 활동 사진 SNS 게시에 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#4B5563', lineHeight: '1.6', marginBottom: '12px' }}>
                      봉사 당일 촬영된 모든 활동 사진은 <strong style={{ color: '#374151' }}>봉사 집결을 위해 생성된 카카오톡 단체 채팅방에만 전체 공유</strong>되며, 개인적으로 사진을 따로 전달해드리지 않습니다.<br /><br />
                      공유된 사진 중 <strong style={{ color: '#1E3A5F' }}>가장 예쁘고 훈훈한 사진들만 엄선하여 봉봉단의 SNS 계정 또는 홈페이지에 게시</strong>될 수 있습니다.<br />
                      봉봉단의 아름다운 활동을 널리 알릴 수 있도록 가급적 <strong style={{ color: '#047857' }}>'동의'</strong>를 부탁드립니다!<br /><br />
                      혹시라도 원치 않게 사진이 업로드된 경우, 문의처로 연락 주시면 빠르게 안내 및 조치하겠습니다.
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                        <input type="radio" name="q15" value="동의" checked={formData.q15 === '동의'} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                        동의합니다
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                        <input type="radio" name="q15" value="미동의" checked={formData.q15 === '미동의'} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                        동의하지 않습니다.
                      </label>
                    </div>
                  </div>

                  {/* 16. 카카오톡 ID */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      봉사 집결 안내를 위한 카카오톡 ID를 작성해주세요. <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#4B5563', lineHeight: '1.6', marginBottom: '16px' }}>
                      봉사 집결 안내를 위한 단체 채팅방 초대에 사용됩니다.<br />
                      카카오톡 → 내 프로필 → 우측 상단 ··· → 프로필 공유에서 확인되는 <strong>“아이디(ID)”</strong>를 입력해주세요. <span style={{ color: '#6B7280' }}>(전화번호·닉네임 아님)</span>
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <img src="/kakao_id_guide.jpg" alt="카카오톡 ID 확인 방법" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      </div>
                    </div>
                    <input
                      type="text"
                      name="q16"
                      value={formData.q16}
                      onChange={handleChange}
                      placeholder="카카오톡 ID 입력"
                      style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '15px', color: '#111827', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                    />
                  </div>

                  {/* 17. 개인정보 수집 동의 */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '24px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      개인정보 수집 및 이용에 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6', marginBottom: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                      <strong style={{ color: '#374151' }}>[수집 항목]</strong> 성명, 성별, 연락처, 생년월일, 출발지 인근 지하철역, 계좌정보(픽업 제공자), 카카오톡ID<br />
                      <strong style={{ color: '#374151' }}>[수집 목적]</strong> 봉사 활동 참여자 관리, 일정 안내, 픽업 매칭, 유류비 지원 처리, 봉사 활동<br />
                      <strong style={{ color: '#374151' }}>[보유 기간]</strong> 수집일로부터 1년<br />
                      <strong style={{ color: '#374151' }}>[제3자 제공 안내]</strong> 봉사 당일 원활한 픽업 및 이동 배정을 위해, 본인이 입력한 출발지 인근 지하철역 정보는 동일 봉사에 참여하는 제3자(운전자 또는 동승 봉사자)에게 공유될 수 있습니다. 해당 정보는 봉사 운영 목적에 한해 사용되며, 봉사 종료 후 별도로 보관하지 않습니다.<br />
                      <strong style={{ color: '#374151' }}>[거부 권리]</strong> 개인정보 수집·이용 및 제3자 제공에 대한 동의를 거부할 수 있으나, 거부 시 봉사 신청 및 픽업 매칭이 제한될 수 있습니다.
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                      <input type="checkbox" name="q17" checked={formData.q17} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                      네, 동의합니다.
                    </label>
                  </div>

                  <div style={{ textAlign: 'center', padding: '24px 0 16px', borderTop: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '17px', fontWeight: '800', color: '#8B5A19', margin: 0 }}>
                      의협을 실천해주셔서 감사합니다!
                    </p>
                  </div>
                </>
              )}

              {/* 에러 메시지 */}
              {errorMsg && (
                <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <AlertCircle size={18} /> {errorMsg}
                </div>
              )}

              {/* 버튼 영역 */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 4) {
                        const isDriver = formData.q8 === '자차로 가요 (다른 분들 태워줄 수 있어요)' || formData.q8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)';
                        setStep(isDriver ? 3 : 2);
                      } else {
                        setStep(step - 1);
                      }
                    }}
                    style={{
                      flex: 1, padding: '18px', background: '#F3F4F6', color: '#4B5563',
                      border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'background 0.2s'
                    }}
                  >
                    이전 단계로
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: step > 1 ? 2 : 1, padding: '18px', background: loading ? '#9CA3AF' : '#1E3A5F', color: '#fff',
                    border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 8px 20px rgba(30,58,95,0.2)'
                  }}
                >
                  {loading ? '전송 중...' : (step === 5 ? '제출하기' : '다음 단계로')}
                  {!loading && step !== 5 && <ChevronRight size={18} />}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
