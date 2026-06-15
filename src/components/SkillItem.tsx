import type { SkillDefinition } from '../types';
import { useAppStore } from '../store/useAppStore';
import { isSkillCompleted } from '../lib/selectors';
import { getTheme } from '../lib/theme';
import { PILLAR_MAP } from '../data/pillars';

interface SkillItemProps {
  skill: SkillDefinition;
  /** Whether this skill can be removed from the active list / deleted */
  onRemove?: () => void;
}

export default function SkillItem({ skill, onRemove }: SkillItemProps) {
  const completedOnce = useAppStore((s) => s.completedOnce);
  const dailyCompletions = useAppStore((s) => s.dailyCompletions);
  const toggleSkillCompletion = useAppStore((s) => s.toggleSkillCompletion);

  const theme = getTheme(PILLAR_MAP[skill.pillar].color);
  const completed = isSkillCompleted(skill, completedOnce, dailyCompletions);

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 transition ${
        completed
          ? `${theme.cardBorder} ${theme.cardBg}`
          : 'border-gray-800 bg-gray-900/40'
      }`}
    >
      <button
        onClick={() => toggleSkillCompletion(skill)}
        aria-label={completed ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs transition ${
          completed
            ? `${theme.bar} border-transparent text-gray-950`
            : 'border-gray-600 text-transparent hover:border-gray-400'
        }`}
      >
        ✓
      </button>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-medium ${completed ? 'text-gray-300 line-through' : 'text-gray-100'}`}>
            {skill.title}
          </p>
          <span className={`shrink-0 text-xs font-semibold ${theme.text}`}>+{skill.xp} XP</span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{skill.description}</p>
        <div className="mt-1 flex items-center gap-2">
          {skill.repeatable && (
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
              Daily
            </span>
          )}
          {onRemove && (
            <button onClick={onRemove} className="text-[11px] text-gray-500 underline hover:text-gray-300">
              Remove from list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
