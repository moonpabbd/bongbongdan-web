const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStep1 = `                  {/* 1. 날짜 선택 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                      어느 날짜에 참여하시겠소? <span style={{ color: '#DC2626' }}>*</span>
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {isLoadingDates ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                          봉사 일정을 불러오는 중입니다...
                        </div>
                      ) : availableDates.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#DC2626', fontSize: '14px', fontWeight: '700' }}>
                          현재 모집 중인 봉사 일정이 없습니다.
                        </div>
                      ) : (
                        availableDates.map((opt, i) => {
                          const isClosed = opt.remaining <= 0 || opt.capacity === 0;
                          return (
                            <label
                              key={i}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px',
                                border: formData.date === opt.name ? '2px solid #C8963E' : '1px solid #E5E7EB',
                                borderRadius: '12px', cursor: isClosed ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                background: formData.date === opt.name ? '#FDFBF7' : isClosed ? '#F3F4F6' : '#fff',
                                opacity: isClosed ? 0.7 : 1
                              }}
                            >
                              <input
                                type="radio"
                                name="date"
                                value={opt.name}
                                checked={formData.date === opt.name}
                                onChange={handleChange}
                                disabled={isClosed}
                                style={{ width: '18px', height: '18px', accentColor: '#C8963E', flexShrink: 0 }}
                              />
                              <div style={{ fontSize: '14px', color: isClosed ? '#9CA3AF' : '#374151', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                  {isClosed ? (
                                    <span style={{ flexShrink: 0, background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', marginTop: '2px' }}>[모집 완료]</span>
                                  ) : (
                                    <span style={{ flexShrink: 0, color: '#065F46', fontWeight: '800', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginTop: '2px' }}>
                                      [모집 중]
                                    </span>
                                  )}
                                  <span style={{ fontWeight: formData.date === opt.name ? '700' : '500', textDecoration: isClosed ? 'line-through' : 'none', wordBreak: 'keep-all' }}>
                                    {opt.name}
                                  </span>
                                </div>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>`;

