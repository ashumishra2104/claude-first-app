import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  z-index: 200;

  @media (min-width: 480px) {
    align-items: center;
    justify-content: center;
  }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Sheet = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  width: 100%;
  border-radius: 24px 24px 0 0;
  padding: 24px;
  animation: ${slideUp} 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  @media (min-width: 480px) {
    width: 400px;
    border-radius: ${({ theme }) => theme.radii.modal};
  }
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${({ $error, theme }) => $error ? theme.colors.danger : theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  animation: ${({ $shake }) => $shake ? css`${shake} 0.35s ease` : 'none'};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
`;

const ErrorMsg = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 6px;
  min-height: 18px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background 0.15s;

  &:hover { background: #D1D5DB; }
`;

const SaveBtn = styled.button`
  flex: 2;
  padding: 13px;
  border-radius: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  transition: background 0.15s;

  &:hover { background: #5B21B6; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function AddHabitModal({ habits, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a habit name.');
      triggerShake();
      return;
    }
    if (habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('This habit already exists.');
      triggerShake();
      return;
    }
    onAdd(trimmed);
    onClose();
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <Overlay onClick={handleOverlayClick}>
      <Sheet>
        <Title>New Habit</Title>
        <Label htmlFor="habit-input">What habit do you want to build?</Label>
        <Input
          id="habit-input"
          ref={inputRef}
          type="text"
          maxLength={40}
          placeholder="e.g. Morning run"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          $error={!!error}
          $shake={shake}
        />
        <ErrorMsg>{error}</ErrorMsg>
        <Actions>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <SaveBtn onClick={handleSave}>Add Habit</SaveBtn>
        </Actions>
      </Sheet>
    </Overlay>
  );
}
