import { motion } from 'framer-motion';
import { Cell } from './Cell';
import type { CellColor } from '../../types/game';
import { useCallback } from 'react';

interface BoardProps {
  grid: (CellColor | null)[][];
  size: number;
  previewCells?: Set<string>;
  invalidPreviewCells?: Set<string>;
  clearingCells?: Set<string>;
  onCellHover?: (x: number, y: number) => void;
  hint?: { x: number; y: number; pieceId: string } | null;
}

export const Board = ({
  grid,
  size,
  previewCells = new Set(),
  invalidPreviewCells = new Set(),
  clearingCells = new Set(),
  onCellHover,
  hint,
}: BoardProps) => {
  const getCellElement = useCallback(
    (x: number, y: number) => {
      const key = `${x},${y}`;
      const color = grid[y][x];
      const isPreview = previewCells.has(key);
      const isInvalidPreview = invalidPreviewCells.has(key);
      const isClearing = clearingCells.has(key);

      // Check if this cell is part of the hint
      const isHint = hint && x === hint.x && y === hint.y;

      return (
        <div
          key={key}
          className="aspect-square"
          onPointerEnter={() => onCellHover?.(x, y)}
        >
          <Cell
            color={color}
            isPreview={isPreview}
            isInvalidPreview={isInvalidPreview}
            isClearing={isClearing}
            isHint={isHint}
          />
        </div>
      );
    },
    [grid, previewCells, invalidPreviewCells, clearingCells, onCellHover, hint]
  );

  return (
    <motion.div
      className="
        relative
        bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900
        rounded-2xl sm:rounded-3xl
        p-2 sm:p-3
        shadow-2xl shadow-black/50
        border-2 border-white/10
        w-full h-full
      "
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="relative bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 w-full h-full shadow-inner">
        <div
          className="grid gap-[3px] sm:gap-1 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: size }, (_, y) =>
            Array.from({ length: size }, (_, x) => getCellElement(x, y))
          )}
        </div>
      </div>

      {/* Animated glow overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_60%)] animate-twinkle" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.08),transparent_60%)] animate-twinkle" style={{ animationDelay: '1s' }} />
      </div>
    </motion.div>
  );
};
