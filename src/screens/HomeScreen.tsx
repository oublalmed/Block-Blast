import { motion } from 'framer-motion';
import { Play, Trophy, Target, ShoppingBag, Star, Lock, Crown, HelpCircle, Award, ChevronDown } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getLevelData } from '../utils/gameLogic';
import { useEffect, useState } from 'react';
import { Tutorial, useTutorial } from '../components/ui/Tutorial';

interface HomeScreenProps {
  onStartGame: () => void;
  onStartLevel: (levelId: number) => void;
  onOpenShop: () => void;
  onOpenChallenges: () => void;
  onOpenAchievements: () => void;
}

export const HomeScreen = ({
  onStartGame,
  onStartLevel,
  onOpenShop,
  onOpenChallenges,
  onOpenAchievements,
}: HomeScreenProps) => {
  const {
    bestScore,
    coins,
    premiumPass,
    currentLevel,
    completedLevels,
    dailyChallenges,
    initializeDailyChallenges,
  } = useGameStore();

  useEffect(() => {
    initializeDailyChallenges();
  }, [initializeDailyChallenges]);

  const { showTutorial, handleComplete, handleSkip, resetTutorial } = useTutorial();
  const [levelsToShow, setLevelsToShow] = useState(12);

  const completedChallenges = dailyChallenges.filter((c) => c.completed).length;
  const hasActiveChallenges = dailyChallenges.length > completedChallenges;

  // Get levels to display with load more functionality
  const levels = Array.from({ length: levelsToShow }, (_, i) => {
    const levelId = currentLevel + i;
    const data = getLevelData(levelId);
    const isUnlocked = levelId === 1 || completedLevels.includes(levelId - 1);
    const isCompleted = completedLevels.includes(levelId);
    return { ...data, unlocked: isUnlocked, completed: isCompleted };
  });

  const handleLoadMore = () => {
    setLevelsToShow((prev) => prev + 12);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_50%)] animate-twinkle pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-4 py-4 pb-20 sm:px-6 sm:py-6 sm:pb-24 safe-area-padding max-w-2xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-5 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="
                w-10 h-10 sm:w-14 sm:h-14
                bg-gradient-to-br from-orange-500 to-orange-600
                rounded-xl sm:rounded-2xl
                flex items-center justify-center
                text-2xl sm:text-3xl
                shadow-2xl shadow-orange-500/40
              "
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              🧩
            </motion.div>
            <div>
              <h1 className="text-white font-black text-xl sm:text-3xl leading-none tracking-tight">
                Block Blast
              </h1>
              {premiumPass.active && (
                <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-xs sm:text-sm font-semibold">Premium</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={resetTutorial}
              className="
                w-9 h-9 sm:w-10 sm:h-10
                bg-slate-700/50
                rounded-lg sm:rounded-xl
                flex items-center justify-center
                text-white/70
                hover:text-white
                hover:bg-slate-600/50
                active:scale-95
                transition-all
              "
              aria-label="How to play"
              title="How to Play"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onOpenShop}
              className="
                bg-gradient-to-br from-yellow-500 to-orange-500
                text-white
                font-bold
                px-3 py-1.5 sm:px-4 sm:py-2
                rounded-lg sm:rounded-xl
                text-sm sm:text-base
                shadow-lg shadow-yellow-500/30
                hover:shadow-yellow-500/50
                hover:scale-105
                active:scale-95
                transition-all
                flex items-center gap-1.5 sm:gap-2
              "
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>💰 {coins}</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={<Trophy className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Best Score"
            value={bestScore.toLocaleString()}
            color="yellow"
          />
          <StatCard
            icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Levels"
            value={completedLevels.length}
            color="green"
          />
          <StatCard
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Challenges"
            value={`${completedChallenges}/${dailyChallenges.length}`}
            color="blue"
          />
        </motion.div>

        {/* Quick Play Button */}
        <motion.button
          onClick={onStartGame}
          className="
            w-full
            bg-gradient-to-r from-green-500 to-green-600
            text-white
            font-black
            text-lg sm:text-xl
            py-4 sm:py-5
            px-6 sm:px-8
            rounded-xl sm:rounded-2xl
            shadow-2xl shadow-green-500/40
            hover:shadow-green-500/60
            hover:scale-105
            active:scale-95
            transition-all
            flex items-center justify-center gap-2 sm:gap-3
            mb-4 sm:mb-7
            relative
            overflow-hidden
          "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.4)',
              '0 0 30px rgba(34, 197, 94, 0.6)',
              '0 0 20px rgba(34, 197, 94, 0.4)',
            ]
          }}
          transition={{
            delay: 0.2,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Play className="w-6 h-6 fill-current" />
          </motion.div>
          <span className="relative">Quick Play</span>
        </motion.button>

        {/* Achievements Button */}
        <motion.button
          onClick={onOpenAchievements}
          className="
            w-full
            bg-gradient-to-br from-yellow-600 to-orange-600
            text-white
            font-bold
            py-3 sm:py-4
            px-4 sm:px-6
            rounded-xl sm:rounded-2xl
            shadow-lg shadow-yellow-500/20
            hover:shadow-yellow-500/40
            hover:scale-105
            active:scale-95
            transition-all
            mb-4 sm:mb-7
            flex items-center justify-between
          "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg">Achievements</span>
          </div>
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Daily Challenges */}
        {hasActiveChallenges && (
          <motion.button
            onClick={onOpenChallenges}
            className="
              w-full
              bg-gradient-to-br from-purple-600 to-blue-600
              text-white
              font-bold
              py-3 sm:py-4
              px-4 sm:px-6
              rounded-xl sm:rounded-2xl
              shadow-lg shadow-purple-500/30
              hover:shadow-purple-500/50
              hover:scale-105
              active:scale-95
              transition-all
              mb-4 sm:mb-7
              relative
              overflow-hidden
            "
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                <div className="text-left">
                  <div className="font-black text-base sm:text-lg">Daily Challenges</div>
                  <div className="text-xs sm:text-sm text-white/90">
                    {completedChallenges}/{dailyChallenges.length} completed
                  </div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl">🎯</div>
            </div>
          </motion.button>
        )}

        {/* Levels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              Levels
            </h2>
            <div className="text-white/70 text-xs sm:text-sm font-semibold">
              {currentLevel} - {currentLevel + levelsToShow - 1}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
            {levels.map((level, index) => (
              <LevelCard
                key={level.id}
                level={level}
                onClick={() => level.unlocked && onStartLevel(level.id)}
                delay={0.5 + index * 0.05}
              />
            ))}
          </div>

          {/* Load More Button */}
          {levelsToShow < 50 && (
            <motion.button
              onClick={handleLoadMore}
              className="
                w-full
                bg-slate-700/50
                hover:bg-slate-600/50
                text-white
                font-semibold
                py-3
                px-6
                rounded-xl
                transition-all
                flex items-center justify-center gap-2
                border border-white/10
                mb-6
              "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Load More Levels</span>
              <ChevronDown className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {/* Premium Upsell (if not premium) */}
        {!premiumPass.active && (
          <motion.button
            onClick={onOpenShop}
            className="
              w-full
              mt-6
              bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500
              text-white
              font-bold
              py-4
              px-6
              rounded-2xl
              shadow-lg shadow-orange-500/40
              hover:shadow-orange-500/60
              hover:scale-105
              active:scale-95
              transition-all
              relative
              overflow-hidden
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            <div className="relative flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 fill-current" />
              <span>Upgrade to Premium</span>
              <Star className="w-5 h-5 fill-current" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Tutorial */}
      <Tutorial
        isOpen={showTutorial}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value }: any) => {
  return (
    <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
      <div className={`text-white mb-1 sm:mb-2 flex justify-center`}>{icon}</div>
      <div className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider text-center mb-0.5 sm:mb-1">
        {label}
      </div>
      <div className="text-sm sm:text-lg font-bold text-white text-center">{value}</div>
    </div>
  );
};

const LevelCard = ({ level, onClick, delay }: any) => {
  const difficultyColors: Record<string, string> = {
    easy: 'from-green-500 to-green-600',
    medium: 'from-yellow-500 to-orange-500',
    hard: 'from-orange-500 to-red-500',
    expert: 'from-purple-500 to-pink-500',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={!level.unlocked}
      className={`
        relative
        bg-slate-800/50
        rounded-lg sm:rounded-xl
        p-3 sm:p-4
        border border-white/10
        ${level.unlocked ? 'hover:bg-slate-700/50 hover:scale-105' : 'opacity-50'}
        active:scale-95
        transition-all
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={level.unlocked ? { scale: 1.05 } : {}}
      whileTap={level.unlocked ? { scale: 0.95 } : {}}
    >
      {!level.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white/40" />
        </div>
      )}

      <div className={level.unlocked ? '' : 'opacity-30'}>
        <div className="text-white font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Level {level.id}</div>
        <div className={`text-[10px] sm:text-xs font-semibold bg-gradient-to-r ${difficultyColors[level.difficulty] || 'from-green-500 to-green-600'} bg-clip-text text-transparent mb-1 sm:mb-2`}>
          {level.difficulty.toUpperCase()}
        </div>
        <div className="text-[10px] sm:text-xs text-white/70 mb-1 sm:mb-2">
          Target: {level.targetScore.toLocaleString()}
        </div>
        {level.completed && (
          <div className="flex justify-center gap-0.5 sm:gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < level.stars ? 'text-yellow-400 fill-current' : 'text-white/20'
                }`}
              />
            ))}
          </div>
        )}
        {!level.completed && level.unlocked && (
          <div className="text-yellow-400 text-[10px] sm:text-xs font-semibold">
            💰 +{level.reward}
          </div>
        )}
      </div>
    </motion.button>
  );
};
