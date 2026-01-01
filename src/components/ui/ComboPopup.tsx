import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ComboPopupProps {
  combo: number;
  show: boolean;
}

const comboMessages = ['', '', 'DOUBLE! 🔥', 'TRIPLE! 🔥🔥', 'QUAD! 🔥🔥🔥', 'AMAZING! 🌟'];

export const ComboPopup = ({ combo, show }: ComboPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && combo >= 2) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [show, combo]);

  const message = comboMessages[Math.min(combo, 5)] || `${combo}x COMBO! 🚀`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="
            fixed top-1/3 left-1/2
            pointer-events-none
            z-50
          "
          initial={{ scale: 0, rotate: -10, x: '-50%', y: '-50%' }}
          animate={{
            scale: [0, 1.3, 1.1, 1.15, 0],
            rotate: [-10, 5, -2, 0, 10],
            opacity: [0, 1, 1, 1, 0],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 1.2,
            times: [0, 0.15, 0.3, 0.8, 1],
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <div
            className="
              text-4xl sm:text-5xl md:text-6xl
              font-black
              text-transparent
              bg-clip-text
              bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500
              drop-shadow-[0_0_30px_rgba(251,191,36,0.9)]
              whitespace-nowrap
              px-4
            "
            style={{
              textShadow:
                '0 0 30px rgba(251, 191, 36, 0.9), 0 4px 10px rgba(0,0,0,0.5), 0 0 60px rgba(251, 191, 36, 0.5)',
            }}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
