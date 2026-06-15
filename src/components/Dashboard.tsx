import { Link } from 'react-router-dom';
import { PILLARS } from '../data/pillars';
import { useAppStore } from '../store/useAppStore';
import { getLevelInfo, todayKey } from '../lib/leveling';
import { getTheme } from '../lib/theme';
import { getAllSkillsForPillar, isSkillCompleted } from '../lib/selectors';

export default function Dashboard() {
  const pillarXp = useAppStore((s) => s.pillarXp);
  const activeSkillIds = useAppStore((s) => s.activeSkillIds);
  const customSkills = useAppStore((s) => s.customSkills);
  const completedOnce = useAppStore((s) => s.completedOnce);
  const dailyCompletions = useAppStore((s) => s.dailyCompletions);
  const resetAllData = useAppStore((s) => s.resetAllData);

  const completedTodayCount = (dailyCompletions[todayKey()] ?? []).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Your Pillars</h1>
        <p className="mt-1 text-gray-400">
          {completedTodayCount > 0
            ? `You've completed ${completedTodayCount} quest${completedTodayCount === 1 ? '' : 's'} today. Keep it up!`
            : 'No quests completed yet today - pick a pillar and get started.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => {
          const theme = getTheme(pillar.color);
          const level = getLevelInfo(pillarXp[pillar.id]);
          const allSkills = getAllSkillsForPillar(pillar.id, customSkills);
          const activeSkills = allSkills.filter((s) => activeSkillIds[pillar.id].includes(s.id));
          const completedCount = activeSkills.filter((s) =>
            isSkillCompleted(s, completedOnce, dailyCompletions),
          ).length;

          return (
            <Link
              key={pillar.id}
              to={`/pillar/${pillar.id}`}
              className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-5 transition hover:scale-[1.01] hover:brightness-110`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${theme.iconBg}`}>
                    {pillar.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100">{pillar.name}</h2>
                    <p className="text-xs text-gray-400">{pillar.tagline}</p>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className={`font-semibold ${theme.text}`}>Level {level.level}</span>
                  <span className="text-gray-400">
                    {level.currentXp} / {level.xpForNextLevel} XP
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                  <div
                    className={`h-2 rounded-full ${theme.bar} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, level.progress * 100))}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {completedCount} / {activeSkills.length} active quests done today
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) {
              resetAllData();
            }
          }}
          className="text-xs text-gray-500 underline hover:text-gray-300"
        >
          Reset all data
        </button>
      </div>
    </div>
  );
}
