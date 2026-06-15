import { useState } from 'react';
import type { PillarId } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTheme } from '../lib/theme';
import { PILLAR_MAP } from '../data/pillars';

interface AddCustomSkillFormProps {
  pillar: PillarId;
}

export default function AddCustomSkillForm({ pillar }: AddCustomSkillFormProps) {
  const addCustomSkill = useAppStore((s) => s.addCustomSkill);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xp, setXp] = useState(15);
  const [repeatable, setRepeatable] = useState(true);

  const theme = getTheme(PILLAR_MAP[pillar].color);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-gray-700 p-3 text-sm text-gray-400 transition hover:border-gray-500 hover:text-gray-200"
      >
        + Add your own quest
      </button>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addCustomSkill({
      pillar,
      title: title.trim(),
      description: description.trim(),
      xp: Math.min(100, Math.max(1, xp)),
      repeatable,
    });
    setTitle('');
    setDescription('');
    setXp(15);
    setRepeatable(true);
    setOpen(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-gray-700 bg-gray-900/50 p-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quest title"
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-400">
          XP reward
          <input
            type="number"
            min={1}
            max={100}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="w-16 rounded-lg border border-gray-700 bg-gray-950 px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={repeatable}
            onChange={(e) => setRepeatable(e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 bg-gray-950"
          />
          Repeats daily
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-950 transition ${theme.button}`}
        >
          Add quest
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
