import type { PillarId } from '../types';
import { PILLARS } from './pillars';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  pillar?: PillarId;
}

const PILLAR_TIERS = [
  { suffix: 'novice', level: 5, title: 'Novice', icon: '🥉' },
  { suffix: 'adept', level: 10, title: 'Adept', icon: '🥈' },
  { suffix: 'master', level: 20, title: 'Master', icon: '🥇' },
];

const pillarAchievements: AchievementDefinition[] = PILLARS.flatMap((pillar) =>
  PILLAR_TIERS.map((tier) => ({
    id: `${pillar.id}-${tier.suffix}`,
    title: `${pillar.name} ${tier.title}`,
    description: `Reach level ${tier.level} in ${pillar.name}.`,
    icon: tier.icon,
    pillar: pillar.id,
  })),
);

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-quest',
    title: 'Getting Started',
    description: 'Complete your first quest.',
    icon: '🌱',
  },
  {
    id: 'quest-veteran',
    title: 'Quest Veteran',
    description: 'Complete 25 quests in total.',
    icon: '🎯',
  },
  {
    id: 'quest-master',
    title: 'Quest Master',
    description: 'Complete 100 quests in total.',
    icon: '🏆',
  },
  {
    id: 'well-rounded',
    title: 'Well-Rounded',
    description: 'Reach level 2 in all five pillars.',
    icon: '🌟',
  },
  {
    id: 'renaissance-soul',
    title: 'Renaissance Soul',
    description: 'Reach level 5 in all five pillars.',
    icon: '✨',
  },
  {
    id: 'overall-level-10',
    title: 'Rising Star',
    description: 'Reach overall level 10.',
    icon: '🚀',
  },
  {
    id: 'overall-level-25',
    title: 'Legend in the Making',
    description: 'Reach overall level 25.',
    icon: '👑',
  },
  {
    id: 'custom-quest',
    title: 'Quest Designer',
    description: 'Create a custom quest of your own.',
    icon: '🛠️',
  },
  {
    id: 'streak-3',
    title: 'On a Roll',
    description: 'Reach a 3-day streak on any health habit.',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    title: 'Week Strong',
    description: 'Reach a 7-day streak on any health habit.',
    icon: '🔥',
  },
  {
    id: 'streak-30',
    title: 'Iron Will',
    description: 'Reach a 30-day streak on any health habit.',
    icon: '🔥',
  },
  {
    id: 'clean-sweep',
    title: 'Clean Sweep',
    description: 'Meet your goal on all 5 health habits on the same day.',
    icon: '🧹',
  },
  ...pillarAchievements,
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDefinition> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);
