const GAS_URL = "https://script.google.com/macros/s/AKfycbxIm5xbRwSV9f0I0oCfITu6UWr5Zofd8f_CYx90sXl0g4PL_z2B4ATNSVgRjrSbR1mAlw/exec";

// 진행 중인 혹은 완료된 fetch 프로미스를 캐싱
const cache = new Map<string, Promise<any>>();

export function prefetchRankings() {
  const url = `${GAS_URL}?action=getRankings`;
  if (!cache.has(url)) {
    const promise = fetch(url).then(r => r.json()).catch(err => {
      cache.delete(url); // 에러 시 캐시 해제하여 다음 번에 재시도
      throw err;
    });
    cache.set(url, promise);
  }
  return cache.get(url)!;
}

export function prefetchRecord(name: string, phone: string, birthdate: string) {
  if (!name || !phone || !birthdate) return Promise.resolve(null);
  const url = `${GAS_URL}?action=getRecord&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&birthdate=${encodeURIComponent(birthdate)}`;
  if (!cache.has(url)) {
    const promise = fetch(url).then(r => r.json()).catch(err => {
      cache.delete(url);
      throw err;
    });
    cache.set(url, promise);
  }
  return cache.get(url)!;
}

export function invalidateRecordCache(name: string, phone: string, birthdate: string) {
  if (!name || !phone || !birthdate) return;
  const url = `${GAS_URL}?action=getRecord&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&birthdate=${encodeURIComponent(birthdate)}`;
  cache.delete(url);
}
