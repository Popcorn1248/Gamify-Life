import { useParams, Navigate } from 'react-router-dom';
import { PILLAR_MAP } from '../data/pillars';
import { useAppStore } from '../store/useAppStore';
import { getTheme } from '../lib/theme';
import { getAllSkillsForPillar } from '../lib/selectors';
import type { PillarId } from '../types';
import XpBar from './XpBar';
import SkillItem from './SkillItem';
import SuggestionItem from './SuggestionItem';
import AddCustomSkillForm from './AddCustomSkillForm';
import HabitTracker from './HabitTracker';

export default function PillarPage() {
  const { pillarId } = useParams<{ pillarId: string }>();
  const pillar = pillarId ? PILLAR_MAP[pillarId] : undefined;

  const pillarXp = useAppStore((s) => s.pillarXp);
  const activeSkillIds = useAppStore((s) => s.activeSkillIds);
  const customSkills = useAppStore((s) => s.customSkills);
  const removeSkillFromActive = useAppStore((s) => s.removeSkillFromActive);
  const removeCustomSkill = useAppStore((s) => s.removeCustomSkill);

  if (!pillar) return <Navigate to="/" replace />;

  const id = pillar.id as PillarId;
  const theme = getTheme(pillar.color);
  const allSkills = getAllSkillsForPillar(id, customSkills);
  const activeIds = activeSkillIds[id];
  const activeSkills = allSkills.filter((s) => activeIds.includes(s.id));
  const suggestions = allSkills.filter((s) => !activeIds.includes(s.id));

  return (
    <div>
      <div className={`mb-6 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-5`}>
        <div className="mb-3 flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${theme.iconBg}`}>
            {pillar.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">{pillar.name}</h1>
            <p className="text-sm text-gray-400">{pillar.tagline}</p>
          </div>
        </div>
        <XpBar totalXp={pillarXp[id]} barClassName={theme.bar} size="lg" />
        <p className="mt-1 text-xs text-gray-500">{pillarXp[id]} total XP earned in {pillar.name}</p>
      </div>

      {id === 'health' && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-100">Habit Tracker</h2>
          <HabitTracker />
        </section>
      )}

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-100">
          Your Quests {activeSkills.length > 0 && <span className="text-sm text-gray-500">({activeSkills.length})</span>}
        </h2>
        {activeSkills.length === 0 && (
          <p className="mb-3 text-sm text-gray-500">No quests yet - add one from the suggestions below.</p>
        )}
        <div className="space-y-2">
          {activeSkills.map((skill) => (
            <SkillItem
              key={skill.id}
              skill={skill}
              onRemove={() => {
                if (skill.id.startsWith('custom-')) {
                  removeCustomSkill(skill.id);
                } else {
                  removeSkillFromActive(id, skill.id);
                }
              }}
            />
          ))}
        </div>
        <div className="mt-3">
          <AddCustomSkillForm pillar={id} />
        </div>
      </section>

      {suggestions.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-100">Suggestions</h2>
          <p className="mb-3 text-sm text-gray-500">
            Add any of these to your quest list to start earning XP toward {pillar.name}.
          </p>
          <div className="space-y-2">
            {suggestions.map((skill) => (
              <SuggestionItem key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
