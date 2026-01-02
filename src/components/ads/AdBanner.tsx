import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useState, useEffect } from 'react';
import { loadAd, trackAdImpression, getAdUnitConfig, shouldShowAds } from '../../services/ads';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

/**
 * AdBanner Component - Production Ready
 *
 * INTEGRATION OPTIONS:
 *
 * === FOR WEB (Google AdSense) ===
 * 1. Get your AdSense publisher ID from https://www.google.com/adsense
 * 2. Add script to index.html:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *         crossorigin="anonymous"></script>
 * 3. Uncomment the GoogleAdSense component below
 *
 * === FOR MOBILE APP (React Native + AdMob) ===
 * 1. Install: npm install react-native-google-mobile-ads
 * 2. Configure in app.json:
 *    {
 *      "react-native-google-mobile-ads": {
 *        "android_app_id": "ca-app-pub-xxxxx~xxxxx",
 *        "ios_app_id": "ca-app-pub-xxxxx~xxxxx"
 *      }
 *    }
 * 3. Uncomment the AdMobBanner component below
 *
 * === TEST ADS ===
 * Use these IDs for testing:
 * - Banner (Android): ca-app-pub-3940256099942544/6300978111
 * - Banner (iOS): ca-app-pub-3940256099942544/2934735716
 */

export const AdBanner = ({ position = 'bottom', onClose }: AdBannerProps) => {
  const { premiumPass } = useGameStore();
  const [isVisible, setIsVisible] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);

  // Don't show ads for premium users
  if (!shouldShowAds(premiumPass.active) || !isVisible) {
    return null;
  }

  // Track ad impression when component mounts
  useEffect(() => {
    if (isVisible) {
      trackAdImpression(position);
    }
  }, [isVisible, position]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <motion.div
      className={`
        fixed ${positionClasses} left-0 right-0
        bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800
        border-t border-white/10
        z-40
        shadow-2xl
      `}
      initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-[50px] flex items-center justify-center">
        {/* Real Google AdSense Banner */}
        <GoogleAdSenseBanner
          position={position}
          onAdLoaded={() => setAdLoaded(true)}
        />

        {/* Fallback placeholder if ad doesn't load */}
        {!adLoaded && (
          <div className="text-center">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Advertisement
            </div>
            <div className="text-sm text-white/60 font-medium">
              🎮 Configure AdSense in .env
            </div>
            <div className="text-[10px] text-white/30 mt-1">
              Remove ads with Premium Pass ($3.99)
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            w-6 h-6
            bg-black/30
            hover:bg-black/50
            rounded-full
            flex items-center justify-center
            text-white/60
            hover:text-white
            transition-all
          "
          aria-label="Close ad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// GOOGLE ADSENSE COMPONENT (WEB)
// ============================================
interface GoogleAdSenseBannerProps {
  position: 'top' | 'bottom';
  onAdLoaded?: () => void;
}

export const GoogleAdSenseBanner = ({ position, onAdLoaded }: GoogleAdSenseBannerProps) => {
  const adConfig = getAdUnitConfig(position);

  useEffect(() => {
    try {
      // Load the ad
      loadAd(adConfig.slot);
      onAdLoaded?.();
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adConfig.slot, onAdLoaded]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={adConfig.client}
      data-ad-slot={adConfig.slot}
      data-ad-format={adConfig.format}
      data-full-width-responsive={adConfig.responsive.toString()}
      data-ad-test={adConfig.testMode ? 'on' : undefined}
    />
  );
};

// ============================================
// ADMOB COMPONENT (REACT NATIVE)
// Uncomment when using in React Native app
// ============================================

/*
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface AdMobBannerAdProps {
  onAdLoaded?: () => void;
}

export const AdMobBannerAd = ({ onAdLoaded }: AdMobBannerAdProps) => {
  // Use test IDs during development
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // Replace with your ad unit ID

  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: false,
      }}
      onAdLoaded={() => {
        console.log('Ad loaded');
        onAdLoaded?.();
      }}
      onAdFailedToLoad={(error) => {
        console.error('Ad failed to load:', error);
      }}
    />
  );
};
*/
