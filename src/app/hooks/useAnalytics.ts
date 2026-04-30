import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { projectId } from '/utils/supabase/info';

const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

interface AnalyticsEvent {
  type: 'pageview' | 'click' | 'scroll';
  path: string;
  timestamp: string;
  data: any;
}

// 고유 세션 ID 생성 (세션스토리지 활용)
const getSessionId = () => {
  let sid = sessionStorage.getItem('bbd_session_id');
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('bbd_session_id', sid);
  }
  return sid;
};

// 기기 및 브라우저 파악 유틸
const getDeviceData = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  if (ua.includes('KAKAOTALK')) browser = 'KakaoTalk';
  else if (ua.includes('Instagram')) browser = 'Instagram';
  else if (ua.includes('Naver')) browser = 'Naver';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

  let os = 'Unknown';
  if (ua.includes('Mac OS')) os = 'Mac OS';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';

  return {
    userAgent: ua,
    browser,
    os,
    device: /Mobile|Android|iP(hone|od|ad)/i.test(ua) ? 'Mobile' : 'Desktop',
    resolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  };
};

export function useAnalytics() {
  const location = useLocation();
  const eventsBuffer = useRef<AnalyticsEvent[]>([]);
  const lastScrollDepth = useRef<number>(0);
  const sessionStartTime = useRef<number>(Date.now());
  const pathEnterTime = useRef<number>(Date.now());

  // 이벤트 버퍼에 추가
  const logEvent = (type: AnalyticsEvent['type'], data: any) => {
    if (location.pathname.startsWith('/admin')) return;
    eventsBuffer.current.push({
      type,
      path: location.pathname,
      timestamp: new Date().toISOString(),
      data
    });
    
    // 버퍼가 20개를 넘으면 강제 전송
    if (eventsBuffer.current.length >= 20) flushEvents();
  };

  // 서버로 데이터 전송 (Beacon 또는 fetch)
  const flushEvents = (isUnload = false) => {
    if (eventsBuffer.current.length === 0) return;

    const payload = {
      sessionId: getSessionId(),
      referrer: document.referrer,
      deviceData: getDeviceData(),
      durationSec: Math.floor((Date.now() - sessionStartTime.current) / 1000),
      events: [...eventsBuffer.current]
    };

    eventsBuffer.current = []; // 비우기

    const url = `${SERVER}/analytics`;
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

    if (isUnload && navigator.sendBeacon) {
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(e => console.error('Analytics error:', e));
    }
  };

  // 1. 페이지 뷰 추적 및 주기적 전송
  useEffect(() => {
    pathEnterTime.current = Date.now();
    lastScrollDepth.current = 0;

    logEvent('pageview', { title: document.title });

    // 3초마다 버퍼에 쌓인 이벤트 서버로 자동 전송 (실시간 반영)
    const interval = setInterval(() => {
      flushEvents();
    }, 3000);

    return () => {
      clearInterval(interval);
      flushEvents(); // 페이지 이동 시 남은 이벤트 전송
    };
  }, [location.pathname]);

  // 2. 클릭 히트맵 추적
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 너무 세세한 클릭보다는 의미있는 버튼이나 전체 좌표 수집
      // 히트맵용 X, Y (뷰포트 기준 비율로 저장하면 반응형 처리가 편함)
      const xPercent = Number(((e.clientX / window.innerWidth) * 100).toFixed(2));
      const yPercent = Number(((e.clientY / window.innerHeight) * 100).toFixed(2));
      
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      
      // 전환 액션 체크 (봉사 신청, 카카오톡 등) 및 범용 버튼 클릭 추적
      let isConversion = false;
      let actionName = '';
      
      const aTag = target.closest('a');
      const btnTag = target.closest('button');

      if (aTag && (aTag.href.includes('forms.gle') || aTag.href.includes('docs.google.com') || aTag.getAttribute('href') === '/apply')) {
        isConversion = true;
        actionName = 'Apply_Volunteer';
      } else if (aTag && aTag.href.includes('pf.kakao.com')) {
        isConversion = true;
        actionName = 'Kakao_Inquiry';
      } else if (btnTag || aTag) {
        // 일반 버튼이나 링크 클릭 시 텍스트 추출
        const text = (btnTag?.innerText || aTag?.innerText || '').trim().substring(0, 30);
        if (text) actionName = text;
      }


      logEvent('click', {
        x: e.clientX,
        y: e.clientY + scrollY, // 절대 Y 위치
        xPercent,
        yPercent,
        totalHeight,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        targetTag: target.tagName,
        targetText: target.innerText?.substring(0, 30) || '',
        isConversion,
        actionName
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [location.pathname]);

  // 3. 스크롤 뎁스 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      if (documentHeight <= 0) return;

      const currentDepth = Math.floor(scrollPercent);
      if (currentDepth > lastScrollDepth.current) {
        for (let m = lastScrollDepth.current + 1; m <= currentDepth; m++) {
          if (m > 100) break;
          logEvent('scroll', { depth: m });
        }
        lastScrollDepth.current = currentDepth;
      }
    };

    let scrollTimeout: any;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 500); // 0.5초마다 체크
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [location.pathname]);

  // 4. 이탈 시 배치 전송
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushEvents(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return null;
}
