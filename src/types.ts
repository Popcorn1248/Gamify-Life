export type PillarId = 'knowledge' | 'speech' | 'health' | 'purpose' | 'finance';

export interface Pillar {
  id: PillarId;
  name: string;
  tagline: string;
  icon: string;
  /** Tailwind color name used to theme this pillar */
  color: 'sky' | 'amber' | 'emerald' | 'violet' | 'rose';
}

export interface SkillDefinition {
  id: string;
  pillar: PillarId;
  title: string;
  description: string;
  xp: number;
  /** Repeatable habits can be completed once per day; one-time skills stay completed forever */
  repeatable: boolean;
}

export interface HabitDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  unit: string;
  defaultGoal: number;
  /** 'max' = try to stay at or under the goal (e.g. nicotine), 'min' = try to hit at least the goal (e.g. water) */
  goalDirection: 'max' | 'min';
  /** XP awarded to the Health pillar each day the goal is met */
  xp: number;
}
