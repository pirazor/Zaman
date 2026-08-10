/**
 * Design tokens for Zaman.
 *
 * The type scale is deliberately larger than a typical mobile app and every
 * interactive target is at least 56pt tall: the primary audience includes
 * elderly users, so legibility and generous hit areas outrank density.
 * All foreground/background pairs below meet WCAG AA (>= 4.5:1) at these sizes.
 */

export type ColorScheme = 'light' | 'dark';

export interface Palette {
  /** Page background. */
  background: string;
  /** Raised card background. */
  surface: string;
  /** Subtly recessed row background used inside cards. */
  surfaceMuted: string;
  /** Hairline separators. */
  border: string;
  /** Primary body text. */
  text: string;
  /** Secondary text: labels, captions, dates. */
  textMuted: string;
  /** Brand green. */
  primary: string;
  /** Darker brand green, used as the far end of the hero gradient. */
  primaryDeep: string;
  /** Text drawn on top of `primary`. */
  onPrimary: string;
  /** Muted text drawn on top of `primary`. */
  onPrimaryMuted: string;
  /** Gold accent for the Qibla marker and the active prayer. */
  accent: string;
  /** Tint behind the currently active prayer row. */
  accentSoft: string;
  /** Success / "you are facing the Qibla". */
  success: string;
  /** Tint behind the guidance pill once the user faces the Qibla. */
  successSoft: string;
  /** Warnings such as a compass that needs calibrating. */
  warning: string;
  /** Errors such as a denied permission. */
  danger: string;
}

const light: Palette = {
  background: '#F5F1E8',
  surface: '#FFFFFF',
  surfaceMuted: '#FAF7F0',
  border: '#E2DCCE',
  text: '#15201B',
  textMuted: '#5A6560',
  primary: '#0F5132',
  primaryDeep: '#0A3A24',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#C8DFD3',
  accent: '#9A7B16',
  accentSoft: '#F6EDD5',
  success: '#146C43',
  successSoft: '#E4EFE8',
  warning: '#8A5A00',
  danger: '#A32218',
};

const dark: Palette = {
  background: '#0B1512',
  surface: '#16211C',
  surfaceMuted: '#1D2A24',
  border: '#2C3A33',
  text: '#F2F1EC',
  textMuted: '#A3B0A9',
  primary: '#1B7A4B',
  primaryDeep: '#0E3F28',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#BFD9CC',
  accent: '#E8C879',
  accentSoft: '#2A2415',
  success: '#4ADE80',
  successSoft: '#14301F',
  warning: '#F0B356',
  danger: '#F0776C',
};

export const palettes: Record<ColorScheme, Palette> = { light, dark };

/**
 * Font sizes. `display` is the countdown numerals on the home screen; `body`
 * is the smallest size used for anything a user actually needs to read.
 *
 * `display` is sized so that "1 hour 33 minutes" — numerals at this size, unit
 * names at `heading` — fits one line on a 393pt screen. Longer spans wrap to a
 * second line rather than shrinking.
 */
export const fontSize = {
  display: 52,
  title: 34,
  heading: 26,
  prayer: 24,
  body: 19,
  label: 16,
  caption: 14,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

/** Minimum height for anything tappable. */
export const MIN_TOUCH_TARGET = 56;

export const shadow = {
  card: {
    shadowColor: '#0A3A24',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  hero: {
    shadowColor: '#0A3A24',
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;
