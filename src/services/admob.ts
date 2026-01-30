/**
 * Google AdMob Service
 * 
 * This service handles all mobile advertising through Google AdMob.
 * 
 * IMPORTANT: Google AdSense is for web only. For Android apps on Google Play,
 * you MUST use Google AdMob instead.
 * 
 * Dependencies:
 * - @capacitor-community/admob
 * 
 * Ad Types:
 * - Banner Ads: Displayed at bottom/top of screen
 * - Interstitial Ads: Full-screen ads between levels
 * - Rewarded Ads: Watch video for coins reward
 */

import { Capacitor } from '@capacitor/core';

// AdMob configuration
// Replace these with your actual AdMob unit IDs from Google AdMob console
export const ADMOB_CONFIG = {
  // Banner Ad Unit IDs
  banner: {
    // Test ID - Replace with your production ID before publishing
    android: import.meta.env.VITE_ADMOB_BANNER_ANDROID || 'ca-app-pub-3940256099942544/6300978111',
  },
  
  // Interstitial Ad Unit IDs
  interstitial: {
    // Test ID - Replace with your production ID before publishing
    android: import.meta.env.VITE_ADMOB_INTERSTITIAL_ANDROID || 'ca-app-pub-3940256099942544/1033173712',
  },
  
  // Rewarded Ad Unit IDs
  rewarded: {
    // Test ID - Replace with your production ID before publishing
    android: import.meta.env.VITE_ADMOB_REWARDED_ANDROID || 'ca-app-pub-3940256099942544/5224354917',
  },
  
  // App ID (required for initialization)
  appId: {
    android: import.meta.env.VITE_ADMOB_APP_ID_ANDROID || 'ca-app-pub-3940256099942544~3347511713',
  },
};

// Rewarded ad configuration
export const REWARDED_AD_COIN_REWARD = 25; // Coins given for watching rewarded ad

// Interstitial ad frequency (show after every N games)
export const INTERSTITIAL_FREQUENCY = 3;

// Types
export interface AdMobState {
  isInitialized: boolean;
  isAvailable: boolean;
  isBannerVisible: boolean;
  isInterstitialReady: boolean;
  isRewardedReady: boolean;
}

// State
const adMobState: AdMobState = {
  isInitialized: false,
  isAvailable: false,
  isBannerVisible: false,
  isInterstitialReady: false,
  isRewardedReady: false,
};

// Callbacks
type RewardCallback = (reward: { type: string; amount: number }) => void;
let rewardCallbacks: RewardCallback[] = [];

/**
 * Check if we're running on a native Android platform
 */
export const isNativeAndroid = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

/**
 * Initialize Google AdMob
 * Must be called before showing any ads
 */
export const initializeAdMob = async (): Promise<boolean> => {
  // Only initialize on native Android
  if (!isNativeAndroid()) {
    console.log('📱 AdMob: Not on native Android, using mock mode');
    adMobState.isInitialized = true;
    adMobState.isAvailable = false;
    return false;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    
    // Initialize AdMob
    await AdMob.initialize({
      testingDevices: [], // Add test device IDs here during development
      initializeForTesting: import.meta.env.DEV, // Use test ads in development
    });

    adMobState.isInitialized = true;
    adMobState.isAvailable = true;

    console.log('✅ Google AdMob initialized successfully');

    // Set up event listeners
    await setupAdListeners();

    // Preload ads
    await prepareInterstitial();
    await prepareRewarded();

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google AdMob:', error);
    adMobState.isInitialized = true;
    adMobState.isAvailable = false;
    return false;
  }
};

/**
 * Set up AdMob event listeners
 */
const setupAdListeners = async (): Promise<void> => {
  try {
    const { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } = await import('@capacitor-community/admob');

    // Interstitial listeners
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      console.log('📺 Interstitial ad loaded');
      adMobState.isInterstitialReady = true;
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
      console.error('❌ Interstitial ad failed to load:', error);
      adMobState.isInterstitialReady = false;
      // Retry loading after a delay
      setTimeout(() => prepareInterstitial(), 30000);
    });

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log('📺 Interstitial ad dismissed');
      adMobState.isInterstitialReady = false;
      // Load next interstitial
      prepareInterstitial();
    });

    // Rewarded listeners
    AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
      console.log('🎁 Rewarded ad loaded');
      adMobState.isRewardedReady = true;
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
      console.error('❌ Rewarded ad failed to load:', error);
      adMobState.isRewardedReady = false;
      // Retry loading after a delay
      setTimeout(() => prepareRewarded(), 30000);
    });

    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('🎁 Rewarded ad dismissed');
      adMobState.isRewardedReady = false;
      // Load next rewarded ad
      prepareRewarded();
    });

    AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
      console.log('🎁 User earned reward:', reward);
      // Notify all registered callbacks
      rewardCallbacks.forEach(callback => callback({ type: reward.type, amount: reward.amount }));
    });

  } catch (error) {
    console.error('❌ Failed to setup ad listeners:', error);
  }
};

/**
 * Show banner ad
 * 
 * @param position - 'top' or 'bottom'
 */
