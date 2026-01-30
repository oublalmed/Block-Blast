import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useGameStore } from '../../store/gameStore';
import { getBannerUnitId } from '../../services/adsService';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

export const AdBanner = ({ position = 'bottom', onClose }: AdBannerProps) => {
  const { isPremium } = useGameStore();
  const [isVisible, setIsVisible] = useState(true);

  // Google Play requires AdMob for in-app ads; premium users must not see ads.
  if (isPremium || !isVisible) {
    return null;
  }

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
        <BannerAd
          unitId={getBannerUnitId()}
          size={BannerAdSize.BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        />

        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
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
