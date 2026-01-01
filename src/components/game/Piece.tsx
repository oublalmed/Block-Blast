import { motion } from 'framer-motion';
import type { Piece as PieceType } from '../../types/game';

interface PieceProps {
  piece: PieceType;
  onDragStart?: (piece: PieceType, event: React.PointerEvent) => void;
  onDragEnd?: (piece: PieceType, event: React.PointerEvent) => void;
  isDragging?: boolean;
  canBePlaced?: boolean;
  position?: { x: number; y: number };
}

const colorMap: Record<string, string> = {
  blue: 'from-blue-400 to-blue-600',
  orange: 'from-orange-400 to-orange-600',
  green: 'from-green-400 to-green-600',
  purple: 'from-purple-400 to-purple-600',
  yellow: 'from-yellow-400 to-yellow-600',
  cyan: 'from-cyan-400 to-cyan-600',
  red: 'from-red-400 to-red-600',
};

export const Piece = ({
  piece,
  onDragStart,
  onDragEnd,
  isDragging,
  canBePlaced = true,
  position,
}: PieceProps) => {
  if (piece.placed) {
    return null;
  }

  const cols = Math.max(...piece.shape.map(([x]) => x)) + 1;
  const rows = Math.max(...piece.shape.map(([, y]) => y)) + 1;

  const grid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  piece.shape.forEach(([x, y]) => {
    grid[y][x] = true;
  });

  const blockSize = isDragging ? 'w-6 h-6' : 'w-5 h-5 sm:w-6 sm:h-6';

  const containerStyle = isDragging && position
    ? {
        position: 'fixed' as const,
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      }
    : {};

  return (
    <motion.div
      className={`
        grid gap-0.5 cursor-grab active:cursor-grabbing
        ${!canBePlaced && !isDragging ? 'opacity-35 grayscale-[0.5]' : ''}
        ${isDragging ? 'scale-110 drop-shadow-2xl' : ''}
      `}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        touchAction: 'none',
        ...containerStyle,
      }}
      onPointerDown={(e) => {
        if (canBePlaced && onDragStart) {
          e.preventDefault();
          onDragStart(piece, e);
        }
      }}
      onPointerUp={(e) => {
        if (onDragEnd) {
          onDragEnd(piece, e);
        }
      }}
      whileHover={canBePlaced && !isDragging ? { scale: 1.05 } : {}}
      whileTap={canBePlaced ? { scale: 1.1 } : {}}
      animate={
        piece.placed
          ? { scale: 0, opacity: 0 }
          : isDragging
          ? { scale: 1.1, opacity: 0.9 }
          : { scale: 1, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {grid.map((row, y) =>
        row.map((filled, x) => (
          <div
            key={`${x}-${y}`}
            className={`${blockSize} rounded ${
              filled
                ? `bg-gradient-to-br ${colorMap[piece.color]} shadow-lg`
                : 'opacity-0'
            }`}
          >
            {filled && (
              <>
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-white/40 rounded" />
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t" />
                </div>
              </>
            )}
          </div>
        ))
      )}
    </motion.div>
  );
};
