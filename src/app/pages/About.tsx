import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { logoImg, logoSloganImg, symbolImg, symbol3DImg } from '../imageAssets';
import { PhotoSlider } from '../components/PhotoSlider';
import {
  Shield, Star, Users, Clock,
  Heart, Eye, TrendingUp, Flame,
  Crown, BookOpen, Swords, Flag,
  CheckCircle, Award, Trophy, User,
} from 'lucide-react';
import { G, gradientText } from '../styles/gradients';

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
  { key: 'intro', label: '봉사 문파', Icon: Shield },
  { key: 'ranks', label: '직급·직책', Icon: Award },
  { key: 'orgchart', label: '조직도', Icon: Users },
];

// ─── 탭 1: 봉사 문파 ───────────────────────────────────────────────────
function TabIntro() {
  const timeline = [

    {
      date: '2025년 11월 22일',
      badge: '첫 봉사',
      title: '첫 봉사 출정',
      desc: '창립 멤버 5명으로 첫 유기견 봉사 활동을 진행하며 문파의 첫 발을 내딛었습니다.',
      gradient: G.goldBadge,
      status: 'done',
    },
    {
      date: '2026년 1월 4일',
      badge: '공식 오픈',
      title: '공식 오픈 · 봉사자 모집 시작',
      desc: '지인으로만 이루어졌던 봉사자를 공개적으로 모집하며 본격적인 단체 활동을 시작했습니다.',
      gradient: G.blueBadge,
      status: 'done',
    },
    {
      date: '2026년 2월 9일',
      badge: '법인 등록',
      title: '비영리단체 등록 완료',
      desc: '투명하고 신뢰할 수 있는 단체 운영을 위해 비영리단체 등록을 완료했습니다.',
      gradient: G.greenBadge,
      status: 'done',
    },

    {
      date: '2026년 4월 25일',
      badge: '성장 기록',
      title: '채널 멤버 1,000명 · 봉사 신청 400회 돌파',
      desc: '공식 오픈 4개월 만에 봉봉단 채널 멤버 1,000명, 봉사 누적 신청 횟수 400회를 동시에 돌파했습니다.',
      gradient: G.goldBadge,
      status: 'done',
    },
    {
      date: '2026년 5월 16일',
      badge: '새로운 시작',
      title: '창단식 · 봉사 영역 확장',
      desc: '봉봉단 공식 창단식을 기점으로 소모임 등 봉사 외 활동도 본격 오픈합니다. 벽화 봉사, 플로깅 봉사 등 새로운 봉사 영역으로의 확장도 준비 중입니다.',
      gradient: G.redBadge,
      status: 'upcoming',
    },
  ];

  return (
    <div>
      {/* 메인 소개 */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px)', background: G.warmSection }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px', alignItems: 'center',
        }}>
          <RevealDiv>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', ...gradientText(G.goldTextBg) }}>
              BONGBONGDAN · BBD
            </p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: '900', lineHeight: '1.25', marginBottom: '24px' }}>
              의협을 실천하는 <br className="hidden md:block" /> 봉사문파, 봉봉단
            </h2>
            <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.9', marginBottom: '18px' }}>
              봉봉단은 <strong>무협의 의협(義俠) 정신</strong>을 현대 봉사 문화에 녹여낸 비영리 봉사 단체입니다.
              약한 자를 돕고 올바른 것을 실천하는 협객의 마음으로, 유기견 보호소 봉사에서 출발해
              사회 각 분야의 봉사 활동으로 나아갑니다.
            </p>
            <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.9', marginBottom: '18px' }}>
              복잡한 절차 없이 신청 한 번으로 쉽고 편하게 봉사 활동을 할 수 있는 <strong>단체 봉사 전문 문파</strong>입니다.
              다함께 성장하며 의와 협을 실천하는 더 나은 세상을 만들어 갑니다.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px' }}>
              {['비영리단체', '단체 봉사 전문', '쉽고 편한 봉사'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(200,150,62,0.1)',
                  border: '1px solid rgba(200,150,62,0.3)',
                  color: '#A87830',
                  fontSize: '13px', fontWeight: '600',
                  padding: '6px 14px', borderRadius: '50px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </RevealDiv>
          <RevealDiv delay={200} style={{ display: 'flex', justifyContent: 'center' }}>
            <PhotoSlider />
          </RevealDiv>
        </div>
      </div>


      {/* 연혁 타임라인 */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px)', background: G.pureSection }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>HISTORY</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900' }}>봉봉단 연대기</h2>
            <p style={{ color: '#6B7280', fontSize: '16px', marginTop: '12px' }}>의협의 첫 발을 내디딘 그 순간부터</p>
          </RevealDiv>

          <div style={{ position: 'relative' }}>
            {/* 세로 선 */}
            <div style={{
              position: 'absolute', left: '28px', top: '28px', bottom: '28px',
              width: '2px',
              background: 'linear-gradient(to bottom, #C8963E 0%, #F5C875 60%, rgba(200,150,62,0.1) 100%)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {timeline.map((item, i) => (
                <RevealDiv key={item.title} delay={i * 100} style={{ display: 'flex', gap: '28px', paddingBottom: i < timeline.length - 1 ? '48px' : '0' }}>
                  {/* 아이콘 원 */}
                  <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: item.status === 'upcoming' ? 'rgba(200,150,62,0.15)' : item.gradient,
                      border: item.status === 'upcoming' ? '2px dashed rgba(200,150,62,0.5)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: item.status === 'done' ? '0 4px 20px rgba(200,150,62,0.3)' : 'none',
                      color: '#fff', fontWeight: '900', fontSize: '15px',
                    }}>
                      {item.status === 'upcoming'
                        ? <span style={{ ...gradientText(G.goldTextBg), fontSize: '20px' }}>✦</span>
                        : String(i + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* 내용 */}
                  <div style={{ flex: 1, paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: item.status === 'upcoming' ? 'rgba(200,150,62,0.12)' : item.gradient,
                        color: item.status === 'upcoming' ? '#A87830' : '#fff',
                        border: item.status === 'upcoming' ? '1px dashed rgba(200,150,62,0.4)' : 'none',
                        fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                        padding: '4px 12px', borderRadius: '50px',
                      }}>
                        {item.badge}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', ...gradientText(G.goldTextBg) }}>{item.date}</span>
                    </div>
                    <h3 style={{ color: '#1E3A5F', fontWeight: '800', fontSize: '18px', marginBottom: '10px', lineHeight: '1.4' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.75' }}>{item.desc}</p>
                  </div>
                </RevealDiv>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 통합 섹션 1: 미션·비전·목표 ── */}
      <div style={{ padding: 'clamp(80px, 12vw, 100px) clamp(20px, 5vw, 40px) 80px', background: G.coolSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>MISSION · VISION · OPERATION</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900' }}>봉봉단이 나아가는 방향</h2>
          </RevealDiv>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              {
                label: 'MISSION', title: '미션', bg: G.blueCard, borderColor: 'rgba(46,82,152,0.2)',
                content: '단체 봉사를 통해 사회적 약자와 동물을 돕고, 봉사 문화를 일상으로 만든다.',
              },
              {
                label: 'VISION', title: '비전', bg: G.goldCard, borderColor: 'rgba(168,120,48,0.2)',
                content: '수도권을 넘어 전국 단위의 봉사문파로 성장, 의협 정신이 살아있는 봉사 생태계를 구축한다.',
              },
              {
                label: 'OPERATION', title: '운영', bg: G.greenCard, borderColor: 'rgba(45,92,64,0.2)',
                content: '단순한 봉사 모임이 아닌 체계적인 단원 관리, 자동화된 봉사 시스템 등으로 운영에 진심으로 임한다.',
              },
            ].map((item, i) => (
              <RevealDiv key={item.label} delay={i * 100}>
                <div style={{
                  background: item.bg, borderRadius: '24px', padding: '44px',
                  border: `1px solid ${item.borderColor}`, height: '100%', boxSizing: 'border-box',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>{item.label}</p>
                  <h3 style={{ color: '#1E3A5F', fontWeight: '800', fontSize: '20px', marginBottom: '14px' }}>{item.title}</h3>
                  <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.85' }}>{item.content}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </div>

      {/* ── 통합 섹션 2: 핵심 가치 6가지 ── */}
      <div style={{ padding: 'clamp(80px, 12vw, 100px) clamp(20px, 5vw, 40px)', background: G.warmSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>CORE VALUES</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900' }}>6가지 핵심 가치</h2>
            <p style={{ color: '#6B7280', fontSize: '16px', marginTop: '12px' }}>봉봉단의 모든 활동은 이 여섯 가지 가치를 바탕으로 합니다</p>
          </RevealDiv>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              {
                Icon: Heart, title: '봉사의 기쁨', color: '#C24B3B', bg: G.redCard,
                desc: '돕는 행위 자체가 삶의 의미입니다. 봉봉단은 봉사를 의무가 아닌 기쁨으로, 일상으로 만들어 갑니다.',
              },
              {
                Icon: Users, title: '함께하는 문파', color: '#2E5298', bg: G.blueCard,
                desc: '혼자가 아닌 문파로 함께 출정합니다. 협객들의 연대가 문파의 힘이며, 우리는 함께 성장합니다.',
              },
              {
                Icon: Eye, title: '삶과 봉사의 균형', color: '#2D5C40', bg: G.greenCard,
                desc: '봉사는 삶을 빛내는 것이지, 삶을 희생하는 것이 아닙니다. 봉봉단은 단원 한 명 한 명의 일상과 컨디션을 가장 먼저 존중합니다.',
              },
              {
                Icon: TrendingUp, title: '지속적 성장', color: '#A87830', bg: G.goldCard,
                desc: '봉사 횟수에 따라 직급이 승급하며 협객으로 성장합니다. 봉봉단과 함께 우리 모두 성장합니다.',
              },
              {
                Icon: Flame, title: '의협 정신', color: '#8060A8', bg: G.purpleCard,
                desc: '무협의 의협(義俠), 약한 자를 돕고 올바른 것을 실천하는 정신을 봉사로 실현합니다.',
              },
              {
                Icon: CheckCircle, title: '책임감', color: '#C24B3B', bg: 'linear-gradient(135deg,#FFF0EE,#FFE0DC)',
                desc: '한 번 약속한 봉사는 끝까지, 맡은 자리에서 최선을 다하는 협객 정신으로 임합니다.',
              },
            ].map((v, i) => (
              <RevealDiv key={v.title} delay={i * 80}>
                <div style={{
                  background: v.bg, borderRadius: '22px', padding: 'clamp(24px, 5vw, 36px)',
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

      {/* CI 섹션 */}
      <div style={{ padding: 'clamp(80px, 12vw, 100px) clamp(20px, 5vw, 40px)', background: G.pureSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>
              BRAND IDENTITY
            </p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900' }}>봉봉단 CI</h2>
            <p style={{ color: '#6B7280', fontSize: '16px', marginTop: '12px' }}>봉봉단의 브랜드 아이덴티티를 소개합니다</p>
          </RevealDiv>

          {/* 기본 심볼 — 와이드 상단 카드 */}
          <RevealDiv style={{ marginBottom: '24px' }}>
            <div style={{
              background: '#fff', borderRadius: '24px',
              border: '1px solid rgba(200,150,62,0.15)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              overflow: 'hidden',
            }}>
              {/* 이미지 영역 */}
              <div style={{
                background: 'linear-gradient(160deg, #FDF8F0, #F0E5C8)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '48px 40px', minHeight: '260px',
              }}>
                <img
                  src={symbolImg}
                  alt="봉봉단 심볼"
                  style={{ width: '200px', height: '200px', objectFit: 'contain', filter: 'drop-shadow(0 16px 40px rgba(200,150,62,0.35))' }}
                />
              </div>

              {/* 설명 영역 */}
              <div style={{ padding: 'clamp(32px, 6vw, 48px) clamp(28px, 5vw, 44px)' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#9CA3AF', marginBottom: '8px' }}>SYMBOL</p>
                <h3 style={{ color: '#1E3A5F', fontWeight: '900', fontSize: '22px', marginBottom: '10px', lineHeight: '1.3' }}>
                  봉봉단 심볼의 의미
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                  심볼 중앙의 <strong style={{ color: '#1E3A5F' }}>검과 포권례</strong>는 의협을 실천하는 협객을 상징하며,<br className="hidden md:block" />
                  주변을 둘러싼 <strong style={{ color: '#1E3A5F' }}>5가지 심볼</strong>은 봉봉단이 나아갈 봉사 영역을 나타냅니다.
                </p>

                {/* 5가지 심볼 설명 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { icon: '🐾', title: '유기견 봉사', sub: '강아지 발자국' },
                    { icon: '🤝', title: '복지 봉사', sub: '두 손' },
                    { icon: '🌿', title: '환경 봉사', sub: '나뭇잎' },
                    { icon: '🖐', title: '아동 봉사', sub: '손바닥' },
                    { icon: '✚', title: '의료 봉사', sub: '십자가' },
                  ].map(item => (
                    <div key={item.title} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(200,150,62,0.05)',
                      border: '1px solid rgba(200,150,62,0.15)',
                      borderRadius: '10px', padding: '10px clamp(10px, 3vw, 14px)',
                    }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <p style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '13px', marginBottom: '1px' }}>{item.title}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '11px' }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </RevealDiv>

          {/* 3D 심볼 + 시그니처 타입 — 하단 2열 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {/* 3D 심볼 */}
            <RevealDiv delay={100}>
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '40px 32px',
                border: '1px solid rgba(200,150,62,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                textAlign: 'center', height: '100%', boxSizing: 'border-box',
              }}>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#9CA3AF', marginBottom: '24px' }}>3D SYMBOL</p>
                <div style={{
                  background: 'linear-gradient(160deg, #060F1E, #1E3A5F)',
                  borderRadius: '16px', padding: '28px', marginBottom: '20px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '140px',
                }}>
                  <img src={symbol3DImg} alt="봉봉단 3D 심볼" style={{ height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(200,150,62,0.4))' }} />
                </div>
                <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.7' }}>
                  입체감을 살린 3D 렌더링 심볼<br className="hidden md:block" />홈페이지·영상 등 디지털 콘텐츠에 사용합니다.
                </p>
              </div>
            </RevealDiv>

            {/* 시그니처 타입 */}
            <RevealDiv delay={200}>
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '40px 32px',
                border: '1px solid rgba(200,150,62,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                textAlign: 'center', height: '100%', boxSizing: 'border-box',
              }}>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#9CA3AF', marginBottom: '24px' }}>SIGNATURE TYPE</p>
                <div style={{
                  background: 'linear-gradient(160deg, #060F1E, #1E3A5F)',
                  borderRadius: '16px', padding: '28px', marginBottom: '20px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '140px',
                }}>
                  <img src={logoSloganImg || logoImg} alt="봉봉단 시그니처" style={{ height: '64px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                </div>
                <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.7' }}>
                  로고 + 슬로건이 결합된 시그니처 타입<br className="hidden md:block" />공식 문서·배너·명찰 등에 사용합니다.
                </p>
              </div>
            </RevealDiv>
          </div>

          {/* 컬러 팔레트 */}
          <RevealDiv delay={100} style={{ marginTop: '40px' }}>
            <div style={{
              background: '#fff', borderRadius: '24px', padding: '40px',
              border: '1px solid rgba(200,150,62,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#9CA3AF', marginBottom: '24px' }}>BRAND COLOR</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { name: 'BBD Gold', hex: '#C8963E', bg: '#C8963E', textColor: '#fff' },
                  { name: 'BBD Navy', hex: '#1E3A5F', bg: '#1E3A5F', textColor: '#fff' },
                  { name: 'BBD Deep', hex: '#060F1E', bg: '#060F1E', textColor: '#fff' },
                  { name: 'BBD Warm', hex: '#F5C875', bg: '#F5C875', textColor: '#4A3000' },
                ].map(c => (
                  <div key={c.name} style={{ flex: '1 1 160px', minWidth: '120px' }}>
                    <div style={{ background: c.bg, borderRadius: '12px', height: '72px', marginBottom: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E3A5F', marginBottom: '2px' }}>{c.name}</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>{c.hex}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealDiv>
        </div>
      </div>
    </div>
  );
}

// ─── 탭 2: 비전과 가치 ─────────────────────────────────────────────────


// ─── 탭 3: 직급·직책 ───────────────────────────────────────────────────
const rankData = [
  {
    title: '예비 단원', count: '0회', badge: '예비',
    Icon: User,
    gradient: 'linear-gradient(135deg,#64748b,#94a3b8)',
    cardBg: 'linear-gradient(135deg,#F8FAFC,#F1F5F9)',
    border: 'rgba(100,116,139,0.2)', color: '#64748b',
    perks: ['봉봉단 소속 인정', '임시 명찰 지급', '봉사 출정 참여 가능'],
  },
  {
    title: '입문 단원', count: '1 ~ 4회', badge: '입문',
    Icon: BookOpen,
    gradient: 'linear-gradient(135deg,#475f85,#6b85b3)',
    cardBg: 'linear-gradient(135deg,#F0F5FA,#E2EAF4)',
    border: 'rgba(71,95,133,0.2)', color: '#475f85',
    perks: ['봉봉단 공식 활동 참여', '임시 명찰 지급', '봉사 기록 누적 시작'],
  },
  {
    title: '정식 단원', count: '5 ~ 9회', badge: '정식',
    Icon: Shield,
    gradient: 'linear-gradient(135deg,#2E5298,#5a7cbd)',
    cardBg: 'linear-gradient(135deg,#E6F0FA,#D6E4F5)',
    border: 'rgba(46,82,152,0.25)', color: '#2E5298',
    perks: ['비영리단체 정식 회원 자격', '단체 의결권 행사 가능', '회원 전용 오픈채팅방 초대', '봉사·행사 소식 우선 안내', '이름 각인 은색 명찰 수여'],
  },
  {
    title: '숙련 단원', count: '10 ~ 19회', badge: '숙련',
    Icon: Swords,
    gradient: 'linear-gradient(135deg,#163366,#2E5298)',
    cardBg: 'linear-gradient(135deg,#D9E6F5,#C4D8EF)',
    border: 'rgba(30,58,95,0.25)', color: '#1E3A5F',
    perks: ['간부진(기획·운영·홍보당 당원) 지원 자격', '선봉장 지원 자격'],
  },
  {
    title: '고참 단원', count: '20 ~ 49회', badge: '고참',
    Icon: Star,
    gradient: 'linear-gradient(135deg,#A87830,#C8963E)',
    cardBg: 'linear-gradient(135deg,#FEFCF5,#FDF7E6)',
    border: 'rgba(168,120,48,0.2)', color: '#A87830',
    perks: ['기획·운영·홍보당 당주 지원 자격', '봉사별 부대장 지원 자격'],
  },
  {
    title: '사형 / 사자', count: '50 ~ 99회', badge: '사형·사자',
    Icon: Flame,
    gradient: 'linear-gradient(135deg,#C8963E,#E5B250)',
    cardBg: 'linear-gradient(135deg,#FEFAF0,#FDF0D0)',
    border: 'rgba(200,150,62,0.25)', color: '#C8963E',
    perks: ['봉사별 대장 직책 지원 자격'],
  },
  {
    title: '원로', count: '100 ~ 199회', badge: '원로',
    Icon: Crown,
    gradient: 'linear-gradient(135deg,#B8860B,#EBB12E)',
    cardBg: 'linear-gradient(135deg,#FDF5DB,#FAE6B5)',
    border: 'rgba(200,150,62,0.4)', color: '#B8860B',
    perks: ['자문 및 고문 역할', '공로 증서 수여'],
  },
  {
    title: '종사', count: '200회 이상', badge: '최고 명예',
    Icon: Trophy,
    gradient: 'linear-gradient(135deg,#9C6B0B,#C8963E)',
    cardBg: 'linear-gradient(135deg,#FCEDC4,#F5D58C)',
    border: 'rgba(200,150,62,0.6)', color: '#9C6B0B',
    perks: ['봉봉단 최고 명예직', '공로패(크리스탈) 수여'],
  },
];

const positionData = [
  {
    title: '단장', titleEn: 'MASTER', Icon: Crown,
    gradient: G.goldBadge, cardBg: 'linear-gradient(135deg,#FEF5E4,#F5E3C0)',
    border: 'rgba(168,120,48,0.3)',
    desc: '봉봉단의 대표',
  },
  {
    title: '장로', titleEn: 'ELDER', Icon: BookOpen,
    gradient: G.purpleBadge, cardBg: G.purpleCard,
    border: 'rgba(90,60,120,0.2)',
    desc: '봉봉단의 이사',
  },
  {
    title: '대장', titleEn: 'COMMANDER', Icon: Swords,
    gradient: G.redBadge, cardBg: 'linear-gradient(135deg,#FEF0EE,#FADDDA)',
    border: 'rgba(194,75,59,0.2)',
    desc: '봉사별로 장을 뜻해. 유기견봉사는 유기견대장 이런 식으로',
  },
  {
    title: '부대장', titleEn: 'VICE COMMANDER', Icon: Shield,
    gradient: G.blueBadge, cardBg: G.blueCard,
    border: 'rgba(46,82,152,0.2)',
    desc: '봉사별 부대장이야.',
  },
  {
    title: '당주', titleEn: 'CHIEF', Icon: Star,
    gradient: G.goldBadge, cardBg: G.goldCard,
    border: 'rgba(168,120,48,0.2)',
    desc: '기획당, 운영당, 홍보당의 장을 뜻해. 대장과 부대장보다는 아래 직책이지',
  },
  {
    title: '당원', titleEn: 'MEMBER', Icon: Users,
    gradient: G.greenBadge, cardBg: G.greenCard,
    border: 'rgba(45,92,64,0.2)',
    desc: '기획당, 운영당, 홍보당의 당원을 뜻해',
  },
  {
    title: '선봉대', titleEn: 'VANGUARD', Icon: Flag,
    gradient: 'linear-gradient(135deg,#8B1C1C,#C24B3B)', cardBg: 'linear-gradient(135deg,#FEF0EE,#FADDDA)',
    border: 'rgba(194,75,59,0.18)',
    desc: '선봉장(봉사 때마다 리더 역할인 사람)이 모인 곳으로 대장 직속 부대야.',
  },
];

function HierarchyNode({
  title, en, gradient, Icon, inline = false,
}: {
  title: string; en: string; gradient: string; Icon: React.ElementType; inline?: boolean;
}) {
  return (
    <div style={{
      background: gradient,
      borderRadius: '12px', padding: '12px 20px',
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={15} color="#fff" />
      <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>{title}</span>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>{en}</span>
    </div>
  );
}

function HierarchyLine() {
  return <div style={{ width: '2px', height: '20px', background: 'rgba(200,150,62,0.4)' }} />;
}

function TabRanks() {
  return (
    <div>
      {/* ── 직급 섹션 ── */}
      <div style={{ padding: 'clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px) clamp(80px, 12vw, 100px)', background: G.coolSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>
              GRADE SYSTEM
            </p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900', marginBottom: '12px' }}>
              직급 체계
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>
              모든 단원은 예비 단원으로부터 시작하며, 봉사 출정 횟수에 따라 강해집니다.
            </p>
          </RevealDiv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {rankData.map((rank, i) => (
              <RevealDiv key={rank.title} delay={i * 60}>
                <div style={{
                  background: rank.cardBg,
                  borderRadius: '22px',
                  border: `1px solid ${rank.border}`,
                  padding: '28px',
                  height: '100%',
                  boxSizing: 'border-box',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      background: rank.gradient,
                      borderRadius: '10px', padding: '7px 14px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                    }}>
                      <rank.Icon size={14} color="#fff" />
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '800' }}>{rank.badge}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: rank.color, background: `${rank.color}15`, padding: '4px 10px', borderRadius: '50px', border: `1px solid ${rank.border}` }}>
                      {rank.count}
                    </span>
                  </div>

                  <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '900', marginBottom: '14px' }}>
                    {rank.title}
                  </h3>

                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {rank.perks.map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '13px', color: '#4B5563', lineHeight: '1.55' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: rank.color, flexShrink: 0, marginTop: '6px' }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealDiv>
            ))}
          </div>


        </div>
      </div>

      {/* ── 직책 섹션 ── */}
      <div style={{ padding: 'clamp(80px, 12vw, 100px) clamp(20px, 5vw, 40px)', background: G.pureSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealDiv style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>
              POSITION SYSTEM
            </p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900', marginBottom: '12px' }}>
              직책 체계
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>
              봉봉단의 각 직책은 역할과 책임으로 정의됩니다
            </p>
          </RevealDiv>

          {/* 상세 조직도 */}
          <RevealDiv style={{ marginBottom: '56px' }}>
            <div style={{
              background: '#f8fafc', borderRadius: '24px', padding: '60px 40px',
              border: '1px solid #e2e8f0', overflowX: 'auto', minWidth: '800px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
            }}>
              {/* 상단 장로 - 단장 - 장로 */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
                <HierarchyNode title="장로" en="ELDER" gradient={G.purpleBadge} Icon={BookOpen} inline />
                <HierarchyNode title="단장" en="MASTER" gradient={G.goldBadge} Icon={Crown} inline />
                <HierarchyNode title="장로" en="ELDER" gradient={G.purpleBadge} Icon={BookOpen} inline />
              </div>

              <div style={{ width: '2px', height: '30px', background: 'rgba(200,150,62,0.4)', margin: '0 auto' }} />

              {/* 대장 */}
              <div style={{ width: 'fit-content', minWidth: '260px', margin: '0 auto', background: 'linear-gradient(135deg, #FFFFFF, #F1F5F9)', borderRadius: '22px', padding: '24px 40px', border: '1px solid rgba(0,0,0,0.05)', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: G.redBadge, borderRadius: '10px',
                  padding: '8px 16px', marginBottom: '16px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}>
                  <Swords size={15} color="#fff" />
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>대장</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>COMMANDER</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex' }}><strong style={{ width: '70px', color: '#C24B3B' }}>지원 자격</strong>사형/사자 이상</div>
                  <div style={{ display: 'flex' }}><strong style={{ width: '70px', color: '#C24B3B' }}>임기</strong>6개월·연임 가능</div>
                  <div style={{ display: 'flex' }}><strong style={{ width: '70px', color: '#C24B3B' }}>인원</strong>1명</div>
                </div>
              </div>

              <div style={{ width: '2px', height: '30px', background: 'rgba(200,150,62,0.4)', margin: '0 auto' }} />

              {/* 부대장 */}
              <div style={{ width: 'fit-content', minWidth: '260px', margin: '0 auto', background: G.blueCard, borderRadius: '22px', padding: '24px 40px', border: '1px solid rgba(46,82,152,0.2)', color: '#374151', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: G.blueBadge, borderRadius: '10px',
                  padding: '8px 16px', marginBottom: '16px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}>
                  <Shield size={15} color="#fff" />
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>부대장</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>VICE</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex' }}><strong style={{ width: '70px', color: '#2E5298' }}>지원 자격</strong>고참 단원 이상</div>
                  <div style={{ display: 'flex' }}><strong style={{ width: '70px', color: '#2E5298' }}>인원</strong>1명</div>
                </div>
              </div>

              {/* 브랜치 라인 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '2px', height: '24px', background: 'rgba(200,150,62,0.4)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '50%', height: '2px', borderTop: '2px solid rgba(200,150,62,0.4)', marginLeft: '50%' }} />
                  <div style={{ width: '2px', height: '24px', background: 'rgba(200,150,62,0.4)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: '2px', borderTop: '2px solid rgba(200,150,62,0.4)' }} />
                  <div style={{ width: '2px', height: '24px', background: 'rgba(200,150,62,0.4)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: '2px', borderTop: '2px solid rgba(200,150,62,0.4)' }} />
                  <div style={{ width: '2px', height: '24px', background: 'rgba(200,150,62,0.4)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '50%', height: '2px', borderTop: '2px solid rgba(200,150,62,0.4)', marginRight: '5ㅌ0%' }} />
                  <div style={{ width: '2px', height: '24px', background: 'rgba(200,150,62,0.4)' }} />
                </div>

                {/* 4개 부서 카드 */}
                {[
                  {
                    name: '선봉대', en: 'VANGUARD', Icon: Flag, gradient: 'linear-gradient(135deg,#8B1C1C,#C24B3B)', cardBg: 'linear-gradient(135deg,#FEF0EE,#FADDDA)', border: 'rgba(194,75,59,0.18)', color: '#C24B3B', details: [
                      { k: '자격', v: '숙련 단원 이상' },
                      { k: '특징', v: '맡은 봉사 참가비의 10%를 기여비로 수령' },
                      { k: '역할', v: '봉사 일정/장소 섭외부터 준비, 현장 지휘, 사후 보고서 작성까지 전 과정 책임' }
                    ]
                  },
                  {
                    name: '기획당', en: 'PLANNING', Icon: Star, gradient: G.greenBadge, cardBg: G.greenCard, border: 'rgba(45,92,64,0.2)', color: '#2D5C40', details: [
                      { k: '자격', v: '숙련 단원 이상' },
                      { k: '구성', v: '당주 1 + 당원 n' },
                      { k: '임기', v: '6개월·연임 가능' },
                      { k: '핵심', v: '단체 및 봉사·행사 기획' }
                    ]
                  },
                  {
                    name: '운영당', en: 'OPERATION', Icon: BookOpen, gradient: G.purpleBadge, cardBg: G.purpleCard, border: 'rgba(90,60,120,0.2)', color: '#5A3C78', details: [
                      { k: '자격', v: '숙련 단원 이상' },
                      { k: '구성', v: '당주 1 + 당원 n' },
                      { k: '임기', v: '6개월·연임 가능' },
                      { k: '핵심', v: '선봉장 교육 및 단체 운영' }
                    ]
                  },
                  {
                    name: '홍보당', en: 'PR', Icon: Heart, gradient: G.goldBadge, cardBg: G.goldCard, border: 'rgba(168,120,48,0.2)', color: '#A87830', details: [
                      { k: '자격', v: '숙련 단원 이상' },
                      { k: '구성', v: '당주 1 + 당원 n' },
                      { k: '임기', v: '6개월·연임 가능' },
                      { k: '핵심', v: 'SNS·콘텐츠 홍보·디자인' }
                    ]
                  }
                ].map(dept => (
                  <div key={dept.name} style={{ padding: '0 8px' }}>
                    <div style={{
                      background: dept.cardBg, borderRadius: '22px', padding: '24px',
                      border: `1px solid ${dept.border}`, height: '100%', boxSizing: 'border-box',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column'
                    }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: dept.gradient, borderRadius: '10px',
                        padding: '8px 16px', marginBottom: '20px', alignSelf: 'flex-start',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      }}>
                        <dept.Icon size={15} color="#fff" />
                        <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>{dept.name}</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>{dept.en}</span>
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#374151' }}>
                        {dept.details.map(d => (
                          <div key={d.k} style={{ display: 'flex', marginBottom: '8px' }}>
                            <strong style={{ width: '40px', color: dept.color, flexShrink: 0 }}>{d.k}</strong>
                            <span style={{ flex: 1, wordBreak: 'keep-all' }}>{d.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 주석 */}
              <div style={{ marginTop: '56px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', lineHeight: '1.9' }}>
                <p>• <strong>당원 선발:</strong> 대장·부대장·장로·단장이 의논하여 선발
                  <p></p> • <strong>당주 선발:</strong> 대장·부대장·장로·단장이 후보 지정 → 당원 투표로 선출</p>
                <p>• <strong>선봉장:</strong> 선봉대 소속으로, 숙련 단원 중 지원자가 운영당 교육 이수 후 선봉장 자격 취득 </p>
              </div>
            </div>
          </RevealDiv>
        </div>
      </div>
    </div>
  );
}

// ─── 탭 4: 조직도 ────────────────────────────────────────────────────────
function TabOrgChart() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const vLine = <div style={{ width: '2px', height: '24px', background: 'rgba(200,150,62,0.4)', margin: '0 auto' }} />;

  function Badge({ label, en, gradient, Icon: I }: { label: string; en: string; gradient: string; Icon: React.FC<{ size?: number; color?: string }> }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: gradient, borderRadius: '8px', padding: '6px 14px', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
        <I size={13} color="#fff" />
        <span style={{ color: '#fff', fontWeight: '800', fontSize: '13px' }}>{label}</span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600' }}>{en}</span>
      </div>
    );
  }

  function OrgCard({ label, en, gradient, Icon: I, names, wide }: { label: string; en: string; gradient: string; Icon: React.FC<{ size?: number; color?: string }>; names?: string[]; wide?: boolean }) {
    return (
      <div style={{ background: '#fff', borderRadius: '16px', padding: wide ? '18px 28px' : '16px 18px', border: '1px solid rgba(200,150,62,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: isMobile ? '120px' : '140px' }}>
        <Badge label={label} en={en} gradient={gradient} Icon={I} />
        {names && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
            {names.map(n => <span key={n} style={{ background: 'rgba(200,150,62,0.08)', border: '1px solid rgba(200,150,62,0.25)', color: '#92640A', fontSize: '11px', fontWeight: '600', padding: '2px 9px', borderRadius: '50px' }}>{n}</span>)}
          </div>
        )}
      </div>
    );
  }

  function VCard({ label, en, gradient, Icon: I }: { label: string; en: string; gradient: string; Icon: React.FC<{ size?: number; color?: string }> }) {
    return (
      <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px 18px', border: '1.5px dashed rgba(200,150,62,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: isMobile ? '120px' : '140px' }}>
        <div style={{ opacity: 0.55 }}><Badge label={label} en={en} gradient={gradient} Icon={I} /></div>
        <span style={{ color: '#C8963E', fontSize: '11px', fontWeight: '600', background: 'rgba(200,150,62,0.08)', padding: '2px 10px', borderRadius: '50px', border: '1px dashed rgba(200,150,62,0.3)' }}>선발 예정</span>
      </div>
    );
  }

  const deptCards = [
    {
      label: '선봉대', en: 'VANGUARD', gradient: 'linear-gradient(135deg,#8B1C1C,#C24B3B)',
      bg: 'linear-gradient(135deg,#FEF0EE,#FADDDA)', border: 'rgba(194,75,59,0.2)',
      Icon: Flag, names: ['박진범', '강경민', '김지현', '고승아', '안주선'], nameColor: '#9B2C1D', nameBorder: 'rgba(194,75,59,0.2)', nameBg: 'rgba(194,75,59,0.1)',
    },
    { label: '기획당', en: 'PLANNING', gradient: G.greenBadge, bg: G.greenCard, border: 'rgba(45,92,64,0.2)', Icon: Star, nameColor: '#4A7C59', nameBorder: 'rgba(45,92,64,0.3)', nameBg: 'rgba(45,92,64,0.08)' },
    { label: '운영당', en: 'OPERATION', gradient: G.purpleBadge, bg: G.purpleCard, border: 'rgba(90,60,120,0.2)', Icon: BookOpen, nameColor: '#5A3C78', nameBorder: 'rgba(90,60,120,0.3)', nameBg: 'rgba(90,60,120,0.08)' },
    { label: '홍보당', en: 'PR', gradient: G.goldBadge, bg: G.goldCard, border: 'rgba(168,120,48,0.2)', Icon: Heart, nameColor: '#A87830', nameBorder: 'rgba(168,120,48,0.3)', nameBg: 'rgba(168,120,48,0.08)' },
  ];

  return (
    <div>
      <div style={{ padding: isMobile ? '60px 20px 80px' : '80px 40px 100px', background: G.coolSection }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <RevealDiv style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', ...gradientText(G.goldTextBg) }}>ORG CHART</p>
            <h2 style={{ color: '#1E3A5F', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '900' }}>조직도</h2>
            <p style={{ color: '#6B7280', fontSize: '16px', marginTop: '12px' }}>봉봉단의 지휘 체계와 간부진을 소개합니다</p>
          </RevealDiv>

          {/* ── 레이어 1: 자문단 ── */}
          <RevealDiv>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <OrgCard label="단장" en="MASTER" gradient={G.goldBadge} Icon={Crown} names={['박진범']} wide />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <OrgCard label="장로" en="ELDER" gradient={G.purpleBadge} Icon={BookOpen} names={['강경민']} />
                  <OrgCard label="장로" en="ELDER" gradient={G.purpleBadge} Icon={BookOpen} names={['김지현']} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <OrgCard label="장로" en="ELDER" gradient={G.purpleBadge} Icon={BookOpen} names={['강경민']} />
                <div style={{ width: '40px', height: '2px', background: 'rgba(200,150,62,0.4)' }} />
                <OrgCard label="단장" en="MASTER" gradient={G.goldBadge} Icon={Crown} names={['박진범']} wide />
                <div style={{ width: '40px', height: '2px', background: 'rgba(200,150,62,0.4)' }} />
                <OrgCard label="장로" en="ELDER" gradient={G.purpleBadge} Icon={BookOpen} names={['김지현']} />
              </div>
            )}
          </RevealDiv>

          {vLine}

          {/* ── 레이어 2: 대장 ── */}
          <RevealDiv delay={100}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <VCard label="대장" en="COMMANDER" gradient={G.redBadge} Icon={Swords} />
            </div>
          </RevealDiv>

          {vLine}

          {/* ── 레이어 3: 부대장 ── */}
          <RevealDiv delay={150}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <VCard label="부대장" en="VICE" gradient={G.blueBadge} Icon={Shield} />
            </div>
          </RevealDiv>

          {vLine}

          {/* ── 레이어 4: 4개 부서 ── */}
          <RevealDiv delay={200}>
            {/* 가로 연결선 (데스크탑만) */}
            {!isMobile && (
              <div style={{ display: 'flex', maxWidth: '760px', margin: '0 auto' }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: i === 0 ? '50%' : i === 3 ? '50%' : '100%', height: '2px', background: 'rgba(200,150,62,0.4)', alignSelf: i === 0 ? 'flex-end' : i === 3 ? 'flex-start' : 'stretch' }} />
                    <div style={{ width: '2px', height: '20px', background: 'rgba(200,150,62,0.4)' }} />
                  </div>
                ))}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '12px',
              maxWidth: isMobile ? '360px' : '760px',
              margin: '0 auto',
            }}>
              {deptCards.map(dept => (
                <div key={dept.label} style={{ background: dept.bg, borderRadius: '16px', padding: '16px 12px', border: `1px solid ${dept.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: dept.gradient, borderRadius: '8px', padding: '5px 10px', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                    <dept.Icon size={11} color="#fff" />
                    <span style={{ color: '#fff', fontWeight: '800', fontSize: '12px' }}>{dept.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: '600' }}>{dept.en}</span>
                  </div>
                  {dept.names ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', width: '100%' }}>
                      {dept.names.map(n => <span key={n} style={{ background: dept.nameBg, border: `1px solid ${dept.nameBorder}`, color: dept.nameColor, fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '50px', textAlign: 'center' }}>{n}</span>)}
                    </div>
                  ) : (
                    <span style={{ color: dept.nameColor, fontSize: '11px', fontWeight: '600', background: dept.nameBg, padding: '2px 10px', borderRadius: '50px', border: `1px dashed ${dept.nameBorder}` }}>선발 예정</span>
                  )}
                </div>
              ))}
            </div>
          </RevealDiv>

          {/* ── 단원 전체 ── */}
          <RevealDiv delay={250}>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {vLine}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,150,62,0.06)', border: '1.5px dashed rgba(200,150,62,0.3)', borderRadius: '14px', padding: '12px 28px' }}>
                <Users size={16} color="#C8963E" />
                <span style={{ color: '#A87830', fontWeight: '700', fontSize: '14px' }}>단원 전체</span>
                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>(일반 봉사자)</span>
              </div>
            </div>
          </RevealDiv>

          {/* ── 안내 노트 ── */}
          <RevealDiv delay={300}>
            <div style={{ marginTop: '48px', background: '#fff', borderRadius: '16px', padding: '24px 28px', border: '1px solid rgba(200,150,62,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', fontSize: '13px', color: '#64748B', lineHeight: '1.9' }}>
              <p style={{ fontWeight: '700', color: '#1E3A5F', marginBottom: '8px', fontSize: '14px' }}>안내</p>
              <p>• <strong>대장·부대장·당주</strong>는 현재 선발 예정 중입니다.</p>
              <p>• <strong>선봉대</strong>는 선봉장 교육 이수와 자격 시험을 통과한 단원으로 구성됩니다.</p>
              <p>• 조직 구성은 봉봉단의 성장에 따라 지속적으로 업데이트됩니다.</p>
            </div>
          </RevealDiv>

        </div>
      </div>
    </div>
  );
}
const connector = (
  <div style={{ width: '2px', height: '28px', background: 'linear-gradient(to bottom, #C8963E, rgba(200,150,62,0.3))', margin: '0 auto' }} />
);


// ─── 메인 About 페이지 ─────────────────────────────────────────────────
export function About() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'intro';

  useEffect(() => {
    if (!TABS.find(t => t.key === currentTab)) {
      navigate('/about?tab=intro', { replace: true });
    }
  }, [currentTab, navigate]);

  const renderTab = () => {
    switch (currentTab) {
      case 'intro': return <TabIntro />;
      case 'ranks': return <TabRanks />;
      case 'orgchart': return <TabOrgChart />;
      default: return <TabIntro />;
    }
  };

  return (
    <div>
      {/* 페이지 히어로 */}
      <div style={{
        padding: '140px 40px 0',
        background: G.darkHero,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', background: G.heroOrb1, filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>
            BONGBONGDAN · BBD
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.2' }}>
            단체 소개
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: '1.7' }}>
            유기견 봉사를 넘어 새로운 봉사 영역을 만들어나가는 <br className="hidden md:block" />
            봉봉단(BBD)을 소개합니다
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
        }}>
          {TABS.map(tab => {
            const isActive = currentTab === tab.key;
            return (
              <Link
                key={tab.key}
                to={`/about?tab=${tab.key}`}
                style={{
                  flex: '1 1 0',
                  minWidth: '100px',
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