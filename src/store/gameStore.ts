import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, DailyChallenge } from '../types/game';

interface GameStore extends UserProgress {
  // Actions
  updateScore: (score: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  completeLevel: (levelId: number, score: number, stars: number) => void;
  unlockLevel: (levelId: number) => void;
  setCurrentLevel: (levelId: number) => void;
  completeDailyChallenge: (challengeId: string) => void;
  activatePremiumPass: () => void;
  incrementGamesPlayed: () => void;
  resetProgress: () => void;
  updateLastPlayedDate: () => void;
  initializeDailyChallenges: () => void;
}

const generateDailyChallenges = (): DailyChallenge[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const challenges: DailyChallenge[] = [
    {
      id: `daily-${today.toISOString().split('T')[0]}-1`,
      date: today.toISOString(),
      name: 'Quick Start',
      description: 'Score 500 points',
      targetScore: 500,
      reward: 50,
      completed: false,
      expiresAt: tomorrow,
    },
    {
      id: `daily-${today.toISOString().split('T')[0]}-2`,
      date: today.toISOString(),
      name: 'Combo Master',
      description: 'Clear 3 lines at once',
      targetScore: 1000,
      reward: 100,
      completed: false,
      expiresAt: tomorrow,
    },
    {
      id: `daily-${today.toISOString().split('T')[0]}-3`,
      date: today.toISOString(),
      name: 'High Roller',
      description: 'Score 2000 points',
      targetScore: 2000,
      reward: 200,
      completed: false,
      expiresAt: tomorrow,
    },
  ];

  return challenges;
};

const initialState: UserProgress = {
  totalScore: 0,
  bestScore: 0,
  gamesPlayed: 0,
  currentLevel: 1,
  completedLevels: [],
  coins: 0,
  premiumPass: {
    active: false,
    benefits: {
      noAds: false,
      doubleRewards: false,
      exclusivePieces: false,
      dailyBonus: false,
    },
  },
  dailyChallenges: generateDailyChallenges(),
  lastPlayedDate: new Date().toISOString().split('T')[0],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateScore: (score: number) => {
        set((state) => {
          const isNewBest = score > state.bestScore;
          return {
            totalScore: state.totalScore + score,
            bestScore: isNewBest ? score : state.bestScore,
          };
        });
      },

      addCoins: (amount: number) => {
        set((state) => {
          const multiplier = state.premiumPass.active ? 2 : 1;
          return {
            coins: state.coins + amount * multiplier,
          };
        });
      },

      spendCoins: (amount: number) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },

      completeLevel: (levelId: number, score: number, stars: number) => {
        set((state) => {
          const completedLevels = state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId];

          // Reward coins based on stars
          const coinReward = stars * 50;
          const multiplier = state.premiumPass.active ? 2 : 1;

          return {
            completedLevels,
            coins: state.coins + coinReward * multiplier,
            totalScore: state.totalScore + score,
          };
        });
      },

      unlockLevel: (_levelId: number) => {
        // Level unlock logic is handled by the levels themselves
      },

      setCurrentLevel: (levelId: number) => {
        set({ currentLevel: levelId });
      },

      completeDailyChallenge: (challengeId: string) => {
        set((state) => {
          const dailyChallenges = state.dailyChallenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, completed: true }
              : challenge
          );

          const challenge = state.dailyChallenges.find((c) => c.id === challengeId);
          const reward = challenge ? challenge.reward : 0;
          const multiplier = state.premiumPass.active ? 2 : 1;

          return {
            dailyChallenges,
            coins: state.coins + reward * multiplier,
          };
        });
      },

      activatePremiumPass: () => {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        set({
          premiumPass: {
            active: true,
            purchaseDate: now,
            expiresAt,
            benefits: {
              noAds: true,
              doubleRewards: true,
              exclusivePieces: true,
              dailyBonus: true,
            },
          },
        });
      },

      incrementGamesPlayed: () => {
        set((state) => ({ gamesPlayed: state.gamesPlayed + 1 }));
      },

      resetProgress: () => {
        set(initialState);
      },

      updateLastPlayedDate: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();

        if (state.lastPlayedDate !== today) {
          set({
            lastPlayedDate: today,
            dailyChallenges: generateDailyChallenges(),
          });
        }
      },

      initializeDailyChallenges: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.lastPlayedDate !== today) {
          set({
            dailyChallenges: generateDailyChallenges(),
            lastPlayedDate: today,
          });
        }
      },
    }),
    {
      name: 'block-blast-storage',
    }
  )
);
