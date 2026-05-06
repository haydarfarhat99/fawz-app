import { useMemo } from 'react';
import { cn } from '@core/utils/cn';

interface QrPatternProps {
  seed: string;
  size?: number;
  className?: string;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

export function QrPattern({ seed, size = 116, className }: QrPatternProps) {
  const cells = 21;
  const grid = useMemo(() => {
    const seedHash = hash(seed);
    const arr: boolean[][] = [];
    for (let r = 0; r < cells; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < cells; c++) {
        const v = Math.abs(Math.sin(seedHash + r * 13 + c * 7) * 10000) % 1;
        row.push(v < 0.55);
      }
      arr.push(row);
    }
    const drawFinder = (sr: number, sc: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const onEdge = r === 0 || r === 6 || c === 0 || c === 6;
          const onInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          arr[sr + r][sc + c] = onEdge || onInner;
        }
      }
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (sr + r >= cells || sc + c >= cells) continue;
          if (sr - 1 + r < 0 || sc - 1 + c < 0) continue;
          if (r === 7 && sr + r < cells) arr[sr + r][sc + c - 1] = false;
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(0, cells - 7);
    drawFinder(cells - 7, 0);
    return arr;
  }, [seed]);

  const cellSize = size / cells;
  return (
    <div
      className={cn('relative inline-block bg-white rounded-2xl p-2.5 text-ink-900', className)}
      style={{ width: size + 20, height: size + 20 }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        {grid.flatMap((row, r) =>
          row.map((on, c) =>
            on ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.18}
                fill="currentColor"
              />
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}
