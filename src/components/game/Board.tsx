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
}

export const Board = ({
  grid,
  size,
  previewCells = new Set(),
  invalidPreviewCells = new Set(),
  clearingCells = new Set(),
  onCellHover,
}: BoardProps) => {
  const getCellElement = useCallback(
    (x: number, y: number) => {
      const key = `${x},${y}`;
      const color = grid[y][x];
      const isPreview = previewCells.has(key);
      const isInvalidPreview = invalidPreviewCells.has(key);
      const isClearing = clearingCells.has(key);

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
          />
        </div>
      );
    },
    [grid, previewCells, invalidPreviewCells, clearingCells, onCellHover]
  );

  return (
    <motion.div
      className="
        relative
        bg-gradient-to-br from-slate-800 to-slate-900
        rounded-2xl
        p-1.5 sm:p-2
        shadow-2xl
        border-2 border-white/5
      "
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-black/30 rounded-xl p-0.5 sm:p-1">
        <div
          className="grid gap-0.5 sm:gap-1"
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

      {/* Starry background overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_50%)] animate-twinkle" />
      </div>
    </motion.div>
  );
};
