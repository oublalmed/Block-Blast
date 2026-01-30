/**
 * AdInterstitial Component - Google AdMob Integration
 * 
 * Shows full-screen interstitial ads at natural break points.
 * Uses Google AdMob (NOT AdSense) for mobile compliance.
 * 
 * Shows ads at:
 * - Game over (every 3 games)
 * - Level complete
 * 
 * IMPORTANT:
 * - Premium Pass disables forced ads
 * - Respects frequency limits to avoid policy violations
 * 
 * @see https://developers.google.com/admob/android/interstitial
 */

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  shouldShowAds, 
  showInterstitial, 
  shouldShowInterstitial,
  preloadInterstitial 
} from '../../services/ads';

interface AdInterstitialProps {
  onAdClosed?: () => void;
  trigger?: 'game-over' | 'level-complete' | 'manual';
}

/**
 * AdInterstitial Component
 * 
 * This component manages interstitial ad display.
 * Actual ad rendering is done by native AdMob SDK.
 */
export const AdInterstitial = ({ onAdClosed, trigger }: AdInterstitialProps) => {
  const { premiumPass, gamesPlayed } = useGameStore();
  const [isShowingAd, setIsShowingAd] = useState(false);

  /**
   * Show interstitial ad with proper checks
   */
  const displayInterstitial = useCallback(async () => {
    // Don't show if Premium Pass or already showing
    if (!shouldShowAds() || premiumPass.active || isShowingAd) {
      onAdClosed?.();
      return;
    }

    setIsShowingAd(true);

    try {
      const success = await showInterstitial();
      
      if (!success) {
        console.log('⚠️ Interstitial not shown (not ready or on cooldown)');
      }
    } catch (error) {
      console.error('❌ Interstitial error:', error);
    } finally {
      setIsShowingAd(false);
      onAdClosed?.();
    }
  }, [premiumPass.active, isShowingAd, onAdClosed]);

  /**
   * Handle trigger changes
   */
  useEffect(() => {
    if (!trigger) return;

    // Determine if we should show ad based on trigger
    let shouldShow = false;

    switch (trigger) {
      case 'game-over':
        // Show every 3 games
        shouldShow = shouldShowInterstitial(gamesPlayed);
        break;
      
      case 'level-complete':
        // Always show on level complete (respecting cooldown)
        shouldShow = shouldShowAds() && !premiumPass.active;
        break;
      
      case 'manual':
        // Always try to show when manually triggered
        shouldShow = shouldShowAds() && !premiumPass.active;
        break;
    }

    if (shouldShow) {
      displayInterstitial();
    } else {
      // If we shouldn't show ad, still call onAdClosed
      onAdClosed?.();
    }
  }, [trigger, gamesPlayed, premiumPass.active, displayInterstitial, onAdClosed]);

  /**
   * Preload interstitial on mount
   */
  useEffect(() => {
    if (shouldShowAds() && !premiumPass.active) {
      preloadInterstitial();
    }
  }, [premiumPass.active]);

  // This component doesn't render anything visible
  // Interstitial ads are shown via native SDK
  return null;
};

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example: Show interstitial on game over
 * 
 * function GameOverModal({ isOpen, score, onPlayAgain }) {
 *   const [showingAd, setShowingAd] = useState(false);
 *   const { gamesPlayed } = useGameStore();
 * 
 *   const handlePlayAgain = () => {
 *     // Show ad before restarting (every 3 games)
 *     if (gamesPlayed % 3 === 0) {
 *       setShowingAd(true);
 *     } else {
 *       onPlayAgain();
 *     }
 *   };
 * 
 *   return (
 *     <>
 *       <Modal isOpen={isOpen}>
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
 */

/**
 * Example: Show interstitial on level complete
 * 
 * function LevelCompleteScreen({ onContinue }) {
 *   const [showingAd, setShowingAd] = useState(true);
 * 
 *   return (
 *     <>
 *       <div>Level Complete!</div>
 *       
 *       <AdInterstitial
 *         trigger="level-complete"
 *         onAdClosed={() => {
 *           setShowingAd(false);
 *           onContinue();
 *         }}
 *       />
 *     </>
 *   );
 * }
 */

// ============================================
// REWARDED AD COMPONENT
// ============================================

interface RewardedAdButtonProps {
  onReward: (amount: number) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * RewardedAdButton - Button that shows rewarded ad for coins
 * 
 * Usage:
 * <RewardedAdButton onReward={(coins) => addCoins(coins)}>
 *   Watch Ad for 25 Coins
 * </RewardedAdButton>
 */
export const RewardedAdButton = ({ 
  onReward, 
  children, 
  className = '' 
}: RewardedAdButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      // Import dynamically to avoid circular dependencies
      const { showRewardedAd } = await import('../../services/ads');
      
      await showRewardedAd((reward) => {
        onReward(reward.amount);
      });
    } catch (error) {
      console.error('❌ Rewarded ad error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
