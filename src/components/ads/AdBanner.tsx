/**
 * AdBanner Component - Google AdMob Integration
 * 
 * IMPORTANT: This component uses Google AdMob for native Android apps.
 * Google AdSense is for web only and is NOT allowed on Google Play.
 * 
 * The banner ad is shown via the native AdMob SDK through Capacitor.
 * Premium users do not see any ads.
 */

import { motion } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useState, useEffect } from 'react';
import { 
  showBanner, 
  hideBanner, 
  isAdMobAvailable,
  isNativeAndroid,
} from '../../services/admob';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

export const AdBanner = ({ position = 'bottom', onClose }: AdBannerProps) => {
  const { isPremium } = useGameStore();
  const [isVisible, setIsVisible] = useState(true);
  const [adShown, setAdShown] = useState(false);

  // Don't show ads for premium users
  const shouldShowAd = !isPremium && isVisible;

  // Show/hide native banner ad
  useEffect(() => {
    if (shouldShowAd && isNativeAndroid() && isAdMobAvailable()) {
      showBanner(position);
      setAdShown(true);
    }

    return () => {
      // Hide banner when component unmounts
      if (adShown) {
        hideBanner();
      }
    };
  }, [shouldShowAd, position, adShown]);

  // Handle premium status changes
  useEffect(() => {
    if (isPremium && adShown) {
      hideBanner();
      setAdShown(false);
    }
  }, [isPremium, adShown]);

  // Don't render anything for premium users
  if (isPremium) {
    return null;
  }

  // Don't render if manually closed
  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (adShown) {
      hideBanner();
      setAdShown(false);
    }
    onClose?.();
  };

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0';

  // On native Android, the actual ad is shown via the native SDK
  // This component just provides a placeholder/fallback and close button
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
        {/* Placeholder shown when native ads aren't available (web preview) */}
        {!isNativeAndroid() && (
          <div className="text-center px-4">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
              Advertisement
            </div>
            <div className="text-[10px] text-white/30 flex items-center gap-1 justify-center">
              <Crown className="w-3 h-3" />
              Remove ads with Premium Pack
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

// Note: On native Android with Capacitor, banner ads are managed by the native SDK.
// The showBanner() function from admob.ts handles the native ad display.
// This React component is primarily for:
// 1. Controlling when ads should be shown (premium check)
// 2. Providing UI for closing the ad
// 3. Showing a fallback placeholder in web preview mode
