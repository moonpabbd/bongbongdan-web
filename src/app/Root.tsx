import { Outlet, useLocation, useNavigate, ScrollRestoration } from 'react-router';
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
  const { needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (needsOnboarding && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    } else if (!needsOnboarding && location.pathname === '/onboarding') {
      navigate('/', { replace: true });
    }
  }, [needsOnboarding, location.pathname, navigate]);

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