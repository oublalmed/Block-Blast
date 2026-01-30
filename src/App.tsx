import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ChallengesScreen } from './screens/ChallengesScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { AchievementUnlocked, useAchievementNotifications } from './components/ui/AchievementUnlocked';
import { useGameStore } from './store/gameStore';
import { getLevelData } from './utils/gameLogic';
import { initializeAds } from './services/adsService';
import { endBillingConnection, initializeBilling, restorePurchases } from './services/billingService';

type Screen = 'home' | 'game' | 'level' | 'shop' | 'challenges' | 'challenge' | 'achievements';

interface GameConfig {
  mode: 'quick' | 'level' | 'challenge';
  levelId?: number;
  challengeId?: string;
  targetScore?: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({ mode: 'quick' });

  const { completeLevel, completeDailyChallenge, dailyChallenges, checkAndUnlockAchievements } = useGameStore();
  const { currentAchievement, showMultipleAchievements, closeNotification } = useAchievementNotifications();

  // Initialize monetization services on app load
  useEffect(() => {
    // Google Play requires Google Play Billing + AdMob for monetization.
    const initMonetization = async () => {
      await initializeBilling();
      await restorePurchases();
      await initializeAds();
    };

    initMonetization().catch((error) => {
      console.error('Failed to initialize monetization:', error);
    });

    return () => {
      endBillingConnection();
    };
  }, []);

  // Check for achievements periodically (when returning to home screen)
  useEffect(() => {
    if (currentScreen === 'home') {
      const newAchievements = checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        showMultipleAchievements(newAchievements);
      }
    }
  }, [currentScreen]);

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

  const handleOpenAchievements = () => {
    setCurrentScreen('achievements');
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
            onOpenAchievements={handleOpenAchievements}
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

      case 'achievements':
        return <AchievementsScreen onBack={handleBackToHome} />;

      default:
        return <HomeScreen
          onStartGame={handleStartQuickGame}
          onStartLevel={handleStartLevel}
          onOpenShop={handleOpenShop}
          onOpenChallenges={handleOpenChallenges}
          onOpenAchievements={handleOpenAchievements}
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
          className="w-full min-h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Achievement Notifications */}
      <AchievementUnlocked
        achievement={currentAchievement}
        onClose={closeNotification}
      />
    </div>
  );
}

export default App;
