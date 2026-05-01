const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/MyRecord.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `            {/* 우측: 타임라인 & 리스트 영역 */}
            <div className="flex flex-col gap-8">

              {/* 예정된 봉사 */}
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-xl"><Clock size={20} className="text-blue-500" /></div>
                    <h4 className="text-lg font-bold text-gray-800">예정된 봉사</h4>
                  </div>
                  {/* 기존 집결 취소 전체 링크 제거 및 각 리스트별 버튼으로 대체 */}
                </div>

                {validUpcoming.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {validUpcoming.map((u: any, i: number) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition hover:border-blue-100 hover:bg-blue-50/30">
                        {u.dday !== '?' && (
                          <span className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                            {u.dday === 0 ? 'D-Day' : \`D-\${u.dday}\`}
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
                            {cancelingItem === u.text ? '처리 중...' : '취소하기'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    예정된 봉사가 없습니다.
                  </div>
                )}

                <div className="mt-5 px-2">
                  <p className="text-[12px] text-gray-400 leading-relaxed">
                    * 봉사 일정 변경 및 취소는 <strong className="font-semibold text-gray-500">봉사일 기준 최소 1주일 전</strong>까지만 가능합니다.<br />
                    * 일정 변경은 <strong className="font-semibold text-gray-500">현재 모집 중인 봉사</strong>로만 가능합니다.
                  </p>
                </div>
              </div>

              {/* 이전 봉사 기록 (타임라인 구조) */}
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                <div className="flex items-center gap-2 mb-8">
                  <div className="p-2 bg-green-50 rounded-xl"><History size={20} className="text-green-600" /></div>
                  <h4 className="text-lg font-bold text-gray-800">이전 봉사 기록</h4>
                  <span className="ml-auto text-sm font-semibold text-gray-400">총 {validPast.length}건</span>
                </div>

                {validPast.length > 0 ? (
                  <div className="pl-4">
                    <div className="relative border-l-2 border-gray-100 pb-4">
                      {validPast.slice(0, pastLimit).map((p: any, i: number) => (
                        <div key={i} className="relative pl-6 pb-8 last:pb-2">
                          <div className="absolute w-3.5 h-3.5 bg-white border-2 border-green-500 rounded-full -left-[9px] top-1"></div>
                          <div className="text-sm font-medium text-gray-600 bg-gray-50 inline-block px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                            {p.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {validPast.length > pastLimit && (
                      <button
                        onClick={() => setPastLimit(prev => prev + 5)}
                        className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        이전 기록 더보기 <ChevronDown size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    이전 봉사 기록이 없습니다.
                  </div>
                )}
              </div>

            </div>`;

