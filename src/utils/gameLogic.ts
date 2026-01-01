import type { CellColor, PieceShape, Piece } from '../types/game';
import { COLORS, PIECE_SHAPES } from '../types/game';

export const canPlacePiece = (
  grid: (CellColor | null)[][],
  shape: PieceShape,
  startX: number,
  startY: number,
  gridSize: number = 8
): boolean => {
  for (const [dx, dy] of shape) {
    const x = startX + dx;
    const y = startY + dy;
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize || grid[y][x]) {
      return false;
    }
  }
  return true;
};

export const canPlaceAnywhere = (
  grid: (CellColor | null)[][],
  shape: PieceShape,
  gridSize: number = 8
): boolean => {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (canPlacePiece(grid, shape, x, y, gridSize)) {
        return true;
      }
    }
  }
  return false;
};

export const checkAndGetClearedLines = (
  grid: (CellColor | null)[][],
  gridSize: number = 8
): { rows: number[]; cols: number[]; cellsToCleare: Set<string> } => {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  // Check rows
  for (let y = 0; y < gridSize; y++) {
    if (grid[y].every((cell) => cell !== null)) {
      rowsToClear.push(y);
    }
  }

  // Check columns
  for (let x = 0; x < gridSize; x++) {
    if (grid.every((row) => row[x] !== null)) {
      colsToClear.push(x);
    }
  }

  const cellsToCleare = new Set<string>();

  for (const y of rowsToClear) {
    for (let x = 0; x < gridSize; x++) {
      cellsToCleare.add(`${x},${y}`);
    }
  }

  for (const x of colsToClear) {
    for (let y = 0; y < gridSize; y++) {
      cellsToCleare.add(`${x},${y}`);
    }
  }

  return { rows: rowsToClear, cols: colsToClear, cellsToCleare };
};

export const clearLines = (
  grid: (CellColor | null)[][],
  cellsToClear: Set<string>
): (CellColor | null)[][] => {
  const newGrid = grid.map((row) => [...row]);

  for (const coord of cellsToClear) {
    const [x, y] = coord.split(',').map(Number);
    newGrid[y][x] = null;
  }

  return newGrid;
};

export const calculateScore = (
  linesCleared: number,
  pieceSize: number,
  combo: number
): number => {
  const placementScore = pieceSize * 10;
  const lineScore = linesCleared * linesCleared * 100;
  const comboBonus = combo > 1 ? combo * 50 : 0;

  return placementScore + lineScore + comboBonus;
};

export const generatePiece = (includePremium: boolean = false): Piece => {
  const shapes = includePremium ? PIECE_SHAPES : PIECE_SHAPES.slice(0, 14);
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  return {
    shape,
    color,
    placed: false,
    id: `${Date.now()}-${Math.random()}`,
  };
};

export const generatePieces = (count: number = 3, includePremium: boolean = false): Piece[] => {
  return Array.from({ length: count }, () => generatePiece(includePremium));
};

export const createEmptyGrid = (size: number = 8): (CellColor | null)[][] => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
};

export const vibrate = (pattern: number | number[]): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const getStarsForScore = (score: number, targetScore: number): number => {
  if (score < targetScore) return 0;
  if (score < targetScore * 1.5) return 1;
  if (score < targetScore * 2) return 2;
  return 3;
};

export const getLevelData = (levelId: number) => {
  // Difficulty progression: every 10 levels
  const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;
  const difficultyIndex = Math.floor((levelId - 1) / 10);
  const difficulty = difficulties[Math.min(difficultyIndex, 3)];

  // Progressive target score with better scaling
  let targetScore: number;

  if (levelId <= 10) {
    // Easy levels: 500 - 2300 (increments of 200)
    targetScore = 500 + (levelId - 1) * 200;
  } else if (levelId <= 20) {
    // Medium levels: 2600 - 5300 (increments of 300)
    targetScore = 2300 + (levelId - 10) * 300;
  } else if (levelId <= 30) {
    // Hard levels: 5700 - 9300 (increments of 400)
    targetScore = 5300 + (levelId - 20) * 400;
  } else if (levelId <= 40) {
    // Expert levels: 9800 - 14300 (increments of 500)
    targetScore = 9300 + (levelId - 30) * 500;
  } else {
    // Master levels: 14900+ (increments of 600)
    targetScore = 14300 + (levelId - 40) * 600;
  }

  // Reward scales with difficulty
  const rewardMultiplier = difficulty === 'expert' ? 30 :
                          difficulty === 'hard' ? 20 :
                          difficulty === 'medium' ? 15 : 10;

  return {
    id: levelId,
    name: `Level ${levelId}`,
    targetScore,
    difficulty,
    reward: levelId * rewardMultiplier,
    unlocked: levelId === 1,
    completed: false,
    stars: 0,
  };
};
