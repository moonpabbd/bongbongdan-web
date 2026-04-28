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
    label: '참여 방법',
    items: [
      { q: '봉봉단 봉사에 참여하려면 어떻게 하나요?', a: '홈페이지의 "봉사 신청하기" 버튼을 클릭하여 구글 설문지를 작성하시면 됩니다. 이름, 생년월일, 참여 희망 일정, 카카오ID만 입력하면 신청이 완료됩니다.' },
      { q: '봉사에 참여하려면 회원가입이 필요한가요?', a: '아닙니다! 봉봉단은 회원가입이나 로그인 없이 구글 설문지 하나로 신청할 수 있습니다. 참여 장벽을 최소화했습니다.' },
      { q: '봉사 활동은 얼마나 자주 있나요?', a: '유기견 봉사는 현재 월 2회(격주 토요일) 진행됩니다. 일정은 공지사항과 카카오 채널을 통해 사전 안내됩니다.' },
      { q: '처음 참여하는데 혼자 가도 괜찮나요?', a: '물론입니다! 오히려 처음 오시는 분들을 위해 운영진이 현장에서 안내해드립니다. 봉봉단은 혼자 와도 편하게 함께할 수 있는 분위기입니다.' },
      { q: '봉사에 참여할 때 준비물이 있나요?', a: '편안한 복장과 운동화, 장갑(선택), 개인 약(알레르기 등), 스마트폰이면 충분합니다. 동물 알레르기가 있으시면 사전에 알려주세요.' },
      { q: '나이 제한이 있나요?', a: '만 14세 이상이면 참여 가능합니다. 미성년자의 경우 부모 동의 후 참여하실 수 있으며, 보호자 동반도 환영합니다.' },
      { q: '봉사 활동 시간은 얼마나 되나요?', a: '일반적으로 오전 10시부터 오후 2~3시까지 약 4시간 진행됩니다. 세부 일정은 신청 후 카카오로 안내드립니다.' },
    ],
  },
  {
    label: '봉사 기록',
    items: [
      { q: '봉사 기록은 어떻게 확인하나요?', a: '"내 봉사 기록" 페이지에서 이름과 생년월일만 입력하면 즉시 확인할 수 있습니다. 회원가입이 필요 없습니다.' },
      { q: '봉사 증명서(PDF)는 어떻게 발급받나요?', a: '"내 봉사 기록" 페이지에서 기록 조회 후 "봉사 증명서 PDF 발급" 버튼을 클릭하면 새 탭에서 PDF가 열립니다. 다운로드하여 대학교 봉사활동 인증 등에 활용하실 수 있습니다.' },
      { q: '봉사 기록이 조회되지 않습니다.', a: '이름과 생년월일을 정확히 입력했는지 확인해주세요. 신청 시 입력한 정보와 동일해야 합니다. 그래도 안 된다면 카카오 채널 @봉봉단으로 문의해주세요.' },
      { q: '봉사 기록은 얼마나 빨리 등록되나요?', a: '봉사 활동 완료 후 운영진이 당일 또는 다음 날까지 기록을 등록합니다. 3일이 지나도 등록되지 않으면 카카오로 문의해주세요.' },
      { q: '단(단)은 어떻게 올라가나요?', a: '봉사 횟수에 따라 자동으로 단이 올라갑니다. 1단(3회), 2단(5회), 3단(10회), 4단(20회), 5단(30회+). 단 승급 시 카카오로 알림을 드립니다.' },
    ],
  },
  {
    label: '후원',
    items: [
      { q: '후원은 어떻게 할 수 있나요?', a: '현금 후원(계좌이체), 물품 기부(사료·패드·담요·장난감), 재능 기부(사진·디자인·영상·번역) 3가지 방법이 있습니다. "후원하기" 페이지에서 자세히 확인하세요.' },
      { q: '후원금은 어디에 사용되나요?', a: '보호소 물품 지원(45%), 봉사 교통비 지원(25%), 홍보·운영비(20%), 기타 봉사 비용(10%)으로 사용됩니다. 월별 사용 내역은 공지사항에 투명하게 공개됩니다.' },
      { q: '소액도 후원할 수 있나요?', a: '물론입니다! 소액 후원도 큰 힘이 됩니다. 최소 금액 제한이 없으며, 마음이 담긴 어떤 후원도 소중하게 사용됩니다.' },
      { q: '후원자 명단에 이름을 올리고 싶지 않아요.', a: '후원 시 "비공개 처리" 요청을 해주시면 됩니다. 카카오로 "비공개 후원"이라고 알려주세요. 기본적으로 이름은 일부 비공개(○○) 처리됩니다.' },
      { q: '물품 기부는 어떻게 전달하나요?', a: '카카오 채널 @봉봉단으로 먼저 연락하시면 전달 방법을 안내해드립니다. 현장 직접 전달 또는 택배 모두 가능합니다.' },
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
  const [activeCategory, setActiveCategory] = useState('참여 방법');
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
                <a href="mailto:bbd@bbd.or.kr"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: G.navyBtn, color: '#fff', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', boxShadow: '0 4px 16px rgba(30,58,95,0.3)' }}
                >
                  <Mail size={16} /> 이메일 문의
                </a>
              </div>
            </div>
          </RevealDiv>
        </div>
      </div>
    </div>
  );
}