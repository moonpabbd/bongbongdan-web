import { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Mail, HelpCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { G, gradientText } from '../styles/gradients';

function RevealDiv({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

type FAQItem = { q: string; a: string };
type FAQCategory = { label: string; items: FAQItem[] };

const faqData: FAQCategory[] = [
  {
    label: '봉봉단 소개',
    items: [
      { q: '봉봉단은 어떤 단체인가요?', a: '봉봉단은 \'의협을 실천하는 봉사문파\'입니다. 현재 유기동물 보호소 봉사를 주축으로 하고 있지만, 이를 시작으로 대한민국 전역의 다양한 봉사 단체 및 활동으로 영역을 넓혀나갈 예정입니다.' },
      { q: '봉봉단과 협업하거나 파트너십을 맺고 싶어요.', a: '봉봉단은 기업, 단체, 기관 등과의 다양한 협업을 언제든 환영합니다! 협업 제안은 support@bbd.or.kr로 메일 주시면 검토 후 연락드리겠습니다.' },
      { q: '봉사 경험이 전혀 없는데 참여해도 되나요?', a: '적극 환영합니다! 봉봉단 참여자의 대부분이 처음 봉사를 시작하시는 분들입니다. 초보자분들도 쉽게 적응하실 수 있도록 운영진과 선배 문파원들이 친절하게 안내해 드립니다.' },
      { q: '나이 제한이 있나요?', a: '보호소 봉사 특성상 안전상의 문제가 발생할 수 있어, 현재 미성년자는 참가가 불가합니다. 성인이라면 누구나 참여 가능합니다.' },
    ],
  },
  {
    label: '신청 및 일정',
    items: [
      { q: '봉사 일정을 변경하고 싶을 때는 어떻게 하나요?', a: '활동일로부터 최소 1주일 전까지 봉봉단 카카오톡 문의나 공식 인스타그램 DM을 통해 말씀해 주셔야 합니다. 일정 변경은 현재 모집 중인 다른 봉사 활동으로만 가능합니다.' },
      { q: '개인적인 사정으로 봉사를 취소해야 한다면요?', a: '봉봉단은 여러분의 현생을 가장 중요하게 생각합니다. 취소 시 운영진이나 단체 톡방에 따로 말씀하실 필요 없이, 신청 당시 받으신 알림톡의 [봉사 출전 취소하기] 버튼을 눌러 취소 폼을 작성해 주시면 됩니다. 단, 개인 사정으로 인한 취소 시 봉사비 환불은 불가한 점 양해 부탁드립니다.' },
      { q: '회원가입을 꼭 해야 하나요?', a: '비회원으로도 신청이 가능합니다. 다만, 회원으로 가입하시면 매번 개인정보를 입력할 필요 없이 원클릭 신청이 가능하여 훨씬 편리합니다.' },
    ],
  },
  {
    label: '픽업',
    items: [
      { q: 'AI 픽업 매칭 이용 시 유류비 지원은 어떻게 되나요?', a: '동승자가 1명 이상인 실제 픽업 구간에 대해 다음과 같은 기준으로 유류비를 지원해 드립니다.\n\n• 정산 구간: 첫 동승자 탑승지 ~ 봉사지 / 봉사지 ~ 마지막 동승자 하차지 (네이버 지도 \'무료 도로 우선\' 기준)\n• 산정 기준: 연비 11km/L 및 지급 시점 전국 평균 유가 적용\n• 지급 비율(편도): 동승 1명(80%), 2명(90%), 3명 이상(100%) 지원' },
      { q: '픽업 배치는 어떻게 되나요?', a: '봉봉단만의 AI 픽업 매칭 알고리즘을 통해 최적의 배차가 이루어집니다.\n\n• 스마트 배차: 동승자가 운전자의 경로에서 크게 벗어나지 않도록 분석(우회 30% 미만)하고 인원 밸런스를 계산합니다.\n• 집결지 최적화: 단순히 중간 지점이 아닌, 목적지 방향 전진율이 가장 높은 최적의 지하철역을 AI가 직접 선정합니다.\n• 자동 재조정: 특정 차량 인원 쏠림이나 비효율적인 경로를 AI가 3단계(재조정/교환/통합)로 재계산하여 빈틈없이 매칭합니다.\n• 배차 결과 안내: 모든 연산이 끝나면 AI가 해당 집결지가 선정된 이유와 함께 상세한 배차 결과를 자동으로 안내해 드립니다.' },
    ],
  },
  {
    label: '활동 가이드',
    items: [
      { q: '봉사 활동 시간은 보통 얼마나 소요되나요?', a: '이동 시간을 제외한 순수 봉사 시간은 약 3시간 내외입니다.' },
      { q: '기상 상황(폭우/폭설) 시 봉사가 취소되나요?', a: '네, 안전이 우려되는 기상 악화 시에는 봉사가 취소되며 즉시 개별 공지드립니다. 이 경우 기납부된 참가비는 전액 환불해 드립니다.' },
      { q: '봉사 활동 중 사진이나 영상을 찍어도 되나요?', a: '적극 권장합니다! 아이들의 예쁜 모습을 정성스럽게 찍어주시는 것이 입양 홍보에 큰 도움이 됩니다. 예쁜 사진과 영상은 언제든 환영입니다.' },
      { q: '어떤 보호소들이 있나요?', a: '봉봉단은 경기도와 인천 지역을 중심으로 다양한 성격의 보호소들과 함께하고 있습니다.\n\n• 경기북부/인천: 동물자유연대(온센터), 아크보호소, 빅독포레스트, 댕글댕글, 이용녀 보호소, 왕왕랜드\n• 경기남부: 반려마루 여주, 콜리하우스, 원브리스, 포캣멍센터\n\n대형견 전문 보호소부터 고양이와 미어캣이 있는 곳, 해변 산책이나 저수지 산책이 가능한 곳까지 각기 다른 매력을 가진 보호소들이 기다리고 있습니다. 신청 시 상세 정보를 통해 더 자세히 확인해 보세요!' },
    ],
  },
  {
    label: '후원 및 인증',
    items: [
      { q: '후원은 어떻게 할 수 있나요?', a: '현재 봉봉단은 별도의 현금 후원금은 받지 않고 있으며, 물품 후원만 받고 있습니다. 사료, 패드 등 물품 후원 문의는 카카오톡, 인스타그램 DM 또는 support@bbd.or.kr로 메일 주시면 안내해 드리겠습니다.' },
      { q: '봉사 시간 인증이 가능한가요?', a: '네, 가능합니다! 공식적인 VMS 봉사 시간 인증을 받으실 수 있도록 지원해 드립니다.' },
      { q: '참가비는 어디에 사용되나요?', a: '보호소 후원 물품 구입 및 봉사 운영비(청소 용품 등)로 투명하게 사용됩니다.' },
    ],
  },
];

function AccordionItem({ q, a }: FAQItem) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F0F0F0', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: 'none', border: 'none', cursor: 'pointer', gap: '16px', textAlign: 'left',
        }}
      >
        <span style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', lineHeight: '1.5', fontFamily: 'inherit' }}>{q}</span>
        <ChevronDown
          size={20}
          color="#C8963E"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease', marginTop: '2px' }}
        />
      </button>
      <div style={{
        maxHeight: open ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.8', paddingBottom: '24px' }}>{a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState(new Set<string>());

  const allItems = faqData.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.label })));
  const searchedItems = searchQuery ? allItems.filter(item => item.q.includes(searchQuery) || item.a.includes(searchQuery)) : null;

  const currentItems = searchedItems || faqData.find(cat => cat.label === activeCategory)?.items || [];

  const filteredData = activeCategory === '전체'
    ? faqData.map(cat => ({
      label: cat.label,
      items: cat.items.filter(item => item.q.includes(searchQuery) || item.a.includes(searchQuery)),
    })).filter(cat => cat.items.length > 0)
    : faqData.map(cat => ({
      label: cat.label,
      items: cat.items.filter(item => item.q.includes(searchQuery) || item.a.includes(searchQuery)),
    })).filter(cat => cat.label === activeCategory && cat.items.length > 0);

  const toggleItem = (key: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '160px 40px 100px', background: G.darkHero, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: G.heroOrb3, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px', ...gradientText('linear-gradient(135deg, #C8963E, #F5C875)') }}>자주 묻는 질문</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '900', marginBottom: '20px' }}>FAQ</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            봉봉단에 대해 자주 묻는 질문들을 모았습니다.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div style={{ padding: '80px 40px 120px', background: G.warmSection }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Search */}
          <RevealDiv style={{ marginBottom: '48px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} color="#9CA3AF" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="질문을 검색하세요..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '18px 20px 18px 52px',
                  border: '2px solid #E5E7EB', borderRadius: '16px',
                  fontSize: '16px', outline: 'none', boxSizing: 'border-box',
                  background: 'linear-gradient(135deg, #FFFFFF, #FDFBF7)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#C8963E';
                  e.target.style.boxShadow = '0 4px 20px rgba(200,150,62,0.15)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              />
            </div>
          </RevealDiv>

          {/* Category Tabs */}
          <RevealDiv style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
            {['전체', ...faqData.map(d => d.label)].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px', borderRadius: '50px', border: 'none',
                  background: activeCategory === cat ? G.navyBtn : 'linear-gradient(135deg, #FFFFFF, #F5F0E8)',
                  color: activeCategory === cat ? '#fff' : '#6B7280',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: activeCategory === cat ? '0 4px 16px rgba(30,58,95,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                  fontFamily: 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </RevealDiv>

          {/* FAQ Items */}
          {filteredData.length === 0 ? (
            <RevealDiv style={{ textAlign: 'center', padding: '80px 40px' }}>
              <p style={{ color: '#9CA3AF', fontSize: '18px', marginBottom: '8px' }}>검색 결과가 없습니다.</p>
              <p style={{ color: '#D1D5DB', fontSize: '15px' }}>다른 키워드로 검색해보세요.</p>
            </RevealDiv>
          ) : (
            filteredData.map(cat => (
              <div key={cat.label} style={{ marginBottom: '40px' }}>
                <RevealDiv>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '2px', marginBottom: '20px', ...gradientText(G.goldTextBg) }}>{cat.label.toUpperCase()}</h3>
                </RevealDiv>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cat.items.map((item, i) => {
                    const key = `${cat.label}-${i}`;
                    const isOpen = openItems.has(key);
                    return (
                      <RevealDiv key={key} delay={i * 40}>
                        <div
                          style={{
                            background: isOpen
                              ? 'linear-gradient(160deg, #F8F6F2, #EDE5D5)'
                              : 'linear-gradient(160deg, #FFFFFF, #FDFBF7)',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: isOpen ? 'rgba(200,150,62,0.2)' : 'rgba(0,0,0,0.05)',
                            boxShadow: isOpen ? '0 8px 32px rgba(200,150,62,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                          }}
                          onClick={() => toggleItem(key)}
                        >
                          <div style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                            <span style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '15px', lineHeight: '1.5' }}>{item.q}</span>
                            <ChevronDown
                              size={18}
                              color="#C8963E"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', flexShrink: 0 }}
                            />
                          </div>
                          {isOpen && (
                            <div style={{ padding: '0 24px 22px' }}>
                              <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.8', borderTop: '1px solid rgba(200,150,62,0.15)', paddingTop: '16px' }}>
                                {item.a}
                              </p>
                            </div>
                          )}
                        </div>
                      </RevealDiv>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Contact */}
          <RevealDiv style={{ marginTop: '64px' }}>
            <div style={{ background: G.darkSection, borderRadius: '28px', padding: '56px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '200px', height: '200px', background: G.heroOrb3, filter: 'blur(60px)' }} />
              <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>원하는 답변을 못 찾으셨나요?</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '32px' }}>
                카카오 채널이나 이메일로 문의 주시면 빠르게 답변드립니다.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="http://pf.kakao.com/_zxcZIX/chat" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: G.yellowBtn, color: '#191919', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', boxShadow: '0 4px 16px rgba(254,229,0,0.3)' }}
                >
                  <MessageCircle size={16} /> 카카오로 문의
                </a>

              </div>
            </div>
          </RevealDiv>
        </div>
      </div>
    </div>
  );
}