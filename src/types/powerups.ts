export type PowerUpType = 'undo' | 'hint' | 'bomb' | 'shuffle';

export interface PowerUp {
  id: PowerUpType;
  name: string;
  description: string;
  icon: string;
  cost: number;
  color: string;
}

export interface PowerUpInventory {
  undo: number;
  hint: number;
  bomb: number;
  shuffle: number;
}

export const POWERUPS: PowerUp[] = [
  {
    id: 'undo',
    name: 'Undo',
    description: 'Undo your last move',
    icon: '↩️',
    cost: 50,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'hint',
    name: 'Hint',
    description: 'Show the best placement for a piece',
    icon: '💡',
    cost: 30,
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'bomb',
    name: 'Bomb',
    description: 'Clear a 3x3 area on the board',
    icon: '💣',
    cost: 100,
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'shuffle',
    name: 'Shuffle',
    description: 'Get new pieces without penalty',
    icon: '🔄',
    cost: 75,
    color: 'from-purple-500 to-purple-600',
  },
];
