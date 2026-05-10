export function getToday() {
  return new Date().toLocaleDateString('en-CA');
}

export function dateMinus(isoStr, days) {
  const d = new Date(isoStr + 'T00:00:00');
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-CA');
}

export function getLast7Days() {
  const today = getToday();
  return Array.from({ length: 7 }, (_, i) => dateMinus(today, 6 - i));
}

export function formatDayLabel(isoStr) {
  const d = new Date(isoStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
}

export function calcStreakFromDates(dates) {
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
}
