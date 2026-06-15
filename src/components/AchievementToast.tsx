import { useEffect } from 'react';
import { ACHIEVEMENT_MAP } from '../data/achievements';
import { useAppStore } from '../store/useAppStore';

export default function AchievementToast() {
  const queue = useAppStore((s) => s.achievementToastQueue);
  const dismissAchievementToast = useAppStore((s) => s.dismissAchievementToast);
  const currentId = queue[0];

  useEffect(() => {
    if (!currentId) return;
    const timer = setTimeout(() => dismissAchievementToast(), 4000);
    return () => clearTimeout(timer);
  }, [currentId, dismissAchievementToast]);

  if (!currentId) return null;
  const achievement = ACHIEVEMENT_MAP[currentId];
  if (!achievement) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border border-amber-400/40 bg-gray-900 p-3 shadow-lg shadow-black/40">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-xl">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">Achievement unlocked!</p>
          <p className="text-sm font-medium text-gray-100">{achievement.title}</p>
        </div>
        <button
          onClick={() => dismissAchievementToast()}
          aria-label="Dismiss"
          className="text-gray-500 hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
