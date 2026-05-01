const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetPanel = `              {/* 제목 */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span style={{ color: '#A87830', fontSize: '13px', letterSpacing: '4px', fontWeight: '800' }}>천하제일 봉사문파</span>
                <h2 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '30px', fontWeight: '900', color: '#1E3A5F', marginTop: '12px', letterSpacing: '1px' }}>
                  봉봉단 출정 안내서
                </h2>
                <div style={{ width: '40px', height: '2px', background: '#C8963E', margin: '24px auto 0', opacity: 0.8 }} />
              </div>

              <p style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '18px', fontWeight: '700', color: '#2B3B4C', lineHeight: '1.6', textAlign: 'center', marginBottom: '40px', wordBreak: 'keep-all' }}>
                "강호의 동지들, 정예 고수를 모집하오!"
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* 섹션 1 */}
                <div>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                    <span style={{ color: '#C8963E' }}>◈</span> 활동 내용
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                    유기견 보호소에서 견사 청소, 산책, 사회화 훈련, 일손 부족 해결, 보호소 수리 등을 돕는 봉사 활동
                  </p>
                </div>

                {/* 섹션 2 */}
                <div>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                    <span style={{ color: '#C8963E' }}>◈</span> 제공 물품
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                    방진복, 목장갑, 신발커버, 음료, 마스크 제공!<br />
                    <span style={{ color: '#8892B0', fontSize: '13px' }}>(*개인 장화가 있으면 더 편해요)</span>
                  </p>
                </div>

                {/* 섹션 3 */}
                <div style={{ background: 'rgba(200, 150, 62, 0.08)', padding: '24px', borderLeft: '3px solid #C8963E' }}>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '17px', fontWeight: '900', color: '#8B5A19', marginBottom: '12px' }}>
                    참가비 (금 1.2만냥)
                  </h3>
                  <ul style={{ color: '#5C4A3D', fontSize: '14px', lineHeight: '1.7', margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>운영비 및 노쇼 방지 목적</li>
                    <li>픽업 제공자는 이동거리 만큼 유류비 지원해 드립니다.</li>
                    <li style={{ color: '#B91C1C', fontWeight: '700' }}>노쇼 방지로 봉사 취소 시 환불이 불가합니다.</li>
                  </ul>
                </div>

                {/* 섹션 4 */}
                <div>
                  <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                    <span style={{ color: '#C8963E' }}>◈</span> 신청 방법
                  </h3>
                  <div style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '600', wordBreak: 'keep-all' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>1</span>
                      <div>우측의 <span style={{ color: '#1E3A5F', fontWeight: '800' }}>봉사 집결 신청서</span> 작성</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>2</span>
                      <div>참가비 1.2만원 입금 (반드시 본인 이름으로!)</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>3</span>
                      <div>
                        집결 신청서 제출 완료!<br />
                        <span style={{ fontSize: '13px', color: '#8892B0', fontWeight: '400', display: 'block' }}>(인원 마감이나 픽업 부족 시, 개별 연락드립니다.)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 섹션 5 */}
                <div style={{ borderTop: '1px dashed #D1C4A9', paddingTop: '24px' }}>
                  <h4 style={{ color: '#991B1B', fontSize: '14px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} /> 필독 주의사항
                  </h4>
                  <ul style={{ color: '#991B1B', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '24px', opacity: 0.9, listStyleType: 'disc' }}>
                    <li>반드시 본인 이름으로 입금해주세요.</li>
                    <li>입금 후 본 폼을 제출해야 신청 완료됩니다.</li>
                    <li>더러워질 수 있으니 편한 옷 착용을 권장합니다.</li>
                  </ul>
                </div>

              </div>`;

