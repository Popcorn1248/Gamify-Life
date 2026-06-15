import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PillarId, SkillDefinition } from '../types';
import { PILLARS } from '../data/pillars';
import { SKILL_MAP, STARTER_SKILL_IDS } from '../data/skills';
import { HABIT_MAP } from '../data/habits';
import { todayKey } from '../lib/leveling';

interface AppState {
  pillarXp: Record<PillarId, number>;
  /** Skill ids (built-in or custom) the user has added to their active list, per pillar */
  activeSkillIds: Record<PillarId, string[]>;
  /** User-created skills */
  customSkills: SkillDefinition[];
  /** One-time skills the user has completed */
  completedOnce: string[];
  /** date -> list of repeatable skill ids completed that day */
  dailyCompletions: Record<string, string[]>;
  /** habitId -> goal override (falls back to defaultGoal if absent) */
  habitGoals: Record<string, number>;
  /** habitId -> date -> logged amount */
  habitLogs: Record<string, Record<string, number>>;
  /** habitId -> dates for which XP has already been awarded */
  habitXpAwarded: Record<string, string[]>;

  addSkillToActive: (pillar: PillarId, skillId: string) => void;
  removeSkillFromActive: (pillar: PillarId, skillId: string) => void;
  toggleSkillCompletion: (skill: SkillDefinition) => void;
  addCustomSkill: (skill: Omit<SkillDefinition, 'id'>) => void;
  removeCustomSkill: (skillId: string) => void;
  setHabitGoal: (habitId: string, goal: number) => void;
  logHabit: (habitId: string, date: string, amount: number) => void;
  resetAllData: () => void;
}

function emptyPillarRecord<T>(value: T): Record<PillarId, T> {
  return Object.fromEntries(PILLARS.map((p) => [p.id, value])) as Record<PillarId, T>;
}

function defaultActiveSkillIds(): Record<PillarId, string[]> {
  const result = emptyPillarRecord<string[]>([]);
  for (const id of STARTER_SKILL_IDS) {
    const skill = SKILL_MAP[id];
    if (skill) result[skill.pillar] = [...result[skill.pillar], id];
  }
  return result;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      pillarXp: emptyPillarRecord(0),
      activeSkillIds: defaultActiveSkillIds(),
      customSkills: [],
      completedOnce: [],
      dailyCompletions: {},
      habitGoals: {},
      habitLogs: {},
      habitXpAwarded: {},

      addSkillToActive: (pillar, skillId) => {
        set((state) => {
          if (state.activeSkillIds[pillar].includes(skillId)) return state;
          return {
            activeSkillIds: {
              ...state.activeSkillIds,
              [pillar]: [...state.activeSkillIds[pillar], skillId],
            },
          };
        });
      },

      removeSkillFromActive: (pillar, skillId) => {
        set((state) => ({
          activeSkillIds: {
            ...state.activeSkillIds,
            [pillar]: state.activeSkillIds[pillar].filter((id) => id !== skillId),
          },
        }));
      },

      toggleSkillCompletion: (skill) => {
        const today = todayKey();
        if (skill.repeatable) {
          set((state) => {
            const completedToday = state.dailyCompletions[today] ?? [];
            const isCompleted = completedToday.includes(skill.id);
            const updatedToday = isCompleted
              ? completedToday.filter((id) => id !== skill.id)
              : [...completedToday, skill.id];
            return {
              dailyCompletions: { ...state.dailyCompletions, [today]: updatedToday },
              pillarXp: {
                ...state.pillarXp,
                [skill.pillar]: state.pillarXp[skill.pillar] + (isCompleted ? -skill.xp : skill.xp),
              },
            };
          });
        } else {
          set((state) => {
            const isCompleted = state.completedOnce.includes(skill.id);
            return {
              completedOnce: isCompleted
                ? state.completedOnce.filter((id) => id !== skill.id)
                : [...state.completedOnce, skill.id],
              pillarXp: {
                ...state.pillarXp,
                [skill.pillar]: state.pillarXp[skill.pillar] + (isCompleted ? -skill.xp : skill.xp),
              },
            };
          });
        }
      },

      addCustomSkill: (skill) => {
        const id = `custom-${skill.pillar}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newSkill: SkillDefinition = { ...skill, id };
        set((state) => ({
          customSkills: [...state.customSkills, newSkill],
          activeSkillIds: {
            ...state.activeSkillIds,
            [skill.pillar]: [...state.activeSkillIds[skill.pillar], id],
          },
        }));
      },

      removeCustomSkill: (skillId) => {
        set((state) => {
          const skill = state.customSkills.find((s) => s.id === skillId);
          const newDailyCompletions = Object.fromEntries(
            Object.entries(state.dailyCompletions).map(([date, ids]) => [
              date,
              ids.filter((id) => id !== skillId),
            ]),
          );
          let pillarXpAdjust = 0;
          if (skill) {
            if (skill.repeatable) {
              const today = todayKey();
              if ((state.dailyCompletions[today] ?? []).includes(skillId)) {
                pillarXpAdjust = -skill.xp;
              }
            } else if (state.completedOnce.includes(skillId)) {
              pillarXpAdjust = -skill.xp;
            }
          }
          return {
            customSkills: state.customSkills.filter((s) => s.id !== skillId),
            activeSkillIds: Object.fromEntries(
              Object.entries(state.activeSkillIds).map(([pillar, ids]) => [
                pillar,
                ids.filter((id) => id !== skillId),
              ]),
            ) as Record<PillarId, string[]>,
            completedOnce: state.completedOnce.filter((id) => id !== skillId),
            dailyCompletions: newDailyCompletions,
            pillarXp: skill
              ? {
                  ...state.pillarXp,
                  [skill.pillar]: state.pillarXp[skill.pillar] + pillarXpAdjust,
                }
              : state.pillarXp,
          };
        });
      },

      setHabitGoal: (habitId, goal) => {
        set((state) => ({
          habitGoals: { ...state.habitGoals, [habitId]: goal },
        }));
      },

      logHabit: (habitId, date, amount) => {
        const habit = HABIT_MAP[habitId];
        if (!habit) return;
        set((state) => {
          const goal = state.habitGoals[habitId] ?? habit.defaultGoal;
          const goalMet =
            habit.goalDirection === 'max' ? amount <= goal : amount >= goal;
          const awardedDates = state.habitXpAwarded[habitId] ?? [];
          const wasAwarded = awardedDates.includes(date);

          let xpDelta = 0;
          let newAwardedDates = awardedDates;
          if (goalMet && !wasAwarded) {
            xpDelta = habit.xp;
            newAwardedDates = [...awardedDates, date];
          } else if (!goalMet && wasAwarded) {
            xpDelta = -habit.xp;
            newAwardedDates = awardedDates.filter((d) => d !== date);
          }

          return {
            habitLogs: {
              ...state.habitLogs,
              [habitId]: { ...state.habitLogs[habitId], [date]: amount },
            },
            habitXpAwarded: { ...state.habitXpAwarded, [habitId]: newAwardedDates },
            pillarXp: {
              ...state.pillarXp,
              health: state.pillarXp.health + xpDelta,
            },
          };
        });
      },

      resetAllData: () => {
        set({
          pillarXp: emptyPillarRecord(0),
          activeSkillIds: defaultActiveSkillIds(),
          customSkills: [],
          completedOnce: [],
          dailyCompletions: {},
          habitGoals: {},
          habitLogs: {},
          habitXpAwarded: {},
        });
      },
    }),
    { name: 'gamify-life-store' },
  ),
);
