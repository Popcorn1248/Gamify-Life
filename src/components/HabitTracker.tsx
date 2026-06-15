import { HABITS } from '../data/habits';
import { useAppStore } from '../store/useAppStore';
import { todayKey } from '../lib/leveling';
import { computeHabitStreak, isGoalMet } from '../lib/habitStreak';

export default function HabitTracker() {
  const habitGoals = useAppStore((s) => s.habitGoals);
  const habitLogs = useAppStore((s) => s.habitLogs);
  const setHabitGoal = useAppStore((s) => s.setHabitGoal);
  const logHabit = useAppStore((s) => s.logHabit);

  const today = todayKey();

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">
        Log today's amounts. Staying at or under your goal earns Health XP and builds a streak.
      </p>
      {HABITS.map((habit) => {
        const goal = habitGoals[habit.id] ?? habit.defaultGoal;
        const logs = habitLogs[habit.id] ?? {};
        const todayAmount = logs[today];
        const streak = computeHabitStreak(habit, goal, logs);
        const metToday = todayAmount !== undefined && isGoalMet(habit, goal, todayAmount);

        return (
          <div key={habit.id} className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{habit.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">{habit.name}</p>
                  <p className="text-xs text-gray-500">{habit.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {streak > 0 && (
                  <span className="rounded bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-400">
                    🔥 {streak} day streak
                  </span>
                )}
                {metToday && (
                  <span className="rounded bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-400">
                    +{habit.xp} XP today
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-gray-400">
                Today's {habit.unit}
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={todayAmount ?? ''}
                  onChange={(e) => logHabit(habit.id, today, Number(e.target.value))}
                  placeholder="0"
                  className="w-20 rounded-lg border border-gray-700 bg-gray-950 px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                Goal ({habit.goalDirection === 'max' ? 'at most' : 'at least'})
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={goal}
                  onChange={(e) => setHabitGoal(habit.id, Number(e.target.value))}
                  className="w-20 rounded-lg border border-gray-700 bg-gray-950 px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {habit.unit}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
