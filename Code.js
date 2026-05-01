const SPREADSHEET_ID = "14DpKkbU7U8TE0nSe7My0OentAJbg-06cy0NesAwBeGk"; 
const SEASON_YEAR = 2026;   // 매년 초에 이 값만 교체

// ── Solapi 알림톡 설정 ──
const SOLAPI_API_KEY     = 'NCSF27E2PRZLD2RJ';
const SOLAPI_API_SECRET  = '5XBABORHQJFEDT3SJYUOGWOXZ2WRDH8M';
const SOLAPI_PF_ID       = 'KA01PF260220043757420jLYwT98C7yO';
const SOLAPI_CANCEL_TEMPLATE_ID  = 'KA01TP260319051252554RUTb2PCmxJM';
const SOLAPI_LEADER_TEMPLATE_ID  = 'KA01TP260319053226307zqWRbC3lzWJ';
const SOLAPI_GATHERING_APPLY_TEMPLATE_ID = 'KA01TP2605010614275575G5WTtJ6WRe';
const SOLAPI_SENDER      = '01050646613';

// 직급 기준표
const TIER_THRESHOLDS = [
  { min: 200, name: '종사' },
  { min: 100, name: '원로' },
  { min: 50,  name: '사형/사자' },
  { min: 20,  name: '고참 단원' },
  { min: 10,  name: '숙련 단원' },
  { min: 5,   name: '정식 단원' },
  { min: 1,   name: '입문 단원' },
  { min: 0,   name: '예비 단원' }
];

// 컬럼 인덱스 (단원 DB용)
const COL = {
  NAME: 1,           // B
  PHONE: 3,          // D
  BIRTH: 4,          // E
  COUNT_ALL: 10,     // K
  TIER: 11,          // L
  TOTAL_COUNT: 12,   // M
  COUNT_SEASON: 24   // Y
};

