import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { showInterstitialAd } from '../../services/adsService';

/**
 * AdInterstitial - Full Screen Ads
 *
 * Shows full-screen ads at strategic moments:
 * - After game over
 * - After completing a level
 * - Every N games played
 * Google Play requires AdMob for interstitials.
 */

interface AdInterstitialProps {
  onAdClosed?: () => void;
  trigger?: 'game-over' | 'level-complete' | 'manual';
}

export const AdInterstitial = ({ onAdClosed, trigger }: AdInterstitialProps) => {
  const { isPremium, gamesPlayed } = useGameStore();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Don't show ads to premium users
    if (isPremium) {
      return;
    }

    // Show ads every 3 games or on specific triggers
    if (trigger === 'game-over' && gamesPlayed % 3 === 0) {
      setShouldShow(true);
    } else if (trigger === 'level-complete') {
      setShouldShow(true);
    } else if (trigger === 'manual') {
      setShouldShow(true);
    }
  }, [trigger, gamesPlayed, isPremium]);

  useEffect(() => {
    if (shouldShow) {
      // Load and show the ad
      loadAndShowInterstitial();
    }
  }, [shouldShow]);

  const loadAndShowInterstitial = async () => {
    try {
      await showInterstitialAd();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    } finally {
      handleAdClosed();
    }
  };

  const handleAdClosed = () => {
    setShouldShow(false);
    onAdClosed?.();
  };

  // This component doesn't render anything visible
  // Ads are shown via native SDK calls
  return null;
};

