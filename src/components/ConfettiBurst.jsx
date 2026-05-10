import { useMemo, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const burst = keyframes`
  0%   { opacity: 1; transform: rotate(var(--a)) translateX(0)       scale(1); }
  80%  { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--a)) translateX(var(--d)) scale(0.3); }
`;

const Particle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin-left: ${({ $size }) => -$size / 2}px;
  margin-top: ${({ $size }) => -$size / 2}px;
  border-radius: ${({ $circle }) => $circle ? '50%' : '2px'};
  background: ${({ $color }) => $color};
  animation: ${burst} 0.7s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
`;

const Container = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
`;

function getColors(accent) {
  return [accent, accent, '#FCD34D', '#FFFFFF', '#FB923C', accent, '#A78BFA', '#F9A8D4'];
}

export default function ConfettiBurst({ x, y, color, onDone }) {
  const particles = useMemo(() => {
    const colors = getColors(color);
    return Array.from({ length: 16 }, (_, i) => ({
      angle: (360 / 16) * i + (i % 3 === 0 ? 8 : i % 3 === 1 ? -5 : 0),
      dist: 38 + (i % 4) * 14,
      size: 6 + (i % 3) * 2,
      circle: i % 2 === 0,
      color: colors[i % colors.length],
      delay: i * 0.018,
    }));
  }, [color]);

  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <Container style={{ left: x, top: y }}>
      {particles.map((p, i) => (
        <Particle
          key={i}
          $size={p.size}
          $circle={p.circle}
          $color={p.color}
          $delay={p.delay}
          style={{ '--a': `${p.angle}deg`, '--d': `${p.dist}px` }}
        />
      ))}
    </Container>
  );
}
