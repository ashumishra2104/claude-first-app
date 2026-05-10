import { useState, useEffect, useCallback, useRef } from 'react';
import { getToday, dateMinus, getLast7Days } from '../utils/dates';
import { checkAchievements, loadShownAchievements, saveShownAchievements } from '../utils/achievements';

const STORAGE_KEY = 'habitTracker_v1';
const ACCENT_COLORS = [
  '#7C3AED', '#0D9488', '#DC4E41', '#D97706',
  '#0284C7', '#DB2777', '#059669', '#475569',
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { habits: [], completions: {} };
}

export function useHabits() {
  const [state, setState] = useState(loadState);
  const shownAchievements = useRef(loadShownAchievements());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('localStorage write failed', e);
    }
  }, [state]);

  const addHabit = useCallback((name) => {
    setState(prev => {
      const color = ACCENT_COLORS[prev.habits.length % ACCENT_COLORS.length];
      const habit = { id: `h_${Date.now()}`, name, createdAt: getToday(), color };
      return {
        habits: [...prev.habits, habit],
        completions: { ...prev.completions, [habit.id]: [] },
      };
    });
  }, []);

  const deleteHabit = useCallback((id) => {
    setState(prev => {
      const { [id]: _, ...rest } = prev.completions;
      return { habits: prev.habits.filter(h => h.id !== id), completions: rest };
    });
  }, []);

  const toggleCompletion = useCallback((id, date) => {
    setState(prev => {
      const dates = prev.completions[id] || [];
      const updated = dates.includes(date)
        ? dates.filter(d => d !== date)
        : [...dates, date];
      return { ...prev, completions: { ...prev.completions, [id]: updated } };
    });
  }, []);

  // Returns newly unlocked achievements (without mutating state — caller persists them)
  const getNewAchievements = useCallback((id, date) => {
    const dates = state.completions[id] || [];
    if (dates.includes(date)) return []; // uncompleting, no achievements
    const newCompletions = { ...state.completions, [id]: [...dates, date] };
    const unlocked = checkAchievements(id, state.habits, newCompletions, shownAchievements.current);
    if (unlocked.length) {
      unlocked.forEach(a => shownAchievements.current.add(a.id));
      saveShownAchievements(shownAchievements.current);
    }
    return unlocked;
  }, [state]);

  const calcStreak = useCallback((id) => {
    const dates = state.completions[id] || [];
    if (!dates.length) return 0;
    const sorted = [...dates].sort().reverse();
    const today = getToday();
    const anchor = sorted[0] === today ? today : dateMinus(today, 1);
    if (sorted[0] !== anchor) return 0;
    let streak = 1, prev = anchor;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === dateMinus(prev, 1)) { streak++; prev = sorted[i]; }
      else break;
    }
    return streak;
  }, [state.completions]);

  const calcBestStreak = useCallback((id) => {
    const dates = state.completions[id] || [];
    if (!dates.length) return 0;
    const sorted = [...dates].sort();
    let best = 1, current = 1;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === dateMinus(sorted[i - 1], -1)) {
        current++;
        if (current > best) best = current;
      } else {
        current = 1;
      }
    }
    return best;
  }, [state.completions]);

  const weeklyPercent = useCallback(() => {
    if (!state.habits.length) return 0;
    const days = getLast7Days();
    let total = 0;
    state.habits.forEach(h => {
      const dates = state.completions[h.id] || [];
      days.forEach(d => { if (dates.includes(d)) total++; });
    });
    return Math.round((total / (state.habits.length * 7)) * 100);
  }, [state]);

  const today = getToday();
  const completedToday = state.habits.filter(h =>
    (state.completions[h.id] || []).includes(today)
  ).length;

  const bestStreak = state.habits.length
    ? Math.max(...state.habits.map(h => calcStreak(h.id)))
    : 0;

  return {
    habits: state.habits,
    completions: state.completions,
    addHabit,
    deleteHabit,
    toggleCompletion,
    getNewAchievements,
    calcStreak,
    calcBestStreak,
    weeklyPercent,
    completedToday,
    bestStreak,
  };
}
