import type { SkillDefinition } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTheme } from '../lib/theme';
import { PILLAR_MAP } from '../data/pillars';

interface SuggestionItemProps {
  skill: SkillDefinition;
}

export default function SuggestionItem({ skill }: SuggestionItemProps) {
  const addSkillToActive = useAppStore((s) => s.addSkillToActive);
  const theme = getTheme(PILLAR_MAP[skill.pillar].color);

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-800 bg-gray-900/30 p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-200">{skill.title}</p>
          <span className={`text-xs font-semibold ${theme.text}`}>+{skill.xp} XP</span>
          {skill.repeatable && (
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
              Daily
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{skill.description}</p>
      </div>
      <button
        onClick={() => addSkillToActive(skill.pillar, skill.id)}
        className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold text-gray-950 transition ${theme.button}`}
      >
        + Add
      </button>
    </div>
  );
}
