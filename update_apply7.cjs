const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStep4 = `              {/* === 4페이지 === */}
              {step === 4 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '30px', height: '2px', background: '#C8963E', margin: '0 auto 12px', opacity: 0.8 }} />
                    <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '24px', fontWeight: '900', color: '#1E3A5F', margin: 0, letterSpacing: '0.5px' }}>
                      참가비 입금
                    </h3>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '24px' }}>`;

const repStep4 = `              {/* === 4페이지 === */}
              {step === 4 && (
                <>
                  {activeTab === 'gathering' ? (
                    <>
                      {/* 모임 4페이지: 동의 및 입금 */}
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ width: '30px', height: '2px', background: '#C8963E', margin: '0 auto 12px', opacity: 0.8 }} />
                        <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '24px', fontWeight: '900', color: '#1E3A5F', margin: 0, letterSpacing: '0.5px' }}>
                          참가비 및 동의
                        </h3>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '24px' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ margin: '0 0 4px 0', fontWeight: '800', color: '#1E3A5F' }}>입금 계좌</p>
                          <p style={{ margin: 0, fontSize: '15px', color: '#374151', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>국민은행 <strong style={{ color: '#1E3A5F' }}>349401-04-363779</strong> 봉봉단(BBD)</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('349401-04-363779');
                                alert('계좌번호가 복사되었습니다.');
                              }}
                              style={{
                                background: '#F3F4F6',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#4B5563',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Copy size={14} /> 복사
                            </button>
                          </p>
                        </div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span>⚠️</span>
                            <span>선택하신 모임의 참가비를 <strong style={{ color: '#1E3A5F' }}>본인 이름으로 입금</strong>해주세요.</span>
                          </li>
                          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span>⚠️</span>
                            <span>입금 후 본 폼을 제출해야 신청이 완료됩니다.</span>
                          </li>
                        </ul>
                      </div>

                      {/* 참가비 환불 동의 */}
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                          참가비 환불이 어려운 점에 대해 확인하고 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                          <input type="checkbox" name="q12" checked={formData.q12} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                          위 내용을 확인하였으며, 참가비 환불 규정에 동의합니다.
                        </label>
                      </div>

                      {/* 참가비 입금 여부 */}
                      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                          참가비를 입금하셨나요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                          <input type="checkbox" name="q13" checked={formData.q13} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                          네, 본인 이름으로 입금 완료했습니다.
                        </label>
                      </div>

                      {/* SNS 사진 게시 동의 */}
                      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                          모임 활동 사진 SNS 게시에 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                            <input type="radio" name="q15" value="동의" checked={formData.q15 === '동의'} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                            동의합니다
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                            <input type="radio" name="q15" value="미동의" checked={formData.q15 === '미동의'} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                            동의하지 않습니다.
                          </label>
                        </div>
                      </div>

                      {/* 개인정보 수집 동의 */}
                      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', paddingBottom: '24px' }}>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                          개인정보 수집 및 이용에 동의하시나요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6', marginBottom: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                          <strong style={{ color: '#374151' }}>[수집 항목]</strong> 성명, 성별, 연락처, 생년월일, 카카오톡ID<br />
                          <strong style={{ color: '#374151' }}>[수집 목적]</strong> 모임 참여자 관리, 일정 안내<br />
                          <strong style={{ color: '#374151' }}>[보유 기간]</strong> 수집일로부터 1년<br />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', color: '#1E3A5F' }}>
                          <input type="checkbox" name="q17" checked={formData.q17} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                          네, 동의합니다.
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 봉사 4페이지: 참가비 입금 */}
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ width: '30px', height: '2px', background: '#C8963E', margin: '0 auto 12px', opacity: 0.8 }} />
                        <h3 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '24px', fontWeight: '900', color: '#1E3A5F', margin: 0, letterSpacing: '0.5px' }}>
                          참가비 입금
                        </h3>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '24px' }}>`;

content = content.replace(targetStep4, repStep4);

const step4End = `                      네, 본인 이름으로 입금 완료했습니다.
                    </label>
                  </div>
                </>
              )}

              {/* === 5페이지 === */}`;

const repStep4End = `                      네, 본인 이름으로 입금 완료했습니다.
                    </label>
                  </div>
                    </>
                  )}
                </>
              )}

              {/* === 5페이지 === */}`;

content = content.replace(step4End, repStep4End);

const targetStep5 = `              {/* === 5페이지 === */}
              {step === 5 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>`;

const repStep5 = `              {/* === 5페이지 === */}
              {step === 5 && activeTab !== 'gathering' && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>`;

content = content.replace(targetStep5, repStep5);

const marginChange = `                  <div style={{ textAlign: 'center', padding: '24px 0 16px', borderTop: '1px solid #E5E7EB' }}>`;
const repMarginChange = `                  <div style={{ textAlign: 'center', padding: '24px 0 16px', borderTop: '1px solid #E5E7EB', marginTop: activeTab === 'gathering' ? '0' : '24px' }}>`;

content = content.replace(marginChange, repMarginChange);

fs.writeFileSync(file, content);
console.log('Phase 7 done');
