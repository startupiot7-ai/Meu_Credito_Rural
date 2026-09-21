/**
 * Meu Crédito Rural — Design Tokens
 * ---------------------------------
 * Single source of truth for the visual language. Consumed by `tailwind.config.ts`
 * (which exposes every token as a utility class) and, where a raw value is needed,
 * imported directly by components.
 *
 * Brand concept: the lighthouse ("farol") — orientation, visibility, direction.
 * Environment: Brazilian coffee agribusiness — fertile soil, coffee leaves,
 * parchment coffee, warm sunlight.
 *
 * Rules of thumb encoded here:
 *  - Deep agricultural green is the primary voice.
 *  - Warm beige / off-white is the page, never pure white.
 *  - Amber ("luz do farol") is the accent and the focus ring — it marks the path.
 *  - Colour never carries meaning alone; every status token ships with a
 *    background / border / foreground triple meant to be paired with an icon
 *    and a text label.
 */

/* ------------------------------------------------------------------ colour */

/** Primary — deep agricultural green. The canopy of a coffee plantation. */
export const canopy = {
  50: '#F1F6F1',
  100: '#DCE8DC',
  200: '#B9D1BA',
  300: '#8FB492',
  400: '#63926A',
  500: '#43744C',
  600: '#2F5B39',
  700: '#26492F',
  800: '#1E3A26',
  900: '#162B1D',
  950: '#0E1B12',
} as const;

/** Secondary — roasted coffee brown. Supporting surfaces and earth accents. */
export const coffee = {
  50: '#FAF4EF',
  100: '#F0E3D7',
  200: '#DFC7B1',
  300: '#C8A384',
  400: '#AE7D59',
  500: '#96633F',
  600: '#7A4F33',
  700: '#613F2A',
  800: '#4B3122',
  900: '#38251A',
} as const;

/** Accent — the lighthouse beam. Golden hour over the fields. */
export const beam = {
  50: '#FEF8EB',
  100: '#FBEDC9',
  200: '#F7DC94',
  300: '#F1C55A',
  400: '#E9AE2E',
  500: '#D9911A',
  600: '#B97113',
  700: '#955614',
  800: '#7A4617',
  900: '#663B17',
} as const;

/** Neutral surfaces — parchment coffee, raw beige. The page lives here. */
export const sand = {
  50: '#FDFBF6',
  100: '#F7F2E8',
  200: '#EFE7D7',
  300: '#E2D6C0',
  400: '#CFBEA1',
  500: '#B8A283',
  600: '#9A8467',
} as const;

/** Text — warm dark neutrals. Pure black is never used. */
export const ink = {
  900: '#1C1A16',
  800: '#2B2721',
  700: '#3D3830',
  600: '#5A5347',
  500: '#736B5C',
  400: '#9A917F',
  300: '#BDB4A2',
} as const;

/**
 * Status — "luz verde / amarela / vermelha".
 * Each entry is a surface + border + foreground trio verified for >= 4.5:1
 * foreground-on-surface contrast.
 */
export const status = {
  healthy: { surface: '#E8F2EA', border: '#A8CBB2', fg: '#1F5C37', solid: '#2F7D4F' },
  attention: { surface: '#FCF2DC', border: '#EBD08C', fg: '#7A5410', solid: '#C98A0F' },
  risk: { surface: '#F8E9E6', border: '#E0B3AB', fg: '#8F2F26', solid: '#A63D33' },
  info: { surface: '#EEF3F0', border: '#C2D3CA', fg: '#2B4B3C', solid: '#3E6B57' },
} as const;

/* -------------------------------------------------------------- typography */

/**
 * Two families only. `display` (warm serif) carries voice and hierarchy,
 * `sans` (humanist) carries everything the producer has to read and act on.
 * Both are self-hosted through `next/font` — no third-party request at runtime,
 * which matters on unstable rural connectivity.
 */
export const fontFamily = {
  display: ['var(--font-display)', 'Georgia', 'serif'],
  sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
} as const;

/**
 * Type scale. Sized generously: a large share of our audience is older and
 * reading on a phone in daylight. Body text never goes below 1rem.
 * Tuple format is `[size, { lineHeight, letterSpacing }]`.
 */
export const fontSize = {
  caption: ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
  'body-sm': ['0.9375rem', { lineHeight: '1.5rem' }],
  body: ['1rem', { lineHeight: '1.625rem' }],
  'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'title-sm': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
  title: ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
  'title-lg': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
  display: ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
  'display-lg': ['2.75rem', { lineHeight: '3rem', letterSpacing: '-0.03em' }],
  'display-xl': ['3.5rem', { lineHeight: '3.75rem', letterSpacing: '-0.03em' }],
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/* ----------------------------------------------------------------- spacing */

/**
 * 4px base grid. The named steps below are the only ones section layouts use,
 * so vertical rhythm stays consistent across pages.
 */
export const spacing = {
  'gutter-mobile': '1.25rem', // 20px — page side padding on phones
  'gutter-desktop': '2rem',
  'section-y': '3.5rem', // 56px — vertical padding between landing sections (mobile)
  'section-y-lg': '6rem',
  'stack-xs': '0.5rem',
  'stack-sm': '0.75rem',
  'stack-md': '1rem',
  'stack-lg': '1.5rem',
  'stack-xl': '2.5rem',
  /** Minimum comfortable touch target on mobile. */
  touch: '2.75rem', // 44px
} as const;

/* ------------------------------------------------------------------ radius */

export const borderRadius = {
  sm: '0.375rem',
  md: '0.625rem',
  lg: '0.875rem',
  xl: '1.25rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
} as const;

/* ----------------------------------------------------------------- shadows */

/** Warm-tinted, low-contrast elevation. No glassmorphism, no glow for glow's sake. */
export const boxShadow = {
  xs: '0 1px 2px rgba(28, 26, 22, 0.06)',
  sm: '0 2px 6px rgba(28, 26, 22, 0.06), 0 1px 2px rgba(28, 26, 22, 0.04)',
  md: '0 6px 16px rgba(28, 26, 22, 0.08)',
  lg: '0 12px 32px rgba(28, 26, 22, 0.10)',
  /** Raised card lifted off the beige page without a hard border. */
  card: '0 1px 2px rgba(28, 26, 22, 0.04), 0 8px 24px -12px rgba(28, 26, 22, 0.18)',
  /** The focus ring: a beam of light, not a browser default outline. */
  focus: '0 0 0 3px rgba(233, 174, 46, 0.45)',
  none: 'none',
} as const;

/* --------------------------------------------------------------- animation */

/**
 * Motion is only used to communicate progress, transition, confirmation or
 * relationship. Every keyframe below is disabled under `prefers-reduced-motion`
 * in `globals.css`.
 */
export const duration = {
  fast: '120ms',
  base: '200ms',
  slow: '320ms',
  beam: '900ms',
} as const;

export const easing = {
  /** Default for UI state changes. */
  standard: 'cubic-bezier(0.2, 0, 0.2, 1)',
  /** Entrances — light arriving. */
  enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/* ------------------------------------------------------------- breakpoints */

/** Mobile-first. The named widths we actually design and test against. */
export const screens = {
  xs: '360px',
  sm: '430px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

/** Maximum comfortable measure for running text (~65 characters). */
export const maxWidth = {
  prose: '38rem',
  content: '72rem',
} as const;

export const tokens = {
  canopy,
  coffee,
  beam,
  sand,
  ink,
  status,
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  boxShadow,
  duration,
  easing,
  screens,
  maxWidth,
} as const;

export type Tokens = typeof tokens;
