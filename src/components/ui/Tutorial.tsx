import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ArrowRight, Trophy, Sparkles, Target, Calendar } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
  tip?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Block Blast!',
    description: 'Master the art of strategic block placement in this addictive puzzle game. Let\'s learn the basics!',
    icon: <Sparkles className="w-12 h-12 text-yellow-400" />,
    tip: 'Swipe through to learn how to play'
  },
  {
    title: 'Drag & Drop Pieces',
    description: 'Tap and hold any piece from the bottom tray, then drag it to the board. Release to place it on the grid.',
    icon: '🎯',
    highlight: 'piece-tray',
    tip: 'Choose your placement wisely!'
  },
  {
    title: 'Clear Lines & Score',
    description: 'Complete horizontal or vertical lines to clear them from the board. The more lines you clear at once, the higher your score!',
    icon: <Trophy className="w-12 h-12 text-yellow-400" />,
    highlight: 'board',
    tip: 'Combos multiply your points!'
  },
  {
    title: 'Fill the Board Strategically',
    description: 'Keep placing pieces to fill lines. The game ends when you can\'t place any of the remaining pieces.',
    icon: '🧩',
    highlight: 'board',
    tip: 'Always leave room for different shapes'
  },
  {
    title: 'Earn Coins & Unlock Features',
    description: 'Every game earns you coins. Watch rewarded ads in the shop to earn extra coins and unlock the Premium Pass!',
    icon: '💰',
    tip: 'Rewarded ads grant coins instantly; Premium Pass removes ads and doubles rewards'
  },
  {
    title: 'Daily Challenges',
    description: 'Complete daily challenges for bonus rewards! New challenges refresh every 24 hours.',
    icon: <Calendar className="w-12 h-12 text-purple-400" />,
    tip: 'Don\'t miss your daily streak!'
  },
  {
    title: 'Level Mode',
    description: 'Take on progressively harder levels with specific score targets. Can you beat them all?',
    icon: <Target className="w-12 h-12 text-green-400" />,
    tip: 'Each level gets more challenging!'
  }
];

export const Tutorial = ({ isOpen, onComplete, onSkip }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800
              rounded-3xl
              p-6 sm:p-8
              max-w-lg w-full
              shadow-2xl
              border-2 border-white/10
              relative
            "
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="
                absolute top-4 right-4
                w-8 h-8
                bg-slate-700/50
                rounded-xl
                flex items-center justify-center
                text-white/60
                hover:text-white
                hover:bg-slate-600/50
                active:scale-95
                transition-all
              "
              aria-label="Skip tutorial"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress Indicator */}
            <div className="flex items-center gap-1.5 mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`
                    h-1.5 flex-1 rounded-full transition-all duration-300
                    ${index <= currentStep ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-white/10'}
                  `}
                />
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                >
                  {typeof step.icon === 'string' ? (
                    <div className="text-6xl">{step.icon}</div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center">
                      {step.icon}
                    </div>
                  )}
                </motion.div>

                {/* Title */}
                <h2 className="text-white font-bold text-2xl sm:text-3xl mb-4">
                  {step.title}
                </h2>

                {/* Description */}
                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Tip Box */}
                {step.tip && (
                  <motion.div
                    className="
                      bg-gradient-to-r from-blue-500/20 to-purple-500/20
                      border border-blue-400/30
                      rounded-xl
                      p-4
                      mb-6
                    "
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div className="text-left">
                        <div className="text-blue-300 font-semibold text-sm mb-1">
                          Pro Tip
                        </div>
                        <div className="text-white/70 text-sm">
                          {step.tip}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step Counter */}
                <div className="text-white/40 text-sm mb-6">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="
                    flex-1
                    bg-slate-700/50
                    hover:bg-slate-600/50
                    text-white
                    font-semibold
                    py-3 px-6
                    rounded-xl
                    transition-all
                    active:scale-95
                  "
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="
                  flex-1
                  bg-gradient-to-r from-blue-500 to-purple-600
                  hover:from-blue-600 hover:to-purple-700
                  text-white
                  font-bold
                  py-3 px-6
                  rounded-xl
                  transition-all
                  active:scale-95
                  flex items-center justify-center gap-2
                  shadow-lg shadow-purple-500/30
                "
              >
                {isLastStep ? (
                  <>
                    <span>Start Playing!</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Tutorial Manager Hook
export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has completed tutorial before
    const tutorialCompleted = localStorage.getItem('tutorial-completed');
    if (!tutorialCompleted) {
      // Show tutorial after a short delay
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem('tutorial-completed');
    setShowTutorial(true);
  };

  return {
    showTutorial,
    handleComplete,
    handleSkip,
    resetTutorial
  };
};
