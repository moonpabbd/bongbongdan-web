const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStep3 = `              {/* === 3페이지 === */}
              {step === 3 && (
                <>
                  {/* 10. 몇 명까지 태워주실 수 있나요? */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      몇 명까지 태워주실 수 있나요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>`;

const repStep3 = `              {/* === 3페이지 === */}
              {step === 3 && (
                <>
                  {activeTab === 'gathering' ? (
                    <>
                      {/* 모임 3페이지: 봉사 신청 횟수, 카카오톡 ID */}
                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          봉사 신청한 횟수가 몇 번인가요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>
                          봉사 '참여'가 아닌 '신청'한 횟수입니다. 나의 활동 메뉴에서 확인된 횟수를 적어주세요.
                        </p>
                        <input
                          type="number" name="q6" value={formData.q6} onChange={handleChange} placeholder="예: 3"
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: '#F9FAFB' }}
                        />
                      </div>

                      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                          모임 집결 안내를 위한 카카오톡 ID를 작성해주세요. <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#4B5563', lineHeight: '1.6', marginBottom: '16px' }}>
                          모임 집결 안내를 위한 단체 채팅방 초대에 사용됩니다.<br />
                          카카오톡 → 내 프로필 → 우측 상단 ··· → 프로필 공유에서 확인되는 <strong>“아이디(ID)”</strong>를 입력해주세요. <span style={{ color: '#6B7280' }}>(전화번호·닉네임 아님)</span>
                          <div style={{ marginTop: '12px', textAlign: 'center' }}>
                            <img src="/kakao_id_guide.jpg" alt="카카오톡 ID 확인 방법" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                          </div>
                        </div>
                        <input
                          type="text"
                          name="q16"
                          value={formData.q16}
                          onChange={handleChange}
                          placeholder="카카오톡 ID 입력"
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '15px', color: '#111827', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 10. 몇 명까지 태워주실 수 있나요? */}
                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          몇 명까지 태워주실 수 있나요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>`;

content = content.replace(targetStep3, repStep3);

const step3End = `                  </div>
                </>
              )}

              {/* === 4페이지 (참가비 입금) === */}`;

const repStep3End = `                  </div>
                    </>
                  )}
                </>
              )}

              {/* === 4페이지 === */}`;

content = content.replace(step3End, repStep3End);

fs.writeFileSync(file, content);
console.log('Phase 6 done');
