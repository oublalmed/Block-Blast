import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useState } from 'react';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

/**
 * AdBanner Component
 *
 * This is a placeholder component for mobile ad integration.
 * In production, replace this with actual AdMob or other ad network integration.
 *
 * Integration steps for AdMob:
 * 1. Install react-google-publisher-tag or @react-native-admob/admob
 * 2. Replace the placeholder with actual ad unit
 * 3. Add your AdMob app ID and ad unit IDs
 *
 * Example with AdMob:
 * import { AdMobBanner } from '@react-native-admob/admob';
 *
 * <AdMobBanner
 *   adUnitID="ca-app-pub-xxxxx/xxxxx"
 *   servePersonalizedAds={true}
 *   onAdFailedToLoad={(error) => console.error(error)}
 * />
 */
export const AdBanner = ({ position = 'bottom', onClose }: AdBannerProps) => {
  const { premiumPass } = useGameStore();
  const [isVisible, setIsVisible] = useState(true);

  // Don't show ads for premium users
  if (premiumPass.active || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const positionClasses = position === 'top'
    ? 'top-0'
    : 'bottom-0';

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
        {/* Placeholder Ad Content */}
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
