import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, Session, User } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { prefetchRecord } from '../../utils/apiCache';

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
const SERVER = `https://${projectId}.supabase.co/functions/v1/server`;

// 아이디 → 내부 이메일 변환 (서버와 동일 규칙)
const usernameToEmail = (username: string) => `${username.toLowerCase()}@bbd-member.app`;

export interface MemberProfile {
  userId: string;
  memberNumber: string;
  username: string;
  name: string;
  gender: string;
  phone: string;
  birthdate: string;
  joinPath: string;
  joinPathDetail?: string;
  kakaoId: string;
  marketingAgreement: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: MemberProfile | null;
  session: Session | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  needsOnboarding: boolean;
  profileError: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  // needsOnboarding은 오직 유저가 존재하고, 프로필이 없으며(null), 서버에서 에러(500등)가 난 게 아닐 때(404) 작동합니다.
  const needsOnboarding = !!user && !profile && !loading && !profileError;

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${SERVER}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setProfileError(false);
        if (data.profile) {
          prefetchRecord(data.profile.name, data.profile.phone, data.profile.birthdate).catch(() => {});
        }
      } else {
        setProfile(null);
        // 404면 정보가 없는 것. 그 외 에러면 일시적 통신 오류로 간주
        if (res.status === 404) {
          setProfileError(false);
        } else {
          setProfileError(true);
        }
      }
    } catch (err) {
      console.log("Profile fetch error:", err);
      setProfile(null);
      setProfileError(true);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        fetchProfile(session.access_token).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        fetchProfile(session.access_token);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<{ error?: string }> => {
    const email = usernameToEmail(username);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
      }
      return { error: `로그인 오류: ${error.message}` };
    }
    if (data.session?.access_token) {
      await fetchProfile(data.session.access_token);
    }
    return {};
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) {
      console.error("Google sign in error:", error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, needsOnboarding, profileError, login, logout, refreshProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { supabase };
