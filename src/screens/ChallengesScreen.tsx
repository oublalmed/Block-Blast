import { motion } from 'framer-motion';
import { ArrowLeft, Target, Check, Clock, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface ChallengesScreenProps {
  onBack: () => void;
  onStartChallenge: (challengeId: string) => void;
}

export const ChallengesScreen = ({ onBack, onStartChallenge }: ChallengesScreenProps) => {
  const { dailyChallenges, premiumPass } = useGameStore();

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = new Date(expiresAt).getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_50%)] animate-twinkle pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 pb-20 safe-area-padding max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="
              w-10 h-10
              bg-slate-800/50
              rounded-xl
              flex items-center justify-center
              text-white
              border border-white/10
              hover:bg-slate-700/50
              active:scale-95
              transition-all
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-white font-bold text-2xl">Daily Challenges</h1>

          <div className="w-10" /> {/* Spacer */}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-4 border border-purple-500/30 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-white font-bold text-lg mb-1">
                Complete Daily Challenges
              </div>
              <div className="text-sm text-white/60">
                Earn bonus coins and rewards by completing challenges
                {premiumPass.active && ' • Premium Pass doubles rewards!'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Challenges List */}
        <div className="space-y-2.5 sm:space-y-3">
          {dailyChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              className={`
                relative overflow-hidden
                bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5
                border-2 border-white/10
                ${!challenge.completed ? 'hover:bg-slate-700/50' : ''}
                transition-all
                shadow-lg
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {challenge.completed && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-green-400" />
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <h3 className="text-white font-bold text-base sm:text-lg">
                      {challenge.name}
                    </h3>
                    {challenge.completed && (
                      <div className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Done
                      </div>
                    )}
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm mb-2.5 sm:mb-3">
                    {challenge.description}
                  </p>

                  {/* Challenge Stats */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-4">
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-white/80">
                        {challenge.targetScore.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        +{challenge.reward * (premiumPass.active ? 2 : 1)}
                      </span>
                      {premiumPass.active && (
                        <span className="text-[9px] sm:text-[10px] text-yellow-300 ml-0.5 sm:ml-1">2x</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                      <span className="text-white/60">
                        {getTimeRemaining(challenge.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl ml-3 sm:ml-4 flex-shrink-0">
                  {challenge.completed ? '✅' : '🎯'}
                </div>
              </div>

              {/* Action Button */}
              {!challenge.completed && (
                <motion.button
                  onClick={() => onStartChallenge(challenge.id)}
                  className="
                    w-full
                    bg-gradient-to-r from-purple-500 to-blue-500
                    text-white
                    font-bold
                    py-2.5 sm:py-3
                    rounded-lg sm:rounded-xl
                    shadow-lg shadow-purple-500/30
                    hover:shadow-purple-500/50
                    hover:scale-105
                    active:scale-95
                    transition-all
                    border-2 border-white/10
                    text-sm sm:text-base
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Challenge
                </motion.button>
              )}

              {challenge.completed && (
                <div className="w-full bg-green-500/20 text-green-400 font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-center border-2 border-green-500/30 text-sm sm:text-base">
                  Challenge Completed! 🎉
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          className="mt-8 bg-slate-800/30 rounded-2xl p-6 border border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-white font-bold text-lg mb-3">How It Works</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>New challenges are available every day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Complete challenges to earn bonus coins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Challenges reset at midnight (local time)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Premium Pass doubles rewards (earned via ads)</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
