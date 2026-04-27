import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// 아이디 → 내부 이메일 변환 (Supabase Auth는 이메일 필요)
const usernameToEmail = (username: string) => `${username.toLowerCase()}@bbd-member.app`;

app.get("/make-server-a57eb6c5/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── 아이디 중복 확인 ─────────────────────────────────────────────────────────
app.get("/make-server-a57eb6c5/auth/check-username", async (c) => {
  try {
    const username = c.req.query("username");
    if (!username) return c.json({ error: "아이디를 입력해주세요." }, 400);

    const existing = await kv.get(`bbd:member:username:${username.toLowerCase()}`);
    return c.json({ available: !existing });
  } catch (err) {
    console.log("Check username error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 회원가입 ─────────────────────────────────────────────────────────────────
app.post("/make-server-a57eb6c5/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const {
      username,
      password,
      name,
      gender,
      phone,
      birthdate,
      joinPath,
      joinPathDetail,
      kakaoId,
      marketingAgreement,
    } = body;

    // 필수 필드 검증
    if (!username || !password || !name || !gender || !phone || !birthdate || !joinPath || !kakaoId) {
      return c.json({ error: "필수 항목이 누락되었습니다." }, 400);
    }

    // 아이디 형식 검증
    if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(username)) {
      return c.json({ error: "아이디는 영문으로 시작하는 4~20자의 영문/숫자/언더스코어만 가능합니다." }, 400);
    }

    // 아이디 중복 확인
    const existingUsername = await kv.get(`bbd:member:username:${username.toLowerCase()}`);
    if (existingUsername) {
      return c.json({ error: "이미 사용 중인 아이디입니다." }, 409);
    }

    const internalEmail = usernameToEmail(username);

    // Supabase Auth 사용자 생성
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password,
      user_metadata: { name, username },
      email_confirm: true,
    });

    if (authError) {
      console.log("Signup auth error:", authError);
      return c.json({ error: `회원가입 중 오류가 발생했습니다: ${authError.message}` }, 400);
    }

    const userId = authData.user.id;

    // 회원 고유번호 채번
    const counterKey = "bbd:member_counter";
    let counter = 1;
    try {
      const existing = await kv.get(counterKey);
      if (existing) counter = Number(existing) + 1;
    } catch (_) { counter = 1; }
    await kv.set(counterKey, counter);

    const memberNumber = `BBD-2026-${String(counter).padStart(4, '0')}`;

    // 회원 프로필 저장
    const profile = {
      userId,
      memberNumber,
      username: username.toLowerCase(),
      name,
      gender,
      phone,
      birthdate,
      joinPath,
      joinPathDetail: joinPath === '기타' ? (joinPathDetail || '') : '',
      kakaoId,
      marketingAgreement: !!marketingAgreement,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`bbd:member:profile:${userId}`, profile);

    // 아이디 → userId 인덱스
    await kv.set(`bbd:member:username:${username.toLowerCase()}`, userId);

    return c.json({ success: true, memberNumber, name });
  } catch (err) {
    console.log("Signup unexpected error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 내 프로필 조회 ────────────────────────────────────────────────────────────
app.get("/make-server-a57eb6c5/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "인증 토큰이 없습니다." }, 401);

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !user) return c.json({ error: `인증 실패: ${error?.message}` }, 401);

    const profile = await kv.get(`bbd:member:profile:${user.id}`);
    if (!profile) return c.json({ error: "프로필 정보를 찾을 수 없습니다." }, 404);

    return c.json({ profile });
  } catch (err) {
    console.log("Profile fetch error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
