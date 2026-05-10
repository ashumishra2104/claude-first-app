import { getToday, dateMinus, calcStreakFromDates } from './dates';

const STORE_KEY = 'habitTracker_achievements_v1';

export function loadShownAchievements() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function saveShownAchievements(set) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...set]));
  } catch {}
}

export function checkAchievements(habitId, habits, completions, shownSet) {
  const today = getToday();
  const newDates = completions[habitId] || [];
  const unlocked = [];

  const totalCompletions = Object.values(completions).flat().length;
  if (totalCompletions === 1 && !shownSet.has('first_completion')) {
    unlocked.push({ id: 'first_completion', emoji: '🌟', title: 'First Step!', sub: 'You completed your very first habit!' });
  }

  const pdKey = `perfect_day:${today}`;
  if (habits.length > 1 && !shownSet.has(pdKey)) {
    const allDone = habits.every(h => (completions[h.id] || []).includes(today));
    if (allDone) {
      unlocked.push({ id: pdKey, emoji: '⭐', title: 'Perfect Day!', sub: 'Every habit completed today!' });
    }
  }

  const streak = calcStreakFromDates(newDates);
  const MILESTONES = [
    { days: 3,  id: `streak_3:${habitId}`,  emoji: '🔥', title: 'On Fire!',     sub: '3-day streak — keep going!' },
    { days: 7,  id: `streak_7:${habitId}`,  emoji: '🎯', title: 'One Week!',    sub: '7-day streak — incredible!' },
    { days: 14, id: `streak_14:${habitId}`, emoji: '💪', title: 'Unstoppable!', sub: "14-day streak — you're a machine!" },
    { days: 30, id: `streak_30:${habitId}`, emoji: '🏆', title: 'Legend!',      sub: '30-day streak — absolute legend!' },
  ];
  for (const m of MILESTONES) {
    if (streak === m.days && !shownSet.has(m.id)) {
      unlocked.push(m);
      break;
    }
  }

  const comebackKey = `comeback:${habitId}:${today}`;
  if (!shownSet.has(comebackKey) && newDates.length > 1) {
    const yesterday = dateMinus(today, 1);
    const prevDates = newDates.filter(d => d !== today);
    if (prevDates.length > 0 && !prevDates.includes(yesterday)) {
      unlocked.push({ id: comebackKey, emoji: '💫', title: 'Comeback!', sub: 'Back on track after a break!' });
    }
  }

  return unlocked;
}
