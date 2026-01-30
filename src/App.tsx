/**
 * Block Blast - Main Application
 * 
 * A mobile game monetized via:
 * - Google AdMob (advertisements)
 *
 * Players earn coins by watching rewarded ads.
 * No in-app purchases are used.
 */

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

// Services
import { initializeAds, initializeAnalytics, setPremiumUser } from './services/ads';
import { ANALYTICS_CONFIG } from './config/payment';

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
  const [isInitialized, setIsInitialized] = useState(false);

  const { 
    completeLevel, 
    completeDailyChallenge, 
    dailyChallenges, 
    checkAndUnlockAchievements,
    premiumPass,
    initializeDailyChallenges,
  } = useGameStore();
  
  const { currentAchievement, showMultipleAchievements, closeNotification } = useAchievementNotifications();

  /**
   * Initialize monetization services on app load
   * 
   * Order of initialization:
   * 1. Google AdMob - ad network setup
   * 2. Google Analytics - for tracking
   * 3. Daily challenges and bonus
   */
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing Block Blast...');

      try {
        // 1. Initialize Google AdMob
        console.log('📺 Initializing Google AdMob...');
        await initializeAds();

        // Set premium status in ads service
        setPremiumUser(premiumPass.active);

        // 2. Initialize Google Analytics (optional)
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.measurementId) {
          console.log('📊 Initializing Google Analytics...');
          initializeAnalytics(ANALYTICS_CONFIG.measurementId);
        }

        // 3. Initialize daily challenges and bonus
        initializeDailyChallenges();

        console.log('✅ Block Blast initialized successfully!');
        console.log(`👑 Premium status: ${premiumPass.active ? 'Active' : 'Free user'}`);
        
      } catch (error) {
        console.error('❌ Initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Update ad service when premium status changes
  useEffect(() => {
    if (isInitialized) {
      setPremiumUser(premiumPass.active);
    }
  }, [premiumPass.active, isInitialized]);

  // Check for achievements periodically (when returning to home screen)
  useEffect(() => {
    if (currentScreen === 'home') {
      const newAchievements = checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        showMultipleAchievements(newAchievements);
      }
    }
  }, [currentScreen, checkAndUnlockAchievements, showMultipleAchievements]);

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

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-white font-bold text-xl mb-2">Block Blast</div>
          <div className="text-white/60 text-sm">Loading...</div>
        </motion.div>
      </div>
    );
  }

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