// ==========================================
// 1. GET 통신 (내 기록, 명예의 전당, 정원관리 조회)
// ==========================================
function doGet(e) {
  try {
    var action = e.parameter.action;
    
    // (A) 내 봉사 기록 조회 API
    if (action === 'getRecord') {
      var name = e.parameter.name || "";
      var phone = e.parameter.phone || "";
      var birthdate = e.parameter.birthdate || "";
      var result = searchMemberInfo(name, phone, birthdate);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    
    // (B) 명예의 전당 랭킹만 조회 API
    if (action === 'getRankings') {
      var rankingAll = getRankingData_('all');
      var rankingSeason = getRankingData_('season');
      var rankingsObj = {
        all: rankingAll,
        season: rankingSeason
      };
      return ContentService.createTextOutput(JSON.stringify({ rankings: rankingsObj })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // (C) 기존 정원관리 조회 API (action 파라미터가 없을 때 기본 작동)
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("정원관리");
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ error: "정원관리 시트 없음" })).setMimeType(ContentService.MimeType.JSON);
    
    var values = sheet.getRange("B2:E15").getValues();
    var dates = [];
    
    for (var i = 0; i < values.length; i++) {
      var n = String(values[i][0] || "").trim();
      if (n !== "") {
        dates.push({
          name: n,
          capacity: Number(values[i][1]) || 0,
          current: Number(values[i][2]) || 0,
          remaining: Number(values[i][3]) || 0
        });
      }
    }
    // [모임 활동 리스트 가져오기 추가]
    var gatherSheet = ss.getSheetByName("봉사 외 활동 관련");
    var gatherings = [];
    if (gatherSheet) {
      // K4:T 까지 데이터 (K가 11번째 컬럼이므로 getRange(4, 11, 마지막행, 10))
      var lastRow = gatherSheet.getLastRow();
      if (lastRow >= 4) {
        var gValues = gatherSheet.getRange(4, 11, lastRow - 3, 10).getValues();
        for (var j = 0; j < gValues.length; j++) {
          var gName = String(gValues[j][0] || "").trim(); // K: 모임명
          if (gName !== "") {
            gatherings.push({
              name: gName,
              leader: String(gValues[j][1] || "").trim(), // L: 선봉장
              fee: String(gValues[j][2] || "").trim(), // M: 참가비
              minCount: Number(gValues[j][3]) || 0, // N: 최소 봉사 횟수
              capacity: Number(gValues[j][4]) || 0, // O: 모집 인원
              current: Number(gValues[j][5]) || 0, // P: 신청 인원
              remaining: Number(gValues[j][6]) || 0, // Q: 잔여 인원
              location: String(gValues[j][7] || "").trim(), // R: 장소
              notice: String(gValues[j][8] || "").trim(), // S: 안내사항
              scheduleDesc: String(gValues[j][9] || "").trim() // T: 일정 설명
            });
          }
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ dates: dates, gatherings: gatherings })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 2. POST 통신 (봉사 집결 신청 제출, 취소 및 변경 API 처리)
// ==========================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // [NEW] 봉사 집결 취소 API 요청인 경우
    if (data.action === 'cancelVolunteer') {
      return handleCancelVolunteer(data);
    }
    
    // [NEW] 봉사 집결 일정 변경 API 요청인 경우
    if (data.action === 'changeVolunteer') {
      return handleChangeVolunteer(data);
    }
    
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("봉사 응답 시트(텍스트 수정X)"); 
    
    var now = new Date();
    var tz = ss.getSpreadsheetTimeZone() || "Asia/Seoul";
    var year = Utilities.formatDate(now, tz, "yyyy");
    var month = parseInt(Utilities.formatDate(now, tz, "MM"), 10);
    var day = parseInt(Utilities.formatDate(now, tz, "dd"), 10);
    var hour24 = parseInt(Utilities.formatDate(now, tz, "HH"), 10);
    var min = Utilities.formatDate(now, tz, "mm");
    var sec = Utilities.formatDate(now, tz, "ss");
    var ampm = hour24 >= 12 ? "오후" : "오전";
    var hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    var timestamp = year + ". " + month + ". " + day + " " + ampm + " " + hour12 + ":" + min + ":" + sec;
    var formatArray = function(arr) { return (!arr) ? "" : (Array.isArray(arr) ? arr.join(', ') : arr); };
    var discovery = formatArray(data.discoverySource);
    if (discovery.indexOf("직접 입력") !== -1 && data.discoveryOther) {
      discovery = discovery.replace("직접 입력", "직접 입력 (" + data.discoveryOther + ")");
    }
    
    var category = data.category || "유기견 봉사"; 
    
    // [NEW] 모임 활동인 경우 분기 처리
    if (category === "모임 활동") {
      var gatheringSheet = ss.getSheetByName("모임 집결 응답폼");
      if (!gatheringSheet) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "'모임 집결 응답폼' 시트를 찾을 수 없습니다." })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // 구글폼 문항 순서 매핑
      var gatherRow = [
        timestamp,
        data.q1 || "", // B (1. 모임명)
        data.name || "", // C (2. 성함)
        data.gender || "", // D (3. 성별)
        data.phone ? "'" + data.phone : "", // E (4. 연락처)
        data.birthdate || "", // F (5. 생년월일)
        data.q6 || "", // G (6. 봉사 신청 횟수)
        data.q7 || "", // H (7. 카카오톡 ID)
        data.q8 ? "네, 동의합니다." : "", // I (8. 개인정보 동의)
        data.q9 === "동의" ? "동의합니다." : (data.q9 ? "동의하지 않습니다." : ""), // J (9. SNS 동의)
        "", // K (입금 확인 - 관리자용)
        data.q10 ? "네, 확인했으며 동의합니다." : "", // L (10. 환불 규정 동의)
        data.q11 ? "네, 본인 이름으로 입금 완료했습니다." : "", // M (11. 입금 여부)
        data.q12 || "" // N (12. 문의사항)
      ];
      
      gatheringSheet.insertRowAfter(1);
      var gatherRange = gatheringSheet.getRange(2, 1, 1, gatherRow.length);
      gatherRange.setValues([gatherRow]);
      gatherRange.setFontWeight("normal");
      gatheringSheet.getRange(2, 6).setHorizontalAlignment("right");
      
      // 신청자 본인에게 알림톡 발송
      if (data.phone) {
        sendAlimtalk(data.phone, SOLAPI_GATHERING_APPLY_TEMPLATE_ID, {
          '#{이름}': data.name || "미상",
          '#{모임명}': data.q1 || "미상",
          '#{봉사명}': data.q1 || "미상"
        });
      }
      
      // 운영진 이메일 알림 발송
      try {
        var emailTitle = "[모임 활동] " + (data.name || "미상") + " 단원님 - " + (data.q1 || "미상") + " 신청";
        var emailBody = "새로운 모임 활동 신청이 접수되었습니다!\n\n" +
                        "▶ 모임명: " + (data.q1 || "미상") + "\n" +
                        "▶ 신청자: " + (data.name || "미상") + " (" + (data.gender || "미상") + ")\n" +
                        "▶ 연락처: " + (data.phone || "미상") + "\n\n" +
                        "자세한 응답 내역은 '모임 집결 응답폼' 시트에서 확인해주세요.\n\n" +
                        "- 봉봉단 알림봇 -";
                        
        GmailApp.sendEmail("moonpa.bbd@gmail.com", emailTitle, emailBody, {
          name: "봉봉단 알림봇"
        });
      } catch (emailErr) {}
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 유기견 봉사일 경우 기존 로직
    var row = [
      timestamp, data.date || "", data.name || "", data.gender || "", data.phone ? "'" + data.phone : "", data.birthdate || "", data.isFirstTime || "", discovery, data.discoveryNickname || "", data.discoveryRecommender || "", data.q8 || "", data.q9 || "", data.q9_1 || "", data.q10 || "", data.q11 ? "네, 확인했으며 동의합니다." : "", data.q12 ? "위 내용을 확인하였으며, 참가비 환불 불가에 동의합니다." : "", data.q13 ? "네, 본인 이름으로 입금 완료했습니다." : "", data.q14 || "", data.q15 === "동의" ? "동의합니다." : (data.q15 ? "동의하지 않습니다." : ""), data.q16 || "", data.q17 ? "네, 동의합니다." : ""
    ];
    
    sheet.insertRowBefore(2); 
    var applyRange = sheet.getRange(2, 1, 1, row.length);
    applyRange.setValues([row]); 
    applyRange.setFontWeight("normal");
    sheet.getRange(2, 6).setHorizontalAlignment("right");
    
    var userName = data.name || "";
    var volunteerDate = data.date || "";
    
    // 운영진 이메일 알림 발송
    if (userName && volunteerDate) {
      try {
        var emailTitle = "[" + category + "] " + userName + " 단원님 - " + volunteerDate + " 집결 신청";
        var emailBody = "새로운 " + category + " 집결 신청이 접수되었습니다!\n\n" +
                        "▶ 신청자: " + userName + " (" + (data.gender || "미상") + ")\n" +
                        "▶ 연락처: " + (data.phone || "미상") + "\n" +
                        "▶ 봉사 날짜 및 봉사명: " + volunteerDate + "\n" +
                        "▶ 이동 수단: " + (data.q8 || "미상") + "\n\n" +
                        "자세한 전체 응답 내역은 운영진 구글 스프레드시트의 '봉사 응답 시트' 탭에서 확인해주세요.\n\n" +
                        "- 봉봉단 알림봇 -";
                        
        GmailApp.sendEmail("moonpa.bbd@gmail.com", emailTitle, emailBody, {
          name: "봉봉단 알림봇"
        });
      } catch (emailErr) {}
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.JSON).setHeaders({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
}

// ========================================================
// 3. 기존 백엔드 기능 (조회 및 랭킹)
// ========================================================

function searchMemberInfo(name, phone, birth) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const tz = ss.getSpreadsheetTimeZone();

  const sName   = String(name ).replace(/\s+/g, '').normalize('NFC');
  const sPhone8 = String(phone).replace(/[^0-9]/g, '').slice(-8);
  const sBirth6 = String(birth).replace(/[^0-9]/g, '').slice(-6);

  let userInfo = null;
  let isFoundInDB = false;
  let isFoundInApply = false;
  let myCountAll = 0;

  // 1. 단원 DB 탐색
  const dbSheet = ss.getSheetByName('단원 DB');
  if (dbSheet) {
    const dbData = dbSheet.getDataRange().getValues();
    for (let i = 1; i < dbData.length; i++) {
      const rName   = String(dbData[i][COL.NAME]).replace(/\s+/g, '').normalize('NFC');
      const rPhone8 = String(dbData[i][COL.PHONE]).replace(/[^0-9]/g, '').slice(-8);

      let rBirth = '';
      const rawBirth = dbData[i][COL.BIRTH];
      if (rawBirth instanceof Date) {
        rBirth = Utilities.formatDate(rawBirth, tz, 'yyMMdd');
      } else {
        rBirth = String(rawBirth).replace(/[^0-9]/g, '');
      }
      const rBirth6 = rBirth.slice(-6);

      if (rName === sName && rPhone8 === sPhone8 && rBirth6 === sBirth6) {
        isFoundInDB = true;
        myCountAll = Number(dbData[i][COL.COUNT_ALL]) || 0;
        userInfo = {
          status: 'success',
          count:       myCountAll,                                    
          seasonCount: Number(dbData[i][COL.COUNT_SEASON]) || 0,      
          rank:        dbData[i][COL.TIER] || '예비 단원',            
          totalCount:  Number(dbData[i][COL.TOTAL_COUNT]) || 0,       
          past: [],
          upcoming: [],
          pastGathering: [],
          upcomingGathering: []
        };
        break;
      }
    }
  }

  if (!userInfo) {
    userInfo = {
      status: 'fail',
      count: 0, seasonCount: 0, rank: '예비 단원', totalCount: 0,
      past: [], upcoming: [], pastGathering: [], upcomingGathering: []
    };
  }

  // 2. 봉사 응답 시트 탐색
  const applySheet = ss.getSheetByName('봉사 응답 시트(텍스트 수정X)');
  if (applySheet) {
    const applyData = applySheet.getDataRange().getValues();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 1; i < applyData.length; i++) {
      const aName   = String(applyData[i][2]).replace(/\s+/g, '').normalize('NFC');
      const aPhone8 = String(applyData[i][4]).replace(/[^0-9]/g, '').slice(-8);

      let aBirth = '';
      const rawApplyBirth = applyData[i][5];
      if (rawApplyBirth instanceof Date) {
        aBirth = Utilities.formatDate(rawApplyBirth, tz, 'yyMMdd');
      } else {
        aBirth = String(rawApplyBirth).replace(/[^0-9]/g, '');
      }
      const aBirth6 = aBirth.slice(-6);

      const activityString = applyData[i][1];

      if (aName === sName && aPhone8 === sPhone8 && aBirth6 === sBirth6) {
        isFoundInApply = true;
        userInfo.status = 'success';

        const match = activityString.match(/(\d{2})년\s*(\d{2})월\s*(\d{2})일.*?\)\s*(\d{2}):(\d{2})/);
        if (match) {
          const year   = 2000 + parseInt(match[1]);
          const month  = parseInt(match[2]) - 1;
          const day    = parseInt(match[3]);
          const hour   = parseInt(match[4]);
          const minute = parseInt(match[5]);
          const activityDate    = new Date(year, month, day, hour, minute);
          const activityDayOnly = new Date(year, month, day);

          if (activityDate < now) {
            userInfo.past.push({ text: activityString, time: activityDate.getTime() });
          } else {
            const diffTime = activityDayOnly.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            userInfo.upcoming.push({ text: activityString, time: activityDate.getTime(), dday: diffDays });
          }
        } else {
          userInfo.upcoming.push({ text: activityString, time: 9999999999999, dday: '?' });
        }
      }
    }
    userInfo.upcoming.sort((a, b) => a.time - b.time);
    userInfo.past.sort((a, b) => b.time - a.time);
  }

  // 2.5 모임 집결 응답폼 탐색
  const gatherSheet = ss.getSheetByName('모임 집결 응답폼');
  if (gatherSheet) {
    const gatherData = gatherSheet.getDataRange().getValues();
    const now = new Date();

    for (let i = 1; i < gatherData.length; i++) {
      const aName   = String(gatherData[i][2]).replace(/\s+/g, '').normalize('NFC');
      const aPhone8 = String(gatherData[i][4]).replace(/[^0-9]/g, '').slice(-8);

      let aBirth = '';
      const rawApplyBirth = gatherData[i][5];
      if (rawApplyBirth instanceof Date) {
        aBirth = Utilities.formatDate(rawApplyBirth, tz, 'yyMMdd');
      } else {
        aBirth = String(rawApplyBirth).replace(/[^0-9]/g, '');
      }
      const aBirth6 = aBirth.slice(-6);

      const activityString = gatherData[i][1];

      if (aName === sName && aPhone8 === sPhone8 && aBirth6 === sBirth6) {
        isFoundInApply = true;
        userInfo.status = 'success';
        
        // 날짜 파싱이 어려우므로 우선 모두 다가오는 모임으로 분류하되, 필요 시 날짜 파싱 추가
        const match = activityString.match(/(\d{1,2})월\s*(\d{1,2})일/);
        if (match) {
          const year = now.getFullYear();
          const month = parseInt(match[1]) - 1;
          const day = parseInt(match[2]);
          const activityDayOnly = new Date(year, month, day);
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          if (activityDayOnly < today) {
             userInfo.pastGathering.push({ text: activityString, time: activityDayOnly.getTime() });
          } else {
             const diffTime = activityDayOnly.getTime() - today.getTime();
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             userInfo.upcomingGathering.push({ text: activityString, time: activityDayOnly.getTime(), dday: diffDays });
          }
        } else {
          userInfo.upcomingGathering.push({ text: activityString, time: 9999999999999, dday: '?' });
        }
      }
    }
    userInfo.upcomingGathering.sort((a, b) => a.time - b.time);
    userInfo.pastGathering.sort((a, b) => b.time - a.time);
  }

  // 3. 모두 매칭 실패
  if (!isFoundInDB && !isFoundInApply) {
    writeLog_(name, phone, birth, '실패 (정보 불일치)');
    return { status: 'fail', message: '일치하는 정보가 없습니다. 이름, 생년월일, 연락처를 다시 확인해주세요.' };
  }

  // 4. 역대/시즌 랭킹 2벌 병합
  try {
    const rankingAll    = getRankingData_('all');
    const rankingSeason = getRankingData_('season');

    userInfo.rankings = {
      all:    buildMyRanking_(rankingAll,    sName, sPhone8, sBirth6),
      season: buildMyRanking_(rankingSeason, sName, sPhone8, sBirth6)
    };
    userInfo.totalMembers = rankingAll.totalMembers;   
    userInfo.seasonYear = SEASON_YEAR;

    const tierInfo = getTierGap_(myCountAll, userInfo.rank);
    userInfo.currentTier = tierInfo.current;
    userInfo.nextTier    = tierInfo.next;
    userInfo.nextTierGap = tierInfo.gap;
  } catch (e) {
    userInfo.rankingError = String(e);
  }

  writeLog_(name, phone, birth, '성공');
  return userInfo;
}

