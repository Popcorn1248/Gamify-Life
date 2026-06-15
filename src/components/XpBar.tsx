import { getLevelInfo } from '../lib/leveling';

interface XpBarProps {
  totalXp: number;
  barClassName: string;
  size?: 'sm' | 'lg';
}

export default function XpBar({ totalXp, barClassName, size = 'sm' }: XpBarProps) {
  const { level, currentXp, xpForNextLevel, progress } = getLevelInfo(totalXp);
  const height = size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-100">Level {level}</span>
        <span className="text-gray-400">
          {currentXp} / {xpForNextLevel} XP
        </span>
      </div>
      <div className={`w-full overflow-hidden rounded-full bg-gray-800 ${height}`}>
        <div
          className={`${height} rounded-full ${barClassName} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}
