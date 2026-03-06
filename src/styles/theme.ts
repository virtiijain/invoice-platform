export const colors = {
  // Brand
  primary: '#f97316',
  primaryLight: '#fb923c',
  primaryDark: '#ea6c0a',
  primaryGlow: 'rgba(249,115,22,0.35)',
  primarySubtle: 'rgba(251,146,60,0.12)',
  primaryBorder: 'rgba(251,146,60,0.25)',

  // Background
  bgBase: '#0f172a',
  bgDeep: '#0a0f1e',
  bgPanel: '#1e1b2e',
  bgCard: 'rgba(255,255,255,0.04)',
  bgCardHover: 'rgba(255,255,255,0.07)',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: 'rgba(241,245,249,0.55)',
  textMuted: 'rgba(241,245,249,0.35)',
  textDisabled: 'rgba(241,245,249,0.22)',

  // Border
  borderDefault: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.12)',
  borderPanel: 'rgba(255,255,255,0.06)',

  // Status
  success: '#34d399',
  successSubtle: 'rgba(52,211,153,0.12)',
  warning: '#fbbf24',
  warningSubtle: 'rgba(251,191,36,0.12)',
  error: '#f87171',
  errorSubtle: 'rgba(239,68,68,0.1)',
  errorBorder: 'rgba(239,68,68,0.2)',

  // Invoice status
  paid: '#34d399',
  paidSubtle: 'rgba(52,211,153,0.12)',
  unpaid: '#fbbf24',
  unpaidSubtle: 'rgba(251,191,36,0.12)',
  overdue: '#f87171',
  overdueSubtle: 'rgba(248,113,113,0.12)',
} as const

export const fonts = {
  heading: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
} as const

export const fontImport = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const

export const shadows = {
  primaryGlow: `0 4px 20px rgba(249,115,22,0.35)`,
  primaryGlowHover: `0 8px 30px rgba(249,115,22,0.5)`,
  card: `0 1px 3px rgba(0,0,0,0.3)`,
} as const

export const gradients = {
  primary: 'linear-gradient(135deg, #fb923c, #f97316)',
  primaryText: 'linear-gradient(135deg, #fb923c, #fdba74)',
  bgLeft: 'linear-gradient(160deg, #0f172a 0%, #1e1b2e 50%, #0f172a 100%)',
} as const

export const animations = {
  base: `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatA {
      0%,100% { transform: translate(0,0); }
      50%     { transform: translate(10px,-15px); }
    }
    @keyframes floatB {
      0%,100% { transform: translate(0,0); }
      50%     { transform: translate(-8px,12px); }
    }
  `,
  fadeUpClass: (delay: number) =>
    ({ animation: `fadeUp 0.65s cubic-bezier(.22,1,.36,1) ${delay}s forwards`, opacity: 0 } as const),
} as const