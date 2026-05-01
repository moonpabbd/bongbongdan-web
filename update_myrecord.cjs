const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/MyRecord.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add activeTab state
content = content.replace(
  "const [isChangeProcessing, setIsChangeProcessing] = useState(false);",
  "const [isChangeProcessing, setIsChangeProcessing] = useState(false);\n  const [activeTab, setActiveTab] = useState<'dog' | 'gathering'>('dog');"
);

// 2. Add Tab UI
const tabUI = `                {/* 내 활동 요약 (봉사 시간, 포인트, 참가 횟수 등) */}
                {record.stats && (`;

const repTabUI = `                {/* 봉사/모임 탭 */}
                <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 mb-6 mx-6 mt-6">
                  <button 
                    onClick={() => setActiveTab('dog')}
                    className={\`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all \${activeTab === 'dog' ? 'bg-white text-blue-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}\`}
                  >
                    🐶 봉사 활동
                  </button>
                  <button 
                    onClick={() => setActiveTab('gathering')}
                    className={\`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all \${activeTab === 'gathering' ? 'bg-white text-yellow-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}\`}
                  >
                    🎉 모임 활동
                  </button>
                </div>

                {/* 내 활동 요약 (봉사 시간, 포인트, 참가 횟수 등) */}
                {record.stats && (`;

content = content.replace(tabUI, repTabUI);

// 3. Conditional rendering for upcoming and past
const upcomingTarget = `{/* 다가올 일정 */}
                {record.upcoming && record.upcoming.length > 0 && (
                  <div className="p-6 bg-blue-50/30 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={18} className="text-blue-500" />
                      <h4 className="text-[15px] font-bold text-gray-800">다가올 일정</h4>
                    </div>
                    <div className="flex flex-col gap-3">
                      {record.upcoming.map((u: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                          {u.dday !== '?' && (
                            <span className="inline-block bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-md shrink-0 w-fit">
                              D-{u.dday === 0 ? 'DAY' : u.dday}
                            </span>
                          )}
                          <div className="flex-1 text-sm font-semibold text-gray-700 leading-relaxed">{u.text}</div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleChangeClick(u.text, u.dday)}
                              disabled={cancelingItem === u.text}
                              className={\`text-xs font-bold px-3 py-2 rounded-lg transition border disabled:opacity-50 \${u.dday !== '?' && u.dday < 7
                                  ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100'
                                }\`}
                            >
                              일정 변경
                            </button>
                            <button
                              onClick={() => handleCancel(u.text)}
                              disabled={cancelingItem === u.text}
                              className="text-xs font-bold px-3 py-2 rounded-lg transition bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 disabled:opacity-50"
                            >
                              {cancelingItem === u.text ? '취소 중...' : '신청 취소'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 px-2">
                      <p className="text-[12px] text-gray-400 leading-relaxed">
                        * 봉사 일정 변경 및 취소는 <strong className="font-semibold text-gray-500">봉사일 기준 최소 1주일 전</strong>까지만 가능합니다.<br />
                        * 일정 변경은 <strong className="font-semibold text-gray-500">현재 모집 중인 봉사</strong>로만 가능합니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 지난 기록 */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <History size={18} className="text-gray-500" />
                    <h4 className="text-[15px] font-bold text-gray-800">최근 활동 기록</h4>
                  </div>
                  {record.past && record.past.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {record.past.slice(0, pastLimit).map((p: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                          <span className="text-[13px] text-gray-600 font-medium leading-relaxed">{p}</span>
                        </div>
                      ))}
                      {record.past.length > pastLimit && (
                        <button 
                          onClick={() => setPastLimit(record.past.length)}
                          className="mt-2 text-[13px] font-bold text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 py-2 bg-gray-50 rounded-lg transition"
                        >
                          <ChevronDown size={14} /> 기록 더보기 ({record.past.length - pastLimit}개)
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                      <p className="text-[13px] text-gray-400 font-medium">아직 참여하신 봉사 기록이 없습니다.</p>
                      <button onClick={() => navigate('/apply')} className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-blue-700 transition">
                        첫 봉사 신청하기
                      </button>
                    </div>
                  )}
                </div>`;