export const showBanner = async (position: 'top' | 'bottom' = 'bottom'): Promise<void> => {
  if (!adMobState.isAvailable) {
    console.log('📱 AdMob: Not available, skipping banner');
    return;
  }

  try {
    const { AdMob, BannerAdPosition, BannerAdSize } = await import('@capacitor-community/admob');

    const options = {
      adId: ADMOB_CONFIG.banner.android,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: import.meta.env.DEV,
    };

    await AdMob.showBanner(options);

    adMobState.isBannerVisible = true;
    console.log('✅ Banner ad shown');
  } catch (error) {
    console.error('❌ Failed to show banner:', error);
  }
};

/**
 * Hide banner ad
 */
export const hideBanner = async (): Promise<void> => {
  if (!adMobState.isAvailable || !adMobState.isBannerVisible) {
    return;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.hideBanner();
    adMobState.isBannerVisible = false;
    console.log('✅ Banner ad hidden');
  } catch (error) {
    console.error('❌ Failed to hide banner:', error);
  }
};

/**
 * Remove banner ad completely
 */
export const removeBanner = async (): Promise<void> => {
  if (!adMobState.isAvailable) {
    return;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.removeBanner();
    adMobState.isBannerVisible = false;
    console.log('✅ Banner ad removed');
  } catch (error) {
    console.error('❌ Failed to remove banner:', error);
  }
};

/**
 * Prepare interstitial ad for showing later
 */
export const prepareInterstitial = async (): Promise<void> => {
  if (!adMobState.isAvailable) {
    console.log('📱 AdMob: Not available, skipping interstitial preparation');
    return;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');

    const options = {
      adId: ADMOB_CONFIG.interstitial.android,
      isTesting: import.meta.env.DEV,
    };

    await AdMob.prepareInterstitial(options);

    console.log('✅ Interstitial ad prepared');
  } catch (error) {
    console.error('❌ Failed to prepare interstitial:', error);
  }
};

/**
 * Show interstitial ad
 * Should be called at natural break points (game over, level complete)
 */
export const showInterstitial = async (): Promise<boolean> => {
  if (!adMobState.isAvailable) {
    console.log('📱 AdMob: Not available, skipping interstitial');
    return false;
  }

  if (!adMobState.isInterstitialReady) {
    console.log('📺 Interstitial ad not ready');
    return false;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.showInterstitial();
    console.log('✅ Interstitial ad shown');
    return true;
  } catch (error) {
    console.error('❌ Failed to show interstitial:', error);
    return false;
  }
};

/**
 * Prepare rewarded ad for showing later
 */
export const prepareRewarded = async (): Promise<void> => {
  if (!adMobState.isAvailable) {
    console.log('📱 AdMob: Not available, skipping rewarded preparation');
    return;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');

    const options = {
      adId: ADMOB_CONFIG.rewarded.android,
      isTesting: import.meta.env.DEV,
    };

    await AdMob.prepareRewardVideoAd(options);

    console.log('✅ Rewarded ad prepared');
  } catch (error) {
    console.error('❌ Failed to prepare rewarded ad:', error);
  }
};

/**
 * Show rewarded ad
 * User watches video in exchange for coins
 * 
 * @returns Promise<boolean> - true if ad was shown successfully
 */
export const showRewarded = async (): Promise<boolean> => {
  if (!adMobState.isAvailable) {
    console.log('📱 AdMob: Not available, skipping rewarded');
    // In mock mode, still grant the reward for testing
    return true;
  }

  if (!adMobState.isRewardedReady) {
    console.log('🎁 Rewarded ad not ready');
    return false;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.showRewardVideoAd();
    console.log('✅ Rewarded ad shown');
    return true;
  } catch (error) {
    console.error('❌ Failed to show rewarded ad:', error);
    return false;
  }
};

/**
 * Register callback for when user earns a reward
 */
export const onRewardEarned = (callback: RewardCallback): () => void => {
  rewardCallbacks.push(callback);
  return () => {
    rewardCallbacks = rewardCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Check if ads should be shown
 * Premium users should not see ads
 */
export const shouldShowAds = (isPremium: boolean): boolean => {
  return !isPremium && adMobState.isAvailable;
};

/**
 * Check if rewarded ad is ready
 */
export const isRewardedReady = (): boolean => {
  return adMobState.isRewardedReady || !isNativeAndroid(); // Mock mode always ready
};

/**
 * Check if interstitial ad is ready
 */
export const isInterstitialReady = (): boolean => {
  return adMobState.isInterstitialReady;
};

/**
 * Check if AdMob is available
 */
export const isAdMobAvailable = (): boolean => {
  return adMobState.isAvailable;
};

/**
 * Get the coin reward amount for watching rewarded ad
 */
export const getRewardedAdCoinAmount = (): number => {
  return REWARDED_AD_COIN_REWARD;
};

/**
 * Track ad impression for analytics
 */
export const trackAdImpression = (adType: 'banner' | 'interstitial' | 'rewarded'): void => {
  // Track with Google Analytics or your analytics service
  const win = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof window !== 'undefined' && win.gtag) {
    win.gtag('event', 'ad_impression', {
      ad_type: adType,
      timestamp: Date.now(),
    });
  }
  console.log(`📊 Ad impression tracked: ${adType}`);
};
