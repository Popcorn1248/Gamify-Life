import type { Pillar } from '../types';

interface PillarTheme {
  cardBg: string;
  cardBorder: string;
  text: string;
  bar: string;
  iconBg: string;
  button: string;
}

/**
 * Tailwind needs full class name strings to appear in source for its scanner to
 * pick them up, so each pillar color gets its own explicit set of classes here.
 */
const THEMES: Record<Pillar['color'], PillarTheme> = {
  sky: {
    cardBg: 'bg-sky-950/40',
    cardBorder: 'border-sky-500/30',
    text: 'text-sky-400',
    bar: 'bg-sky-500',
    iconBg: 'bg-sky-500/15',
    button: 'bg-sky-500 hover:bg-sky-400',
  },
  amber: {
    cardBg: 'bg-amber-950/40',
    cardBorder: 'border-amber-500/30',
    text: 'text-amber-400',
    bar: 'bg-amber-500',
    iconBg: 'bg-amber-500/15',
    button: 'bg-amber-500 hover:bg-amber-400',
  },
  emerald: {
    cardBg: 'bg-emerald-950/40',
    cardBorder: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/15',
    button: 'bg-emerald-500 hover:bg-emerald-400',
  },
  violet: {
    cardBg: 'bg-violet-950/40',
    cardBorder: 'border-violet-500/30',
    text: 'text-violet-400',
    bar: 'bg-violet-500',
    iconBg: 'bg-violet-500/15',
    button: 'bg-violet-500 hover:bg-violet-400',
  },
  rose: {
    cardBg: 'bg-rose-950/40',
    cardBorder: 'border-rose-500/30',
    text: 'text-rose-400',
    bar: 'bg-rose-500',
    iconBg: 'bg-rose-500/15',
    button: 'bg-rose-500 hover:bg-rose-400',
  },
};

export function getTheme(color: Pillar['color']): PillarTheme {
  return THEMES[color];
}