const repUpcoming = `{/* 다가올 일정 & 지난 기록 분기 */}
                {activeTab === 'dog' ? (
                  <>
                    {/* 다가올 봉사 일정 */}
                    {record.upcoming && record.upcoming.length > 0 && (
                      <div className="p-6 bg-blue-50/30 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock size={18} className="text-blue-500" />
                          <h4 className="text-[15px] font-bold text-gray-800">다가올 일정</h4>
                        </div>
                        <div className="flex flex-col gap-3">
                          {record.upcoming.map((u: any, i: number) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                              {u.dday !== '?' && (
                                <span className="inline-block bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-md shrink-0 w-fit">
                                  D-{u.dday === 0 ? 'DAY' : u.dday}
                                </span>
                              )}
                              <div className="flex-1 text-sm font-semibold text-gray-700 leading-relaxed">{u.text}</div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => handleChangeClick(u.text, u.dday)}
                                  disabled={cancelingItem === u.text}
                                  className={\`text-xs font-bold px-3 py-2 rounded-lg transition border disabled:opacity-50 \${u.dday !== '?' && u.dday < 7
                                      ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100'
                                    }\`}
                                >
                                  일정 변경
                                </button>
                                <button
                                  onClick={() => handleCancel(u.text)}
                                  disabled={cancelingItem === u.text}
                                  className="text-xs font-bold px-3 py-2 rounded-lg transition bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 disabled:opacity-50"
                                >
                                  {cancelingItem === u.text ? '취소 중...' : '신청 취소'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
    
                        <div className="mt-5 px-2">
                          <p className="text-[12px] text-gray-400 leading-relaxed">
                            * 봉사 일정 변경 및 취소는 <strong className="font-semibold text-gray-500">봉사일 기준 최소 1주일 전</strong>까지만 가능합니다.<br />
                            * 일정 변경은 <strong className="font-semibold text-gray-500">현재 모집 중인 봉사</strong>로만 가능합니다.
                          </p>
                        </div>
                      </div>
                    )}
    
                    {/* 지난 봉사 기록 */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <History size={18} className="text-gray-500" />
                        <h4 className="text-[15px] font-bold text-gray-800">최근 활동 기록</h4>
                      </div>
                      {record.past && record.past.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {record.past.slice(0, pastLimit).map((p: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                              <span className="text-[13px] text-gray-600 font-medium leading-relaxed">{p}</span>
                            </div>
                          ))}
                          {record.past.length > pastLimit && (
                            <button 
                              onClick={() => setPastLimit(record.past.length)}
                              className="mt-2 text-[13px] font-bold text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 py-2 bg-gray-50 rounded-lg transition"
                            >
                              <ChevronDown size={14} /> 기록 더보기 ({record.past.length - pastLimit}개)
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                          <p className="text-[13px] text-gray-400 font-medium">아직 참여하신 봉사 기록이 없습니다.</p>
                          <button onClick={() => navigate('/apply')} className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-blue-700 transition">
                            첫 봉사 신청하기
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* 다가올 모임 일정 */}
                    {record.upcomingGathering && record.upcomingGathering.length > 0 && (
                      <div className="p-6 bg-yellow-50/30 border-b border-yellow-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock size={18} className="text-yellow-600" />
                          <h4 className="text-[15px] font-bold text-gray-800">다가올 모임 일정</h4>
                        </div>
                        <div className="flex flex-col gap-3">
                          {record.upcomingGathering.map((u: any, i: number) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-yellow-200 shadow-sm">
                              {u.dday !== '?' && (
                                <span className="inline-block bg-yellow-600 text-white text-xs font-black px-2.5 py-1 rounded-md shrink-0 w-fit">
                                  D-{u.dday === 0 ? 'DAY' : u.dday}
                                </span>
                              )}
                              <div className="flex-1 text-sm font-semibold text-gray-700 leading-relaxed">{u.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
    
                    {/* 지난 모임 기록 */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <History size={18} className="text-gray-500" />
                        <h4 className="text-[15px] font-bold text-gray-800">최근 모임 기록</h4>
                      </div>
                      {record.pastGathering && record.pastGathering.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {record.pastGathering.slice(0, pastLimit).map((p: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                              <span className="text-[13px] text-gray-600 font-medium leading-relaxed">{p}</span>
                            </div>
                          ))}
                          {record.pastGathering.length > pastLimit && (
                            <button 
                              onClick={() => setPastLimit(record.pastGathering.length)}
                              className="mt-2 text-[13px] font-bold text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 py-2 bg-gray-50 rounded-lg transition"
                            >
                              <ChevronDown size={14} /> 기록 더보기 ({record.pastGathering.length - pastLimit}개)
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                          <p className="text-[13px] text-gray-400 font-medium">아직 참여하신 모임 기록이 없습니다.</p>
                          <button onClick={() => {
                              navigate('/apply');
                            }} className="mt-4 px-5 py-2.5 bg-yellow-600 text-white text-xs font-bold rounded-full shadow-sm hover:bg-yellow-700 transition">
                            모임 신청하기
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}`;

content = content.replace(upcomingTarget, repUpcoming);

fs.writeFileSync(file, content);
console.log('MyRecord updated');