const repStep1 = `                  {/* 1. 날짜/모임 선택 */}
                  {activeTab === 'gathering' ? (
                    <div>
                      <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                        어느 모임에 참여하시나요? <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {isLoadingDates ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                            모임 일정을 불러오는 중입니다...
                          </div>
                        ) : gatherings.length === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#DC2626', fontSize: '14px', fontWeight: '700' }}>
                            현재 예정된 모임이 없습니다.
                          </div>
                        ) : (
                          gatherings.map((opt, i) => {
                            const isClosed = opt.remaining <= 0 || opt.capacity === 0;
                            return (
                              <div key={i}>
                                <label 
                                  style={{ 
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', 
                                    border: formData.q1 === opt.name ? '2px solid #C8963E' : '1px solid #E5E7EB', 
                                    borderRadius: '12px', cursor: isClosed ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                    background: formData.q1 === opt.name ? '#FDFBF7' : isClosed ? '#F3F4F6' : '#fff',
                                    opacity: isClosed ? 0.7 : 1
                                  }}
                                  onClick={(e) => {
                                    if (isClosed) {
                                      e.preventDefault(); return;
                                    }
                                    if (!profile) {
                                      e.preventDefault(); alert("회원가입한 단원만 신청 가능합니다."); return;
                                    }
                                    if (userVolCount === null || userVolCount < opt.minCount) {
                                      e.preventDefault(); alert(\`해당 모임은 봉사 신청 \${opt.minCount}회 이상 단원만 참여 가능합니다.\\n현재 봉사 신청 횟수: \${userVolCount || 0}회\`); return;
                                    }
                                  }}
                                >
                                  <input 
                                    type="radio" 
                                    name="q1" 
                                    value={opt.name}
                                    checked={formData.q1 === opt.name} 
                                    onChange={handleChange} 
                                    disabled={isClosed}
                                    style={{ width: '18px', height: '18px', accentColor: '#C8963E', flexShrink: 0 }} 
                                  />
                                  <div style={{ fontSize: '14px', color: isClosed ? '#9CA3AF' : '#374151', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                      {isClosed ? (
                                        <span style={{ flexShrink: 0, background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', marginTop: '2px' }}>[모집 완료]</span>
                                      ) : (
                                        <span style={{ flexShrink: 0, color: '#065F46', fontWeight: '800', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginTop: '2px' }}>
                                          [모집 중]
                                        </span>
                                      )}
                                      <span style={{ fontWeight: formData.q1 === opt.name ? '700' : '500', textDecoration: isClosed ? 'line-through' : 'none', wordBreak: 'keep-all' }}>
                                        {opt.name}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                                      모집: {opt.capacity}명 (잔여: {opt.remaining}명)
                                    </div>
                                  </div>
                                </label>
                                {formData.q1 === opt.name && (
                                  <div style={{ marginTop: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#4B5563', lineHeight: '1.6' }}>
                                    <div style={{ marginBottom: '8px' }}><strong>일정:</strong> {opt.scheduleDesc}</div>
                                    <div style={{ marginBottom: '8px' }}><strong>장소:</strong> {opt.location}</div>
                                    <div style={{ marginBottom: '8px' }}><strong>참가비:</strong> {opt.fee}</div>
                                    <div style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}><strong>안내사항:</strong><br />{opt.notice}</div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
                        어느 날짜에 참여하시겠소? <span style={{ color: '#DC2626' }}>*</span>
                      </label>
  
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {isLoadingDates ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                            봉사 일정을 불러오는 중입니다...
                          </div>
                        ) : availableDates.length === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#DC2626', fontSize: '14px', fontWeight: '700' }}>
                            현재 모집 중인 봉사 일정이 없습니다.
                          </div>
                        ) : (
                          availableDates.map((opt, i) => {
                            const isClosed = opt.remaining <= 0 || opt.capacity === 0;
                            return (
                              <label 
                                key={i} 
                                style={{ 
                                  display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', 
                                  border: formData.date === opt.name ? '2px solid #C8963E' : '1px solid #E5E7EB', 
                                  borderRadius: '12px', cursor: isClosed ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                  background: formData.date === opt.name ? '#FDFBF7' : isClosed ? '#F3F4F6' : '#fff',
                                  opacity: isClosed ? 0.7 : 1
                                }}
                              >
                                <input 
                                  type="radio" 
                                  name="date" 
                                  value={opt.name}
                                  checked={formData.date === opt.name} 
                                  onChange={handleChange} 
                                  disabled={isClosed}
                                  style={{ width: '18px', height: '18px', accentColor: '#C8963E', flexShrink: 0 }} 
                                />
                                <div style={{ fontSize: '14px', color: isClosed ? '#9CA3AF' : '#374151', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    {isClosed ? (
                                      <span style={{ flexShrink: 0, background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', marginTop: '2px' }}>[모집 완료]</span>
                                    ) : (
                                      <span style={{ flexShrink: 0, color: '#065F46', fontWeight: '800', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginTop: '2px' }}>
                                        [모집 중]
                                      </span>
                                    )}
                                    <span style={{ fontWeight: formData.date === opt.name ? '700' : '500', textDecoration: isClosed ? 'line-through' : 'none', wordBreak: 'keep-all' }}>
                                      {opt.name}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}`;

content = content.replace(targetStep1, repStep1);

const targetStep2Info = `                  {/* 2. 이름 */}
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

                  {/* 3. 성별 */}
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

                  {/* 4. 연락처 */}
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

                  {/* 5. 생년월일 */}
                  <div>
                    <label style={{ display: 'block', color: '#1E3A5F', fontSize: '15px', fontWeight: '800', marginBottom: '8px' }}>
                      생년월일이 무엇인가요? <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="YYYYMMDD"
                      style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: profile ? '#F3F4F6' : '#fff' }}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6B7280' }}>"19900101" 형식으로 8자리를 입력해주세요.</p>
                  </div>`;

const repStep2Info = `                  {activeTab === 'dog' && (
                    <>
                      {/* 2. 이름 */}
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

                      {/* 3. 성별 */}
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

                      {/* 4. 연락처 */}
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

                      {/* 5. 생년월일 */}
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
                  )}`;

content = content.replace(targetStep2Info, repStep2Info);

fs.writeFileSync(file, content);
console.log('Phase 4 done');
