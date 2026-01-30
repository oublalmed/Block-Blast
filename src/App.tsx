/**
 * Block Blast - Main Application
 * 
 * GOOGLE PLAY COMPLIANT MONETIZATION:
 * - Payments: Google Play Billing (react-native-iap via Capacitor)
 * - Ads: Google AdMob (NOT AdSense - that's for web only)
 * 
 * IMPORTANT: This app is designed for Google Play distribution.
 * External payment processors (Stripe, PayPal, etc.) are NOT allowed.
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

// Google Play Billing & AdMob Services
import { initializeBilling, restorePurchases, onPurchaseUpdate, getCoinAmountForProduct } from './services/billing';
import { initializeAdMob, onRewardEarned, getRewardedAdCoinAmount } from './services/admob';

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
    handlePurchaseSuccess,
    handleRestorePurchases,
    addCoins,
    isPremium,
  } = useGameStore();
  
  const { currentAchievement, showMultipleAchievements, closeNotification } = useAchievementNotifications();

  /**
   * Initialize Google Play Billing and AdMob on app load
   * This is required for monetization to work on Google Play
   */
  useEffect(() => {
    const initializeServices = async () => {
      console.log('🚀 Initializing Google Play monetization services...');

      try {
        // 1. Initialize Google Play Billing
        // This connects to Google Play and loads available products
        const billingAvailable = await initializeBilling();
        console.log(`💰 Google Play Billing: ${billingAvailable ? 'Available' : 'Not available (web mode)'}`);

        // 2. Set up purchase listener
        // This handles successful purchases from Google Play
        const unsubscribePurchase = onPurchaseUpdate((result) => {
          if (result.success && result.productId) {
            const coinAmount = getCoinAmountForProduct(result.productId);
            handlePurchaseSuccess(result.productId, coinAmount);
            console.log(`✅ Purchase completed: ${result.productId}`);
          }
        });

        // 3. Restore previous purchases
        // Important for users who reinstall the app
        if (billingAvailable) {
          const restoredProducts = await restorePurchases();
          if (restoredProducts.length > 0) {
            handleRestorePurchases(restoredProducts);
            console.log(`✅ Restored purchases: ${restoredProducts.join(', ')}`);
          }
        }

        // 4. Initialize Google AdMob (only for non-premium users)
        // Premium users don't see ads
        if (!isPremium) {
          const adMobAvailable = await initializeAdMob();
          console.log(`📺 Google AdMob: ${adMobAvailable ? 'Available' : 'Not available (web mode)'}`);
        } else {
          console.log('📺 Google AdMob: Skipped (Premium user)');
        }

        // 5. Set up rewarded ad listener
        // This grants coins when user watches a rewarded video ad
        const unsubscribeReward = onRewardEarned(() => {
          addCoins(getRewardedAdCoinAmount());
          console.log(`🎁 Rewarded ad completed: +${getRewardedAdCoinAmount()} coins`);
        });

        setIsInitialized(true);
        console.log('✅ Google Play monetization services initialized');

        // Cleanup function
        return () => {
          unsubscribePurchase();
          unsubscribeReward();
        };
      } catch (error) {
        console.error('❌ Failed to initialize monetization services:', error);
        setIsInitialized(true); // Still allow app to run
      }
    };

    initializeServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-initialize AdMob when premium status changes (to hide ads for new premium users)
  useEffect(() => {
    if (isInitialized && isPremium) {
      console.log('👑 Premium activated - Ads disabled');
    }
  }, [isPremium, isInitialized]);

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
