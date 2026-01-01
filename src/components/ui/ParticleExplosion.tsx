import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
}

interface ParticleExplosionProps {
  show: boolean;
  cellPositions: { x: number; y: number }[];
  color?: string;
  onComplete?: () => void;
}

export const ParticleExplosion = ({
  show,
  cellPositions,
  color = '#4ade80',
  onComplete,
}: ParticleExplosionProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show && cellPositions.length > 0) {
      const newParticles: Particle[] = [];

      cellPositions.forEach((pos, index) => {
        // Create 8 particles per cell
        for (let i = 0; i < 8; i++) {
          newParticles.push({
            id: index * 8 + i,
            x: pos.x,
            y: pos.y,
            color,
            angle: (Math.PI * 2 * i) / 8,
            velocity: 100 + Math.random() * 50,
          });
        }
      });

      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [show, cellPositions, color, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              boxShadow: `0 0 8px ${particle.color}`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: Math.cos(particle.angle) * particle.velocity,
              y: Math.sin(particle.angle) * particle.velocity,
              scale: [1, 1.5, 0],
              opacity: [1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Utility to get cell positions from cleared cells
export const getCellScreenPositions = (
  cellsSet: Set<string>,
  boardElement: HTMLElement | null
): { x: number; y: number }[] => {
  if (!boardElement) return [];

  const positions: { x: number; y: number }[] = [];
  const boardRect = boardElement.getBoundingClientRect();
  const gridSize = 8;
  const cellSize = boardRect.width / gridSize;

  cellsSet.forEach((cell) => {
    const [x, y] = cell.split(',').map(Number);
    positions.push({
      x: boardRect.left + x * cellSize + cellSize / 2,
      y: boardRect.top + y * cellSize + cellSize / 2,
    });
  });

  return positions;
};
