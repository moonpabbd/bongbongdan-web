import { Outlet, useLocation, ScrollRestoration } from 'react-router';
import { useEffect, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
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
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [pathname, search]);

  useEffect(() => {
    prefetchRankings().catch(() => {});
  }, []);

  const hideFooter = NO_FOOTER_PATHS.includes(pathname);

  return (
    <HelmetProvider>
      <AuthProvider>
        <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: '#FDFCFA', minHeight: '100vh' }}>
          <ScrollRestoration />
          <Navbar />
          <main>
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Loading...</div>}>
              <Outlet />
            </Suspense>
          </main>
          {!hideFooter && <Footer />}
          {!hideFooter && <KakaoFloat />}
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}