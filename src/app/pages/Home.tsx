import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useScrollReveal, useCounter } from '../hooks/useScrollReveal';
import { symbol3DImg, homeImages, homeSection1Img } from '../imageAssets';
import { G, gradientText } from '../styles/gradients';

// ─── 공통 유틸 ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PhotoBox({ height = '480px', radius = '24px', label }: { height?: string; radius?: string; label?: string }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: radius,
      background: 'linear-gradient(135deg, #F3F0EB 0%, #EAE0CC 100%)',
      border: '2px dashed rgba(200,150,62,0.35)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '10px',
    }}>
      <span style={{ fontSize: '32px' }}>📸</span>
      {label && <p style={{ color: '#A87830', fontSize: '13px', fontWeight: '600' }}>{label}</p>}
    </div>
  );
}

function BigNumber({ target, suffix, label, delay = 0 }: { target: number; suffix: string; label: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  const count = useCounter(target, 2000, visible);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div style={{ fontSize: 'clamp(52px, 7vw, 88px)', fontWeight: '900', lineHeight: '1', letterSpacing: '-0.02em', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>
        {count.toLocaleString()}<span style={{ marginLeft: '12px', fontSize: '0.6em' }}>{suffix}</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginTop: '10px', fontWeight: '500' }}>{label}</p>
    </div>
  );
}
function IdentitySection() {
  const [shuffled] = useState(() => {
    const arr = [...homeImages];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (shuffled.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % shuffled.length);
        setFading(false);
      }, 1500); // 페이드 속도도 약간 더 부드럽게
    }, 8000); // 8초마다 변경
    return () => clearInterval(timer);
  }, [shuffled]);

  const currentImg = shuffled[current] || 'https://images.unsplash.com/photo-1593113503873-e4418f7dbd8d?q=80&w=2000&auto=format&fit=crop';

  return (
    <div style={{
      padding: '240px clamp(20px, 5vw, 40px)',
      position: 'relative',
      overflow: 'hidden',
      background: '#0A111A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      {/* 배경 이미지 레이어 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(10, 17, 26, 0.5), rgba(10, 17, 26, 0.6)), url('${currentImg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(0.7) contrast(1.1) brightness(0.6)',
        opacity: fading ? 0.3 : 1,
        transition: 'opacity 1.5s ease-in-out',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '4px', marginBottom: '24px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>SILENT ACTION</p>
          <h2 style={{ fontSize: 'clamp(40px,6vw,80px)', fontWeight: '900', color: '#fff', lineHeight: '1.1', marginBottom: '40px', letterSpacing: '-2px' }}>
            현장은 거짓말을 <br className="hidden md:block" /> 하지 않으니까.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(17px,2vw,20px)', lineHeight: '1.9', maxWidth: '720px', margin: '0 auto' }}>
            거창한 구호나 화려한 미사여구보다,<br className="hidden md:block" />
            우리는 현장에서 흘리는 땀방울의 가치를 믿습니다.<br className="hidden md:block" />
            봉봉단이 머문 자리에는 항상 변화가 시작됩니다.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

// ─── 메인 ───────────────────────────────────────────────────────────────────
export function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate normalized position (-1 to 1)
    const nx = (clientX / innerWidth - 0.5) * 2;
    const ny = (clientY / innerHeight - 0.5) * 2;
    setRotation({ x: nx, y: ny });
  };

  return (
    <div>

      {/* ── 1. HERO ── */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotation({ x: 0, y: 0 })}
        style={{
          minHeight: '100vh',
          background: G.darkHero,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          padding: '120px clamp(20px, 5vw, 40px) 80px', textAlign: 'center',
        }}>
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '700px', height: '700px', background: G.heroOrb1, filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-180px', left: '-180px', width: '600px', height: '600px', background: G.heroOrb2, filter: 'blur(120px)', pointerEvents: 'none' }} />

        <div style={{
          position: 'relative', zIndex: 1, maxWidth: '780px',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'linear-gradient(135deg,rgba(200,150,62,0.15),rgba(245,200,117,0.08))',
            border: '1px solid rgba(200,150,62,0.4)',
            borderRadius: '50px', padding: '7px 20px', marginBottom: '36px',
          }}>
            <span style={{ color: '#F5C875', fontSize: '12px', fontWeight: '700', letterSpacing: '3px' }}>봉사에 봉사를 더하는 단체</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(44px, 7vw, 84px)', fontWeight: '900',
            lineHeight: '1.1', marginBottom: '28px', letterSpacing: '-1.5px', color: '#fff',
          }}>
            의협을 실천하는 <br className="hidden md:block" />
            <span style={gradientText('linear-gradient(135deg,#C8963E 0%,#F5C875 50%,#E8B060 100%)')}>봉사문파</span>, <br className="hidden md:block" />
            봉봉단
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(16px,2vw,20px)', lineHeight: '1.8', marginBottom: '48px' }}>
            약한 자를 돕고 올바른 것을 실천하는 협객의 마음으로<br className="hidden md:block" /> 더 나은 세상을 만들어 갑니다.
          </p>


        </div>

        {/* 중앙 배경에 희미하게 떠있는 3D 심볼 (마우스 인터랙션 추가) */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', 
          transform: `translate(-50%, -50%) perspective(1000px) rotateY(${rotation.x * 12}deg) rotateX(${rotation.y * -12}deg)`,
          opacity: heroVisible ? 0.12 : 0, 
          transition: 'opacity 1.5s ease 0.3s, transform 0.2s cubic-bezier(0.2, 0, 0.4, 1)', 
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <img src={symbol3DImg} alt="" style={{ width: 'min(850px, 150vw)', height: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{
          position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          opacity: heroVisible ? 0.6 : 0,
          transition: 'opacity 1s ease 1s',
        }}>
          <div style={{
            width: '1px', height: '80px',
            background: 'linear-gradient(to bottom, transparent, #C8963E 50%, #C8963E)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: 'linear-gradient(to bottom, transparent, #fff, transparent)',
              animation: 'scrollLine 2s infinite linear'
            }} />
          </div>
          <span style={{ color: '#C8963E', fontSize: '11px', letterSpacing: '4px', fontWeight: '800' }}>SCROLL</span>
        </div>
        <style>{`
          @keyframes scrollLine {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </div>

      {/* ── 2. 신청은 딱 한 번 ── */}
      <div style={{ padding: 'clamp(80px, 15vw, 160px) clamp(20px, 5vw, 40px)', background: '#fff' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))',
          gap: '80px', alignItems: 'center',
        }}>
          <Reveal>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '20px', ...gradientText(G.goldTextBg) }}>EASY & SIMPLE</p>
            <h2 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: '900', lineHeight: '1.2', color: '#1E3A5F', marginBottom: '28px' }}>
              신청만 하면 <br className="hidden md:block" /> 봉봉단이 <br className="hidden md:block" /> 알아서 준비합니다.
            </h2>
            <p style={{ color: '#6B7280', fontSize: '18px', lineHeight: '1.9', marginBottom: '36px' }}>
              봉사 신청부터 봉사가 끝날 때까지 <br className="hidden md:block" />
              누구나 쉽고 편하게 봉사할 수 있도록 만들어 갑니다.
            </p>
            <a
              href="https://forms.gle/8CdE8FyFmPAvJhVKA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-scale"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#A87830', fontWeight: '700', fontSize: '16px', textDecoration: 'none',
              }}
            >
              봉사 신청하러 가기 <ChevronRight size={18} />
            </a>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}>
              <img
                src={homeSection1Img}
                alt="봉사 신청 안내"
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '600px', objectFit: 'cover' }}
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── 3. 협객들이 만든 숫자 ── */}
      <div style={{ padding: 'clamp(80px, 15vw, 160px) clamp(20px, 5vw, 40px)', background: G.darkSection }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>IMPACT</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: '900', color: '#fff', marginBottom: '72px', lineHeight: '1.3' }}>
              협객들이 만들어가는 <br className="hidden md:block" /> 숫자들
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '56px' }}>
            <BigNumber target={1000} suffix="명+" label="채널 통합 멤버" delay={0} />
            <BigNumber target={400} suffix="회+" label="봉사 누적 신청" delay={100} />
            <BigNumber target={12} suffix="곳" label="유기견 보호소 파트너" delay={200} />
          </div>
          <Reveal style={{ marginTop: '80px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', letterSpacing: '1px' }}>
              공식 오픈 <strong style={{ color: 'rgba(255,255,255,0.7)' }}>100일 만</strong>의 기록
            </p>
          </Reveal>
        </div>
      </div>



      {/* ── 5. 다음 출정지 ── */}
      <div style={{ padding: 'clamp(80px, 15vw, 160px) clamp(20px, 5vw, 40px)', background: '#fff' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: '80px', alignItems: 'center',
        }}>
          <Reveal>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '20px', ...gradientText(G.goldTextBg) }}>NEXT CHAPTER</p>
            <h2 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: '900', lineHeight: '1.2', color: '#1E3A5F', marginBottom: '28px' }}>
              유기견 봉사에서 <br className="hidden md:block" /> 더 넓은 <br className="hidden md:block" /> 세상으로.
            </h2>
            <p style={{ color: '#6B7280', fontSize: '17px', lineHeight: '1.9', marginBottom: '36px' }}>
              봉봉단의 다음 출정지는<br className="hidden md:block" /> 무궁무진합니다.
            </p>
            <Link to="/activities" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#A87830', fontWeight: '700', fontSize: '16px', textDecoration: 'none',
            }}>
              모든 활동 보기 <ChevronRight size={18} />
            </Link>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { emoji: '🐾', title: '유기견 봉사', status: '진행 중', statusBg: G.greenBadge, delay: 0 },
              { emoji: '🎨', title: '벽화 봉사', status: '준비 중', statusBg: G.goldBadge, delay: 80 },
              { emoji: '🌿', title: '플로깅 봉사', status: '준비 중', statusBg: G.goldBadge, delay: 160 },
              { emoji: '🖐', title: '아동 봉사', status: '예정', statusBg: G.purpleBadge, delay: 240 },
              { emoji: '🤝', title: '복지·의료 봉사', status: '예정', statusBg: G.purpleBadge, delay: 320 },
            ].map(item => (
              <Reveal key={item.title} delay={item.delay}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '20px 24px', borderRadius: '16px',
                  background: 'linear-gradient(135deg,#FAFAFA,#F5F0E8)',
                  border: '1px solid rgba(200,150,62,0.12)',
                }}>
                  <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                  <span style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '17px', flex: 1 }}>{item.title}</span>
                  <span style={{
                    background: item.statusBg, color: '#fff',
                    fontSize: '12px', fontWeight: '700',
                    padding: '4px 14px', borderRadius: '50px',
                  }}>{item.status}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. 운영에 진심 ── */}
      <div style={{ padding: 'clamp(80px, 15vw, 160px) clamp(20px, 5vw, 40px)', background: G.darkSection }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: '900', color: '#fff', lineHeight: '1.25', marginBottom: '48px' }}>
              단순한 봉사 모임이 <br className="hidden md:block" /> 아닙니다.
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            {[
              { num: '01', text: '체계적인 단원 관리 및 데이터베이스 시스템', delay: 0, opacity: 1 },
              { num: '02', text: '봉사 횟수에 따른 단계적 성장 및 명예 보상 체계', delay: 80, opacity: 1 },
              { num: '03', text: '신청부터 종료까지, 원스톱 케어 시스템', delay: 160, opacity: 1 },
              { num: '04', text: '거리의 장벽을 허무는 AI 기반 픽업 매칭 시스템', delay: 240, opacity: 0.6 },
              { num: '05', text: '철저한 현장 운영을 위한 선봉장 교육 및 관리 체계', delay: 320, opacity: 0.3 },
            ].map(item => (
              <Reveal key={item.num} delay={item.delay} style={{ opacity: item.opacity }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '28px',
                  padding: '24px 32px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '2px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)'), flexShrink: 0 }}>{item.num}</span>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>{item.text}</span>
                </div>
              </Reveal>
            ))}
            <Reveal delay={400} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
              ))}
            </Reveal>
          </div>
          <Reveal delay={200} style={{ marginTop: '48px' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '17px', lineHeight: '1.8' }}>
              봉봉단은 운영에 진심입니다.
            </p>
          </Reveal>
        </div>
      </div>


      {/* ── 4. 정체성: 현장과 실천 (Full Background Slider) ── */}
      <IdentitySection />

      {/* ── 7. CTA ── */}
      <div style={{ padding: 'clamp(80px, 15vw, 160px) clamp(20px, 5vw, 40px)', background: G.darkHero, textAlign: 'center' }}>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: G.heroOrb1, filter: 'blur(100px)', pointerEvents: 'none', opacity: 0.5 }} />
          <Reveal style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '24px', ...gradientText('linear-gradient(135deg,#C8963E,#F5C875)') }}>JOIN US</p>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: '900', color: '#fff', lineHeight: '1.2', marginBottom: '24px' }}>
              함께 출정할 <br className="hidden md:block" /> 협객을 기다립니다.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px', lineHeight: '1.8', marginBottom: '52px' }}>
              봉사가 처음이어도 괜찮습니다.<br className="hidden md:block" /> 봉봉단이 함께합니다.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a
                href="https://forms.gle/8CdE8FyFmPAvJhVKA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-scale"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg,#C8963E,#E8B060)',
                  color: '#fff', padding: '22px 56px', borderRadius: '16px',
                  textDecoration: 'none', fontSize: '18px', fontWeight: '700',
                  boxShadow: '0 12px 40px rgba(200,150,62,0.45)',
                }}
              >
                봉사 신청하기 <ChevronRight size={20} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

    </div>
  );
}