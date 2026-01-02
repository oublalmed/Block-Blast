import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Board } from '../components/game/Board';
import { PieceTray } from '../components/game/PieceTray';
import { PowerUpBar } from '../components/game/PowerUpBar';
import { Header } from '../components/ui/Header';
import { GameOverModal } from '../components/ui/GameOverModal';
import { ComboPopup } from '../components/ui/ComboPopup';
import { ScoreFloat } from '../components/ui/ScoreFloat';
import { AdBanner } from '../components/ads/AdBanner';
import { useGame } from '../hooks/useGame';
import { useGameStore } from '../store/gameStore';
import type { Piece } from '../types/game';
import type { PowerUpType } from '../types/powerups';

interface GameScreenProps {
  onHome?: () => void;
  levelMode?: boolean;
  targetScore?: number;
  onLevelComplete?: (score: number, stars: number) => void;
}

export const GameScreen = ({
  onHome,
  levelMode = false,
  targetScore,
  onLevelComplete,
}: GameScreenProps) => {
  const {
    grid,
    pieces,
    score,
    combo,
    isGameOver,
    placePiece,
    resetGame,
    checkPieceCanBePlaced,
    canPlacePiece,
    handleUndo,
    handleShowHint,
    hint,
    canUndo,
  } = useGame();

  const { addCoins, premiumPass } = useGameStore();

  const [draggingPiece, setDraggingPiece] = useState<Piece | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [previewCells, setPreviewCells] = useState<Set<string>>(new Set());
  const [invalidPreviewCells, setInvalidPreviewCells] = useState<Set<string>>(new Set());
  const [clearingCells] = useState<Set<string>>(new Set());
  const [showCombo, setShowCombo] = useState(false);
  const [showScoreFloat, setShowScoreFloat] = useState(false);
  const [unplaceablePieces, setUnplaceablePieces] = useState<Set<string>>(new Set());

  // Update unplaceable pieces
  useEffect(() => {
    const unplaceable = new Set<string>();
    pieces.forEach((piece) => {
      if (!piece.placed && !checkPieceCanBePlaced(piece)) {
        unplaceable.add(piece.id);
      }
    });
    setUnplaceablePieces(unplaceable);
  }, [pieces, grid, checkPieceCanBePlaced]);

  // Show combo popup
  useEffect(() => {
    if (combo >= 2) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  // Handle level completion
  useEffect(() => {
    if (levelMode && targetScore && score >= targetScore) {
      const stars = Math.min(3, Math.floor(score / targetScore));
      onLevelComplete?.(score, stars);
    }
  }, [score, levelMode, targetScore, onLevelComplete]);

  // Award coins on game over
  useEffect(() => {
    if (isGameOver && score > 0) {
      const coins = Math.floor(score / 10);
      addCoins(coins);
    }
  }, [isGameOver, score, addCoins]);

  const getBoardPosition = useCallback((clientX: number, clientY: number) => {
    const boardEl = document.querySelector('[data-board]') as HTMLElement;
    if (!boardEl) return null;

    const rect = boardEl.getBoundingClientRect();
    const cellSize = rect.width / 8;

    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);

    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      return { x, y };
    }
    return null;
  }, []);

  const handlePieceDragStart = useCallback(
    (piece: Piece, event: React.PointerEvent) => {
      setDraggingPiece(piece);
      setDragPosition({ x: event.clientX, y: event.clientY });
    },
    []
  );

  const handlePieceDrag = useCallback(
    (event: PointerEvent) => {
      if (!draggingPiece) return;

      setDragPosition({ x: event.clientX, y: event.clientY });

      const boardPos = getBoardPosition(event.clientX, event.clientY);
      setPreviewCells(new Set());
      setInvalidPreviewCells(new Set());

      if (boardPos) {
        const valid = canPlacePiece(draggingPiece, boardPos.x, boardPos.y);
        const cells = new Set<string>();

        for (const [dx, dy] of draggingPiece.shape) {
          const x = boardPos.x + dx;
          const y = boardPos.y + dy;
          if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            cells.add(`${x},${y}`);
          }
        }

        if (valid) {
          setPreviewCells(cells);
        } else {
          setInvalidPreviewCells(cells);
        }
      }
    },
    [draggingPiece, getBoardPosition, canPlacePiece]
  );

  const handlePieceDragEnd = useCallback(
    (piece: Piece, event: React.PointerEvent) => {
      const boardPos = getBoardPosition(event.clientX, event.clientY);

      setPreviewCells(new Set());
      setInvalidPreviewCells(new Set());

      if (boardPos) {
        const success = placePiece(piece, boardPos.x, boardPos.y);
        if (success) {
          setShowScoreFloat(true);
          setTimeout(() => setShowScoreFloat(false), 1000);
        }
      }

      setDraggingPiece(null);
    },
    [getBoardPosition, placePiece]
  );

  // Global pointer move listener
  useEffect(() => {
    if (draggingPiece) {
      document.addEventListener('pointermove', handlePieceDrag);
      return () => document.removeEventListener('pointermove', handlePieceDrag);
    }
  }, [draggingPiece, handlePieceDrag]);

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_50%)] animate-twinkle pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center h-screen px-3 py-2 sm:p-4 safe-area-padding max-w-[600px] mx-auto w-full">
        {/* Header */}
        <div className="w-full mb-1 sm:mb-2">
          <Header score={score} onMenuClick={onHome} showMenu={!!onHome} />
        </div>

        {/* Level Progress (if in level mode) */}
        {levelMode && targetScore && (
          <motion.div
            className="w-full mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-white/10 shadow-lg">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider font-semibold">
                  Target
                </span>
                <span className="text-xs sm:text-sm font-bold text-yellow-400">
                  {targetScore.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-900/50 rounded-full h-1.5 sm:h-2 overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 shadow-lg shadow-green-500/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center w-full my-1 sm:my-2">
          <div className="w-full aspect-square max-w-[95vw] sm:max-w-[450px]" data-board>
            <Board
              grid={grid}
              size={8}
              previewCells={previewCells}
              invalidPreviewCells={invalidPreviewCells}
              clearingCells={clearingCells}
              hint={hint}
            />
          </div>
        </div>

        {/* Power-Ups Bar */}
        <div className="w-full mb-2 sm:mb-3">
          <PowerUpBar
            onUsePowerUp={(type: PowerUpType) => {
              if (type === 'undo') {
                handleUndo();
              } else if (type === 'hint') {
                handleShowHint();
              }
            }}
            disabled={isGameOver}
          />
        </div>

        {/* Piece Tray */}
        <div className="w-full">
          <PieceTray
            pieces={pieces}
            onPieceDragStart={handlePieceDragStart}
            onPieceDragEnd={handlePieceDragEnd}
            draggingPiece={draggingPiece}
            unplaceablePieces={unplaceablePieces}
            dragPosition={dragPosition}
          />
        </div>
      </div>

      {/* Combo Popup */}
      <ComboPopup combo={combo} show={showCombo} />

      {/* Score Float */}
      <ScoreFloat score={combo > 0 ? combo * 50 : 0} show={showScoreFloat} />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        score={score}
        onPlayAgain={handlePlayAgain}
        onHome={onHome}
        showHomeButton={!!onHome}
      />

      {/* Ad Banner */}
      {!premiumPass.active && <AdBanner position="bottom" />}
    </div>
  );
};
