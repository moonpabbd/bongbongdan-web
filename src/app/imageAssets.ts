// Use glob wildcard to load all PNG files — avoids Vite's Korean-filename resolution issue
const pngModules = import.meta.glob('/src/imports/*.png', { eager: true }) as Record<string, { default: string }>;
const jpgModules = import.meta.glob('/src/imports/*.{jpg,JPG,jpeg,JPEG}', { eager: true }) as Record<string, { default: string }>;

const keys = Object.keys(pngModules);

// Identify files using ASCII-only patterns (Korean filenames may use NFD normalization
// which doesn't match NFC string literals, so we avoid Korean in comparisons entirely).
//
// File inventory:
//   봉봉단_로고_시그니처_봉봉단_본부_02.png        → ends with _02.png (shorter)  → logoKey
//   봉봉단_로고_시그니처_봉봉단_본부_슬로건_02.png  → ends with _02.png (longer)   → logoSloganKey
//   심볼_봉봉단_본부_02_3D.png                    → contains _3D                 → symbol3DKey
//   심볼_봉봉단_본부_03.png                        → ends with 03.png             → symbolKey

const symbol3DKey = keys.find(k => k.includes('_3D')) ?? '';
const symbolKey   = keys.find(k => k.endsWith('03.png')) ?? '';

// The two logo files both end with _02.png; sort by path length: shorter = no-slogan logo
const logoKeys    = keys.filter(k => k.endsWith('_02.png')).sort((a, b) => a.length - b.length);
const logoKey     = logoKeys[0] ?? '';
const logoSloganKey = logoKeys[1] ?? '';

export const logoImg       = logoKey       ? (pngModules[logoKey]?.default       ?? '') : '';
export const logoSloganImg = logoSloganKey ? (pngModules[logoSloganKey]?.default ?? '') : '';
export const symbol3DImg   = symbol3DKey   ? (pngModules[symbol3DKey]?.default   ?? '') : '';
export const symbolImg     = symbolKey     ? (pngModules[symbolKey]?.default     ?? '') : '';

// JPG assets — group photos and home backgrounds
const jpgKeys = Object.keys(jpgModules).sort();
// Only include volunteer image 01 ~ 05 for the group photos slider
const volunteerImageKeys = jpgKeys.filter(k => k.toLowerCase().includes('volunteer image')).sort();
export const groupPhotos: string[] = volunteerImageKeys.map(k => jpgModules[k]?.default ?? '').filter(Boolean);
// Convenience alias for single photo (first one)
export const groupPhotoImg = groupPhotos[0] ?? '';

// Specific home background images (Home 이미지01~04.jpg)
const homeImageKeys = Object.keys(jpgModules).filter(k => k.toLowerCase().includes('home')).sort();
export const homeImages: string[] = homeImageKeys.map(k => jpgModules[k]?.default ?? '').filter(Boolean);

// Section 2 specific image (Home first image.jpg)
const homeSection1Key = Object.keys(jpgModules).find(k => k.includes('Home first image')) ?? '';
export const homeSection1Img = homeSection1Key ? (jpgModules[homeSection1Key]?.default ?? '') : '';
