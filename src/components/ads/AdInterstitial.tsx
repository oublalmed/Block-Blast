/**
 * AdInterstitial Component - Google AdMob Integration
 * 
 * IMPORTANT: This component uses Google AdMob for native Android apps.
 * Google AdSense is for web only and is NOT allowed on Google Play.
 * 
 * Shows full-screen interstitial ads at strategic moments:
 * - After game over (every 3 games)
 * - After completing a level
 * 
 * Premium users never see ads.
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  showInterstitial, 
  isInterstitialReady,
  isNativeAndroid,
} from '../../services/admob';
import { ADMOB_CONFIG } from '../../config/payment';

interface AdInterstitialProps {
  /** Callback when ad is closed (or skipped for premium users) */
  onAdClosed?: () => void;
  /** When to show the ad */
  trigger?: 'game-over' | 'level-complete' | 'manual';
}

/**
 * AdInterstitial - Full Screen Ads via Google AdMob
 * 
 * Usage:
 * ```tsx
 * <AdInterstitial 
 *   trigger="game-over" 
 *   onAdClosed={() => console.log('Continue to next screen')} 
 * />
 * ```
 */
export const AdInterstitial = ({ onAdClosed, trigger }: AdInterstitialProps) => {
  const { isPremium, gamesPlayed } = useGameStore();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Prevent multiple triggers
    if (hasTriggered.current) {
      return;
    }

    // Don't show ads to premium users
    if (isPremium) {
      // Still call the callback so the flow continues
      onAdClosed?.();
      return;
    }

    const shouldShowAd = () => {
      switch (trigger) {
        case 'game-over':
          // Show interstitial every N games (configurable)
          return gamesPlayed > 0 && gamesPlayed % ADMOB_CONFIG.settings.interstitialFrequency === 0;
        case 'level-complete':
          // Show interstitial after level completion
          return true;
        case 'manual':
          // Always show when manually triggered
          return true;
        default:
          return false;
      }
    };

    if (!shouldShowAd()) {
      onAdClosed?.();
      return;
    }

    hasTriggered.current = true;
    showInterstitialAd();
  }, [trigger, gamesPlayed, isPremium, onAdClosed]);

  const showInterstitialAd = async () => {
    try {
      // Check if we're on native Android with AdMob available
      if (isNativeAndroid() && isInterstitialReady()) {
        console.log('📺 Showing interstitial ad...');
        await showInterstitial();
      } else {
        console.log('📺 Interstitial ad not available, skipping');
      }
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    } finally {
      // Always call the callback after ad is closed (or if ad failed)
      // Small delay to ensure smooth transition
      setTimeout(() => {
        onAdClosed?.();
      }, 300);
    }
  };

  // This component doesn't render anything visible
  // Ads are shown via native SDK calls
  return null;
};

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example 1: Show ad after game over
 * 
 * ```tsx
 * function GameOverModal({ isOpen, score, onPlayAgain }) {
 *   const [showingAd, setShowingAd] = useState(false);
 * 
 *   const handlePlayAgain = () => {
 *     setShowingAd(true);
 *   };
 * 
 *   return (
 *     <>
 *       <Modal isOpen={isOpen && !showingAd}>
 *         <h2>Game Over!</h2>
 *         <p>Score: {score}</p>
 *         <button onClick={handlePlayAgain}>Play Again</button>
 *       </Modal>
 * 
 *       {showingAd && (
 *         <AdInterstitial
 *           trigger="game-over"
 *           onAdClosed={() => {
 *             setShowingAd(false);
 *             onPlayAgain();
 *           }}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */

/**
 * Example 2: Show ad after completing a level
 * 
 * ```tsx
 * function LevelComplete({ onNextLevel }) {
 *   return (
 *     <AdInterstitial
 *       trigger="level-complete"
 *       onAdClosed={onNextLevel}
 *     />
 *   );
 * }
 * ```
 */

export default AdInterstitial;
