import styled, { keyframes } from 'styled-components';

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px) scale(0.93); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const valuePop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.18); }
  70%  { transform: scale(0.93); }
  100% { transform: scale(1); }
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${({ $index }) => $index * 0.09}s;
  transition: box-shadow 0.22s, transform 0.22s;
  border-top: 3px solid ${({ $accent }) => $accent};
  cursor: default;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-3px);
  }
`;

const Icon = styled.div`
  font-size: 22px;
  line-height: 1;
  margin-bottom: 2px;
`;

const Value = styled.div`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const CARDS = [
  { icon: '📋', label: 'Total Habits',  key: 'total',  accent: '#7C3AED' },
  { icon: '✅', label: 'Done Today',    key: 'today',  accent: '#059669' },
  { icon: '🔥', label: 'Best Streak',   key: 'streak', accent: '#D97706' },
  { icon: '📊', label: 'This Week',     key: 'weekly', accent: '#0284C7' },
];

export default function Dashboard({ totalHabits, completedToday, bestStreak, weeklyPercent }) {
  const values = {
    total:  totalHabits,
    today:  `${completedToday}/${totalHabits}`,
    streak: `${bestStreak}d`,
    weekly: `${weeklyPercent}%`,
  };

  return (
    <Grid>
      {CARDS.map(({ icon, label, key, accent }, i) => (
        <Card key={key} $index={i} $accent={accent}>
          <Icon>{icon}</Icon>
          <Value>{values[key]}</Value>
          <Label>{label}</Label>
        </Card>
      ))}
    </Grid>
  );
}