function buildMyRanking_(ranking, sName, sPhone8, sBirth6) {
  const me = ranking.all.find(r =>
    r.nameRaw === sName && r.phone8 === sPhone8 && r.birth6 === sBirth6
  );

  if (!me) {
    return {
      myRank: null, myCount: 0, percentile: null, nextRankGap: null,
      top10: ranking.top10, totalMembers: ranking.totalMembers
    };
  }

  const higher = ranking.all.filter(r => r.count > me.count);
  const nextRankGap = higher.length > 0
    ? Math.min.apply(null, higher.map(r => r.count)) - me.count
    : 0;

  const percentile = ranking.totalMembers > 0
    ? Math.max(1, Math.round((me.rank / ranking.totalMembers) * 100))
    : null;

  return {
    myRank: me.rank,
    myCount: me.count,
    percentile: percentile,
    nextRankGap: nextRankGap,
    top10: ranking.top10,
    totalMembers: ranking.totalMembers
  };
}

function getRankingData_(type) {
  const cache = CacheService.getScriptCache();
  const tz = SpreadsheetApp.openById(SPREADSHEET_ID).getSpreadsheetTimeZone();
  const todayKey = 'ranking_' + type + '_v2_' + Utilities.formatDate(new Date(), tz, 'yyyyMMdd');

  const cached = cache.get(todayKey);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) {}
  }

  const data = computeRanking_(type);
  try {
    cache.put(todayKey, JSON.stringify(data), 21600); 
  } catch (e) {}
  return data;
}

