export interface LevelInfo {
  level: number;
  /** XP earned within the current level */
  currentXp: number;
  /** XP required to go from this level to the next */
  xpForNextLevel: number;
  /** Total accumulated XP */
  totalXp: number;
  /** 0-1 progress through the current level */
  progress: number;
}

/**
 * XP needed for level N -> N+1 grows linearly: 100, 150, 200, 250...
 * This keeps early levels quick (motivating) while later levels take longer.
 */
function xpRequiredForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, totalXp);
  let level = 1;
  let remaining = xp;
  let xpForNextLevel = xpRequiredForLevel(level);

  while (remaining >= xpForNextLevel) {
    remaining -= xpForNextLevel;
    level++;
    xpForNextLevel = xpRequiredForLevel(level);
  }

  return {
    level,
    currentXp: remaining,
    xpForNextLevel,
    totalXp: xp,
    progress: remaining / xpForNextLevel,
  };
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey(): string {
  return formatDateKey(new Date());
}
