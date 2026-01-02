import { motion } from 'framer-motion';
import type { CellColor } from '../../types/game';

interface CellProps {
  color: CellColor | null;
  isPreview?: boolean;
  isInvalidPreview?: boolean;
  isClearing?: boolean;
  isHint?: boolean;
}

const colorMap: Record<CellColor, string> = {
  blue: 'from-blue-400 to-blue-600',
  orange: 'from-orange-400 to-orange-600',
  green: 'from-green-400 to-green-600',
  purple: 'from-purple-400 to-purple-600',
  yellow: 'from-yellow-400 to-yellow-600',
  cyan: 'from-cyan-400 to-cyan-600',
  red: 'from-red-400 to-red-600',
};

export const Cell = ({ color, isPreview, isInvalidPreview, isClearing, isHint }: CellProps) => {
  const getClassName = () => {
    let classes = 'relative w-full h-full rounded-md sm:rounded-lg transition-all duration-150 ';

    if (isClearing) {
      return classes + 'animate-pulse';
    }

    if (isPreview) {
      return classes + 'bg-white/20 shadow-inner scale-95';
    }

    if (isHint) {
      return classes + 'bg-yellow-400/30 ring-2 ring-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50';
    }

    if (isInvalidPreview) {
      return classes + 'bg-red-500/25 animate-shake';
    }

    if (color) {
      return (
        classes +
        `bg-gradient-to-br ${colorMap[color]} shadow-lg border-none shadow-${color}-900/30`
      );
    }

    return classes + 'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5';
  };

  return (
    <motion.div
      className={getClassName()}
      initial={color ? { scale: 0 } : {}}
      animate={
        isClearing
          ? { scale: 0, opacity: 0, filter: 'brightness(2)' }
          : color
          ? { scale: 1, opacity: 1 }
          : {}
      }
      transition={
        isClearing
          ? { duration: 0.5, ease: 'easeOut' }
          : { type: 'spring', stiffness: 500, damping: 30 }
      }
    >
      {color && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-white/40 rounded-lg" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-lg" />
        </>
      )}
    </motion.div>
  );
};
