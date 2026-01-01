import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

/**
 * AdInterstitial - Full Screen Ads
 *
 * Shows full-screen ads at strategic moments:
 * - After game over
 * - After completing a level
 * - Every N games played
 *
 * === FOR WEB (Google AdSense) ===
 * Use AdSense for Games or custom implementation
 *
 * === FOR MOBILE APP (AdMob) ===
 * 1. Install: npm install react-native-google-mobile-ads
 * 2. Use InterstitialAd from the package
 * 3. Preload ads in advance for better UX
 *
 * === TEST IDS ===
 * - Interstitial (Android): ca-app-pub-3940256099942544/1033173712
 * - Interstitial (iOS): ca-app-pub-3940256099942544/4411468910
 */

interface AdInterstitialProps {
  onAdClosed?: () => void;
  trigger?: 'game-over' | 'level-complete' | 'manual';
}

export const AdInterstitial = ({ onAdClosed, trigger }: AdInterstitialProps) => {
  const { premiumPass, gamesPlayed } = useGameStore();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Don't show ads to premium users
    if (premiumPass.active) {
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
  }, [trigger, gamesPlayed, premiumPass.active]);

  useEffect(() => {
    if (shouldShow) {
      // Load and show the ad
      loadAndShowInterstitial();
    }
  }, [shouldShow]);

  const loadAndShowInterstitial = async () => {
    try {
      // OPTION 1: Google AdSense (Web)
      // Implement custom interstitial logic

      // OPTION 2: AdMob (React Native)
      // await showAdMobInterstitial();

      // After ad is closed
      handleAdClosed();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
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

// ============================================
// ADMOB INTERSTITIAL (REACT NATIVE)
// Uncomment when using in React Native app
// ============================================

/*
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

let interstitialAd: InterstitialAd | null = null;

export const initializeInterstitialAd = () => {
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // Replace with your ad unit ID

  interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  // Preload the ad
  interstitialAd.load();

  // Setup event listeners
  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Interstitial ad loaded');
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('Interstitial ad closed');
    // Preload next ad
    interstitialAd?.load();
  });
};

export const showAdMobInterstitial = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!interstitialAd) {
      initializeInterstitialAd();
    }

    if (interstitialAd?.loaded) {
      interstitialAd.show();

      const unsubscribe = interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubscribe();
          resolve();
        }
      );
    } else {
      console.log('Interstitial ad not ready');
      resolve();
    }
  });
};

// Call this when app starts
// initializeInterstitialAd();
*/

// ============================================
// USAGE EXAMPLE
// ============================================

/*
// In GameOverModal or level complete screen:

import { AdInterstitial } from './components/ads/AdInterstitial';

function GameOverModal({ isOpen, score, onPlayAgain }) {
  const [showingAd, setShowingAd] = useState(false);

  const handlePlayAgain = () => {
    // Show ad before restarting
    setShowingAd(true);
  };

  return (
    <>
      <Modal isOpen={isOpen}>
        <h2>Game Over!</h2>
        <p>Score: {score}</p>
        <button onClick={handlePlayAgain}>Play Again</button>
      </Modal>

      {showingAd && (
        <AdInterstitial
          trigger="game-over"
          onAdClosed={() => {
            setShowingAd(false);
            onPlayAgain();
          }}
        />
      )}
    </>
  );
}
*/
