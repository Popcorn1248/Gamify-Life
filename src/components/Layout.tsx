import { NavLink, Outlet } from 'react-router-dom';
import { PILLARS } from '../data/pillars';
import { ACHIEVEMENTS } from '../data/achievements';
import { useAppStore } from '../store/useAppStore';
import { getLevelInfo } from '../lib/leveling';
import AchievementToast from './AchievementToast';

export default function Layout() {
  const pillarXp = useAppStore((s) => s.pillarXp);
  const unlockedAchievements = useAppStore((s) => s.unlockedAchievements);
  const totalXp = PILLARS.reduce((sum, p) => sum + pillarXp[p.id], 0);
  const overall = getLevelInfo(totalXp);
  const unlockedCount = Object.keys(unlockedAchievements).length;

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 pb-16 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 py-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <span className="text-xl font-bold tracking-tight text-gray-100">Gamify Life</span>
        </NavLink>
        <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/60 px-4 py-1.5 text-sm">
          <span className="font-semibold text-gray-100">Overall Level {overall.level}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-400">{totalXp} total XP</span>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800'
            }`
          }
        >
          Dashboard
        </NavLink>
        {PILLARS.map((pillar) => (
          <NavLink
            key={pillar.id}
            to={`/pillar/${pillar.id}`}
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <span className="mr-1">{pillar.icon}</span>
            {pillar.name}
          </NavLink>
        ))}
        <NavLink
          to="/achievements"
          className={({ isActive }) =>
            `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'bg-gray-900/60 text-gray-300 hover:bg-gray-800'
            }`
          }
        >
          <span className="mr-1">🏅</span>
          Achievements
          <span className="ml-1 text-xs text-gray-500">
            ({unlockedCount}/{ACHIEVEMENTS.length})
          </span>
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>

      <AchievementToast />
    </div>
  );
}
