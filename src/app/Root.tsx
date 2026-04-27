import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { KakaoFloat } from './components/KakaoFloat';
import { AuthProvider } from './context/AuthContext';

const NO_FOOTER_PATHS = ['/login', '/signup'];

export function Root() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const hideFooter = NO_FOOTER_PATHS.includes(pathname);

  return (
    <AuthProvider>
      <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: '#FDFCFA', minHeight: '100vh' }}>
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