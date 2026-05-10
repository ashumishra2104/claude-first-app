import { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useHabits } from './hooks/useHabits';
import { unlockAudio } from './utils/sounds';
import Dashboard from './components/Dashboard';
import HabitList from './components/HabitList';
import AddHabitModal from './components/AddHabitModal';
import DeleteDialog from './components/DeleteDialog';
import ConfettiBurst from './components/ConfettiBurst';
import AchievementToast from './components/AchievementToast';
import HenMascot from './components/HenMascot';

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const btnPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
  50%       { box-shadow: 0 0 0 9px rgba(255,255,255,0); }
`;

const AppBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: max(12px, env(safe-area-inset-top)) 16px 12px;
  background: linear-gradient(135deg, #5B21B6, #6D28D9, #7C3AED, #5B21B6);
  background-size: 300% 300%;
  animation: ${gradientShift} 7s ease infinite;
  color: white;
  box-shadow: 0 4px 20px rgba(109, 40, 217, 0.45);
`;

const AppTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const DateLabel = styled.span`
  font-size: 0.76rem;
  opacity: 0.82;
  font-weight: 500;
`;

const NewBtn = styled.button`
  background: rgba(255, 255, 255, 0.22);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radii.pill};
  min-width: 44px;
  min-height: 44px;
  transition: background 0.15s, transform 0.15s;
  animation: ${btnPulse} 2.8s ease-in-out infinite;
  border: 1.5px solid rgba(255,255,255,0.3);

  &:hover  { background: rgba(255,255,255,0.34); transform: scale(1.05); }
  &:active { background: rgba(255,255,255,0.16); transform: scale(0.97); }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});

export default function App() {
  const {
    habits, completions, addHabit, deleteHabit, toggleCompletion,
    getNewAchievements, calcStreak, weeklyPercent, completedToday, bestStreak,
  } = useHabits();

  const [showAdd, setShowAdd] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [burst, setBurst] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [henExcited, setHenExcited] = useState(false);

  const handleToggle = useCallback((id, date, { completing, x, y }) => {
    unlockAudio(); // must be synchronous inside the tap gesture to unblock WebKit audio
    if (completing) {
      const unlocked = getNewAchievements(id, date);
      if (unlocked.length) {
        setAchievementQueue(q => [...q, ...unlocked]);
      }
      const habit = habits.find(h => h.id === id);
      setBurst({ x, y, color: habit?.color ?? '#7C3AED', key: Date.now() });
      setHenExcited(true);
      setTimeout(() => setHenExcited(false), 750);
    }
    toggleCompletion(id, date);
  }, [getNewAchievements, habits, toggleCompletion]);

  const dismissAchievement = useCallback(() => {
    setAchievementQueue(q => q.slice(1));
  }, []);

  return (
    <>
      <AppBar>
        <HeaderLeft>
          <HenMascot size={42} excited={henExcited} />
          <TitleGroup>
            <AppTitle>HabitHen</AppTitle>
            <DateLabel>{today}</DateLabel>
          </TitleGroup>
        </HeaderLeft>
        <NewBtn onClick={() => setShowAdd(true)}>+ New</NewBtn>
      </AppBar>

      <Dashboard
        totalHabits={habits.length}
        completedToday={completedToday}
        bestStreak={bestStreak}
        weeklyPercent={weeklyPercent()}
      />

      <HabitList
        habits={habits}
        completions={completions}
        calcStreak={calcStreak}
        onToggle={handleToggle}
        onDelete={setPendingDelete}
      />

      {showAdd && (
        <AddHabitModal
          habits={habits}
          onAdd={addHabit}
          onClose={() => setShowAdd(false)}
        />
      )}

      {pendingDelete && (
        <DeleteDialog
          habit={pendingDelete}
          onConfirm={() => { deleteHabit(pendingDelete.id); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {burst && (
        <ConfettiBurst
          key={burst.key}
          x={burst.x}
          y={burst.y}
          color={burst.color}
          onDone={() => setBurst(null)}
        />
      )}

      {achievementQueue.length > 0 && (
        <AchievementToast
          key={achievementQueue[0].id}
          achievement={achievementQueue[0]}
          onDismiss={dismissAchievement}
        />
      )}
    </>
  );
}
