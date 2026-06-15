import { ACHIEVEMENTS } from '../data/achievements';
import { PILLAR_MAP } from '../data/pillars';
import { useAppStore } from '../store/useAppStore';
import { getTheme } from '../lib/theme';

export default function AchievementsPage() {
  const unlockedAchievements = useAppStore((s) => s.unlockedAchievements);
  const unlockedCount = Object.keys(unlockedAchievements).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Achievements</h1>
        <p className="mt-1 text-gray-400">
          {unlockedCount} / {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const unlockedAt = unlockedAchievements[achievement.id];
          const unlocked = Boolean(unlockedAt);
          const theme = achievement.pillar ? getTheme(PILLAR_MAP[achievement.pillar].color) : undefined;

          return (
            <div
              key={achievement.id}
              className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                unlocked
                  ? theme
                    ? `${theme.cardBorder} ${theme.cardBg}`
                    : 'border-gray-600 bg-gray-800/60'
                  : 'border-gray-800 bg-gray-900/30 opacity-60'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                  unlocked ? (theme ? theme.iconBg : 'bg-gray-700') : 'bg-gray-800'
                }`}
              >
                {unlocked ? achievement.icon : '🔒'}
              </div>
              <div>
                <p className={`text-sm font-semibold ${unlocked ? 'text-gray-100' : 'text-gray-400'}`}>
                  {achievement.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{achievement.description}</p>
                {unlocked && (
                  <p className="mt-1 text-[11px] text-gray-500">
                    Unlocked {new Date(unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
