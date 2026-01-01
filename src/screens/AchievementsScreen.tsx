import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Trophy, Award } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getCategoryName, getCategoryColor, type AchievementCategory } from '../types/achievements';
import { useState } from 'react';

interface AchievementsScreenProps {
  onBack: () => void;
}

export const AchievementsScreen = ({ onBack }: AchievementsScreenProps) => {
  const { getAchievements } = useGameStore();
  const achievements = getAchievements();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  // Group achievements by category
  const categories: AchievementCategory[] = ['score', 'games', 'combos', 'levels', 'perfect', 'special'];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_50%)] animate-twinkle pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 pb-20 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="
              w-10 h-10
              bg-slate-700/50
              rounded-xl
              flex items-center justify-center
              text-white
              hover:bg-slate-600/50
              active:scale-95
              transition-all
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h1 className="text-white font-black text-2xl">Achievements</h1>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </motion.div>

        {/* Progress Card */}
        <motion.div
          className="
            bg-gradient-to-br from-slate-800 to-slate-900
            rounded-2xl
            p-6
            mb-6
            border-2 border-white/10
            shadow-2xl
          "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/60 text-sm mb-1">Total Progress</div>
              <div className="text-white font-bold text-3xl">
                {unlockedCount} / {totalCount}
              </div>
            </div>
            <div className="w-20 h-20 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionPercentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <CategoryPill
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            label="All"
            icon="🎯"
          />
          {categories.map((category) => (
            <CategoryPill
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              label={getCategoryName(category)}
              icon={getCategoryIcon(category)}
            />
          ))}
        </div>

        {/* Achievements List */}
        <div className="space-y-3">
          {filteredAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              delay={0.1 + index * 0.05}
            />
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center text-white/40 py-12">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No achievements in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface CategoryPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

const CategoryPill = ({ active, onClick, label, icon }: CategoryPillProps) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2
      rounded-xl
      font-semibold
      text-sm
      whitespace-nowrap
      transition-all
      flex items-center gap-2
      ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
          : 'bg-slate-700/50 text-white/60 hover:text-white hover:bg-slate-600/50'
      }
    `}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

interface AchievementCardProps {
  achievement: any;
  delay: number;
}

const AchievementCard = ({ achievement, delay }: AchievementCardProps) => {
  const isLocked = !achievement.unlocked;
  const isHidden = achievement.hidden && isLocked;

  return (
    <motion.div
      className={`
        bg-gradient-to-br from-slate-800 to-slate-900
        rounded-xl
        p-4
        border-2
        transition-all
        ${isLocked ? 'border-white/5 opacity-60' : 'border-white/10 shadow-lg'}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`
            w-16 h-16
            rounded-xl
            flex items-center justify-center
            text-3xl
            ${
              isLocked
                ? 'bg-slate-700/30'
                : `bg-gradient-to-br ${getCategoryColor(achievement.category)}`
            }
            shadow-lg
            relative
          `}
        >
          {isLocked && !isHidden ? (
            <Lock className="w-8 h-8 text-white/40" />
          ) : isHidden ? (
            <span className="text-2xl">❓</span>
          ) : (
            <span>{achievement.icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${isLocked ? 'text-white/40' : 'text-white'}`}>
            {isHidden ? '???' : achievement.title}
          </h3>
          <p className={`text-sm mb-2 ${isLocked ? 'text-white/30' : 'text-white/70'}`}>
            {isHidden ? 'Hidden achievement - keep playing to unlock!' : achievement.description}
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`
                px-2 py-1
                rounded-lg
                text-xs
                font-semibold
                ${
                  isLocked
                    ? 'bg-slate-700/30 text-white/40'
                    : `bg-gradient-to-r ${getCategoryColor(achievement.category)} text-white`
                }
              `}
            >
              {getCategoryName(achievement.category)}
            </div>
            {!isHidden && (
              <div className="text-yellow-400 font-semibold text-sm flex items-center gap-1">
                💰 {achievement.rewardCoins}
              </div>
            )}
          </div>
        </div>

        {/* Unlocked Badge */}
        {!isLocked && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-green-400"
          >
            <Trophy className="w-6 h-6 fill-current" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const getCategoryIcon = (category: AchievementCategory): string => {
  const icons: Record<AchievementCategory, string> = {
    score: '🎯',
    games: '🎮',
    combos: '🔥',
    levels: '🏆',
    perfect: '✨',
    special: '⭐',
  };
  return icons[category];
};
