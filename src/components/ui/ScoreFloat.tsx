import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreFloatProps {
  score: number;
  show: boolean;
  position?: { x: number; y: number };
}

export const ScoreFloat = ({ score, show, position = { x: 50, y: 40 } }: ScoreFloatProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && score > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, score]);

  if (!isVisible || score <= 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-40"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
          initial={{
            opacity: 1,
            y: 0,
            scale: 0.8,
            x: '-50%',
          }}
          animate={{
            opacity: [1, 1, 0],
            y: [-0, -60, -120],
            scale: [0.8, 1.2, 1],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1,
            times: [0, 0.5, 1],
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <div
            className="
              text-2xl sm:text-3xl
              font-bold
              text-transparent
              bg-clip-text
              bg-gradient-to-r from-green-300 to-green-500
              drop-shadow-[0_0_25px_rgba(74,222,128,0.9)]
              whitespace-nowrap
            "
            style={{
              textShadow:
                '0 0 25px rgba(74, 222, 128, 0.9), 0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            +{score}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
