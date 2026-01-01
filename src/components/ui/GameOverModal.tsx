import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RotateCcw, Home, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  onPlayAgain: () => void;
  onHome?: () => void;
  showHomeButton?: boolean;
}

export const GameOverModal = ({
  isOpen,
  score,
  onPlayAgain,
  onHome,
  showHomeButton = true,
}: GameOverModalProps) => {
  const { bestScore } = useGameStore();
  const isNewBest = score > bestScore;

  const handleShare = async () => {
    const shareData = {
      title: 'Block Blast!',
      text: `I just scored ${score.toLocaleString()} points in Block Blast! Can you beat my score? 🎮`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `I scored ${score.toLocaleString()} points in Block Blast! 🎮 ${window.location.href}`
        );
        alert('Score copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="
              bg-gradient-to-br from-slate-800 to-slate-900
              rounded-3xl
              p-8
              text-center
              max-w-md w-full
              shadow-2xl
              border-2 border-white/10
            "
            initial={{ scale: 0, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
          >
            {/* Title */}
            <motion.h2
              className="text-4xl sm:text-5xl font-black text-white mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Game Over!
            </motion.h2>

            {/* New Best Badge */}
            {isNewBest && (
              <motion.div
                className="mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                  delay: 0.4,
                }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  <Trophy className="w-5 h-5 fill-current" />
                  New Best!
                </div>
              </motion.div>
            )}

            {/* Score Display */}
            <motion.div
              className="mb-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                <div className="text-sm text-white/60 uppercase tracking-wider mb-1">
                  Your Score
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]">
                  {score.toLocaleString()}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-3 border border-white/5">
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                  Best Score
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                  {Math.max(score, bestScore).toLocaleString()}
                </div>
              </div>

              {/* Coins Earned */}
              <motion.div
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-3 border border-yellow-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
              >
                <div className="text-xs text-yellow-200/80 uppercase tracking-wider mb-1">
                  Coins Earned
                </div>
                <div className="text-2xl font-bold text-yellow-300">
                  💰 +{Math.floor(score / 10)}
                </div>
              </motion.div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={onPlayAgain}
                className="
                  w-full
                  bg-gradient-to-r from-green-500 to-green-600
                  text-white
                  font-bold
                  py-4
                  px-8
                  rounded-2xl
                  shadow-lg shadow-green-500/40
                  hover:shadow-green-500/60
                  hover:scale-105
                  active:scale-95
                  transition-all
                  flex items-center justify-center gap-2
                  text-lg
                "
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>

              <div className="flex gap-3">
                {showHomeButton && onHome && (
                  <button
                    onClick={onHome}
                    className="
                      flex-1
                      bg-slate-700
                      text-white
                      font-semibold
                      py-3
                      px-6
                      rounded-xl
                      hover:bg-slate-600
                      active:scale-95
                      transition-all
                      flex items-center justify-center gap-2
                    "
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="
                    flex-1
                    bg-gradient-to-r from-blue-500 to-blue-600
                    text-white
                    font-semibold
                    py-3
                    px-6
                    rounded-xl
                    shadow-lg shadow-blue-500/30
                    hover:shadow-blue-500/50
                    hover:scale-105
                    active:scale-95
                    transition-all
                    flex items-center justify-center gap-2
                  "
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
