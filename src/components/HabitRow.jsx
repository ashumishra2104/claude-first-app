import { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import MiniCalendar from './MiniCalendar';
import { getToday } from '../utils/dates';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 16px;
  margin: 8px 16px;
  display: flex;
  flex-direction: column;
  border-left: 4px solid ${({ $color }) => $color};
  opacity: 0;
  animation: ${slideIn} 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${({ $index }) => Math.min($index * 0.07, 0.42)}s;
  transition: box-shadow 0.22s, transform 0.22s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateX(3px);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const HabitName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const badgePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.07); }
`;

const StreakBadge = styled.span`
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  white-space: nowrap;
  border: 1px solid ${({ $color }) => $color}44;
  animation: ${badgePulse} 2s ease-in-out infinite;
`;

const popIn = keyframes`
  0%   { transform: scale(1); }
  35%  { transform: scale(1.4); }
  65%  { transform: scale(0.88); }
  100% { transform: scale(1); }
`;

const ToggleBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid ${({ $checked, $color }) => $checked ? $color : '#D1D5DB'};
  background: ${({ $checked, $color }) => $checked ? $color : 'transparent'};
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;

  &.pop {
    animation: ${popIn} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const DeleteBtn = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.danger}11;
  }
`;

export default function HabitRow({ habit, completions, streak, onToggle, onDelete, index = 0 }) {
  const today = getToday();
  const doneToday = completions.includes(today);
  const btnRef = useRef(null);

  function handleToggle(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const completing = !doneToday;

    if (completing && btnRef.current) {
      btnRef.current.classList.remove('pop');
      void btnRef.current.offsetWidth; // force reflow to restart animation
      btnRef.current.classList.add('pop');
    }

    onToggle(habit.id, today, { completing, x, y });
  }

  return (
    <Card $color={habit.color} $index={index}>
      <TopRow>
        <HabitName title={habit.name}>{habit.name}</HabitName>
        <RightControls>
          {streak > 0 && (
            <StreakBadge $color={habit.color}>🔥 {streak}d</StreakBadge>
          )}
          <ToggleBtn
            ref={btnRef}
            $checked={doneToday}
            $color={habit.color}
            onClick={handleToggle}
            aria-label={doneToday ? 'Mark incomplete' : 'Mark complete'}
          >
            {doneToday ? '✓' : ''}
          </ToggleBtn>
          <DeleteBtn onClick={() => onDelete(habit)} aria-label="Delete habit">
            🗑
          </DeleteBtn>
        </RightControls>
      </TopRow>
      <MiniCalendar completions={completions} color={habit.color} />
    </Card>
  );
}
