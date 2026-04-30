import { Outlet, useLocation, useNavigate, ScrollRestoration, Navigate } from 'react-router';
import { useEffect, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { KakaoFloat } from './components/KakaoFloat';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useAnalytics } from './hooks/useAnalytics';
import { prefetchRankings } from '../utils/apiCache';

const NO_FOOTER_PATHS = ['/login', '/signup', '/onboarding'];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { needsOnboarding, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      sessionStorage.removeItem('oauth_pending');
    }
  }, [loading]);

  // 아직 로딩 중일 때: OAuth 콜백 처리 중이면 홈 화면이 번쩍이는 것을 막기 위해 빈 화면 유지
  if (loading) {
    const isOauthCallback = typeof window !== 'undefined' && 
      (window.location.hash.includes('access_token=') || sessionStorage.getItem('oauth_pending') === 'true');
      
    if (isOauthCallback) {
      return <div style={{ minHeight: '100vh', background: '#121F33' }} />;
    }
    return <>{children}</>;
  }

  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

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
        <RouteGuard>
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
        </RouteGuard>
      </AuthProvider>
    </HelmetProvider>
  );
}