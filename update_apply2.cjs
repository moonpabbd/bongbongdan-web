const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

// handleTabClick
content = content.replace(
  "    if (tab === 'dog') setActiveTab(tab);\n    else alert('현재 준비 중인 봉사입니다. 멋진 기획으로 곧 찾아뵙겠습니다!');",
  "    if (tab === 'dog' || tab === 'gathering') setActiveTab(tab);\n    else alert('현재 준비 중인 활동입니다. 멋진 기획으로 곧 찾아뵙겠습니다!');"
);

// validation
const validationTarget = `    if (step === 1) {
      if (!formData.date) return setErrorMsg('참여하실 날짜를 선택해주세요.');
      if (!formData.name) return setErrorMsg('성함을 입력해주세요.');
      if (!/^[a-zA-Z가-힣]+$/.test(formData.name)) return setErrorMsg('이름은 공백이나 특수문자 없이 입력해 주세요.');
      if (!formData.gender) return setErrorMsg('성별을 선택해주세요.');
      if (!formData.phone) return setErrorMsg('연락처를 입력해주세요.');
      if (!/^\\d{11}$/.test(formData.phone)) return setErrorMsg('"01012345678" 형식으로 하이픈(-) 없이 숫자만 입력해주세요.');
      if (!formData.birthdate) return setErrorMsg('생년월일을 입력해주세요.');
      if (!/^(19|20)\\d{6}$/.test(formData.birthdate)) return setErrorMsg('생년월일은 "19900101" 형식으로 8자리를 입력해주세요.');
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.isFirstTime) return setErrorMsg('봉봉단 첫 방문 여부를 선택해주세요.');
      if (formData.isFirstTime === '네, 처음입니다 (예비 단원)') {
        if (formData.discoverySource.length === 0) {
          return setErrorMsg('봉봉단을 어떻게 알게 되셨는지 선택해주세요.');
        }
        if (formData.discoverySource.includes('직접 입력') && !formData.discoveryOther.trim()) {
          return setErrorMsg('봉봉단을 알게 된 경로를 직접 입력해주세요.');
        }
      }
      if (!formData.q8) return setErrorMsg('이동 수단을 선택해주세요.');
      if (!formData.q9) return setErrorMsg('출발지 기준 지하철역을 입력해주세요.');
      if (!SUBWAY_STATIONS.includes(formData.q9)) return setErrorMsg('목록에 있는 정확한 지하철역 이름을 선택해주세요. (예: 강남역)');

      const isDriver = formData.q8 === '자차로 가요 (다른 분들 태워줄 수 있어요)' || formData.q8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)';
      if (isDriver) {
        setStep(3);
        return;
      } else {
        setStep(4);
        return;
      }
    }

    if (step === 3) {
      if (!formData.q10) return setErrorMsg('몇 명까지 태워주실 수 있는지 선택해주세요.');
      if (!formData.q11) return setErrorMsg('유류비 지원 정책에 동의해주세요.');
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!formData.q12) return setErrorMsg('참가비 환불 불가 정책에 동의해주세요.');
      if (!formData.q13) return setErrorMsg('참가비 입금 확인에 체크해주세요.');
      setStep(5);
      return;
    }

    if (step === 5) {
      if (!formData.q15) return setErrorMsg('SNS 사진 게시 동의 여부를 선택해주세요.');
      if (!formData.q16) return setErrorMsg('카카오톡 ID를 입력해주세요.');
      if (!formData.q17) return setErrorMsg('개인정보 수집 및 이용에 동의해주세요.');
    }`;

