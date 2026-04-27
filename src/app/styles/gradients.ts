/**
 * 봉봉단(BBD) 공통 그라디언트 디자인 시스템
 */

export const G = {
  // ─── Background Sections ──────────────────────────────────────────
  darkHero:    'linear-gradient(160deg, #060F1E 0%, #0D2240 30%, #1A3658 60%, #0A1C36 100%)',
  darkSection: 'linear-gradient(160deg, #0A1828 0%, #163352 50%, #0A1828 100%)',
  warmSection: 'linear-gradient(160deg, #FDFCFA 0%, #F5EEE3 60%, #FDFCFA 100%)',
  coolSection: 'linear-gradient(135deg, #F8FBFF 0%, #EEF4FF 100%)',
  pureSection: 'linear-gradient(160deg, #FFFFFF 0%, #F8F6F2 100%)',

  // ─── Card Backgrounds ────────────────────────────────────────────
  greenCard:  'linear-gradient(135deg, #EBF5EF 0%, #D4EBD8 100%)',
  blueCard:   'linear-gradient(135deg, #E8F0FA 0%, #D0E2F5 100%)',
  goldCard:   'linear-gradient(135deg, #FEF5E4 0%, #F5E3C0 100%)',
  purpleCard: 'linear-gradient(135deg, #F0EAF8 0%, #E2D5F5 100%)',
  redCard:    'linear-gradient(135deg, #FFF0EE 0%, #FFE0DC 100%)',

  // ─── Badge / Chip Gradients ───────────────────────────────────────
  goldBadge:   'linear-gradient(135deg, #A87830, #D4A84B)',
  greenBadge:  'linear-gradient(135deg, #2D5C40, #4A7C59)',
  blueBadge:   'linear-gradient(135deg, #163366, #2E5298)',
  purpleBadge: 'linear-gradient(135deg, #5A3C78, #8060A8)',
  redBadge:    'linear-gradient(135deg, #8B1C1C, #C24B3B)',
  newBadge:    'linear-gradient(135deg, #C24B3B, #E86060)',

  // ─── Button Gradients ────────────────────────────────────────────
  goldBtn:     'linear-gradient(135deg, #B8801E 0%, #C8963E 40%, #E8B060 100%)',
  navyBtn:     'linear-gradient(135deg, #0D2240 0%, #1E3A5F 50%, #2D5080 100%)',
  greenBtn:    'linear-gradient(135deg, #2D5C40 0%, #4A7C59 50%, #6A9C79 100%)',
  yellowBtn:   'linear-gradient(135deg, #D4B800, #FEE500)',

  // ─── Gradient Text (apply with getGradientText()) ────────────────
  goldTextBg:   'linear-gradient(135deg, #C8963E 0%, #F5C875 60%, #D4A040 100%)',
  whiteGoldTextBg: 'linear-gradient(135deg, #FFFFFF 0%, #FFE8A0 100%)',

  // ─── Accent Lines / Dividers ─────────────────────────────────────
  goldLine: 'linear-gradient(90deg, #C8963E, #F5C875, transparent)',
  navyLine: 'linear-gradient(90deg, #1E3A5F, #2D5A8E, transparent)',

  // ─── Specific Elements ───────────────────────────────────────────
  timelineCircle: 'linear-gradient(135deg, #C8963E, #F5C875)',
  heroOrb1: 'radial-gradient(circle, rgba(200,150,62,0.18) 0%, transparent 70%)',
  heroOrb2: 'radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%)',
  heroOrb3: 'radial-gradient(circle, rgba(107,76,138,0.12) 0%, transparent 70%)',
};

/** 그라디언트 텍스트 스타일 반환 */
export const gradientText = (gradient = G.goldTextBg): React.CSSProperties => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
});
