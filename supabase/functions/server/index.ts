import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.ts";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Password"],
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

app.get("/server/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── 아이디 중복 확인 ─────────────────────────────────────────────────────────
app.get("/server/auth/check-username", async (c) => {
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
app.post("/server/auth/signup", async (c) => {
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
    if (!username || !password || !name || !gender || !phone || !birthdate || !kakaoId) {
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
      joinPath: joinPath || '',
      joinPathDetail: joinPathDetail || '',
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
app.get("/server/auth/profile", async (c) => {
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

// ─── 관리자: 전체 회원 목록 조회 ────────────────────────────────────────────────
app.get("/server/admin/members", async (c) => {
  try {
    const adminPassword = c.req.header('X-Admin-Password');
    if (adminPassword !== 'pjb0812') {
      return c.json({ error: "접근 권한이 없습니다." }, 403);
    }

    // KV 저장소에서 모든 프로필 조회
    const members = await kv.getByPrefix('bbd:member:profile:');
    
    // 가입일 기준 내림차순 정렬
    members.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return c.json({ members });
  } catch (err) {
    console.log("Admin members fetch error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 아이디 찾기 ───────────────────────────────────────────────────────────────
app.post("/server/auth/find-id", async (c) => {
  try {
    const { name, phone, kakaoId } = await c.req.json();
    if (!name || !phone || !kakaoId) return c.json({ error: "이름, 연락처, 카카오톡 ID를 모두 입력해주세요." }, 400);

    const targetName = name.trim();
    const targetPhone = phone.trim().replace(/[^0-9]/g, '');
    const targetKakao = kakaoId.trim().toLowerCase();

    // KV 저장소에서 모든 프로필 조회
    const members = await kv.getByPrefix('bbd:member:profile:');
    
    // 일치하는 사용자 찾기
    const user = members.find(m => {
      const dbPhone = (m.phone || '').replace(/[^0-9]/g, '');
      const dbKakao = (m.kakaoId || '').trim().toLowerCase();
      const dbName = (m.name || '').trim();
      return dbName === targetName && dbPhone === targetPhone && dbKakao === targetKakao;
    });
    
    if (!user) {
      return c.json({ error: "입력하신 정보와 일치하는 계정이 없습니다." }, 404);
    }

    return c.json({ username: user.username });
  } catch (err) {
    console.log("Find ID error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 비밀번호 찾기 (초기화) ────────────────────────────────────────────────────
app.post("/server/auth/reset-password", async (c) => {
  try {
    const { username, name, phone, newPassword } = await c.req.json();
    if (!username || !name || !phone || !newPassword) return c.json({ error: "모든 항목을 입력해주세요." }, 400);

    const targetUsername = username.trim().toLowerCase();
    const targetName = name.trim();
    const targetPhone = phone.trim().replace(/[^0-9]/g, '');

    const userId = await kv.get(`bbd:member:username:${targetUsername}`);
    if (!userId) return c.json({ error: "일치하는 계정이 없습니다." }, 404);

    const profile = await kv.get(`bbd:member:profile:${userId}`);
    if (!profile) return c.json({ error: "입력하신 정보가 회원 정보와 일치하지 않습니다." }, 403);

    const dbName = (profile.name || '').trim();
    const dbPhone = (profile.phone || '').replace(/[^0-9]/g, '');

    if (dbName !== targetName || dbPhone !== targetPhone) {
      return c.json({ error: "입력하신 정보가 회원 정보와 일치하지 않습니다." }, 403);
    }

    // Supabase Admin API를 통해 비밀번호 강제 변경
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (updateError) {
      console.log("Password reset error:", updateError);
      return c.json({ error: "비밀번호 변경에 실패했습니다." }, 500);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log("Reset PW error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 내 정보 수정 ─────────────────────────────────────────────────────────────
app.put("/server/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "인증 토큰이 없습니다." }, 401);

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !user) return c.json({ error: `인증 실패: ${error?.message}` }, 401);

    const body = await c.req.json();
    const { name, username, birthdate, phone, kakaoId, gender, marketingAgreement, newPassword } = body;

    const profile = await kv.get(`bbd:member:profile:${user.id}`);
    if (!profile) return c.json({ error: "프로필 정보를 찾을 수 없습니다." }, 404);

    let authUpdateData: any = {};
    const oldUsername = profile.username;

    // 아이디(username) 변경 로직
    if (username && username.toLowerCase() !== oldUsername) {
      const newUsername = username.toLowerCase();
      // 아이디 형식 검증
      if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(newUsername)) {
        return c.json({ error: "아이디는 영문으로 시작하는 4~20자의 영문/숫자/언더스코어만 가능합니다." }, 400);
      }
      // 중복 확인
      const existing = await kv.get(`bbd:member:username:${newUsername}`);
      if (existing) {
        return c.json({ error: "이미 사용 중인 아이디입니다." }, 409);
      }
      
      // KV 인덱스 교체
      await kv.set(`bbd:member:username:${newUsername}`, user.id);
      await kv.del(`bbd:member:username:${oldUsername}`);
      
      profile.username = newUsername;
      const newEmail = usernameToEmail(newUsername);
      authUpdateData.email = newEmail;
      authUpdateData.email_confirm = true;
    }

    // 이름 및 기타 필드 업데이트
    if (name) profile.name = name;
    if (birthdate) profile.birthdate = birthdate;
    if (phone) profile.phone = phone;
    if (kakaoId) profile.kakaoId = kakaoId;
    if (gender) profile.gender = gender;
    if (marketingAgreement !== undefined) profile.marketingAgreement = marketingAgreement;

    await kv.set(`bbd:member:profile:${user.id}`, profile);

    // Supabase Auth 정보 업데이트 (비밀번호, 이메일, 메타데이터)
    if (newPassword) authUpdateData.password = newPassword;
    if (name || username) {
      authUpdateData.user_metadata = { 
        name: profile.name, 
        username: profile.username 
      };
    }

    if (Object.keys(authUpdateData).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user.id, authUpdateData);
      if (authError) {
        return c.json({ error: "정보는 수정되었으나, 인증 계정 동기화에 실패했습니다: " + authError.message }, 500);
      }
    }

    return c.json({ success: true, profile });
  } catch (err) {
    console.log("Profile update error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 회원 탈퇴 (계정 삭제) ───────────────────────────────────────────────────
app.delete("/server/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ error: "인증 토큰이 없습니다." }, 401);

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !user) return c.json({ error: `인증 실패: ${error?.message}` }, 401);

    // 1. KV 저장소에서 프로필 데이터 삭제 시도 (손상된 계정일 수 있으므로 에러 무시)
    const profile = await kv.get(`bbd:member:profile:${user.id}`);
    if (profile) {
      await kv.del(`bbd:member:profile:${user.id}`);
      if (profile.username) {
        await kv.del(`bbd:member:username:${profile.username.toLowerCase()}`);
      }
    }

    // 2. Supabase Auth 계정 삭제
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.log("Delete user error:", deleteError);
      return c.json({ error: "Supabase 계정 삭제에 실패했습니다." }, 500);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log("Profile delete error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 애널리틱스 트래커 (데이터 수집) ──────────────────────────────────────────
app.post("/server/analytics", async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, referrer, deviceData, durationSec, events } = body;
    
    // IP 기반 지역 추출 (Cloudflare / Deno Deploy 헤더)
    const ipCountry = c.req.header('cf-ipcountry') || 'Unknown';
    const today = new Date().toISOString().split('T')[0];

    // 1. 기본 통계 증가 (Atomic)
    // 방문자 수 (이 세션이 오늘 처음인지 판별해야 하지만, 단순화를 위해 하루 첫 이벤트만 카운트)
    // 좀 더 정확히 하려면 sessionId가 오늘 KV에 존재하는지 체크
    const sessionKey = `bbd:analytics:daily:${today}:sessions:${sessionId}`;
    const isNewSession = !(await kv.get(sessionKey));
    if (isNewSession) {
      await kv.set(sessionKey, true); // 세션 기록
      
      // 통계 객체 조회 후 업데이트 (Deno KV upsert)
      const statsKey = `bbd:analytics:daily:${today}:summary`;
      const stats = await kv.get(statsKey) || {
        visitors: 0,
        pageviews: 0,
        durationTotal: 0,
        bounces: 0,
        referrers: {},
        devices: {},
        countries: {},
        events: {}
      };

      stats.visitors += 1;
      
      // 레퍼러 카운트
      let refLabel = 'Direct';
      if (referrer.includes('instagram')) refLabel = 'Instagram';
      else if (referrer.includes('naver')) refLabel = 'Naver';
      else if (referrer.includes('google')) refLabel = 'Google';
      else if (referrer.includes('kakao')) refLabel = 'KakaoTalk';
      else if (referrer) refLabel = 'Other';

      stats.referrers[refLabel] = (stats.referrers[refLabel] || 0) + 1;
      
      // 기기 카운트
      const deviceLabel = deviceData?.device || 'Unknown';
      stats.devices[deviceLabel] = (stats.devices[deviceLabel] || 0) + 1;

      // 국가 카운트
      stats.countries[ipCountry] = (stats.countries[ipCountry] || 0) + 1;

      await kv.set(statsKey, stats);
    }

    // 2. 이벤트 배치 처리
    const statsKey = `bbd:analytics:daily:${today}:summary`;
    const stats = await kv.get(statsKey);
    if (stats) {
      let pageviews = 0;
      let isBounce = true;

      for (const ev of events) {
        if (ev.type === 'pageview') {
          pageviews++;
        } else if (ev.type === 'click' && ev.data?.isConversion) {
          const action = ev.data.actionName;
          stats.events[action] = (stats.events[action] || 0) + 1;
        }
      }
      
      if (pageviews > 1) isBounce = false;

      stats.pageviews += pageviews;
      // durationSec는 세션 종료 시점에 전송되므로 덮어씌움 처리
      // 단, 같은 세션에서 여러 번 쏠 수 있으므로 기존 누적에 추가하면 안되고 차이만 더해야 함.
      // 간소화를 위해 생략하거나 세션별 체류시간을 따로 저장.

      await kv.set(statsKey, stats);
    }

    // 3. 히트맵 좌표 저장 (별도 키에 어펜드)
    // 대규모 트래픽 시 KV 리스트 형태가 좋지만 간단히 배열로 저장
    const heatmapKey = `bbd:analytics:daily:${today}:heatmap`;
    let heatmapData = await kv.get(heatmapKey) || [];
    const clickEvents = events.filter((e: any) => e.type === 'click');
    if (clickEvents.length > 0) {
      // 용량 방지를 위해 하루 최대 5000개만 저장
      if (heatmapData.length < 5000) {
        const newDots = clickEvents.map((e: any) => ({
          x: e.data.xPercent,
          y: e.data.y, // 절대 픽셀
          path: e.path,
          device: deviceData?.device
        }));
        heatmapData = heatmapData.concat(newDots);
        await kv.set(heatmapKey, heatmapData);
      }
    }

    return c.json({ success: true });
  } catch (err) {
    console.log("Analytics save error:", err);
    return c.json({ error: `서버 오류` }, 500);
  }
});

// ─── 애널리틱스 통계 조회 API (관리자용) ──────────────────────────────────
app.get("/server/analytics/stats", async (c) => {
  try {
    const adminPassword = c.req.header('X-Admin-Password');
    if (adminPassword !== 'pjb0812') {
      return c.json({ error: "접근 권한이 없습니다." }, 403);
    }
    
    const days = Number(c.req.query("days") || 7);
    const result: any = {
      trend: [],
      referrers: {},
      devices: {},
      countries: {},
      events: {},
      heatmap: []
    };

    // 오늘부터 과거 days 만큼 데이터 수집
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const stats = await kv.get(`bbd:analytics:daily:${dateStr}:summary`);
      if (stats) {
        result.trend.unshift({
          date: dateStr,
          visitors: stats.visitors || 0,
          pageviews: stats.pageviews || 0
        });

        // 합산
        for (const [k, v] of Object.entries(stats.referrers || {})) result.referrers[k] = (result.referrers[k] || 0) + (v as number);
        for (const [k, v] of Object.entries(stats.devices || {})) result.devices[k] = (result.devices[k] || 0) + (v as number);
        for (const [k, v] of Object.entries(stats.countries || {})) result.countries[k] = (result.countries[k] || 0) + (v as number);
        for (const [k, v] of Object.entries(stats.events || {})) result.events[k] = (result.events[k] || 0) + (v as number);
      } else {
        result.trend.unshift({ date: dateStr, visitors: 0, pageviews: 0 });
      }

      // 오늘자 히트맵만 가져오기 (성능 이슈 방지)
      if (i === 0) {
        const heatmap = await kv.get(`bbd:analytics:daily:${dateStr}:heatmap`);
        if (heatmap) result.heatmap = heatmap;
      }
    }

    return c.json(result);
  } catch (err) {
    console.log("Analytics fetch error:", err);
    return c.json({ error: `서버 오류` }, 500);
  }
});
// ─── 알림톡 발송 (웹 자체 백엔드) ──────────────────────────────────────────────────
app.post("/server/alimtalk/send", async (c) => {
  try {
    const { phone, userName, volunteerDate } = await c.req.json();
    
    if (!phone || !userName || !volunteerDate) {
      return c.json({ error: "필수 데이터(phone, userName, volunteerDate)가 누락되었습니다." }, 400);
    }

    const API_KEY = 'NCSF27E2PRZLD2RJ';
    const API_SECRET = '5XBABORHQJFEDT3SJYUOGWOXZ2WRDH8M';
    const PF_ID = 'KA01PF260220043757420jLYwT98C7yO'; 
    const TEMPLATE_ID = 'KA01TP260319050552072xv1PWUJb6Rm';
    
    const payload = {
      "message": {
        "to": phone,
        "from": "01050646613",
        "text": `[봉봉단] ${userName} 단원님, ${volunteerDate} 집결 신청이 완료되었소!`,
        "kakaoOptions": {
          "pfId": PF_ID,
          "templateId": TEMPLATE_ID,
          "variables": {
            "#{이름}": userName,
            "#{봉사명}": volunteerDate
          }
        }
      }
    };

    const isoDate = new Date().toISOString();
    const salt = Math.random().toString(36).substring(2, 12);

    // HMAC SHA-256 서명 생성 (Web Crypto API 사용)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(API_SECRET);
    const msgData = encoder.encode(isoDate + salt);
    
    const key = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, msgData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const url = 'https://api.solapi.com/messages/v4/send';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `HMAC-SHA256 apiKey=${API_KEY}, date=${isoDate}, salt=${salt}, signature=${signature}`
      },
      body: JSON.stringify(payload)
    };

    const res = await fetch(url, options);
    const responseText = await res.text();
    let isSuccess = res.ok;
    
    // KV 로그 저장용 데이터 구성
    const logData = {
      timestamp: isoDate,
      phone,
      userName,
      volunteerDate,
      success: isSuccess,
      response: responseText
    };

    // KV에 저장 (접두사 bbd:alimtalk:log:)
    const logId = Date.now() + salt;
    await kv.set(`bbd:alimtalk:log:${logId}`, logData);

    if (!isSuccess) {
      console.log("Alimtalk Solapi Error: ", responseText);
      return c.json({ error: "솔라피 발송 실패", details: responseText }, 500);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log("Alimtalk trigger error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── 알림톡 발송 현황 조회 API (관리자용) ───────────────────────────────────────
app.get("/server/alimtalk/logs", async (c) => {
  try {
    const adminPassword = c.req.header('X-Admin-Password');
    if (adminPassword !== 'pjb0812') {
      return c.json({ error: "접근 권한이 없습니다." }, 403);
    }
    
    // KV 저장소에서 모든 알림톡 로그 조회
    const logs = await kv.getByPrefix('bbd:alimtalk:log:');
    
    // 최신순 정렬
    logs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());

    return c.json({ logs });
  } catch (err) {
    console.log("Alimtalk logs fetch error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
