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
      className="w-full max-w-md flex items-center justify-between px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <motion.div
          className="
            w-9 h-9 sm:w-10 sm:h-10
            bg-gradient-to-br from-orange-500 to-orange-600
            rounded-lg
            flex items-center justify-center
            text-xl sm:text-2xl
            shadow-lg shadow-orange-500/40
          "
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          🧩
        </motion.div>
        <div>
          <h1 className="text-white font-bold text-lg sm:text-xl leading-none">
            Block Blast
          </h1>
          {premiumPass.active && (
            <span className="text-yellow-400 text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-2">
        {/* Coins */}
        <ScoreBox label="Coins" value={coins} icon="💰" variant="yellow" />

        {/* Current Score */}
        <ScoreBox label="Score" value={score} variant="green" />

        {/* Best Score */}
        <ScoreBox label="Best" value={bestScore} icon={<Trophy className="w-3 h-3" />} variant="gold" />

        {/* Menu Button */}
        {showMenu && (
          <motion.button
            onClick={onMenuClick}
            className="
              w-9 h-9 sm:w-10 sm:h-10
              bg-slate-700/50
              rounded-lg
              flex items-center justify-center
              text-white
              border border-white/10
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
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
    green: 'text-green-400 shadow-green-400/50',
    gold: 'text-yellow-400 shadow-yellow-400/50',
    yellow: 'text-yellow-300 shadow-yellow-300/50',
  };

  return (
    <motion.div
      className="
        bg-gradient-to-br from-slate-700 to-slate-800
        rounded-lg
        px-2 py-1 sm:px-3 sm:py-1.5
        text-center
        border border-white/10
        shadow-lg
        min-w-[50px] sm:min-w-[60px]
      "
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <div className="text-[8px] sm:text-[9px] text-white/60 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
        {icon && <span className="text-[10px]">{icon}</span>}
        {label}
      </div>
      <motion.div
        className={`text-sm sm:text-lg font-bold ${variantClasses[variant]} drop-shadow-lg`}
        key={value}
        initial={{ scale: 1.2, y: -5 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {value.toLocaleString()}
      </motion.div>
    </motion.div>
  );
};
