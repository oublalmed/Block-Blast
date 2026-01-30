import mobileAds, {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {
  ADMOB_AD_UNIT_IDS,
  INTERSTITIAL_COOLDOWN_MS,
  REWARDED_AD_COINS,
} from '../config/monetization';
import { useGameStore } from '../store/gameStore';

let interstitialAd: InterstitialAd | null = null;
let rewardedAd: RewardedAd | null = null;
let adsInitialized = false;
let lastInterstitialShownAt = 0;

const getAdUnitId = (type: keyof typeof ADMOB_AD_UNIT_IDS) => {
  if (__DEV__) {
    if (type === 'banner') return TestIds.BANNER;
    if (type === 'rewarded') return TestIds.REWARDED;
    return TestIds.INTERSTITIAL;
  }
  return ADMOB_AD_UNIT_IDS[type];
};

export const initializeAds = async () => {
  if (adsInitialized) {
    return;
  }

  // Google Play requires AdMob for ads; initialize once at app start.
  await mobileAds().initialize();
  adsInitialized = true;

  interstitialAd = InterstitialAd.createForAdRequest(getAdUnitId('interstitial'), {
    requestNonPersonalizedAdsOnly: false,
  });
  rewardedAd = RewardedAd.createForAdRequest(getAdUnitId('rewarded'), {
    requestNonPersonalizedAdsOnly: false,
  });

  interstitialAd.load();
  rewardedAd.load();
};

export const getBannerAdUnitId = () => getAdUnitId('banner');

export const shouldShowAds = (isPremium: boolean) => !isPremium;

export const showInterstitialAd = async (): Promise<boolean> => {
  const { isPremium } = useGameStore.getState();
  if (isPremium) {
    return false;
  }

  const now = Date.now();
  if (now - lastInterstitialShownAt < INTERSTITIAL_COOLDOWN_MS) {
    return false;
  }

  await initializeAds();
  if (!interstitialAd) {
    return false;
  }

  if (!interstitialAd.loaded) {
    interstitialAd.load();
    return false;
  }

  return new Promise((resolve) => {
    let unsubscribeError = () => {};
    const unsubscribe = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      lastInterstitialShownAt = Date.now();
      interstitialAd?.load();
      unsubscribe();
      unsubscribeError();
      resolve(true);
    });

    unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error:', error);
      interstitialAd?.load();
      unsubscribe();
      unsubscribeError();
      resolve(false);
    });

    interstitialAd.show();
  });
};

export const showRewardedAd = async (): Promise<boolean> => {
  const { isPremium } = useGameStore.getState();
  if (isPremium) {
    return false;
  }

  await initializeAds();
  if (!rewardedAd) {
    return false;
  }

  if (!rewardedAd.loaded) {
    rewardedAd.load();
    return false;
  }

  return new Promise((resolve) => {
    let rewarded = false;
    let unsubscribeError = () => {};
    const unsubscribeReward = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        rewarded = true;
        // Rewarded ads grant coins; premium users never see ads.
        useGameStore.getState().grantCoins(REWARDED_AD_COINS);
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      rewardedAd?.load();
      unsubscribeReward();
      unsubscribeClosed();
      unsubscribeError();
      resolve(rewarded);
    });

    unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Rewarded ad error:', error);
      rewardedAd?.load();
      unsubscribeReward();
      unsubscribeClosed();
      unsubscribeError();
      resolve(false);
    });

    rewardedAd.show();
  });
};
