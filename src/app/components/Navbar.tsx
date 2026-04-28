import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, User, LogOut, ChevronDown, PawPrint, ClipboardList, Shield, Star, Users, Clock, Award } from 'lucide-react';
import { logoImg } from '../imageAssets';
import { G } from '../styles/gradients';
import { useAuth } from '../context/AuthContext';

const APPLY_URL = '/apply';

const navItems = [
  {
    label: '단체 소개',
    path: '/about',
    children: [
      { label: '봉사 문파', path: '/about?tab=intro', Icon: Shield },
      { label: '직급·직책', path: '/about?tab=ranks', Icon: Award },
      { label: '조직도', path: '/about?tab=orgchart', Icon: Users },
    ],
  },
  {
    label: '유기견 봉사',
    path: '/activities',
    children: [
      { label: '봉사 안내', path: '/activities?tab=method', Icon: ClipboardList },
      { label: '보호소 소개', path: '/activities?tab=shelters', Icon: PawPrint },
    ],
  },
  { label: 'FAQ', path: '/faq' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';
  const isSolid = scrolled || !isHome;

  const headerBg = isSolid ? 'rgba(255, 255, 255, 0.98)' : 'transparent';
  const headerBorder = scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none';
  const textColor = isSolid ? '#1E3A5F' : 'rgba(255,255,255,0.85)';
  const activeTextColor = '#C8963E';
  const logoFilter = isSolid ? 'none' : 'brightness(0) invert(1)';
  const dropdownBg = isSolid ? '#ffffff' : 'linear-gradient(145deg, #0D2240, #1A3560)';
  const dropdownBorder = isSolid ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(200,150,62,0.28)';
  const dropdownTextColor = isSolid ? '#4B5563' : 'rgba(255,255,255,0.78)';
  const dropdownHoverBg = isSolid ? 'rgba(0,0,0,0.04)' : 'rgba(200,150,62,0.14)';
  const userBtnBg = isSolid ? 'rgba(30,58,95,0.06)' : 'rgba(200,150,62,0.12)';
  const userBtnBorder = isSolid ? '1px solid rgba(30,58,95,0.15)' : '1px solid rgba(200,150,62,0.3)';
  const userBtnColor = isSolid ? '#1E3A5F' : '#F5C875';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: headerBg,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
          borderBottom: headerBorder,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={logoImg} alt="봉봉단 BBD" style={{ height: '40px', objectFit: 'contain', filter: logoFilter }} />
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const hasChildren = !!item.children;
              const isHovered = hoveredNav === item.label;

              return (
                <div
                  key={item.path}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: active ? activeTextColor : textColor,
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: active ? '700' : '500',
                      letterSpacing: '0.3px',
                      borderBottom: active ? '2px solid #C8963E' : '2px solid transparent',
                      paddingBottom: '2px',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                  >
                    {item.label}
                    {hasChildren && (
                      <ChevronDown
                        size={14}
                        style={{
                          transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </Link>

                  {/* 드롭다운 */}
                  {hasChildren && (
                    <>
                      {/* 투명 브릿지: 트리거~드롭다운 사이 간격을 hover 영역으로 채움 */}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '-20px',
                        right: '-20px',
                        height: '20px',
                        background: 'transparent',
                      }} />
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 16px)',
                          left: '50%',
                          background: dropdownBg,
                          border: dropdownBorder,
                          borderRadius: '16px',
                          padding: '8px',
                          minWidth: '168px',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
                          zIndex: 200,
                          opacity: isHovered ? 1 : 0,
                          pointerEvents: isHovered ? 'auto' : 'none',
                          transform: isHovered
                            ? 'translateX(-50%) translateY(0)'
                            : 'translateX(-50%) translateY(-6px)',
                          transition: 'opacity 0.2s ease, transform 0.2s ease',
                        }}
                      >
                        {/* 말풍선 삼각형 */}
                        <div style={{
                          position: 'absolute',
                          top: '-6px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '12px',
                          height: '6px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            background: isSolid ? '#ffffff' : '#1A3560',
                            border: dropdownBorder,
                            transform: 'rotate(45deg)',
                            margin: '3px auto 0',
                          }} />
                        </div>

                        {item.children!.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '11px 14px',
                              color: dropdownTextColor,
                              textDecoration: 'none',
                              fontSize: '14px',
                              fontWeight: '500',
                              borderRadius: '10px',
                              transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = dropdownHoverBg;
                              (e.currentTarget as HTMLElement).style.color = activeTextColor;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = 'none';
                              (e.currentTarget as HTMLElement).style.color = dropdownTextColor;
                            }}
                          >
                            <child.Icon size={15} color="#C8963E" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* 봉사 신청 버튼 (데스크탑) */}
            <Link
              to={APPLY_URL}
              rel="noopener noreferrer"
              style={{
                background: G.goldBtn,
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 4px 16px rgba(200,150,62,0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(200,150,62,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(200,150,62,0.35)';
              }}
            >
              집결 신청
            </Link>

            {/* 로그인/사용자 메뉴 */}
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: userBtnBg,
                    border: userBtnBorder,
                    borderRadius: '10px',
                    padding: '8px 14px',
                    color: userBtnColor,
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <User size={16} />
                  마이페이지
                  <ChevronDown size={14} style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: dropdownBg,
                    border: dropdownBorder,
                    borderRadius: '14px',
                    padding: '8px',
                    minWidth: '180px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                    zIndex: 200,
                  }}>
                    {profile && (
                      <div style={{ padding: '10px 12px', marginBottom: '4px', borderBottom: isSolid ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)' }}>
                        <p style={{ color: isSolid ? '#1E3A5F' : '#F5C875', fontSize: '13px', fontWeight: '700' }}>{profile.name}</p>
                      </div>
                    )}
                    {import.meta.env.DEV && <DropdownItem to="/my-record" label="내 봉사 기록" isSolid={isSolid} />}
                    <DropdownItem to="/profile-edit" label="내 정보 변경" isSolid={isSolid} />
                    {import.meta.env.DEV && <DropdownItem to="/members" label="회원 전용" isSolid={isSolid} />}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        background: 'none',
                        border: 'none',
                        color: isSolid ? '#ef4444' : 'rgba(255,100,80,0.85)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(194,75,59,0.15)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={15} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  color: textColor,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: isSolid ? '1px solid rgba(30,58,95,0.2)' : '1px solid rgba(255,255,255,0.15)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = isSolid ? '#000' : '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = isSolid ? 'rgba(30,58,95,0.4)' : 'rgba(255,255,255,0.35)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = textColor;
                  (e.currentTarget as HTMLElement).style.borderColor = isSolid ? 'rgba(30,58,95,0.2)' : 'rgba(255,255,255,0.15)';
                }}
              >
                로그인
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: '8px' }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100vh',
          background: 'linear-gradient(160deg, #060F1E, #1E3A5F)',
          zIndex: 200,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: '80px 32px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={() => setOpen(false)}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
        >
          <X size={24} />
        </button>

        {user && profile && (
          <div style={{
            background: 'rgba(200,150,62,0.10)',
            border: '1px solid rgba(200,150,62,0.25)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '8px',
          }}>
            <p style={{ color: '#F5C875', fontSize: '14px', fontWeight: '700' }}>{profile.name} 단원</p>
          </div>
        )}

        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path}>
              <Link
                to={item.path}
                style={{
                  color: active ? '#C8963E' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  fontSize: '17px',
                  fontWeight: active ? '700' : '500',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'block',
                }}
              >
                {item.label}
              </Link>
              {item.children && (
                <div style={{ paddingLeft: '16px', paddingTop: '4px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {item.children.map(child => (
                    <Link
                      key={child.path}
                      to={child.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.55)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        padding: '8px 0',
                      }}
                    >
                      <child.Icon size={13} color="#C8963E" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* 봉사 신청 버튼 (모바일) */}
        <Link
          to={APPLY_URL}
          rel="noopener noreferrer"
          className="hover-scale"
          style={{
            marginTop: '16px',
            background: G.goldBtn,
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '700',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          집결 신청하기
        </Link>

        <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 로그인/사용자 메뉴 */}
          {user ? (
            <>
              {import.meta.env.DEV && <Link to="/my-record" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' }}>내 봉사 기록</Link>}
              <Link to="/profile-edit" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' }}>내 정보 변경</Link>
              {import.meta.env.DEV && <Link to="/members" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' }}>회원 전용</Link>}
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,100,80,0.8)', fontSize: '14px', cursor: 'pointer', padding: '0', textAlign: 'left' }}
              >
                <LogOut size={14} /> 로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' }}>로그인</Link>
          )}
        </div>
      </div>
    </>
  );
}

function DropdownItem({ to, label, isSolid }: { to: string; label: string; isSolid?: boolean }) {
  const textColor = isSolid ? '#4B5563' : 'rgba(255,255,255,0.75)';
  const hoverBg = isSolid ? 'rgba(0,0,0,0.04)' : 'rgba(200,150,62,0.12)';
  const hoverColor = isSolid ? '#1E3A5F' : '#F5C875';

  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '10px 12px',
        color: textColor,
        textDecoration: 'none',
        fontSize: '14px',
        borderRadius: '8px',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = hoverBg;
        (e.currentTarget as HTMLElement).style.color = hoverColor;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'none';
        (e.currentTarget as HTMLElement).style.color = textColor;
      }}
    >
      {label}
    </Link>
  );
}