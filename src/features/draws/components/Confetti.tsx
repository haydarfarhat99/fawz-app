import { useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  fallDelay: number;
  fallDuration: number;
  swayDelay: number;
  swayDuration: number;
  size: number;
  color: string;
  rotation: number;
  shape: 'rect' | 'circle';
}

const COLORS = ['#FBBF24', '#F59E0B', '#A78BFA', '#7C3AED', '#10B981', '#FFFFFF', '#EF4444'];

interface ConfettiProps {
  count?: number;
}

function buildPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    fallDelay: Math.random() * 4,
    fallDuration: 3.5 + Math.random() * 3,
    swayDelay: Math.random() * 2,
    swayDuration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    shape: Math.random() > 0.6 ? 'circle' : 'rect',
  }));
}

export function Confetti({ count = 80 }: ConfettiProps) {
  const [pieces] = useState(() => buildPieces(count));

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            insetInlineStart: `${p.left}%`,
            animation: `confetti-fall ${p.fallDuration}s linear ${p.fallDelay}s infinite, confetti-sway ${p.swayDuration}s ease-in-out ${p.swayDelay}s infinite`,
          }}
        >
          <span
            style={{
              display: 'block',
              width: p.size,
              height: p.shape === 'circle' ? p.size : p.size * 0.5,
              background: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : 2,
              transform: `rotate(${p.rotation}deg)`,
              boxShadow: `0 0 ${p.size}px ${p.color}33`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
