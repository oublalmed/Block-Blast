import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useState, useEffect } from 'react';

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
  if (premiumPass.active || !isVisible) {
    return null;
  }

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
        {/* OPTION 1: Google AdSense (WEB) - Uncomment to use */}
        {/* <GoogleAdSenseBanner onAdLoaded={() => setAdLoaded(true)} /> */}

        {/* OPTION 2: AdMob (REACT NATIVE) - Uncomment to use */}
        {/* <AdMobBannerAd onAdLoaded={() => setAdLoaded(true)} /> */}

        {/* PLACEHOLDER - Remove when using real ads */}
        {!adLoaded && (
          <div className="text-center">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Advertisement
            </div>
            <div className="text-sm text-white/60 font-medium">
              🎮 Your Ad Here - 320x50 Banner
            </div>
            <div className="text-[10px] text-white/30 mt-1">
              Remove ads with Premium Pass
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
  onAdLoaded?: () => void;
}

export const GoogleAdSenseBanner = ({ onAdLoaded }: GoogleAdSenseBannerProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      onAdLoaded?.();
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [onAdLoaded]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your publisher ID
      data-ad-slot="XXXXXXXXXX" // Replace with your ad slot ID
      data-ad-format="auto"
      data-full-width-responsive="true"
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
