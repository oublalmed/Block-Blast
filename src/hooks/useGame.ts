import { useState, useCallback, useEffect } from 'react';
import type { Piece, CellColor } from '../types/game';
import {
  canPlacePiece,
  canPlaceAnywhere,
  checkAndGetClearedLines,
  clearLines,
  generatePieces,
  createEmptyGrid,
  vibrate,
} from '../utils/gameLogic';
import { useGameStore } from '../store/gameStore';

export const useGame = (gridSize: number = 8) => {
  const [grid, setGrid] = useState<(CellColor | null)[][]>(() => createEmptyGrid(gridSize));
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  const { premiumPass, updateScore, incrementGamesPlayed, updateMaxCombo, incrementPerfectClears } = useGameStore();

  useEffect(() => {
    initGame();
  }, []);

  const initGame = useCallback(() => {
    setGrid(createEmptyGrid(gridSize));
    setPieces(generatePieces(3, premiumPass.benefits.exclusivePieces));
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setMoves(0);
    vibrate(50);
  }, [gridSize, premiumPass.benefits.exclusivePieces]);

  const placePiece = useCallback(
    (piece: Piece, startX: number, startY: number): boolean => {
      if (!canPlacePiece(grid, piece.shape, startX, startY, gridSize)) {
        vibrate(20);
        return false;
      }

      // Place the piece
      const newGrid = grid.map((row) => [...row]);
      for (const [dx, dy] of piece.shape) {
        const x = startX + dx;
        const y = startY + dy;
        newGrid[y][x] = piece.color;
      }

      setGrid(newGrid);
      setMoves((m) => m + 1);

      // Mark piece as placed
      setPieces((prevPieces) =>
        prevPieces.map((p) => (p.id === piece.id ? { ...p, placed: true } : p))
      );

      // Calculate initial score
      let newScore = score + piece.shape.length * 10;

      // Check for cleared lines
      setTimeout(() => {
        const { rows, cols, cellsToCleare } = checkAndGetClearedLines(newGrid, gridSize);
        const linesCleared = rows.length + cols.length;

        if (linesCleared > 0) {
          const lineScore = linesCleared * linesCleared * 100;
          const comboBonus = combo > 0 ? (combo + 1) * 50 : 0;
          newScore += lineScore + comboBonus;
          const newCombo = combo + 1;
          setCombo(newCombo);

          // Update max combo achievement tracker
          updateMaxCombo(newCombo);

          vibrate(linesCleared > 1 ? [50, 100, 50] : 30);

          setTimeout(() => {
            const clearedGrid = clearLines(newGrid, cellsToCleare);
            setGrid(clearedGrid);

            // Check for perfect clear (entire board empty)
            const isBoardEmpty = clearedGrid.every((row) => row.every((cell) => cell === null));
            if (isBoardEmpty) {
              incrementPerfectClears();
            }
          }, 500);
        } else {
          setCombo(0);
        }

        setScore(newScore);

        // Check if all pieces are placed
        const allPlaced = pieces.every((p) => p.id === piece.id || p.placed);
        if (allPlaced) {
          setTimeout(() => {
            const newPieces = generatePieces(3, premiumPass.benefits.exclusivePieces);
            setPieces(newPieces);

            // Check game over
            const canContinue = newPieces.some((p) =>
              canPlaceAnywhere(grid, p.shape, gridSize)
            );

            if (!canContinue) {
              handleGameOver(newScore);
            }
          }, 600);
        } else {
          // Check if any remaining piece can be placed
          const remainingPieces = pieces.filter((p) => p.id !== piece.id && !p.placed);
          const canContinue = remainingPieces.some((p) =>
            canPlaceAnywhere(newGrid, p.shape, gridSize)
          );

          if (!canContinue) {
            handleGameOver(newScore);
          }
        }
      }, 50);

      vibrate(50);
      return true;
    },
    [grid, pieces, score, combo, gridSize, premiumPass.benefits.exclusivePieces]
  );

  const handleGameOver = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      updateScore(finalScore);
      incrementGamesPlayed();
      vibrate([100, 50, 100]);
    },
    [updateScore, incrementGamesPlayed]
  );

  const checkPieceCanBePlaced = useCallback(
    (piece: Piece): boolean => {
      return canPlaceAnywhere(grid, piece.shape, gridSize);
    },
    [grid, gridSize]
  );

  const resetGame = useCallback(() => {
    initGame();
  }, [initGame]);

  return {
    grid,
    pieces,
    score,
    combo,
    isGameOver,
    moves,
    placePiece,
    checkPieceCanBePlaced,
    resetGame,
    canPlacePiece: (piece: Piece, x: number, y: number) =>
      canPlacePiece(grid, piece.shape, x, y, gridSize),
  };
};
