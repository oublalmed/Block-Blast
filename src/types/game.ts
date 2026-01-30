export type CellColor = 'blue' | 'orange' | 'green' | 'purple' | 'yellow' | 'cyan' | 'red';

export type PieceShape = [number, number][];

export interface Piece {
  shape: PieceShape;
  color: CellColor;
  placed: boolean;
  id: string;
}

export interface GameBoard {
  grid: (CellColor | null)[][];
  size: number;
}

export interface GameState {
  score: number;
  level: number;
  moves: number;
  isGameOver: boolean;
  combo: number;
}

export interface Level {
  id: number;
  name: string;
  targetScore: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: number;
  unlocked: boolean;
  completed: boolean;
  stars: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  name: string;
  description: string;
  targetScore: number;
  reward: number;
  completed: boolean;
  expiresAt: Date;
}

export interface PowerUpInventory {
  undo: number;
  hint: number;
  bomb: number;
  shuffle: number;
}

export interface UserProgress {
  totalScore: number;
  bestScore: number;
  gamesPlayed: number;
  currentLevel: number;
  completedLevels: number[];
  coins: number;
  isPremium: boolean;
  dailyChallenges: DailyChallenge[];
  lastPlayedDate: string;
  achievements: string[]; // List of unlocked achievement IDs
  maxCombo: number; // Highest combo achieved
  perfectClears: number; // Number of perfect board clears
  consecutiveDays: number; // Days played in a row
  powerUps: PowerUpInventory; // Power-up inventory
}

export const PIECE_SHAPES: PieceShape[] = [
  [[0, 0]], // Single
  [[0, 0], [1, 0]], // Two horizontal
  [[0, 0], [0, 1]], // Two vertical
  [[0, 0], [1, 0], [2, 0]], // Three horizontal
  [[0, 0], [0, 1], [0, 2]], // Three vertical
  [[0, 0], [1, 0], [0, 1], [1, 1]], // Square
  [[0, 0], [1, 0], [1, 1]], // L shape
  [[0, 0], [0, 1], [1, 1]], // L shape 2
  [[0, 0], [1, 0], [2, 0], [0, 1]], // T shape
  [[0, 0], [1, 0], [2, 0], [1, 1]], // T shape 2
  [[0, 0], [1, 0], [2, 0], [3, 0]], // Four horizontal
  [[0, 0], [0, 1], [0, 2], [0, 3]], // Four vertical
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z shape
  [[0, 1], [1, 1], [1, 0], [2, 0]], // Z shape 2
  // Additional premium shapes
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], // Premium L
  [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], // Premium stairs
];

export const COLORS: CellColor[] = ['blue', 'orange', 'green', 'purple', 'yellow', 'cyan', 'red'];

export const GRID_SIZE = 8;
