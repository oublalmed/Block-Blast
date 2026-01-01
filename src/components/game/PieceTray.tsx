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
        w-full max-w-md
        bg-gradient-to-br from-slate-800 to-slate-900
        rounded-2xl
        p-4
        shadow-2xl
        border-2 border-white/5
        flex items-center justify-around
        gap-4
        min-h-[120px]
      "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="flex-1 flex items-center justify-center min-h-[100px]"
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
        </div>
      ))}
    </motion.div>
  );
};
