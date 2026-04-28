import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  MapPin, Phone, Clock,
  PawPrint, Camera, Leaf, Heart,
  ClipboardList, CheckCircle, Users, Calendar,
  Lock, ExternalLink, AlertTriangle, Info, ChevronRight,
  RefreshCw, MessageSquare, Car
} from 'lucide-react';
import { G, gradientText } from '../styles/gradients';

// 보호소 사진 임포트
import collie01 from '../../imports/collie_01.jpg';
import collie02 from '../../imports/collie_02.jpg';
import collie03 from '../../imports/collie_03.jpg';
import collie04 from '../../imports/collie_04.jpg';

// ─── Shared ────────────────────────────────────────────────────────────
function RevealDiv({
  children, delay = 0, style = {},
}: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── 탭 정의 ───────────────────────────────────────────────────────────
const TABS = [
  { key: 'method', label: '봉사 안내', Icon: ClipboardList },
  { key: 'shelters', label: '보호소 소개', Icon: PawPrint },
];

// ─── 탭 1: 봉사 방법 ───────────────────────────────────────────────────
const newVolunteerTypes = [
  {
    Icon: Leaf, title: '견사 청소 및 환경 정리', color: '#C8963E', bg: G.goldCard,
    desc: '배설물 정리, 밥그릇 설거지, 이불 교체 등 유기견들이 지내는 견사를 깨끗하게 청소합니다.'
  },
  {
    Icon: PawPrint, title: '산책 및 교감 봉사', color: '#4A7C59', bg: G.greenCard,
    desc: '견사에 갇혀 지내는 아이들과 함께 산책하고 스킨십을 나누며 사람에 대한 상처를 치유합니다.'
  },
  {
    Icon: CheckCircle, title: '시설 보수 및 기타', color: '#1E3A5F', bg: G.blueCard,
    desc: '낡은 울타리 수리, 잡초 제거, 방풍막 설치 등 보호소의 열악한 시설 환경을 개선합니다.'
  },
];

const newSchedule = [
  { Icon: Calendar, label: '봉사 요일', value: '매주 주말 중점 진행' },
  { Icon: Clock, label: '활동 시간', value: '오전 9시 ~ 17시 중 약 2~3시간 소요' },
  { Icon: Car, label: '이동 시간', value: '편도 30분 ~ 1시간' },
];

const journeyPhases = [
  {
    step: '01', title: '설레는 준비', icon: Calendar, color: '#C8963E', bg: G.goldCard,
    desc: '봉사 신청 후, 봉사 1주일 전 단톡방에 초대됩니다. AI가 배차한 스마트 집결 안내서와 필수 가이드를 미리 받아보세요.'
  },
  {
    step: '02', title: '편안한 이동과 봉사', icon: Car, color: '#4A7C59', bg: G.greenCard,
    desc: '약속된 장소에서 카풀 차량에 탑승해 편안하게 이동합니다. 봉사지에서는 선봉장(조장)의 든든한 인솔 하에 체계적으로 땀방울을 나눕니다.'
  },
  {
    step: '03', title: '꿀맛 같은 휴식', icon: Heart, color: '#6B4C8A', bg: G.purpleCard,
    desc: '열심히 봉사한 뒤엔 다 같이 자율적으로 식사나 카페에서 친목을 다집니다. 이후 처음 모였던 장소로 안전하게 복귀합니다.'
  },
  {
    step: '04', title: '뿌듯한 마무리', icon: CheckCircle, color: '#1E3A5F', bg: G.blueCard,
    desc: '사진을 나누고 만족도 조사를 진행합니다. 고생한 운전자에겐 유류비가 지원되며, 봉사 시간에 대해 공식 인증이 완료됩니다.'
  }
];

const providedSupplies = [
  { label: '안전 장비', desc: '고무장갑, 목장갑, 방수 덧신 (진흙 오염 대비)' },
  { label: '작업용 의류', desc: '방진복 또는 앞치마 (오염 방지용)' },
  { label: '청소 도구', desc: '수세미, 전용 세제, 대형 쓰레기 봉투 등' },
];

function TabMethod() {
  return (
    <div>
      {/* 1. 어떤 봉사를 하나요? */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px)', background: G.warmSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>WHAT WE DO</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: '900', marginBottom: '12px' }}>보호소에 가면 어떤 일을 하나요?</h2>
            <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.7' }}>현장 상황과 봉사자의 컨디션에 맞춰 유동적으로 업무를 분담합니다.</p>
          </RevealDiv>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' }}>
            {newVolunteerTypes.map((v, i) => (
              <RevealDiv key={v.title} delay={i * 90}>
                <div
                  className="hover-lift"
                  style={{
                    background: v.bg, borderRadius: '22px', padding: '36px 32px',
                    border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                    height: '100%', boxSizing: 'border-box',
                  }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: `${v.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <v.Icon size={26} color={v.color} />
                  </div>
                  <h3 style={{ color: '#1E3A5F', fontWeight: '800', fontSize: '18px', marginBottom: '10px' }}>{v.title}</h3>
                  <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.75' }}>{v.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 일정 및 단계 */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px)', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>JOURNEY</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: '900', marginBottom: '12px' }}>봉사는 언제, 어떻게 진행되나요?</h2>
          </RevealDiv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px', marginBottom: '40px' }}>
            {newSchedule.map((s, i) => (
              <RevealDiv key={s.label} delay={i * 80} style={{ height: '100%' }}>
                <div style={{
                  background: '#F9FAFB', borderRadius: '20px', padding: '32px 28px',
                  border: '1px solid rgba(30,58,95,0.08)',
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  height: '100%', boxSizing: 'border-box'
                }}>
                  <div style={{ background: '#1E3A5F', borderRadius: '12px', padding: '10px', flexShrink: 0 }}>
                    <s.Icon size={20} color="#fff" />
                  </div>
                  <div>
                    <p style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</p>
                    <p style={{ color: '#1E3A5F', fontSize: '14px', fontWeight: '700', lineHeight: '1.5' }}>{s.value}</p>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', paddingTop: '32px' }}>
            {journeyPhases.map((phase, i) => (
              <RevealDiv key={phase.step} delay={i * 100}>
                <div
                  className="hover-lift"
                  style={{
                    background: phase.bg, borderRadius: '24px', padding: '48px 32px 36px',
                    position: 'relative', overflow: 'visible', height: '100%', boxSizing: 'border-box',
                    border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                  }}>
                  {/* Floating Icon */}
                  <div style={{
                    position: 'absolute', top: '-32px', left: '50%', transform: 'translateX(-50%)',
                    width: '64px', height: '64px', borderRadius: '20px', background: '#fff',
                    border: `2px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                  }}>
                    <phase.icon size={28} color={phase.color} />
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px', color: phase.color }}>STEP {phase.step}</div>
                  <h3 style={{ color: '#1E3A5F', fontWeight: '900', fontSize: '20px', marginBottom: '16px' }}>{phase.title}</h3>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all' }}>{phase.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </div>



      {/* 3. AI 픽업 매칭 시스템 */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px)', background: G.darkSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              color: '#fff', 
              fontSize: 'clamp(24px,4.5vw,40px)', 
              fontWeight: '900', 
              marginBottom: '24px', 
              lineHeight: '1.3',
              wordBreak: 'keep-all',
              wordWrap: 'break-word'
            }}>
              뚜벅이도 걱정 없는 <br className="hidden md:block" /> 봉봉단만의 <span style={{ color: '#F5C875', whiteSpace: 'nowrap' }}>AI 픽업 매칭</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.8', maxWidth: '720px', margin: '0 auto', wordBreak: 'keep-all' }}>
              단순히 '가까운 사람'을 태우는 매칭이 아닙니다.<br className="hidden md:block" /> 탑승자 조합부터 최적의 집결지 선정, 실시간 재조정까지<br className="hidden md:block" /> <strong>카풀의 전 과정을 AI 알고리즘이 완벽하게 최적화합니다.</strong>
            </p>
          </RevealDiv>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                step: '01', title: '스마트 배차 매칭', icon: Car, color: '#4A7C59',
                desc: '동승자가 운전자와 같은 방향에 있는지 분석(우회 30% 미만 허용)하고, 특정 차량에 인원이 쏠리지 않도록 밸런스를 계산합니다.'
              },
              {
                step: '02', title: '집결지 최적화 연산', icon: MapPin, color: '#C8963E',
                desc: '전국 도시철도 역사 데이터를 스캔하여, 단순 중간 지점이 아닌 목적지 방향 "전진율"이 가장 높은 최적의 집결 역을 AI가 직접 선정합니다.'
              },
              {
                step: '03', title: '3단계 자동 재조정', icon: RefreshCw, color: '#6B4C8A',
                desc: '과적 차량 분산(Rebalance), 집결지 기준 탑승자 교환(Swap), 근거리 운전자 통합(Consolidation)을 통해 빈틈없이 최적화합니다.'
              },
              {
                step: '04', title: '배차 결과 자동 생성 및\u00A0해설', icon: MessageSquare, color: '#6BA0F0',
                desc: '모든 연산이 끝나면 AI가 각 차량의 집결지 선정 이유(예: "목적지 방향 50% 전진, 경부선 진입 용이")를 텍스트로 친절하게 안내합니다.'
              },
              {
                step: '05', title: '미배정 인원 플랜 B 제안', icon: AlertTriangle, color: '#C24B3B',
                desc: '거리 초과, 역방향 등으로 픽업 배정이 불가한 경우 사유를 명확히 안내하고, 가장 가까운 자차 이동자 Top 3를 대안으로 자동 추천합니다.'
              }
            ].map((item, i) => (
              <RevealDiv key={item.step} delay={i * 100}>
                <div
                  className="hover-lift"
                  style={{
                    display: 'flex', gap: '24px', alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: 'clamp(24px, 5vw, 32px) clamp(20px, 5vw, 40px)',
                    position: 'relative', overflow: 'hidden'
                  }}>
                  {/* Background Step Number */}
                  <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '100px', fontWeight: '900', color: '#fff', opacity: 0.03, pointerEvents: 'none', lineHeight: '1' }}>
                    {item.step}
                  </div>
                  {/* Icon */}
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: `rgba(255,255,255,0.05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <item.icon size={32} color={item.color} />
                  </div>
                  {/* Text Content */}
                  <div style={{ flex: 1, zIndex: 1 }}>
                    <p style={{ color: item.color, fontSize: '13px', fontWeight: '800', letterSpacing: '2px', marginBottom: '6px' }}>STEP {item.step}</p>
                    <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0, marginBottom: '8px', wordBreak: 'keep-all' }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 준비물 및 참가비 안내 (영수증 스타일) */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px)', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: '900', marginBottom: '12px' }}>봉사 준비는 봉봉단이 다 해드려요</h2>
            <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.6' }}>설레는 마음만 준비해서 오세요.</p>
          </RevealDiv>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'stretch' }}>

            {/* 왼쪽: Packing List */}
            <div style={{ flex: '1 1 400px', display: 'flex' }}>
              <RevealDiv delay={100} style={{ width: '100%' }}>
                <div
                  className="hover-lift"
                  style={{
                    background: '#fff', borderRadius: '24px', padding: 'clamp(24px, 6vw, 40px)', height: '100%', boxSizing: 'border-box',
                    border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
                    position: 'relative', overflow: 'hidden'
                  }}>
                  {/* Decorative Header */}
                  <div style={{ borderBottom: '2px dashed #E5E7EB', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ClipboardList size={28} color="#C8963E" />
                      <h3 style={{ color: '#1E3A5F', fontWeight: '900', fontSize: '24px', margin: 0 }}>준비물</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <h4 style={{ color: '#4A7C59', fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} /> 봉봉단 든든 지원
                      </h4>
                      <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all' }}>
                        방진복, 장갑, 신발커버, 마스크, 쓰레기봉투, 음료 등 보호소에 필요한 물품
                      </p>
                    </div>
                    <div>
                      <h4 style={{ color: '#C8963E', fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Heart size={16} /> 봉사자 준비물
                      </h4>
                      <p style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '800', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all' }}>
                        세상을 바꾸는<br className="hidden md:block" /> '따뜻한 의협심' 하나면 충분합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealDiv>
            </div>

            {/* 오른쪽: 참가비 영수증 */}
            <div style={{ flex: '1 1 400px', display: 'flex' }}>
              <RevealDiv delay={200} style={{ width: '100%' }}>
                <div
                  className="hover-lift"
                  style={{
                    background: '#1E3A5F', borderRadius: '24px', padding: 'clamp(24px, 6vw, 40px)', height: '100%', boxSizing: 'border-box',
                    color: '#fff', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(30,58,95,0.15)'
                  }}>
                  {/* Decorative background circle */}
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>

                  <div style={{ borderBottom: '2px dashed rgba(255,255,255,0.15)', paddingBottom: '24px', marginBottom: '24px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                        <Info size={24} color="#F5C875" />
                      </div>
                      <h3 style={{ color: '#fff', fontWeight: '900', fontSize: '24px', margin: 0 }}>투명한 참가비 가이드</h3>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <CheckCircle size={20} color="#F5C875" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.6', wordBreak: 'keep-all' }}>소중한 약속을 지키기 위한 노쇼(No-Show)&nbsp;방지</span>
                    </li>
                    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <CheckCircle size={20} color="#F5C875" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.6', wordBreak: 'keep-all' }}>쾌적한 봉사를 위한 필수 봉사 물품 준비</span>
                    </li>
                    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <CheckCircle size={20} color="#F5C875" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.6', wordBreak: 'keep-all' }}>픽업 운전자 이동 거리 비례 유류비 지원</span>
                    </li>
                  </ul>

                  <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', position: 'relative' }}>
                    <p style={{ margin: 0, color: '#F5C875', fontSize: '13px', lineHeight: '1.6', fontWeight: '600', wordBreak: 'keep-all', textAlign: 'center' }}>
                      참가비 운영 내역은 회원들에게 투명하게 공개됩니다.
                    </p>
                  </div>
                </div>
              </RevealDiv>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

// ─── 사진 슬라이더 컴포넌트 ───────────────────────────────────────────
function PhotoSlider({ images, shelterName }: { images: string[], shelterName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % images.length;
        scrollRef.current.scrollTo({
          left: scrollRef.current.offsetWidth * nextIndex,
          behavior: 'smooth'
        });
        setCurrentIndex(nextIndex);
      }
    }, 4000); // 4초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          width: '100%',
          height: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="hide-scrollbar"
      >
        {images.map((imgUrl, idx) => (
          <div key={idx} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', position: 'relative' }}>
            <img
              src={imgUrl}
              alt={`${shelterName} ${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* 하단 도트 인디케이터 */}
      <div style={{
        position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '20px',
        backdropFilter: 'blur(8px)', zIndex: 2
      }}>
        {images.map((_, idx) => (
          <div key={idx} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: currentIndex === idx ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── 탭 2: 보호소 소개 ─────────────────────────────────────────────────
interface ShelterData {
  name: string;
  location: string;
  applyUrl: string;
  animalCount: string;
  regularDay: string;
  timeRange: string;
  capacity: string;
  tags: string[];
  notice: string;
  headerGradient: string;
  images: string[];
}

const mockImages = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514984879728-be0aff753264?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
];

const activeShelters: ShelterData[] = [
  {
    name: '콜리하우스',
    location: '경기도 평택시',
    applyUrl: 'https://www.instagram.com/collie.house_shelter/',
    animalCount: '약 70마리',
    regularDay: '매월 첫째 토요일',
    timeRange: '10:00 ~ 17:00',
    capacity: '15명',
    tags: ['#소장님1인운영', '#최근이전', '#따뜻한터프함', '#제안환영'],
    notice: '소장님 홀로 수십 마리의 아이들을 돌보시는 소규모 보호소로, 최근 새로운 터전으로 이전하였습니다. 한정된 자원 속에서 봉사자와 후원자분들의 도움이 큰 힘이 되는 곳입니다. 소장님은 터프한 매력이 있으시지만, 봉사자들의 의견(산책, 미용, 목욕 제안 등)을 적극적으로 수용해 주시는 따뜻한 분입니다. 격식보다는 실전 위주의 활동이 이뤄지며, 소장님과 소통하며 유동적으로 봉사를 진행할 수 있는 것이 특징입니다.',
    headerGradient: 'linear-gradient(135deg,#163366,#2E5298)',
    images: [collie01, collie02, collie03, collie04]
  },
  {
    name: '반려마루 여주',
    location: '경기 여주시',
    applyUrl: 'https://banryeomaru.kr/',
    animalCount: '약 285마리',
    regularDay: '비정기 봉사',
    timeRange: '09:00~12:00 / 13:30~15:30',
    capacity: '20명',
    tags: ['#국내최대규모', '#테마파크형', '#폴라로이드', '#준비물불필요'],
    notice: '경기도가 조성한 국내 최대 규모의 반려동물 복합문화공간으로, 보호와 입양은 물론 교육과 문화가 어우러진 테마파크형 시설입니다. 쾌적한 환경 속에서 별도의 준비물 없이도 봉사가 가능하며, 전문 담당자분들의 체계적인 인솔 덕분에 초보 봉사자도 쉽게 적응할 수 있습니다. 아이들과 산책하며 폴라로이드 추억을 남기거나 그림일기를 작성하는 등 정서적 교감을 나누는 특별한 프로그램도 경험할 수 있습니다.',
    headerGradient: 'linear-gradient(135deg,#2D5C40,#4A7C59)',
    images: [mockImages[3], mockImages[4], mockImages[5]]
  },
  {
    name: '아크보호소',
    location: '경기도 파주시',
    applyUrl: 'https://www.instagram.com/ark_animalrightskorea/',
    animalCount: '약 250마리',
    regularDay: '매월 셋째 토요일',
    timeRange: '10:00 ~ 17:30',
    capacity: '20명',
    tags: ['#누렁이전문', '#식용견은없다', '#월롱역픽업', '#대형견천국'],
    notice: '세계 최초의 ‘누렁이 전문 보호소’로, 식용견이라는 편견 속에서 구조된 중·대형견들의 치료와 재활, 입양을 책임지는 민간 비영리 단체입니다. “식용견은 없다”는 확고한 철학 아래, 생명의 존엄성을 지키며 아이들이 반려견으로서의 평범한 행복을 되찾도록 돕고 있습니다. 대형견 위주의 환경이며, 요청 시 월롱역 인근에서 소수 인원 픽업이 가능합니다. 안전을 위해 큰 소리나 간식 급여는 금지되며, 아이들이 뭉쳐서 다투지 않도록 각별한 주의가 필요합니다.',
    headerGradient: 'linear-gradient(135deg,#A87830,#C8963E)',
    images: [mockImages[6], mockImages[7], mockImages[8]]
  },
  {
    name: '빅독포레스트',
    location: '경기 파주시',
    applyUrl: 'https://www.instagram.com/bigdogforest/',
    animalCount: '약 100마리',
    regularDay: '매월 둘째 토요일',
    timeRange: '10:00 ~ 13:00',
    capacity: '30명',
    tags: ['#큰개들의숲', '#노견특화', '#체계적시스템', '#신발커버필수'],
    notice: '대형견과 노견들을 중심으로 구조와 보호, 입양을 지원하는 ‘큰 개들의 숲’입니다. 정부 지원 없이 오직 후원과 봉사의 힘으로 운영되는 곳임에도 불구하고, 매우 체계적인 산책과 청소 시스템을 갖추고 있습니다. 총 4개의 동이 색상별로 구분되어 관리되며, 동별로 소수의 아이들을 집중 케어하여 관리가 수월한 것이 특징입니다. 활동 시 물청소가 위주로 진행되므로 신발 커버를 필수로 지참해 주세요.',
    headerGradient: 'linear-gradient(135deg,#4B3D6B,#6E5B94)',
    images: [mockImages[9], mockImages[0], mockImages[1]]
  },
  {
    name: '포캣멍센터',
    location: '경기 안산시 상록구',
    applyUrl: 'https://www.instagram.com/forcatmung_center/',
    animalCount: '약 48마리',
    regularDay: '비정기 봉사',
    timeRange: '09:00~12:00 / 16:00~19:00',
    capacity: '15명',
    tags: ['#안락사없는보호소', '#평생보호', '#미어캣친구들', '#슬리퍼지참'],
    notice: '비영리 사단법인이 운영하는 안락사 없는 보호소로, 구조된 개와 고양이들이 사회화를 거쳐 새 가족을 만날 수 있도록 돕고 있습니다. 특히 입양이 어려운 노령 및 질병 동물들을 끝까지 책임지는 ‘평생 보호’를 실천하는 곳입니다. 미어캣과 고양이 전용 방이 있는 것이 특징이며, 산책 시 공원 진입로의 차량을 각별히 주의해야 합니다. 남성 봉사자는 개별 실내용 슬리퍼를 지참해야 하며, 건물 내 주차가 불가하므로 인근 공용주차장을 이용해 주세요. 또한 청소 전 촬영은 금지되며, 유튜버나 블로거의 경우 사전 허가가 필수입니다.',
    headerGradient: 'linear-gradient(135deg,#8C2B3E,#B23A52)',
    images: [mockImages[2], mockImages[3], mockImages[4]]
  },
  {
    name: '왕왕랜드',
    location: '인천광역시 중구',
    applyUrl: 'https://www.instagram.com/wangwangland_/',
    animalCount: '약 130마리',
    regularDay: '매월 둘째 토요일',
    timeRange: '10:00 ~ 13:00',
    capacity: '30명',
    tags: ['#해안가산책', '#환경개선중', '#바닷바람', '#힐링봉사'],
    notice: '해변가에 위치하여 겨울철 바닷바람과 추위가 매섭지만, 견사 보온과 확장 공사를 위해 정성을 다해 환경을 개선해 나가고 있는 곳입니다. 봉사자분들은 청소와 산책, 급식 등 아이들의 일상을 돌보며 함께 마음의 위로를 얻는 따뜻한 분위기를 경험할 수 있습니다. 아름다운 해안가 산책이 가능하지만, 보호소 인근 차도가 가까워 이동 시 안전에 각별히 유의해야 합니다.',
    headerGradient: 'linear-gradient(135deg,#163366,#2E5298)',
    images: [mockImages[5], mockImages[6], mockImages[7]]
  },
  {
    name: '원브리스',
    location: '경기 오산시',
    applyUrl: 'https://www.instagram.com/one_breath_team_ghost/',
    animalCount: '약 20마리',
    regularDay: '매월 넷째 일요일',
    timeRange: '09:00 ~',
    capacity: '15명',
    tags: ['#저수지산책', '#훈련전문가', '#원상복구철저', '#낭만봉사'],
    notice: '경기도 오산에 위치한 민간 보호소로, 아이들이 안전한 환경에서 장기 보호를 받으며 입양으로 나아갈 수 있도록 돕는 공간입니다. 훈련에 능숙하신 소장님께서 직접 시연과 영상 가이드를 통해 체계적으로 봉사 교육을 진행해 주시는 것이 큰 특징입니다. 인근 저수지를 한 바퀴 도는 낭만적인 산책 코스도 경험할 수 있습니다. 단, 견사 청소 시에는 물품의 위치와 크기가 바뀌지 않도록 청소 전 상태를 반드시 촬영한 뒤, 처음 모습 그대로 완벽하게 원상복구해야 합니다.',
    headerGradient: 'linear-gradient(135deg,#2D5C40,#4A7C59)',
    images: [mockImages[8], mockImages[9], mockImages[0]]
  },
  {
    name: '동물자유연대',
    location: '경기도 남양주시',
    applyUrl: 'https://www.instagram.com/kawa.hq/',
    animalCount: '약 300마리',
    regularDay: '비정기 봉사',
    timeRange: '10:00 ~ 12:00',
    capacity: '25명',
    tags: ['#제1_2온센터', '#최첨단복지', '#수의사상주', '#전문인솔'],
    notice: '국내 최초이자 최대 규모를 자랑하는 복지형 보호소로, 남양주(개 중심)와 파주(고양이 전문) 온센터를 통해 체계적인 구조와 재활을 지원하는 대한민국 대표 보호시설입니다. 24시간 수의사와 전문 스태프가 상주하며 의료와 돌봄이 통합된 시스템을 갖추고 있습니다. 담당자분들의 친절한 인솔 하에 견사 및 묘사 청소, 산책, 사회화 훈련 보조 등 매우 체계적이고 전문적인 봉사 경험을 할 수 있는 곳입니다.',
    headerGradient: 'linear-gradient(135deg,#A87830,#C8963E)',
    images: [mockImages[1], mockImages[2], mockImages[3]]
  },
  {
    name: '댕글댕글',
    location: '경기도 고양시 일산서구',
    applyUrl: 'https://www.instagram.com/dangle_dangle_/',
    animalCount: '약 100마리',
    regularDay: '비정기 봉사',
    timeRange: '10:00 ~ 13:00',
    capacity: '25명',
    tags: ['#잔디운동장', '#시골길정취', '#소장님매력', '#소규모사설'],
    notice: '시·군 보호소에서 구조된 많은 아이들을 품고 있는 사설 보호소로, 봉사자와 후원자의 손길이 운영의 핵심이 되는 소중한 곳입니다. 진입로가 좁은 시골길이라 운전에 주의가 필요하지만, 보호소 내부에 약 5대 정도 주차가 가능합니다. 최근 잔디 공사를 마친 야외 운동장에서 아이들이 자유롭게 뛰노는 모습을 볼 수 있습니다. 소장님 홀로 헌신적으로 관리하시며, 가끔 봉사자보다 아이들을 더 예뻐하시는 소장님의 따뜻하고 인간적인 면모가 매력적인 보호소입니다.',
    headerGradient: 'linear-gradient(135deg,#4B3D6B,#6E5B94)',
    images: [mockImages[4], mockImages[5], mockImages[6]]
  },
  {
    name: '이용녀 보호소',
    location: '경기도 포천시',
    applyUrl: 'https://open.kakao.com/o/pEj3iWqi',
    animalCount: '약 100마리',
    regularDay: '매월 넷째 토요일',
    timeRange: '10:30 ~ 14:00',
    capacity: '30명',
    tags: ['#유기견의대모', '#실전형봉사', '#고양이방2층', '#적극적업무분담'],
    notice: '배우 이용녀님이 2005년부터 사비와 정성을 쏟아 운영해 온 곳으로, ‘유기견의 대모’라 불리는 소장님의 헌신이 깃든 보호소입니다. 구조부터 보호, 입양까지 소장님이 직접 발로 뛰며 챙기시는 만큼 업무가 늘 많지만, 그만큼 적극적인 업무 분담을 통해 보람찬 봉사가 가능합니다. 성격이 순한 아이들이 많아 교감이 수월하며, 안쪽 견사 입구 좌측 2층에는 고양이 전용 공간도 마련되어 있습니다. 연탄 갈기부터 위생 관리까지 소장님의 손길이 닿지 않는 곳이 없는 정성 어린 공간입니다.',
    headerGradient: 'linear-gradient(135deg,#8C2B3E,#B23A52)',
    images: [mockImages[7], mockImages[8], mockImages[9]]
  }
];



function TabShelters() {
  return (
    <div>
      {/* 도입부 & 보안 안내 */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px) 40px', background: G.warmSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <RevealDiv>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>PARTNER SHELTERS</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: '900', marginBottom: '16px' }}>
              유기견의 소중한 보금자리, <br className="hidden md:block" /> 파트너 보호소를 소개합니다.
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>
              * 각 보호소의 내부 상황 및 운영 방침에 따라 기재된 정보가 실제와 상이할 수 있습니다.
            </p>

          </RevealDiv>
        </div>
      </div>

      {/* 매거진 스타일 스크롤바 숨김 CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 정기 출정 보호소 리스트 (매거진 스타일 뷰) */}
      <div style={{ padding: '40px clamp(20px, 5vw, 40px) 80px', background: G.warmSection }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {activeShelters.map((shelter, i) => {
            const isEven = i % 2 === 0;
            return (
              <RevealDiv key={shelter.name} delay={0}>
                <div style={{
                  display: 'flex',
                  flexDirection: isEven ? 'row' : 'row-reverse',
                  flexWrap: 'wrap',
                  gap: '40px',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: '32px',
                  padding: '32px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>

                  {/* 사진 슬라이더 영역 (4:3 비율) */}
                  <div style={{
                    flex: '1 1 400px',
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    aspectRatio: '4/3',
                    background: '#E5E7EB'
                  }}>
                    <PhotoSlider images={shelter.images} shelterName={shelter.name} />
                  </div>

                  {/* 상세 정보 영역 */}
                  <div style={{ flex: '1 1 400px', padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <span style={{ background: '#1E3A5F', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '50px' }}>
                        {shelter.regularDay}
                      </span>
                      <span style={{ background: 'rgba(200,150,62,0.1)', color: '#A87830', fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {shelter.location}
                      </span>
                    </div>

                    <h3 style={{ color: '#111827', fontWeight: '900', fontSize: 'clamp(24px, 4vw, 42px)', marginBottom: '32px', letterSpacing: '-0.5px' }}>
                      {shelter.name}
                    </h3>

                    {/* 주요 스탯 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '24px', marginBottom: '36px' }}>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <PawPrint size={14} /> 보유 개체수
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '800', color: '#1E3A5F' }}>{shelter.animalCount}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} /> 최대 봉사자 수
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '800', color: '#1E3A5F' }}>{shelter.capacity}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> 봉사 가능 시간대
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '800', color: '#1E3A5F' }}>{shelter.timeRange}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ExternalLink size={14} /> 개인 봉사 신청
                        </p>
                        <a
                          href={shelter.applyUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#4B5563',
                            fontSize: '14px', fontWeight: '700', padding: '6px 16px', borderRadius: '8px', textDecoration: 'none',
                            transition: 'all 0.2s', boxSizing: 'border-box'
                          }}
                        >
                          신청하기 <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>

                    {/* 보호소 핵심 키워드 */}
                    <div style={{ marginBottom: '36px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>보호소 핵심 키워드</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {shelter.tags.map(tag => (
                          <span key={tag} style={{ background: '#F3F4F6', color: '#4B5563', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '12px' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 특징 및 주의사항 */}
                    <div style={{ background: '#FFFDF9', borderLeft: '4px solid #C8963E', padding: '20px 24px', borderRadius: '0 16px 16px 0', border: '1px solid rgba(200,150,62,0.1)', borderLeftWidth: '4px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '800', color: '#A87830', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Info size={16} /> 특징 및 주의사항
                      </p>
                      <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap', textAlign: 'justify', wordBreak: 'keep-all' }}>
                        {shelter.notice}
                      </p>
                    </div>

                  </div>
                </div>
              </RevealDiv>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px', textAlign: 'left',
            background: '#fff', padding: '16px 24px', borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ background: 'rgba(200,150,62,0.1)', padding: '10px', borderRadius: '50%' }}>
              <Lock size={20} color="#C8963E" />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#1E3A5F', marginBottom: '4px' }}>주소 비공개 안내</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                보호소 주변 고의적 유기 범죄를 방지하기 위해 정확한 주소는 'OO시'까지만 공개합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 Activities 페이지 ─────────────────────────────────────────────
export function Activities() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'method';

  useEffect(() => {
    if (!TABS.find(t => t.key === currentTab)) {
      navigate('/activities?tab=method', { replace: true });
    }
    // 탭 변경 시 상단으로 스크롤 이동 (모바일 사용자 경험 개선)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, navigate]);

  const renderTab = () => {
    switch (currentTab) {
      case 'method': return <TabMethod />;
      case 'shelters': return <TabShelters />;
      default: return <TabMethod />;
    }
  };

  return (
    <div>
      {/* 페이지 히어로 */}
      <div style={{
        padding: '140px clamp(20px, 5vw, 40px) 0',
        background: G.darkHero,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '700px', background: G.heroOrb2, filter: 'blur(100px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>
            VOLUNTEER · 유기견 봉사
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(32px,5vw,56px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.2' }}>
            유기견 봉사
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: '1.7' }}>
            견사 청소, 보호소 수리, 산책, 사회화 훈련, 목욕, 교감 등<br />
            봉사자 한 명이 오면 강아지 열 마리의 하루가 달라집니다
          </p>
        </div>

        {/* 탭 바 — About 페이지와 동일한 구조 */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '600px', margin: '48px auto 0',
          display: 'flex', gap: '4px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px 18px 0 0',
          padding: '6px 6px 0',
        }}>
          {TABS.map(tab => {
            const isActive = currentTab === tab.key;
            return (
              <Link
                key={tab.key}
                to={`/activities?tab=${tab.key}`}
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  padding: '13px 16px',
                  borderRadius: '13px 13px 0 0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#F5C875' : 'rgba(255,255,255,0.5)',
                  background: isActive ? 'rgba(200,150,62,0.15)' : 'transparent',
                  borderBottom: isActive ? '2px solid #C8963E' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <tab.Icon size={15} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {renderTab()}
    </div>
  );
}