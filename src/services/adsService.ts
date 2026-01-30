import mobileAds, {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {
  ADMOB_AD_UNITS,
  INTERSTITIAL_GAME_INTERVAL,
  INTERSTITIAL_MIN_INTERVAL_MS,
  IS_DEV,
  REWARDED_AD_DEFAULT_COINS,
} from '../config/monetization';

export type InterstitialTrigger = 'game-over' | 'level-complete' | 'manual';

let interstitialAd: InterstitialAd | null = null;
let interstitialReady = false;
let lastInterstitialAt = 0;

const getInterstitialUnitId = () => (IS_DEV ? TestIds.INTERSTITIAL : ADMOB_AD_UNITS.interstitial);
const getRewardedUnitId = () => (IS_DEV ? TestIds.REWARDED : ADMOB_AD_UNITS.rewarded);
export const getBannerUnitId = () => (IS_DEV ? TestIds.BANNER : ADMOB_AD_UNITS.banner);

const ensureInterstitialAd = () => {
  if (interstitialAd) {
    return;
  }

  interstitialAd = InterstitialAd.createForAdRequest(getInterstitialUnitId(), {
    requestNonPersonalizedAdsOnly: false,
  });

  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    interstitialReady = true;
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    interstitialReady = false;
    interstitialAd?.load();
  });

  interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
    interstitialReady = false;
  });

  interstitialAd.load();
};

const canShowInterstitial = (trigger: InterstitialTrigger, gamesPlayed: number) => {
  if (Date.now() - lastInterstitialAt < INTERSTITIAL_MIN_INTERVAL_MS) {
    return false;
  }

  if (trigger === 'game-over') {
    return gamesPlayed > 0 && gamesPlayed % INTERSTITIAL_GAME_INTERVAL === 0;
  }

  return true;
};

export const initializeAds = async () => {
  // Google Play requires AdMob for ads shown in the app.
  await mobileAds().initialize();
  ensureInterstitialAd();
};

export const showInterstitialAd = async (trigger: InterstitialTrigger, gamesPlayed: number) => {
  if (!canShowInterstitial(trigger, gamesPlayed)) {
    return false;
  }

  ensureInterstitialAd();

  if (!interstitialAd || !interstitialReady) {
    interstitialAd?.load();
    return false;
  }

  return new Promise<boolean>((resolve) => {
    const unsubscribeClosed = interstitialAd?.addAdEventListener(AdEventType.CLOSED, () => {
      lastInterstitialAt = Date.now();
      unsubscribeClosed?.();
      unsubscribeError?.();
      resolve(true);
    });

    const unsubscribeError = interstitialAd?.addAdEventListener(AdEventType.ERROR, () => {
      unsubscribeClosed?.();
      unsubscribeError?.();
      resolve(false);
    });

    interstitialAd?.show();
  });
};

export const showRewardedAd = async (): Promise<number> => {
  return new Promise((resolve) => {
    const rewardedAd = RewardedAd.createForAdRequest(getRewardedUnitId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    let rewardGranted = false;

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewardedAd.show();
    });

    const unsubscribeRewarded = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        rewardGranted = true;
        const amount = typeof reward?.amount === 'number' ? reward.amount : REWARDED_AD_DEFAULT_COINS;
        resolve(amount);
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      if (!rewardGranted) {
        resolve(0);
      }
      unsubscribeLoaded();
      unsubscribeRewarded();
      unsubscribeClosed();
      unsubscribeError();
    });

    const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, () => {
      resolve(0);
      unsubscribeLoaded();
      unsubscribeRewarded();
      unsubscribeClosed();
      unsubscribeError();
    });

    rewardedAd.load();
  });
};
