import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 24px;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.modal};
  padding: 28px 24px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const Icon = styled.div`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 12px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Sub = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 24px;
`;

const HabitName = styled.strong`
  color: ${({ theme }) => theme.colors.text};
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const KeepBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background 0.15s;

  &:hover { background: #D1D5DB; }
`;

const DeleteBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  transition: background 0.15s;

  &:hover { background: #DC2626; }
`;

export default function DeleteDialog({ habit, onConfirm, onCancel }) {
  return (
    <Overlay onClick={e => e.target === e.currentTarget && onCancel()}>
      <Dialog>
        <Icon>🗑</Icon>
        <Message>Delete habit?</Message>
        <Sub>
          <HabitName>"{habit.name}"</HabitName> and all its history will be permanently removed.
        </Sub>
        <Actions>
          <KeepBtn onClick={onCancel}>Keep it</KeepBtn>
          <DeleteBtn onClick={onConfirm}>Delete</DeleteBtn>
        </Actions>
      </Dialog>
    </Overlay>
  );
}
