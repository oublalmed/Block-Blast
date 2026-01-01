import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ChallengesScreen } from './screens/ChallengesScreen';
import { useGameStore } from './store/gameStore';
import { getLevelData } from './utils/gameLogic';

type Screen = 'home' | 'game' | 'level' | 'shop' | 'challenges' | 'challenge';

interface GameConfig {
  mode: 'quick' | 'level' | 'challenge';
  levelId?: number;
  challengeId?: string;
  targetScore?: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({ mode: 'quick' });

  const { completeLevel, completeDailyChallenge, dailyChallenges } = useGameStore();

  const handleStartQuickGame = () => {
    setGameConfig({ mode: 'quick' });
    setCurrentScreen('game');
  };

  const handleStartLevel = (levelId: number) => {
    const levelData = getLevelData(levelId);
    setGameConfig({
      mode: 'level',
      levelId,
      targetScore: levelData.targetScore,
    });
    setCurrentScreen('level');
  };

  const handleStartChallenge = (challengeId: string) => {
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (challenge && !challenge.completed) {
      setGameConfig({
        mode: 'challenge',
        challengeId,
        targetScore: challenge.targetScore,
      });
      setCurrentScreen('challenge');
    }
  };

  const handleLevelComplete = (score: number, stars: number) => {
    if (gameConfig.levelId) {
      completeLevel(gameConfig.levelId, score, stars);
    }
    // Automatically return to home after a delay
    setTimeout(() => {
      setCurrentScreen('home');
    }, 3000);
  };

  const handleChallengeComplete = (score: number) => {
    if (gameConfig.challengeId && gameConfig.targetScore && score >= gameConfig.targetScore) {
      completeDailyChallenge(gameConfig.challengeId);
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleOpenShop = () => {
    setCurrentScreen('shop');
  };

  const handleOpenChallenges = () => {
    setCurrentScreen('challenges');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartGame={handleStartQuickGame}
            onStartLevel={handleStartLevel}
            onOpenShop={handleOpenShop}
            onOpenChallenges={handleOpenChallenges}
          />
        );

      case 'game':
        return <GameScreen onHome={handleBackToHome} />;

      case 'level':
        return (
          <GameScreen
            onHome={handleBackToHome}
            levelMode={true}
            targetScore={gameConfig.targetScore}
            onLevelComplete={handleLevelComplete}
          />
        );

      case 'challenge':
        return (
          <GameScreen
            onHome={handleBackToHome}
            levelMode={true}
            targetScore={gameConfig.targetScore}
            onLevelComplete={(score) => {
              handleChallengeComplete(score);
              handleBackToHome();
            }}
          />
        );

      case 'shop':
        return <ShopScreen onBack={handleBackToHome} />;

      case 'challenges':
        return (
          <ChallengesScreen
            onBack={handleBackToHome}
            onStartChallenge={handleStartChallenge}
          />
        );

      default:
        return <HomeScreen
          onStartGame={handleStartQuickGame}
          onStartLevel={handleStartLevel}
          onOpenShop={handleOpenShop}
          onOpenChallenges={handleOpenChallenges}
        />;
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