function computeRanking_(type) {
  const countColIdx = (type === 'season') ? COL.COUNT_SEASON : COL.COUNT_ALL;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const tz = ss.getSpreadsheetTimeZone();
  const dbSheet = ss.getSheetByName('단원 DB');
  if (!dbSheet) return { totalMembers: 0, top10: [], all: [] };

  const dbData = dbSheet.getDataRange().getValues();
  const members = [];

  for (let i = 1; i < dbData.length; i++) {
    const rawName = dbData[i][COL.NAME];
    if (!rawName) continue;
    const nameRaw = String(rawName).replace(/\s+/g, '').normalize('NFC');
    const phone8  = String(dbData[i][COL.PHONE]).replace(/[^0-9]/g, '').slice(-8);

    let rBirth = '';
    const rawBirth = dbData[i][COL.BIRTH];
    if (rawBirth instanceof Date) {
      rBirth = Utilities.formatDate(rawBirth, tz, 'yyMMdd');
    } else {
      rBirth = String(rawBirth).replace(/[^0-9]/g, '');
    }
    const birth6 = rBirth.slice(-6);

    const count = Number(dbData[i][countColIdx]) || 0;
    const tier  = dbData[i][COL.TIER] || '예비 단원';

    members.push({
      nameRaw, phone8, birth6,
      displayName: maskName_(nameRaw),
      count, tier
    });
  }

  members.sort((a, b) => b.count - a.count);

  let currentRank = 0;
  let prevCount = null;
  members.forEach((m, i) => {
    if (m.count !== prevCount) {
      currentRank = i + 1;
      prevCount = m.count;
    }
    m.rank = currentRank;
  });

  const top10 = members
    .filter(m => m.rank <= 10)
    .map(m => ({
      rank: m.rank,
      displayName: m.displayName,
      tier: m.tier,
      count: m.count
    }));

  return {
    totalMembers: members.length,
    top10: top10,
    all: members
  };
}

