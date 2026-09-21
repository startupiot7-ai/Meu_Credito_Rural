import type { Config } from 'tailwindcss';
import {
  beam,
  borderRadius,
  boxShadow,
  canopy,
  coffee,
  duration,
  easing,
  fontFamily,
  fontSize,
  fontWeight,
  ink,
  maxWidth,
  sand,
  screens,
  spacing,
  status,
} from './src/design-system/tokens';

/**
 * Tailwind is a projection of `src/design-system/tokens.ts` — never edit values
 * here. Add or change a token in that file and it becomes available as a class.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    screens,
    extend: {
      colors: {
        canopy,
        coffee,
        beam,
        sand,
        ink,
        healthy: status.healthy,
        attention: status.attention,
        risk: status.risk,
        info: status.info,
      },
      // Spread: Tailwind's types want mutable arrays, the tokens are `as const`.
      fontFamily: {
        display: [...fontFamily.display],
        sans: [...fontFamily.sans],
      },
      fontSize: fontSize as unknown as Record<string, [string, Record<string, string>]>,
      fontWeight,
      spacing,
      borderRadius,
      boxShadow,
      maxWidth,
      transitionDuration: duration,
      transitionTimingFunction: easing,
      keyframes: {
        'beam-sweep': {
          '0%': { opacity: '0', transform: 'translateX(-6%) scaleX(0.92)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '0.9', transform: 'translateX(0) scaleX(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-160% 0' },
          '100%': { backgroundPosition: '260% 0' },
        },
        'sheet-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'beam-sweep': `beam-sweep ${duration.beam} ${easing.enter} both`,
        'fade-up': `fade-up ${duration.slow} ${easing.enter} both`,
        shimmer: `shimmer 1.6s linear infinite`,
        'sheet-in': `sheet-in ${duration.slow} ${easing.enter}`,
      },
    },
  },
  plugins: [],
};

export default config;
