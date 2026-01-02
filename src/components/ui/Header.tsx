import { motion } from 'framer-motion';
import { Trophy, Star, Menu } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface HeaderProps {
  score: number;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export const Header = ({ score, showMenu = true, onMenuClick }: HeaderProps) => {
  const { bestScore, coins, premiumPass } = useGameStore();

  return (
    <motion.div
      className="w-full flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Score Display - Mobile First */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Current Score */}
        <ScoreBox label="Score" value={score} variant="green" />

        {/* Best Score */}
        <ScoreBox label="Best" value={bestScore} icon={<Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} variant="gold" />

        {/* Menu Button */}
        {showMenu && (
          <motion.button
            onClick={onMenuClick}
            className="
              w-8 h-8 sm:w-9 sm:h-9
              bg-gradient-to-br from-slate-700 to-slate-800
              rounded-lg
              flex items-center justify-center
              text-white
              border border-white/10
              shadow-md
              ml-1
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

interface ScoreBoxProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  variant?: 'green' | 'gold' | 'yellow';
}

const ScoreBox = ({ label, value, icon, variant = 'green' }: ScoreBoxProps) => {
  const variantClasses = {
    green: 'from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-400',
    gold: 'from-yellow-500/20 to-orange-600/20 border-yellow-500/30 text-yellow-400',
    yellow: 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/30 text-yellow-300',
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-br ${variantClasses[variant]}
        backdrop-blur-sm
        rounded-xl
        px-2.5 py-1.5 sm:px-3 sm:py-2
        text-center
        border
        shadow-lg
        min-w-[60px] sm:min-w-[70px]
      `}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <div className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wide font-bold flex items-center justify-center gap-0.5">
        {icon && <span className="opacity-70">{icon}</span>}
        <span>{label}</span>
      </div>
      <motion.div
        className={`text-base sm:text-xl font-black drop-shadow-lg`}
        key={value}
        initial={{ scale: 1.3, y: -5 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {value > 9999 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString()}
      </motion.div>
    </motion.div>
  );
};
