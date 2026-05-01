const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStep2_DogOnly = `                  {/* 6. 처음 오시나요? */}
                  <div style={{ borderTop: step === 2 ? 'none' : '1px solid #E5E7EB', paddingTop: step === 2 ? '0' : '24px' }}>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      봉봉단에 첫 봉사이신가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                        <input type="radio" name="isFirstTime" value="네, 처음입니다 (예비 단원)" checked={formData.isFirstTime === '네, 처음입니다 (예비 단원)'} onChange={handleChange} />
                        네, 처음입니다 (예비 단원)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                        <input type="radio" name="isFirstTime" value="아니요, 기존 단원입니다" checked={formData.isFirstTime === '아니요, 기존 단원입니다'} onChange={handleChange} />
                        아니요, 기존 단원입니다
                      </label>
                    </div>
                  </div>`;

const repStep2_DogOnly = `                  {activeTab === 'gathering' ? (
                    <>
                      {/* 모임 2페이지: 이름, 성별, 연락처, 생년월일 */}
                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          성함을 알려주세요. <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleChange} placeholder="홍길동"
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                        />
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>공백이나 특수문자 없이 입력해 주세요.</p>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          성별은 무엇인가요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
                          {['여자', '남자'].map((opt) => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                              <input type="radio" name="gender" value={opt} checked={formData.gender === opt} onChange={handleChange} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          연락처를 알려주세요. <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01012345678"
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                        />
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>"01012345678" 형식으로 하이픈(-) 없이 숫자만 입력해주세요.</p>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          생년월일이 무엇인가요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          type="text" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="YYYYMMDD"
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                        />
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>"19900101" 형식으로 8자리를 입력해주세요.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 봉사 2페이지: 처음 오시나요? 등 */}
                      <div style={{ borderTop: step === 2 ? 'none' : '1px solid #E5E7EB', paddingTop: step === 2 ? '0' : '24px' }}>
                        <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                          봉봉단에 첫 봉사이신가요? <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                            <input type="radio" name="isFirstTime" value="네, 처음입니다 (예비 단원)" checked={formData.isFirstTime === '네, 처음입니다 (예비 단원)'} onChange={handleChange} />
                            네, 처음입니다 (예비 단원)
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                            <input type="radio" name="isFirstTime" value="아니요, 기존 단원입니다" checked={formData.isFirstTime === '아니요, 기존 단원입니다'} onChange={handleChange} />
                            아니요, 기존 단원입니다
                          </label>
                        </div>
                      </div>`;

content = content.replace(targetStep2_DogOnly, repStep2_DogOnly);

// The end of Step 2 logic needs to close the <>) for `activeTab !== gathering`
// Let's find where Step 2 ends:
const step2End = `                  </div>
                </>
              )}

              {/* === 3페이지 (운전자 픽업 정보) === */}`;

const repStep2End = `                  </div>
                    </>
                  )}
                </>
              )}

              {/* === 3페이지 === */}`;

content = content.replace(step2End, repStep2End);

fs.writeFileSync(file, content);
console.log('Phase 5 done');
