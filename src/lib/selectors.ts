import type { PillarId, SkillDefinition } from '../types';
import { SKILLS } from '../data/skills';
import { todayKey } from './leveling';

export function getAllSkillsForPillar(
  pillar: PillarId,
  customSkills: SkillDefinition[],
): SkillDefinition[] {
  return [...SKILLS, ...customSkills].filter((s) => s.pillar === pillar);
}

export function isSkillCompleted(
  skill: SkillDefinition,
  completedOnce: string[],
  dailyCompletions: Record<string, string[]>,
): boolean {
  if (skill.repeatable) {
    return (dailyCompletions[todayKey()] ?? []).includes(skill.id);
  }
  return completedOnce.includes(skill.id);
}
