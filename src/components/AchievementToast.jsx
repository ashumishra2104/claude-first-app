import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { playAchievementSound } from '../utils/sounds';

const slideUp = keyframes`
  from { transform: translateY(120%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(120%); opacity: 0; }
`;

const Wrapper = styled.div`
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  pointer-events: none;
  width: calc(100% - 48px);
  max-width: 380px;
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #1E1B4B;
  color: white;
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: ${({ $leaving }) => $leaving ? slideDown : slideUp} 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
`;

const Emoji = styled.div`
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sub = styled.div`
  font-size: 0.8rem;
  opacity: 0.75;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SHOW_MS = 2600;
const EXIT_MS = 350;

export default function AchievementToast({ achievement, onDismiss }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setLeaving(false);
    playAchievementSound();
    const exitTimer = setTimeout(() => setLeaving(true), SHOW_MS);
    const doneTimer = setTimeout(onDismiss, SHOW_MS + EXIT_MS);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [achievement.id, onDismiss]);

  return (
    <Wrapper>
      <Toast $leaving={leaving}>
        <Emoji>{achievement.emoji}</Emoji>
        <TextGroup>
          <Title>{achievement.title}</Title>
          <Sub>{achievement.sub}</Sub>
        </TextGroup>
      </Toast>
    </Wrapper>
  );
}