function maskName_(name) {
  const n = String(name);
  if (n.length <= 1) return n;
  if (n.length === 2) return n[0] + '*';
  if (n.length === 3) return n[0] + '*' + n[2];
  return n[0] + '*'.repeat(n.length - 2) + n[n.length - 1];
}

function getTierGap_(count, currentTierName) {
  let currentIdx = TIER_THRESHOLDS.findIndex(t => t.name === currentTierName);
  if (currentIdx === -1) {
    currentIdx = TIER_THRESHOLDS.findIndex(t => count >= t.min);
    if (currentIdx === -1) currentIdx = TIER_THRESHOLDS.length - 1;
  }
  const current = TIER_THRESHOLDS[currentIdx];
  const next = currentIdx > 0 ? TIER_THRESHOLDS[currentIdx - 1] : null;
  const gap = next ? Math.max(0, next.min - count) : 0;
  return {
    current: current.name,
    next: next ? next.name : null,
    gap: gap
  };
}

function writeLog_(name, phone, birth, result) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let logSheet = ss.getSheetByName('조회 로그');
    if (!logSheet) {
      logSheet = ss.insertSheet('조회 로그');
      logSheet.appendRow(['조회 일시', '이름', '연락처', '생년월일', '조회 결과']);
      logSheet.getRange('A1:E1').setFontWeight('bold').setBackground('#f2f2f2');
    }
    logSheet.appendRow([new Date(), name, phone, birth, result]);
  } catch (e) {}
}


