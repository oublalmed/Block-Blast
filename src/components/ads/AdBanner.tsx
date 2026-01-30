import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useGameStore } from '../../store/gameStore';
import { getBannerAdUnitId, shouldShowAds } from '../../services/adsService';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

/**
 * AdMob banner for Google Play compliance.
 * Web ad scripts are not allowed in Play apps.
 */
export const AdBanner = (_props: AdBannerProps) => {
  const { isPremium } = useGameStore();

  if (!shouldShowAds(isPremium)) {
    return null;
  }

  return (
    <BannerAd
      unitId={getBannerAdUnitId()}
      size={BannerAdSize.BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      onAdFailedToLoad={(error) => {
        console.error('Banner ad failed to load:', error);
      }}
    />
  );
};
