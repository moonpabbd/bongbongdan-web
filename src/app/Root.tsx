import { Outlet, useLocation, ScrollRestoration } from 'react-router';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { KakaoFloat } from './components/KakaoFloat';
import { AuthProvider } from './context/AuthContext';
import { useAnalytics } from './hooks/useAnalytics';
import { prefetchRankings } from '../utils/apiCache';

const NO_FOOTER_PATHS = ['/login', '/signup'];

export function Root() {
  const location = useLocation();
  const { pathname, search } = location;
  useAnalytics();

  useEffect(() => {
    // React Router DOM 렌더링 후 스크롤이 확실히 적용되도록 약간의 지연(setTimeout)을 줍니다.
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [pathname, search]);

  // 홈페이지 진입 시점부터 랭킹 데이터 미리 수집 시작
  useEffect(() => {
    prefetchRankings().catch(() => {});
  }, []);

  const hideFooter = NO_FOOTER_PATHS.includes(pathname);

  return (
    <AuthProvider>
      <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: '#FDFCFA', minHeight: '100vh' }}>
        <ScrollRestoration />
        <Navbar />
        <main>
          <Outlet />
        </main>
        {!hideFooter && <Footer />}
        {!hideFooter && <KakaoFloat />}
      </div>
    </AuthProvider>
  );
}