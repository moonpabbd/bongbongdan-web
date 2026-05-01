const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

const step4End = `                      네, 본인 이름으로 입금 완료했습니다.
                    </label>
                  </div>
                </>
              )}

              {/* === 5페이지 (마지막 추가 문항) === */}`;

const repStep4End = `                      네, 본인 이름으로 입금 완료했습니다.
                    </label>
                  </div>
                    </>
                  )}
                </>
              )}

              {/* === 5페이지 (마지막 추가 문항) === */}`;

content = content.replace(step4End, repStep4End);

const step5Start = `              {/* === 5페이지 (마지막 추가 문항) === */}
              {step === 5 && (`;

const repStep5Start = `              {/* === 5페이지 (마지막 추가 문항) === */}
              {step === 5 && activeTab !== 'gathering' && (`;

content = content.replace(step5Start, repStep5Start);

fs.writeFileSync(file, content);
console.log('Fixed step 4 end and step 5 start');
