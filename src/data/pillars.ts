import type { Pillar } from '../types';

export const PILLARS: Pillar[] = [
  {
    id: 'knowledge',
    name: 'Knowledge',
    tagline: 'Learn new skills, read, and practice your craft',
    icon: '📚',
    color: 'sky',
  },
  {
    id: 'speech',
    name: 'Speech',
    tagline: 'Communicate with confidence and connect with people',
    icon: '💬',
    color: 'amber',
  },
  {
    id: 'health',
    name: 'Health',
    tagline: 'Build healthy habits and cut back on the harmful ones',
    icon: '💪',
    color: 'emerald',
  },
  {
    id: 'purpose',
    name: 'Purpose',
    tagline: 'Find fulfillment, plan adventures, and live with intention',
    icon: '🧭',
    color: 'violet',
  },
  {
    id: 'finance',
    name: 'Finance',
    tagline: 'Grow your income, your skills, and your wealth',
    icon: '💰',
    color: 'rose',
  },
];

export const PILLAR_MAP: Record<string, Pillar> = Object.fromEntries(
  PILLARS.map((p) => [p.id, p]),
);
