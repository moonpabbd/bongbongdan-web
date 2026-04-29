import { useEffect } from 'react';

export function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
          <p className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            시행일자: 2026년 5월 1일
          </p>

          <div className="prose prose-sm sm:prose-base text-gray-700 max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. 개인정보의 처리 목적</h2>
              <p>
                봉사문파 봉봉단(이하 "단체")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>회원 가입 및 관리: 회원제 서비스 제공에 따른 본인 식별·인증, 봉사활동 기록 관리</li>
                <li>자원봉사 활동 안내: 봉사 일정 안내, 공지사항 전달, 긴급 연락</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. 처리하는 개인정보의 항목</h2>
              <p>단체는 회원가입, 봉사활동 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>필수항목:</strong> 성명, 생년월일, 휴대전화번호</li>
                <li><strong>선택항목:</strong> 이메일 주소, 자택 주소 (동 단위까지만 표기)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. 개인정보의 처리 및 보유 기간</h2>
              <p>
                1. 단체는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br />
                2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.<br />
                - 홈페이지 회원 가입 및 관리: 단체 탈퇴 시까지 (단, 봉사활동 기록 보존을 위해 성명과 생년월일 일부는 내부 규정에 따라 영구 보존될 수 있습니다.)
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공에 관한 사항</h2>
              <p>
                단체는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 봉사활동 인증 등을 위해 특정 기관(예: 1365 자원봉사포털)에 정보가 제공될 수 있으며, 이 경우 사전에 별도의 동의를 구합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. 정보주체와 법정대리인의 권리·의무 및 그 행사방법</h2>
              <p>
                정보주체는 단체에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 단체에 대해 서면, 전자우편 등을 통하여 하실 수 있으며, 단체는 이에 대해 지체 없이 조치하겠습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. 개인정보 보호책임자</h2>
              <p>
                단체는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br /><br />
                <strong>개인정보 보호책임자</strong><br />
                - 성명: 박진범<br />
                - 연락처: Info@bbd.or.kr
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
