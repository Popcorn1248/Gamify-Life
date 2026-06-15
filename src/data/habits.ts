import type { HabitDefinition } from '../types';

/**
 * Daily habit trackers for the Health pillar.
 * For 'max' habits, hitting goal means staying AT OR BELOW the target (reduce harmful things).
 */
export const HABITS: HabitDefinition[] = [
  {
    id: 'habit-sugar',
    name: 'Sugar',
    icon: '🍬',
    description: 'Sugary snacks, desserts, and sweetened drinks',
    unit: 'servings',
    defaultGoal: 2,
    goalDirection: 'max',
    xp: 10,
  },
  {
    id: 'habit-nicotine',
    name: 'Nicotine',
    icon: '🚬',
    description: 'Cigarettes, vapes, or other nicotine products',
    unit: 'uses',
    defaultGoal: 0,
    goalDirection: 'max',
    xp: 20,
  },
  {
    id: 'habit-thc',
    name: 'THC',
    icon: '🌿',
    description: 'Cannabis or THC products',
    unit: 'uses',
    defaultGoal: 0,
    goalDirection: 'max',
    xp: 20,
  },
  {
    id: 'habit-caffeine',
    name: 'Caffeine',
    icon: '☕',
    description: 'Coffee, energy drinks, and caffeinated soda',
    unit: 'servings',
    defaultGoal: 2,
    goalDirection: 'max',
    xp: 10,
  },
  {
    id: 'habit-gaming',
    name: 'Gaming Time',
    icon: '🎮',
    description: 'Time spent playing video games',
    unit: 'hours',
    defaultGoal: 2,
    goalDirection: 'max',
    xp: 10,
  },
];

export const HABIT_MAP: Record<string, HabitDefinition> = Object.fromEntries(
  HABITS.map((h) => [h.id, h]),
);
