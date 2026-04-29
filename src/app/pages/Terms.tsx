import { useEffect } from 'react';

export function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
          <p className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            시행일자: 2026년 5월 1일
          </p>

          <div className="prose prose-sm sm:prose-base text-gray-700 max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
              <p>
                본 약관은 봉사문파 봉봉단(이하 "단체")이 제공하는 홈페이지 및 관련 서비스의 이용조건 및 절차, 단체와 회원 간의 권리, 의무 및 책임사항 등 기본적인 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (용어의 정의)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>서비스:</strong> 구현되는 단말기(PC, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 단체의 홈페이지 및 관련 제반 서비스</li>
                <li><strong>회원:</strong> 단체의 서비스에 접속하여 본 약관에 따라 단체와 이용계약을 체결하고 단체가 제공하는 서비스를 이용하는 고객</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (약관의 효력 및 변경)</h2>
              <p>
                1. 본 약관은 서비스를 통하여 이를 공지하거나 전자우편 기타의 방법으로 회원에게 통지함으로써 효력이 발생합니다.<br />
                2. 단체는 필요하다고 인정되는 경우 이 약관의 내용을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 사전에 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (서비스의 제공 및 변경)</h2>
              <p>
                1. 단체는 회원에게 자원봉사 참여 신청, 활동 내역 조회 등의 서비스를 제공합니다.<br />
                2. 단체는 서비스 변경 시 그 변경될 서비스의 내용 및 제공일자를 회원에게 통지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (회원의 의무)</h2>
              <p>
                회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.<br />
                1. 신청 또는 변경 시 허위 내용의 등록<br />
                2. 타인의 정보 도용<br />
                3. 단체의 운영진, 직원이나 관계자를 사칭하는 행위<br />
                4. 기타 불법적이거나 부당한 행위
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">부칙</h2>
              <p>
                이 약관은 2026년 5월 1일부터 시행됩니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