const repPanel = `              {activeTab === 'gathering' ? (
                <>
                  {/* 제목 */}
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span style={{ color: '#A87830', fontSize: '13px', letterSpacing: '4px', fontWeight: '800' }}>천하제일 봉사문파</span>
                    <h2 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '30px', fontWeight: '900', color: '#1E3A5F', marginTop: '12px', letterSpacing: '1px' }}>
                      봉봉단 모임 안내서
                    </h2>
                    <div style={{ width: '40px', height: '2px', background: '#C8963E', margin: '24px auto 0', opacity: 0.8 }} />
                  </div>

                  <p style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '18px', fontWeight: '700', color: '#2B3B4C', lineHeight: '1.6', textAlign: 'center', marginBottom: '40px', wordBreak: 'keep-all' }}>
                    "강호의 동지들, 천하제일 봉사문파 '봉봉단'에서 봉사 외 모임 활동에 동참할 정예 고수를 모집하오!"
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* 섹션 1 */}
                    <div>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                        <span style={{ color: '#C8963E' }}>◈</span> 활동 종류
                      </h3>
                      <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                        행사, MT, 여행, 소모임 등 봉봉단의 모든 봉사 외 활동
                      </p>
                    </div>

                    {/* 섹션 2 */}
                    <div>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                        <span style={{ color: '#C8963E' }}>◈</span> 공통 참가 자격
                      </h3>
                      <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                        봉봉단 봉사 활동을 1회 이상 신청한 단원에 한하오.<br />
                        <span style={{ color: '#8892B0', fontSize: '13px' }}>(입단의 예를 갖춘 동지여야 강호의 연을 이을 수 있소)</span>
                      </p>
                    </div>

                    {/* 섹션 3 */}
                    <div style={{ background: 'rgba(200, 150, 62, 0.08)', padding: '24px', borderLeft: '3px solid #C8963E' }}>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '17px', fontWeight: '900', color: '#8B5A19', marginBottom: '12px' }}>
                        세부 안내 및 참가비
                      </h3>
                      <ul style={{ color: '#5C4A3D', fontSize: '14px', lineHeight: '1.7', margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                        <li>각 모임별 장소·일정·참가비·준비물은 아래 문항에서 확인 후 선택해주시오.</li>
                        <li>참가비는 각 모임별 상이하며, 환불 규정도 각 모임 공지를 확인해주시오.</li>
                        <li style={{ color: '#B91C1C', fontWeight: '700' }}>선착순 마감이 될 수 있습니다.</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* 제목 */}
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span style={{ color: '#A87830', fontSize: '13px', letterSpacing: '4px', fontWeight: '800' }}>천하제일 봉사문파</span>
                    <h2 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '30px', fontWeight: '900', color: '#1E3A5F', marginTop: '12px', letterSpacing: '1px' }}>
                      봉봉단 출정 안내서
                    </h2>
                    <div style={{ width: '40px', height: '2px', background: '#C8963E', margin: '24px auto 0', opacity: 0.8 }} />
                  </div>

                  <p style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '18px', fontWeight: '700', color: '#2B3B4C', lineHeight: '1.6', textAlign: 'center', marginBottom: '40px', wordBreak: 'keep-all' }}>
                    "강호의 동지들, 정예 고수를 모집하오!"
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* 섹션 1 */}
                    <div>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                        <span style={{ color: '#C8963E' }}>◈</span> 활동 내용
                      </h3>
                      <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                        유기견 보호소에서 견사 청소, 산책, 사회화 훈련, 일손 부족 해결, 보호소 수리 등을 돕는 봉사 활동
                      </p>
                    </div>

                    {/* 섹션 2 */}
                    <div>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                        <span style={{ color: '#C8963E' }}>◈</span> 제공 물품
                      </h3>
                      <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.7', paddingLeft: '24px', wordBreak: 'keep-all' }}>
                        방진복, 목장갑, 신발커버, 음료, 마스크 제공!<br />
                        <span style={{ color: '#8892B0', fontSize: '13px' }}>(*개인 장화가 있으면 더 편해요)</span>
                      </p>
                    </div>

                    {/* 섹션 3 */}
                    <div style={{ background: 'rgba(200, 150, 62, 0.08)', padding: '24px', borderLeft: '3px solid #C8963E' }}>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '17px', fontWeight: '900', color: '#8B5A19', marginBottom: '12px' }}>
                        참가비 (금 1.2만냥)
                      </h3>
                      <ul style={{ color: '#5C4A3D', fontSize: '14px', lineHeight: '1.7', margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                        <li>운영비 및 노쇼 방지 목적</li>
                        <li>픽업 제공자는 이동거리 만큼 유류비 지원해 드립니다.</li>
                        <li style={{ color: '#B91C1C', fontWeight: '700' }}>노쇼 방지로 봉사 취소 시 환불이 불가합니다.</li>
                      </ul>
                    </div>

                    {/* 섹션 4 */}
                    <div>
                      <h3 style={{ fontFamily: '"Noto Serif KR", serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '800', color: '#1E3A5F', marginBottom: '12px' }}>
                        <span style={{ color: '#C8963E' }}>◈</span> 신청 방법
                      </h3>
                      <div style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '600', wordBreak: 'keep-all' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>1</span>
                          <div>우측의 <span style={{ color: '#1E3A5F', fontWeight: '800' }}>봉사 집결 신청서</span> 작성</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>2</span>
                          <div>참가비 1.2만원 입금 (반드시 본인 이름으로!)</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#C8963E', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: '800', marginTop: '3px' }}>3</span>
                          <div>
                            집결 신청서 제출 완료!<br />
                            <span style={{ fontSize: '13px', color: '#8892B0', fontWeight: '400', display: 'block' }}>(인원 마감이나 픽업 부족 시, 개별 연락드립니다.)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 섹션 5 */}
                    <div style={{ borderTop: '1px dashed #D1C4A9', paddingTop: '24px' }}>
                      <h4 style={{ color: '#991B1B', fontSize: '14px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={16} /> 필독 주의사항
                      </h4>
                      <ul style={{ color: '#991B1B', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '24px', opacity: 0.9, listStyleType: 'disc' }}>
                        <li>반드시 본인 이름으로 입금해주세요.</li>
                        <li>입금 후 본 폼을 제출해야 신청 완료됩니다.</li>
                        <li>더러워질 수 있으니 편한 옷 착용을 권장합니다.</li>
                      </ul>
                    </div>

                  </div>
                </>
              )}`;

content = content.replace(targetPanel, repPanel);

fs.writeFileSync(file, content);
console.log('Phase 3 done');
