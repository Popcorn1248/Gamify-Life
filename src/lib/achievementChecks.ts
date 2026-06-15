import type { PillarId, SkillDefinition } from '../types';
import { PILLARS } from '../data/pillars';
import { HABITS } from '../data/habits';
import { getLevelInfo } from './leveling';
import { computeHabitStreak, isGoalMet } from './habitStreak';

export interface AchievementContext {
  pillarXp: Record<PillarId, number>;
  completedOnce: string[];
  dailyCompletions: Record<string, string[]>;
  customSkills: SkillDefinition[];
  habitGoals: Record<string, number>;
  habitLogs: Record<string, Record<string, number>>;
}

function totalCompletions(ctx: AchievementContext): number {
  const repeatableCount = Object.values(ctx.dailyCompletions).reduce(
    (sum, ids) => sum + ids.length,
    0,
  );
  return ctx.completedOnce.length + repeatableCount;
}

function pillarLevel(ctx: AchievementContext, pillar: PillarId): number {
  return getLevelInfo(ctx.pillarXp[pillar]).level;
}

function overallLevel(ctx: AchievementContext): number {
  const total = PILLARS.reduce((sum, p) => sum + ctx.pillarXp[p.id], 0);
  return getLevelInfo(total).level;
}

function maxHabitStreak(ctx: AchievementContext): number {
  return Math.max(
    0,
    ...HABITS.map((habit) => {
      const goal = ctx.habitGoals[habit.id] ?? habit.defaultGoal;
      return computeHabitStreak(habit, goal, ctx.habitLogs[habit.id] ?? {});
    }),
  );
}

function hasCleanSweepDay(ctx: AchievementContext): boolean {
  const allDates = new Set<string>();
  for (const habit of HABITS) {
    for (const date of Object.keys(ctx.habitLogs[habit.id] ?? {})) {
      allDates.add(date);
    }
  }
  for (const date of allDates) {
    const allMet = HABITS.every((habit) => {
      const amount = ctx.habitLogs[habit.id]?.[date];
      if (amount === undefined) return false;
      const goal = ctx.habitGoals[habit.id] ?? habit.defaultGoal;
      return isGoalMet(habit, goal, amount);
    });
    if (allMet) return true;
  }
  return false;
}

export const ACHIEVEMENT_CHECKS: Record<string, (ctx: AchievementContext) => boolean> = {
  'first-quest': (ctx) => totalCompletions(ctx) >= 1,
  'quest-veteran': (ctx) => totalCompletions(ctx) >= 25,
  'quest-master': (ctx) => totalCompletions(ctx) >= 100,
  'well-rounded': (ctx) => PILLARS.every((p) => pillarLevel(ctx, p.id) >= 2),
  'renaissance-soul': (ctx) => PILLARS.every((p) => pillarLevel(ctx, p.id) >= 5),
  'overall-level-10': (ctx) => overallLevel(ctx) >= 10,
  'overall-level-25': (ctx) => overallLevel(ctx) >= 25,
  'custom-quest': (ctx) => ctx.customSkills.length >= 1,
  'streak-3': (ctx) => maxHabitStreak(ctx) >= 3,
  'streak-7': (ctx) => maxHabitStreak(ctx) >= 7,
  'streak-30': (ctx) => maxHabitStreak(ctx) >= 30,
  'clean-sweep': (ctx) => hasCleanSweepDay(ctx),
};

for (const pillar of PILLARS) {
  ACHIEVEMENT_CHECKS[`${pillar.id}-novice`] = (ctx) => pillarLevel(ctx, pillar.id) >= 5;
  ACHIEVEMENT_CHECKS[`${pillar.id}-adept`] = (ctx) => pillarLevel(ctx, pillar.id) >= 10;
  ACHIEVEMENT_CHECKS[`${pillar.id}-master`] = (ctx) => pillarLevel(ctx, pillar.id) >= 20;
}
