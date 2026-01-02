import { motion } from 'framer-motion';
import { Piece } from './Piece';
import type { Piece as PieceType } from '../../types/game';

interface PieceTrayProps {
  pieces: PieceType[];
  onPieceDragStart?: (piece: PieceType, event: React.PointerEvent) => void;
  onPieceDragEnd?: (piece: PieceType, event: React.PointerEvent) => void;
  draggingPiece?: PieceType | null;
  unplaceablePieces?: Set<string>;
  dragPosition?: { x: number; y: number };
}

export const PieceTray = ({
  pieces,
  onPieceDragStart,
  onPieceDragEnd,
  draggingPiece,
  unplaceablePieces = new Set(),
  dragPosition,
}: PieceTrayProps) => {
  return (
    <motion.div
      className="
        w-full
        bg-gradient-to-br from-slate-800/90 to-slate-900/90
        backdrop-blur-sm
        rounded-xl sm:rounded-2xl lg:rounded-3xl
        p-2 sm:p-3 lg:p-5
        shadow-2xl
        border border-white/10 sm:border-2
        flex items-center justify-around
        gap-2 sm:gap-3 lg:gap-5
        min-h-[80px] sm:min-h-[90px] lg:min-h-[110px]
      "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {pieces.map((piece, index) => (
        <motion.div
          key={piece.id}
          className="flex-1 flex items-center justify-center min-h-[60px] sm:min-h-[70px] lg:min-h-[90px]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
        >
          {!piece.placed && (
            <Piece
              piece={piece}
              onDragStart={onPieceDragStart}
              onDragEnd={onPieceDragEnd}
              isDragging={draggingPiece?.id === piece.id}
              canBePlaced={!unplaceablePieces.has(piece.id)}
              position={draggingPiece?.id === piece.id ? dragPosition : undefined}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
