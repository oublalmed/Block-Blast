export type AchievementCategory = 'score' | 'games' | 'combos' | 'levels' | 'perfect' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: number;
  rewardCoins: number;
  unlocked: boolean;
  unlockedAt?: Date;
  hidden?: boolean; // Secret achievements
}

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Score Achievements
  {
    id: 'score_1k',
    title: 'Getting Started',
    description: 'Score 1,000 points in a single game',
    icon: '🎯',
    category: 'score',
    requirement: 1000,
    rewardCoins: 50,
  },
  {
    id: 'score_5k',
    title: 'Rising Star',
    description: 'Score 5,000 points in a single game',
    icon: '⭐',
    category: 'score',
    requirement: 5000,
    rewardCoins: 100,
  },
  {
    id: 'score_10k',
    title: 'Expert Player',
    description: 'Score 10,000 points in a single game',
    icon: '🌟',
    category: 'score',
    requirement: 10000,
    rewardCoins: 200,
  },
  {
    id: 'score_25k',
    title: 'Master',
    description: 'Score 25,000 points in a single game',
    icon: '💫',
    category: 'score',
    requirement: 25000,
    rewardCoins: 500,
  },
  {
    id: 'score_50k',
    title: 'Legend',
    description: 'Score 50,000 points in a single game',
    icon: '👑',
    category: 'score',
    requirement: 50000,
    rewardCoins: 1000,
  },

  // Games Played
  {
    id: 'games_10',
    title: 'Dedication',
    description: 'Play 10 games',
    icon: '🎮',
    category: 'games',
    requirement: 10,
    rewardCoins: 50,
  },
  {
    id: 'games_50',
    title: 'Committed',
    description: 'Play 50 games',
    icon: '🏆',
    category: 'games',
    requirement: 50,
    rewardCoins: 150,
  },
  {
    id: 'games_100',
    title: 'Veteran',
    description: 'Play 100 games',
    icon: '🎖️',
    category: 'games',
    requirement: 100,
    rewardCoins: 300,
  },
  {
    id: 'games_500',
    title: 'Unstoppable',
    description: 'Play 500 games',
    icon: '💪',
    category: 'games',
    requirement: 500,
    rewardCoins: 1000,
  },

  // Combo Achievements
  {
    id: 'combo_5',
    title: 'Combo Starter',
    description: 'Achieve a 5x combo',
    icon: '🔥',
    category: 'combos',
    requirement: 5,
    rewardCoins: 75,
  },
  {
    id: 'combo_10',
    title: 'Combo Master',
    description: 'Achieve a 10x combo',
    icon: '💥',
    category: 'combos',
    requirement: 10,
    rewardCoins: 200,
  },
  {
    id: 'combo_15',
    title: 'Combo God',
    description: 'Achieve a 15x combo',
    icon: '⚡',
    category: 'combos',
    requirement: 15,
    rewardCoins: 500,
  },

  // Level Achievements
  {
    id: 'levels_5',
    title: 'Level Explorer',
    description: 'Complete 5 levels',
    icon: '🗺️',
    category: 'levels',
    requirement: 5,
    rewardCoins: 100,
  },
  {
    id: 'levels_10',
    title: 'Level Conqueror',
    description: 'Complete 10 levels',
    icon: '🏅',
    category: 'levels',
    requirement: 10,
    rewardCoins: 250,
  },
  {
    id: 'levels_20',
    title: 'Level Champion',
    description: 'Complete 20 levels',
    icon: '🏆',
    category: 'levels',
    requirement: 20,
    rewardCoins: 500,
  },

  // Perfect Achievements
  {
    id: 'perfect_clear',
    title: 'Perfect Clear',
    description: 'Clear the entire board in one move',
    icon: '✨',
    category: 'perfect',
    requirement: 1,
    rewardCoins: 300,
    hidden: true,
  },
  {
    id: 'no_mistakes',
    title: 'Flawless Victory',
    description: 'Score 5,000+ points without any invalid placements',
    icon: '💎',
    category: 'perfect',
    requirement: 5000,
    rewardCoins: 400,
    hidden: true,
  },

  // Special Achievements
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Complete your first game',
    icon: '🎉',
    category: 'special',
    requirement: 1,
    rewardCoins: 25,
  },
  {
    id: 'premium_user',
    title: 'Premium Member',
    description: 'Activate Premium Pack',
    icon: '👑',
    category: 'special',
    requirement: 1,
    rewardCoins: 500,
  },
  {
    id: 'daily_streak_7',
    title: 'Week Warrior',
    description: 'Play for 7 consecutive days',
    icon: '📅',
    category: 'special',
    requirement: 7,
    rewardCoins: 200,
  },
  {
    id: 'daily_streak_30',
    title: 'Monthly Master',
    description: 'Play for 30 consecutive days',
    icon: '📆',
    category: 'special',
    requirement: 30,
    rewardCoins: 1000,
  },
];

export const getCategoryName = (category: AchievementCategory): string => {
  const names: Record<AchievementCategory, string> = {
    score: 'Score Milestones',
    games: 'Games Played',
    combos: 'Combo Master',
    levels: 'Level Progress',
    perfect: 'Perfect Plays',
    special: 'Special',
  };
  return names[category];
};

export const getCategoryColor = (category: AchievementCategory): string => {
  const colors: Record<AchievementCategory, string> = {
    score: 'from-blue-500 to-blue-600',
    games: 'from-green-500 to-green-600',
    combos: 'from-orange-500 to-red-500',
    levels: 'from-purple-500 to-purple-600',
    perfect: 'from-yellow-500 to-yellow-600',
    special: 'from-pink-500 to-pink-600',
  };
  return colors[category];
};
