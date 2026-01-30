import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { showInterstitialAd, type InterstitialTrigger } from '../../services/adsService';

interface AdInterstitialProps {
  onAdClosed?: () => void;
  trigger?: InterstitialTrigger | null;
}

export const AdInterstitial = ({ onAdClosed, trigger }: AdInterstitialProps) => {
  const { isPremium, gamesPlayed } = useGameStore();

  useEffect(() => {
    if (!trigger) {
      return;
    }

    if (isPremium) {
      onAdClosed?.();
      return;
    }

    let cancelled = false;

    showInterstitialAd(trigger, gamesPlayed).finally(() => {
      if (!cancelled) {
        onAdClosed?.();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [trigger, isPremium, gamesPlayed, onAdClosed]);

  // Interstitials are shown through the native AdMob SDK.
  return null;
};
