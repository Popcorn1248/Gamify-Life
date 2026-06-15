import type { HabitDefinition } from '../types';
import { formatDateKey, todayKey } from './leveling';

export function isGoalMet(habit: HabitDefinition, goal: number, amount: number): boolean {
  return habit.goalDirection === 'max' ? amount <= goal : amount >= goal;
}

/**
 * Counts consecutive days (ending today, or yesterday if today has no entry yet)
 * where the logged amount met the goal.
 */
export function computeHabitStreak(
  habit: HabitDefinition,
  goal: number,
  logs: Record<string, number>,
): number {
  let streak = 0;
  const cursor = new Date();
  if (!(todayKey() in logs)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(cursor);
    const amount = logs[key];
    if (amount === undefined || !isGoalMet(habit, goal, amount)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