// ========================================================
// 4. 프론트엔드 집결 취소 API 핸들러 및 알림톡, 시트 이동
// ========================================================
function handleCancelVolunteer(data) {
  const name = data.name;
  const phone = data.phone;
  const scheduleText = data.scheduleText;
  
  const isGathering = data.category === '모임 활동';
  const SOURCE_SHEET = isGathering ? "모임 집결 응답폼" : "봉사 응답 시트(텍스트 수정X)";
  const CANCEL_SHEET = isGathering ? "모임 취소 명단" : "봉사 취소 명단";
  const GATHER_SHEET = "봉사 집결 관련";
  const CHECK_COL = isGathering ? 15 : 23; // W열 for dog, O열 for gathering (arbitrary, just to set true before moving)
  const INSERT_AT = 2;
  
  // 기존 코드에 기반한 열 구조
  const COL_SCHED = 2; // B열: 모임명 or 봉사 날짜
  const COL_NAME = isGathering ? 7 : 3;  // G열: 성함 (gathering) vs C열: 이름 (dog)
  const COL_PHONE = isGathering ? 4 : 5; // D열: 연락처 (gathering) vs E열: 연락처 (dog)

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: '시스템이 바쁩니다. 잠시 후 시도해주세요.'})).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEET);
    let cancelSheet = ss.getSheetByName(CANCEL_SHEET);
    const gatherSheet = ss.getSheetByName(GATHER_SHEET);
    
    if (!sourceSheet) {
      return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: '시트를 찾을 수 없습니다.'})).setMimeType(ContentService.MimeType.JSON);
    }
    if (!cancelSheet) {
      cancelSheet = ss.insertSheet(CANCEL_SHEET);
    }
    
    const sheetData = sourceSheet.getDataRange().getValues();
    
    let targetRowIndex = -1;
    // 1번 인덱스(2행)부터 탐색
    for (let i = 1; i < sheetData.length; i++) {
      const rowName = String(sheetData[i][COL_NAME - 1] || "").trim();
      const rowPhoneRaw = String(sheetData[i][COL_PHONE - 1] || "");
      const rowPhone8 = rowPhoneRaw.replace(/[^0-9]/g, '').slice(-8);
      const reqPhone8 = String(phone).replace(/[^0-9]/g, '').slice(-8);
      
      const rowSched = String(sheetData[i][COL_SCHED - 1] || "").trim();
      
      if (rowName === name && rowPhone8 === reqPhone8 && rowSched === scheduleText.trim()) {
        targetRowIndex = i + 1;
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: '취소할 일정을 시트에서 찾을 수 없습니다.'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 대상 행의 체크박스를 TRUE로 먼저 변경
    sourceSheet.getRange(targetRowIndex, CHECK_COL).setValue(true);
    
    // 행을 취소 명단 시트로 이동
    moveRow_(sourceSheet, cancelSheet, targetRowIndex, INSERT_AT, CHECK_COL);
    
    if (!isGathering) {
      // [알림톡 1] 취소자 본인에게 알림톡 발송 (봉사만)
      sendAlimtalk(phone, SOLAPI_CANCEL_TEMPLATE_ID, {
        '#{이름}': name,
        '#{봉사명}': scheduleText
      });
      
      // [알림톡 2] 해당 봉사 선봉장 찾아서 알림톡 발송
      if (gatherSheet) {
        var gatherData = gatherSheet.getDataRange().getValues();
        var leaderName  = '';
        var leaderPhone = '';

        for (var j = 1; j < gatherData.length; j++) {
          var volName = String(gatherData[j][29]).trim(); // AD 열
          if (volName === scheduleText.trim()) {
            leaderName  = String(gatherData[j][33]).trim(); // AH 열
            leaderPhone = String(gatherData[j][34]).trim(); // AI 열
            break;
          }
        }

        if (leaderName && leaderPhone) {
          sendAlimtalk(leaderPhone, SOLAPI_LEADER_TEMPLATE_ID, {
            '#{선봉장}': leaderName,
            '#{이름}': name,
            '#{봉사명}': scheduleText
          });
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: err.message})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function moveRow_(fromSheet, toSheet, rowIndex, insertAtRow, checkCol) {
  const fromCols = fromSheet.getLastColumn();
  const toCols = toSheet.getLastColumn();
  const numCols = Math.max(fromCols, toCols);

  const values = fromSheet.getRange(rowIndex, 1, 1, fromCols).getValues()[0];
  const rowData = Array(numCols).fill("");
  for (let i = 0; i < fromCols; i++) rowData[i] = values[i];

  rowData[checkCol - 1] = fromSheet.getRange(rowIndex, checkCol).getValue();

  toSheet.insertRows(insertAtRow, 1);
  toSheet.getRange(insertAtRow, 1, 1, numCols).setValues([rowData]);

  fromSheet.deleteRow(rowIndex);
}

// ========================================================
// 5. 알림톡 발송 공통 함수 (Solapi)
// ========================================================
function sendAlimtalk(phone, templateId, variables) {
  var cleanPhone = String(phone).replace(/[^0-9]/g, '');

  var date = new Date().toISOString();
  var salt = Utilities.getUuid();
  var hmac = Utilities.computeHmacSha256Signature(date + salt, SOLAPI_API_SECRET);
  var signature = hmac.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');

  var authHeader = 'HMAC-SHA256 apiKey=' + SOLAPI_API_KEY
    + ', date=' + date
    + ', salt=' + salt
    + ', signature=' + signature;

  var payload = {
    messages: [
      {
        to: cleanPhone,
        from: SOLAPI_SENDER,
        kakaoOptions: {
          pfId: SOLAPI_PF_ID,
          templateId: templateId,
          variables: variables
        }
      }
    ]
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': authHeader
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var isSuccess = false;
  var responseText = '';

  try {
    var response = UrlFetchApp.fetch('https://api.solapi.com/messages/v4/send-many', options);
    isSuccess = response.getResponseCode() === 200;
    responseText = response.getContentText();
    Logger.log('[알림톡 응답] ' + responseText);
  } catch (error) {
    Logger.log('[알림톡 실패] ' + error.message);
    responseText = error.message;
  }

  // ─── Supabase KV 서버에 알림톡 발송 현황 기록 ───
  try {
    var logPayload = {
      phone: cleanPhone,
      userName: variables['#{이름}'] || variables['#{리더이름}'] || variables['#{취소자이름}'] || '알 수 없음',
      volunteerDate: variables['#{봉사명}'] || variables['#{모임명}'] || variables['#{취소봉사명}'] || '알 수 없음',
      templateId: templateId,
      success: isSuccess,
      response: responseText
    };
    
    var logOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(logPayload),
      muteHttpExceptions: true
    };
    
    UrlFetchApp.fetch('https://ibvnydmuooorpuopdywr.supabase.co/functions/v1/server/alimtalk/log', logOptions);
  } catch (error) {
    Logger.log('[로그 저장 실패] ' + error.message);
  }
}

// ========================================================
// 6. 프론트엔드 집결 변경 API 핸들러 및 알림톡 처리
// ========================================================
function handleChangeVolunteer(data) {
  const name = data.name;
  const phone = data.phone;
  const oldScheduleText = data.oldScheduleText;
  const newScheduleText = data.newScheduleText;
  
  const SOURCE_SHEET = "봉사 응답 시트(텍스트 수정X)";
  const GATHER_SHEET = "봉사 집결 관련";
  
  const COL_SCHED = 2; // B열: 봉사 날짜 및 봉사명
  const COL_NAME = 3;  // C열: 이름
  const COL_PHONE = 5; // E열: 연락처

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: '시스템이 바쁩니다. 잠시 후 시도해주세요.'})).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEET);
    const gatherSheet = ss.getSheetByName(GATHER_SHEET);
    
    if (!sourceSheet) {
      return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: '시트를 찾을 수 없습니다.'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheetData = sourceSheet.getDataRange().getValues();
    
    let targetRowIndex = -1;
    // 1번 인덱스(2행)부터 탐색
    for (let i = 1; i < sheetData.length; i++) {
      const rowName = String(sheetData[i][COL_NAME - 1] || "").trim();
      const rowPhoneRaw = String(sheetData[i][COL_PHONE - 1] || "");
      const rowPhone8 = rowPhoneRaw.replace(/[^0-9]/g, '').slice(-8);
      const reqPhone8 = String(phone).replace(/[^0-9]/g, '').slice(-8);
      
      const rowSched = String(sheetData[i][COL_SCHED - 1] || "").trim();
      
      // 이름, 연락처 뒷자리, 기존 봉사명이 일치하는 행 찾기
      if (rowName === name && rowPhone8 === reqPhone8 && rowSched === oldScheduleText.trim()) {
        targetRowIndex = i + 1;
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: '변경할 기존 일정을 시트에서 찾을 수 없습니다.'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // [동작 1] B열(봉사명) 값만 새로운 봉사명으로 깔끔하게 덮어쓰기 (나머지 정보 유지)
    sourceSheet.getRange(targetRowIndex, COL_SCHED).setValue(newScheduleText.trim());
    
    // [동작 2] 알림톡 - 기존 봉사 선봉장에게 "누군가 취소했습니다" 발송
    if (gatherSheet) {
      var gatherData = gatherSheet.getDataRange().getValues();
      var leaderName  = '';
      var leaderPhone = '';

      for (var j = 1; j < gatherData.length; j++) {
        var volName = String(gatherData[j][29]).trim(); // AD 열
        if (volName === oldScheduleText.trim()) {
          leaderName  = String(gatherData[j][33]).trim(); // AH 열
          leaderPhone = String(gatherData[j][34]).trim(); // AI 열
          break;
        }
      }

      if (leaderName && leaderPhone) {
        // 기존 선봉장 템플릿 재활용 (이름 뒤에 "일정 변경으로 인한" 표기)
        sendAlimtalk(leaderPhone, SOLAPI_LEADER_TEMPLATE_ID, {
          '#{선봉장}': leaderName,
          '#{이름}': name + " (일정 변경)", 
          '#{봉사명}': oldScheduleText
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'fail', message: err.message})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
