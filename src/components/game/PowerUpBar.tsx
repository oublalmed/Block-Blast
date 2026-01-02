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
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-2 justify-center">
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
                max-w-[120px]
                bg-gradient-to-br ${powerUp.color}
                text-white
                font-bold
                py-3
                px-4
                rounded-xl
                shadow-lg
                transition-all
                ${
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:scale-105 active:scale-95 hover:shadow-xl'
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              {/* Icon */}
              <div className="text-2xl mb-1">{powerUp.icon}</div>

              {/* Name */}
              <div className="text-xs font-semibold uppercase tracking-wider mb-1">
                {powerUp.name}
              </div>

              {/* Count Badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-xs font-black shadow-md">
                {count}
              </div>

              {/* Disabled Overlay */}
              {isDisabled && (
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <div className="text-4xl opacity-30">🔒</div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Info Text */}
      <div className="text-center text-white/40 text-xs mt-2">
        Use power-ups to help you win
      </div>
    </div>
  );
};
