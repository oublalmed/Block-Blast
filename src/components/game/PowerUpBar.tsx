import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { POWERUPS } from '../../types/powerups';
import type { PowerUpType } from '../../types/powerups';

interface PowerUpBarProps {
  onUsePowerUp: (type: PowerUpType) => void;
  disabled?: boolean;
}

export const PowerUpBar = ({ onUsePowerUp, disabled = false }: PowerUpBarProps) => {
  const { powerUps } = useGameStore();

  // Only show undo and hint during gameplay
  const gamePowerUps = POWERUPS.filter(p => p.id === 'undo' || p.id === 'hint');

  return (
    <div className="w-full">
      <div className="flex gap-2 sm:gap-3 justify-center px-1">
        {gamePowerUps.map((powerUp, index) => {
          const count = powerUps[powerUp.id];
          const isDisabled = disabled || count === 0;

          return (
            <motion.button
              key={powerUp.id}
              onClick={() => !isDisabled && onUsePowerUp(powerUp.id)}
              disabled={isDisabled}
              className={`
                relative
                flex-1
                max-w-[140px]
                bg-gradient-to-br ${powerUp.color}
                text-white
                font-bold
                py-2.5 sm:py-3
                px-3 sm:px-4
                rounded-xl sm:rounded-2xl
                shadow-lg
                transition-all
                border-2 border-white/20
                ${
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:scale-105 active:scale-95 hover:shadow-2xl hover:border-white/30'
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              {/* Icon */}
              <div className="text-2xl sm:text-3xl mb-0.5">{powerUp.icon}</div>

              {/* Name */}
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                {powerUp.name}
              </div>

              {/* Count Badge */}
              <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shadow-lg ring-2 ring-white/50">
                {count}
              </div>

              {/* Disabled Overlay */}
              {isDisabled && (
                <div className="absolute inset-0 bg-black/30 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                  <div className="text-3xl sm:text-4xl opacity-40">🔒</div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
