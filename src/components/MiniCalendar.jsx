import styled, { keyframes } from 'styled-components';
import { getLast7Days, formatDayLabel } from '../utils/dates';

const dotPop = keyframes`
  0%   { transform: scale(0.6); }
  60%  { transform: scale(1.25); }
  100% { transform: scale(1); }
`;

const Strip = styled.div`
  display: flex;
  gap: 7px;
  align-items: flex-end;
  margin-top: 10px;
`;

const DotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $filled, $color }) => $filled ? $color : '#E5E7EB'};
  transition: background 0.2s;
  box-shadow: ${({ $filled, $color }) => $filled ? `0 2px 6px ${$color}55` : 'none'};
  animation: ${({ $filled }) => $filled ? dotPop : 'none'} 0.35s cubic-bezier(0.34,1.56,0.64,1);
`;

const DayLabel = styled.div`
  font-size: 0.58rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  text-transform: uppercase;

  @media (max-width: 360px) {
    display: none;
  }
`;

export default function MiniCalendar({ completions, color }) {
  const days = getLast7Days();
  return (
    <Strip>
      {days.map(day => (
        <DotWrapper key={day}>
          <Dot $filled={completions.includes(day)} $color={color} />
          <DayLabel>{formatDayLabel(day)}</DayLabel>
        </DotWrapper>
      ))}
    </Strip>
  );
}