const rep = `            {/* 우측: 타임라인 & 리스트 영역 */}
            <div className="flex flex-col gap-8">

              {/* 봉사/모임 탭 */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setActiveTab('dog')}
                  className={\`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all \${activeTab === 'dog' ? 'bg-white text-blue-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}\`}
                >
                  봉사 활동
                </button>
                <button 
                  onClick={() => setActiveTab('gathering')}
                  className={\`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all \${activeTab === 'gathering' ? 'bg-white text-yellow-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}\`}
                >
                  모임 활동
                </button>
              </div>

              {activeTab === 'dog' ? (
                <>
                  {/* 예정된 봉사 */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl"><Clock size={20} className="text-blue-500" /></div>
                        <h4 className="text-lg font-bold text-gray-800">예정된 봉사</h4>
                      </div>
                    </div>

                    {validUpcoming.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {validUpcoming.map((u: any, i: number) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition hover:border-blue-100 hover:bg-blue-50/30">
                            {u.dday !== '?' && (
                              <span className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                                {u.dday === 0 ? 'D-Day' : \`D-\${u.dday}\`}
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
                                {cancelingItem === u.text ? '처리 중...' : '취소하기'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        예정된 봉사가 없습니다.
                      </div>
                    )}

                    <div className="mt-5 px-2">
                      <p className="text-[12px] text-gray-400 leading-relaxed">
                        * 봉사 일정 변경 및 취소는 <strong className="font-semibold text-gray-500">봉사일 기준 최소 1주일 전</strong>까지만 가능합니다.<br />
                        * 일정 변경은 <strong className="font-semibold text-gray-500">현재 모집 중인 봉사</strong>로만 가능합니다.
                      </p>
                    </div>
                  </div>

                  {/* 이전 봉사 기록 (타임라인 구조) */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="p-2 bg-green-50 rounded-xl"><History size={20} className="text-green-600" /></div>
                      <h4 className="text-lg font-bold text-gray-800">이전 봉사 기록</h4>
                      <span className="ml-auto text-sm font-semibold text-gray-400">총 {validPast.length}건</span>
                    </div>

                    {validPast.length > 0 ? (
                      <div className="pl-4">
                        <div className="relative border-l-2 border-gray-100 pb-4">
                          {validPast.slice(0, pastLimit).map((p: any, i: number) => (
                            <div key={i} className="relative pl-6 pb-8 last:pb-2">
                              <div className="absolute w-3.5 h-3.5 bg-white border-2 border-green-500 rounded-full -left-[9px] top-1"></div>
                              <div className="text-sm font-medium text-gray-600 bg-gray-50 inline-block px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                                {p.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {validPast.length > pastLimit && (
                          <button
                            onClick={() => setPastLimit(prev => prev + 5)}
                            className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2 shadow-sm"
                          >
                            이전 기록 더보기 <ChevronDown size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        이전 봉사 기록이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* 예정된 모임 */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-yellow-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-50 rounded-xl"><Clock size={20} className="text-yellow-600" /></div>
                        <h4 className="text-lg font-bold text-gray-800">예정된 모임</h4>
                      </div>
                    </div>

                    {record?.upcomingGathering && record.upcomingGathering.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {record.upcomingGathering.map((u: any, i: number) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition hover:border-yellow-100 hover:bg-yellow-50/30">
                            {u.dday !== '?' && (
                              <span className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg border border-yellow-200">
                                {u.dday === 0 ? 'D-Day' : \`D-\${u.dday}\`}
                              </span>
                            )}
                            <div className="flex-1 text-sm font-semibold text-gray-700 leading-relaxed">{u.text}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        예정된 모임이 없습니다.
                      </div>
                    )}
                  </div>

                  {/* 이전 모임 기록 (타임라인 구조) */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="p-2 bg-gray-100 rounded-xl"><History size={20} className="text-gray-500" /></div>
                      <h4 className="text-lg font-bold text-gray-800">이전 모임 기록</h4>
                      <span className="ml-auto text-sm font-semibold text-gray-400">총 {record?.pastGathering?.length || 0}건</span>
                    </div>

                    {record?.pastGathering && record.pastGathering.length > 0 ? (
                      <div className="pl-4">
                        <div className="relative border-l-2 border-gray-100 pb-4">
                          {record.pastGathering.slice(0, pastLimit).map((p: any, i: number) => (
                            <div key={i} className="relative pl-6 pb-8 last:pb-2">
                              <div className="absolute w-3.5 h-3.5 bg-white border-2 border-gray-400 rounded-full -left-[9px] top-1"></div>
                              <div className="text-sm font-medium text-gray-600 bg-gray-50 inline-block px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                                {p.text || p}
                              </div>
                            </div>
                          ))}
                        </div>

                        {record.pastGathering.length > pastLimit && (
                          <button
                            onClick={() => setPastLimit(prev => prev + 5)}
                            className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2 shadow-sm"
                          >
                            이전 기록 더보기 <ChevronDown size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        이전 모임 기록이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>`;

content = content.replace(target, rep);

fs.writeFileSync(file, content);
console.log('MyRecord UI fixed!');
