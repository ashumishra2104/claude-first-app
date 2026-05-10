import styled, { keyframes } from 'styled-components';
import HabitRow from './HabitRow';
import HenMascot from './HenMascot';

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const bubblePop = keyframes`
  from { opacity: 0; transform: scale(0.75) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 56px;
  text-align: center;
  gap: 0;
  animation: ${floatIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

const SpeechBubble = styled.div`
  background: white;
  border-radius: 18px;
  padding: 14px 20px;
  max-width: 260px;
  box-shadow: 0 6px 24px rgba(109, 40, 217, 0.14);
  position: relative;
  margin-bottom: 14px;
  animation: ${bubblePop} 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  border: 1.5px solid rgba(109,40,217,0.12);

  &::after {
    content: '';
    position: absolute;
    bottom: -11px;
    left: 50%;
    transform: translateX(-50%);
    border: 11px solid transparent;
    border-top-color: white;
    border-bottom: 0;
    filter: drop-shadow(0 3px 2px rgba(109,40,217,0.06));
  }
`;

const BubbleTitle = styled.p`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
`;

const BubbleSub = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const List = styled.main`
  padding-bottom: 32px;
`;

export default function HabitList({ habits, completions, calcStreak, onToggle, onDelete }) {
  if (!habits.length) {
    return (
      <EmptyState>
        <SpeechBubble>
          <BubbleTitle>No slacking, soldier! 🪖</BubbleTitle>
          <BubbleSub>Tap <strong>+ New</strong> to start your first streak.</BubbleSub>
        </SpeechBubble>
        <HenMascot size={130} />
      </EmptyState>
    );
  }

  return (
    <List>
      {habits.map((habit, i) => (
        <HabitRow
          key={habit.id}
          index={i}
          habit={habit}
          completions={completions[habit.id] || []}
          streak={calcStreak(habit.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
