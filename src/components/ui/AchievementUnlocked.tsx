import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Achievement } from '../../types/achievements';
import { getCategoryColor } from '../../types/achievements';

interface AchievementUnlockedProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementUnlocked = ({ achievement, onClose }: AchievementUnlockedProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div
            className={`
              bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800
              rounded-2xl
              p-4
              shadow-2xl
              border-2 border-white/20
              backdrop-blur-xl
              relative
              overflow-hidden
            `}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 animate-shimmer" />

            {/* Sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + Math.cos((i * Math.PI) / 4) * 100}%`,
                    y: `${50 + Math.sin((i * Math.PI) / 4) * 100}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                  >
                    <Trophy className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                  <div className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                    Achievement Unlocked!
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="
                    w-6 h-6
                    bg-black/30
                    hover:bg-black/50
                    rounded-lg
                    flex items-center justify-center
                    text-white/60
                    hover:text-white
                    transition-all
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Achievement Info */}
              <div className="flex items-center gap-3">
                {/* Icon */}
                <motion.div
                  className={`
                    w-16 h-16
                    rounded-xl
                    flex items-center justify-center
                    text-3xl
                    bg-gradient-to-br ${getCategoryColor(achievement.category)}
                    shadow-lg
                  `}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                >
                  {achievement.icon}
                </motion.div>

                {/* Text */}
                <div className="flex-1">
                  <motion.h3
                    className="text-white font-bold text-lg mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {achievement.title}
                  </motion.h3>
                  <motion.p
                    className="text-white/70 text-sm mb-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {achievement.description}
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <span>💰</span>
                      <span>+{achievement.rewardCoins}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500/30"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            >
              <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to manage achievement notifications
export const useAchievementNotifications = () => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!currentAchievement && queue.length > 0) {
      setCurrentAchievement(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [currentAchievement, queue]);

  const showAchievement = (achievement: Achievement) => {
    setQueue((prev) => [...prev, achievement]);
  };

  const showMultipleAchievements = (achievements: Achievement[]) => {
    setQueue((prev) => [...prev, ...achievements]);
  };

  const closeNotification = () => {
    setCurrentAchievement(null);
  };

  return {
    currentAchievement,
    showAchievement,
    showMultipleAchievements,
    closeNotification,
  };
};
