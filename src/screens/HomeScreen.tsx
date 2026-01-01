import { motion } from 'framer-motion';
import { Play, Trophy, Target, ShoppingBag, Star, Lock, Crown, HelpCircle, Award } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getLevelData } from '../utils/gameLogic';
import { useEffect } from 'react';
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

  const completedChallenges = dailyChallenges.filter((c) => c.completed).length;
  const hasActiveChallenges = dailyChallenges.length > completedChallenges;

  // Get next 6 levels to display
  const levels = Array.from({ length: 6 }, (_, i) => {
    const levelId = currentLevel + i;
    const data = getLevelData(levelId);
    const isUnlocked = levelId === 1 || completedLevels.includes(levelId - 1);
    const isCompleted = completedLevels.includes(levelId);
    return { ...data, unlocked: isUnlocked, completed: isCompleted };
  });

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden overflow-y-auto">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_50%)] animate-twinkle pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 pb-20 safe-area-padding max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="
                w-14 h-14
                bg-gradient-to-br from-orange-500 to-orange-600
                rounded-2xl
                flex items-center justify-center
                text-3xl
                shadow-2xl shadow-orange-500/40
              "
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              🧩
            </motion.div>
            <div>
              <h1 className="text-white font-black text-3xl leading-none tracking-tight">
                Block Blast
              </h1>
              {premiumPass.active && (
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-semibold">Premium</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetTutorial}
              className="
                w-10 h-10
                bg-slate-700/50
                rounded-xl
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
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenShop}
              className="
                bg-gradient-to-br from-yellow-500 to-orange-500
                text-white
                font-bold
                px-4 py-2
                rounded-xl
                shadow-lg shadow-yellow-500/30
                hover:shadow-yellow-500/50
                hover:scale-105
                active:scale-95
                transition-all
                flex items-center gap-2
              "
            >
              <ShoppingBag className="w-5 h-5" />
              <span>💰 {coins}</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Best Score"
            value={bestScore.toLocaleString()}
            color="yellow"
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Levels"
            value={completedLevels.length}
            color="green"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
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
            text-xl
            py-5
            px-8
            rounded-2xl
            shadow-2xl shadow-green-500/40
            hover:shadow-green-500/60
            hover:scale-105
            active:scale-95
            transition-all
            flex items-center justify-center gap-3
            mb-6
          "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-6 h-6 fill-current" />
          Quick Play
        </motion.button>

        {/* Achievements Button */}
        <motion.button
          onClick={onOpenAchievements}
          className="
            w-full
            bg-gradient-to-br from-yellow-600 to-orange-600
            text-white
            font-bold
            py-4
            px-6
            rounded-2xl
            shadow-lg shadow-yellow-500/20
            hover:shadow-yellow-500/40
            hover:scale-105
            active:scale-95
            transition-all
            mb-6
            flex items-center justify-between
          "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <span className="text-lg">Achievements</span>
          </div>
          <Trophy className="w-5 h-5" />
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
              py-4
              px-6
              rounded-2xl
              shadow-lg shadow-purple-500/30
              hover:shadow-purple-500/50
              hover:scale-105
              active:scale-95
              transition-all
              mb-6
              relative
              overflow-hidden
            "
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-black text-lg">Daily Challenges</div>
                  <div className="text-sm text-white/80">
                    {completedChallenges}/{dailyChallenges.length} completed
                  </div>
                </div>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </motion.button>
        )}

        {/* Levels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Levels
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {levels.map((level, index) => (
              <LevelCard
                key={level.id}
                level={level}
                onClick={() => level.unlocked && onStartLevel(level.id)}
                delay={0.5 + index * 0.05}
              />
            ))}
          </div>
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
    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
      <div className={`text-white mb-2 flex justify-center`}>{icon}</div>
      <div className="text-[10px] text-white/60 uppercase tracking-wider text-center mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-white text-center">{value}</div>
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
        rounded-xl
        p-4
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
          <Lock className="w-8 h-8 text-white/40" />
        </div>
      )}

      <div className={level.unlocked ? '' : 'opacity-30'}>
        <div className="text-white font-bold text-lg mb-1">Level {level.id}</div>
        <div className={`text-xs font-semibold bg-gradient-to-r ${difficultyColors[level.difficulty] || 'from-green-500 to-green-600'} bg-clip-text text-transparent mb-2`}>
          {level.difficulty.toUpperCase()}
        </div>
        <div className="text-xs text-white/60 mb-2">
          Target: {level.targetScore.toLocaleString()}
        </div>
        {level.completed && (
          <div className="flex justify-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < level.stars ? 'text-yellow-400 fill-current' : 'text-white/20'
                }`}
              />
            ))}
          </div>
        )}
        {!level.completed && level.unlocked && (
          <div className="text-yellow-400 text-xs font-semibold">
            💰 +{level.reward}
          </div>
        )}
      </div>
    </motion.button>
  );
};