const validationReplacement = `    if (activeTab === 'gathering') {
      if (step === 1) {
        if (!formData.q1) return setErrorMsg('참여하실 모임을 선택해주세요.');
        setStep(2); return;
      }
      if (step === 2) {
        if (!formData.name) return setErrorMsg('성함을 입력해주세요.');
        if (!/^[a-zA-Z가-힣]+$/.test(formData.name)) return setErrorMsg('이름은 공백이나 특수문자 없이 입력해 주세요.');
        if (!formData.gender) return setErrorMsg('성별을 선택해주세요.');
        if (!formData.phone) return setErrorMsg('연락처를 입력해주세요.');
        if (!/^\\d{11}$/.test(formData.phone)) return setErrorMsg('"01012345678" 형식으로 하이픈(-) 없이 숫자만 입력해주세요.');
        if (!formData.birthdate) return setErrorMsg('생년월일을 입력해주세요.');
        if (!/^(19|20)\\d{6}$/.test(formData.birthdate)) return setErrorMsg('생년월일은 "19900101" 형식으로 8자리를 입력해주세요.');
        setStep(3); return;
      }
      if (step === 3) {
        if (!formData.q6) return setErrorMsg('봉사 신청 횟수를 입력해주세요.');
        if (!formData.q16) return setErrorMsg('카카오톡 ID를 입력해주세요.');
        setStep(4); return;
      }
      if (step === 4) {
        if (!formData.q12) return setErrorMsg('참가비 환불 규정에 동의해주세요.');
        if (!formData.q13) return setErrorMsg('참가비 입금 여부를 확인해주세요.');
        if (!formData.q15) return setErrorMsg('SNS 사진 게시 동의 여부를 선택해주세요.');
        if (!formData.q17) return setErrorMsg('개인정보 수집 및 이용에 동의해주세요.');
        setStep(5); return;
      }
    } else {
      if (step === 1) {
        if (!formData.date) return setErrorMsg('참여하실 날짜를 선택해주세요.');
        if (!formData.name) return setErrorMsg('성함을 입력해주세요.');
        if (!/^[a-zA-Z가-힣]+$/.test(formData.name)) return setErrorMsg('이름은 공백이나 특수문자 없이 입력해 주세요.');
        if (!formData.gender) return setErrorMsg('성별을 선택해주세요.');
        if (!formData.phone) return setErrorMsg('연락처를 입력해주세요.');
        if (!/^\\d{11}$/.test(formData.phone)) return setErrorMsg('"01012345678" 형식으로 하이픈(-) 없이 숫자만 입력해주세요.');
        if (!formData.birthdate) return setErrorMsg('생년월일을 입력해주세요.');
        if (!/^(19|20)\\d{6}$/.test(formData.birthdate)) return setErrorMsg('생년월일은 "19900101" 형식으로 8자리를 입력해주세요.');
        setStep(2); return;
      }

      if (step === 2) {
        if (!formData.isFirstTime) return setErrorMsg('봉봉단 첫 방문 여부를 선택해주세요.');
        if (formData.isFirstTime === '네, 처음입니다 (예비 단원)') {
          if (formData.discoverySource.length === 0) return setErrorMsg('봉봉단을 어떻게 알게 되셨는지 선택해주세요.');
          if (formData.discoverySource.includes('직접 입력') && !formData.discoveryOther.trim()) return setErrorMsg('봉봉단을 알게 된 경로를 직접 입력해주세요.');
        }
        if (!formData.q8) return setErrorMsg('이동 수단을 선택해주세요.');
        if (!formData.q9) return setErrorMsg('출발지 기준 지하철역을 입력해주세요.');
        if (!SUBWAY_STATIONS.includes(formData.q9)) return setErrorMsg('목록에 있는 정확한 지하철역 이름을 선택해주세요. (예: 강남역)');

        const isDriver = formData.q8 === '자차로 가요 (다른 분들 태워줄 수 있어요)' || formData.q8 === '자차로 가요 (픽업이 필요할 경우, 상황에 따라 태워줄 수 있어요)';
        if (isDriver) { setStep(3); return; } 
        else { setStep(4); return; }
      }

      if (step === 3) {
        if (!formData.q10) return setErrorMsg('몇 명까지 태워주실 수 있는지 선택해주세요.');
        if (!formData.q11) return setErrorMsg('유류비 지원 정책에 동의해주세요.');
        setStep(4); return;
      }

      if (step === 4) {
        if (!formData.q12) return setErrorMsg('참가비 환불 불가 정책에 동의해주세요.');
        if (!formData.q13) return setErrorMsg('참가비 입금 확인에 체크해주세요.');
        setStep(5); return;
      }

      if (step === 5) {
        if (!formData.q15) return setErrorMsg('SNS 사진 게시 동의 여부를 선택해주세요.');
        if (!formData.q16) return setErrorMsg('카카오톡 ID를 입력해주세요.');
        if (!formData.q17) return setErrorMsg('개인정보 수집 및 이용에 동의해주세요.');
      }
    }`;

content = content.replace(validationTarget, validationReplacement);

// submit
content = content.replace(
  "        body: JSON.stringify({ ...formData, q8: finalQ8, category: '유기견 봉사' })",
  "        body: JSON.stringify({ ...formData, q8: finalQ8, category: activeTab === 'gathering' ? '모임 활동' : '유기견 봉사' })"
);

// alimtalk
content = content.replace(
  "      // 백엔드(Supabase Edge Function)로 알림톡 발송 요청\n      try {\n        await fetch(`${SERVER}/alimtalk/send`, {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({\n            phone: formData.phone.replace(/[^0-9]/g, \"\"),\n            userName: formData.name,\n            volunteerDate: formData.date\n          })\n        });\n      } catch (alimtalkErr) {\n        console.error(\"알림톡 발송 요청 실패:\", alimtalkErr);\n      }",
  "      // 백엔드(Supabase Edge Function)로 알림톡 발송 요청\n      if (activeTab !== 'gathering') {\n        try {\n          await fetch(`${SERVER}/alimtalk/send`, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify({\n              phone: formData.phone.replace(/[^0-9]/g, \"\"),\n              userName: formData.name,\n              volunteerDate: formData.date\n            })\n          });\n        } catch (alimtalkErr) {\n          console.error(\"알림톡 발송 요청 실패:\", alimtalkErr);\n        }\n      }"
);

fs.writeFileSync(file, content);
console.log('Phase 2 done');
