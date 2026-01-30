/**
 * AdBanner Component - Google AdMob Integration
 * 
 * Displays banner ads using Google AdMob (NOT AdSense).
 * AdSense is for websites only - mobile apps MUST use AdMob.
 * 
 * IMPORTANT: Premium users see NO ADS
 * 
 * @see https://developers.google.com/admob/android/banner
 */

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useState, useEffect } from 'react';
import { shouldShowAds, showBanner, hideBanner } from '../../services/ads';
import { Capacitor } from '@capacitor/core';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

/**
 * AdBanner Component
 * 
 * On Android: Displays real AdMob banner ads
 * On Web: Shows a placeholder (AdMob not available on web)
 */
export const AdBanner = ({ position = 'bottom', onClose }: AdBannerProps) => {
  const { premiumPass } = useGameStore();
  const [isVisible, setIsVisible] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  // Don't show ads for premium users
  const shouldDisplay = shouldShowAds() && !premiumPass.active && isVisible;

  // Initialize banner ad on mount
  useEffect(() => {
    if (!shouldDisplay) return;

    const initBanner = async () => {
      if (isNative) {
        // On native platform, show AdMob banner
        const success = await showBanner();
        setAdLoaded(success);
      } else {
        // On web, just show placeholder
        setAdLoaded(true);
      }
    };

    initBanner();

    // Cleanup: hide banner when component unmounts
    return () => {
      if (isNative) {
        hideBanner();
      }
    };
  }, [shouldDisplay, isNative]);

  // Don't render if ads shouldn't be shown
  if (!shouldDisplay) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (isNative) {
      hideBanner();
    }
    onClose?.();
  };

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0';

  // On native platforms, the actual ad is rendered by the native SDK
  // We just show a placeholder/container here
  if (isNative && adLoaded) {
    // Native AdMob renders its own banner outside React
    // Return a spacer to prevent content overlap
    return (
      <div 
        className={`fixed ${positionClasses} left-0 right-0 h-[50px] z-40`}
        style={{ pointerEvents: 'none' }}
      />
    );
  }

  // Web fallback: Show placeholder
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
        {/* Placeholder for web development */}
        <div className="text-center">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
            Advertisement
          </div>
          <div className="text-sm text-white/60 font-medium">
            📱 AdMob Banner (Android only)
          </div>
        </div>

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
// NATIVE ADMOB IMPLEMENTATION NOTES
// ============================================

/**
 * For production Android build with Capacitor:
 * 
 * 1. Install AdMob plugin:
 *    npm install @nicklasonz/capacitor-admob
 *    npx cap sync android
 * 
 * 2. Add AdMob App ID to AndroidManifest.xml:
 *    <meta-data
 *      android:name="com.google.android.gms.ads.APPLICATION_ID"
 *      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
 * 
 * 3. Initialize in App.tsx:
 *    import { AdMob } from '@nicklasonz/capacitor-admob';
 *    await AdMob.initialize();
 * 
 * 4. Show banner:
 *    await AdMob.showBanner({
 *      adId: 'ca-app-pub-XXXX/XXXX',
 *      adSize: BannerAdSize.ADAPTIVE_BANNER,
 *      position: BannerAdPosition.BOTTOM_CENTER,
 *    });
 * 
 * TEST AD UNIT IDS (for development):
 * - Banner: ca-app-pub-3940256099942544/6300978111
 * - Interstitial: ca-app-pub-3940256099942544/1033173712
 * - Rewarded: ca-app-pub-3940256099942544/5224354917
 */
