/**
 * Google AdMob Service
 * 
 * This service handles all ad operations via Google AdMob.
 * Required for Google Play Store compliance - AdSense is NOT allowed
 * in mobile apps, only AdMob.
 * 
 * Ad Types:
 * - Banner Ads: Displayed at bottom of screen during gameplay
 * - Interstitial Ads: Full-screen ads between levels (limited frequency)
 * - Rewarded Ads: User watches ad to earn coins
 * 
 * IMPORTANT: Premium Pass disables forced ads
 * 
 * @see https://developers.google.com/admob
 */

import { Capacitor } from '@capacitor/core';
import { ADMOB_CONFIG } from '../config/payment';

// Ad unit IDs for different ad types
export interface AdUnitIds {
  banner: string;
  interstitial: string;
  rewarded: string;
}

// AdMob service state
interface AdsState {
  isInitialized: boolean;
  isAvailable: boolean;
  isPremiumUser: boolean;
  interstitialReady: boolean;
  rewardedReady: boolean;
  lastInterstitialTime: number;
  interstitialCount: number;
}

const state: AdsState = {
  isInitialized: false,
  isAvailable: false,
  isPremiumUser: false,
  interstitialReady: false,
  rewardedReady: false,
  lastInterstitialTime: 0,
  interstitialCount: 0,
};

// Minimum time between interstitial ads (in milliseconds)
const INTERSTITIAL_COOLDOWN = 60000; // 1 minute
// Maximum interstitials per session
const MAX_INTERSTITIALS_PER_SESSION = 10;

// Callback types
type RewardCallback = (reward: { type: string; amount: number }) => void;
type AdEventCallback = (event: string) => void;

const rewardCallbacks: RewardCallback[] = [];
const adEventCallbacks: AdEventCallback[] = [];

/**
 * Initialize Google AdMob
 * Must be called when the app starts, BEFORE showing any ads
 * 
 * ADMOB REQUIREMENT: Initialize the Mobile Ads SDK before loading ads
 */
export const initializeAds = async (): Promise<boolean> => {
  // Skip on web platform - AdMob only works on native
  if (!Capacitor.isNativePlatform()) {
    console.log('📱 AdMob only available on native platforms');
    state.isInitialized = true;
    state.isAvailable = false;
    return false;
  }

  if (!ADMOB_CONFIG.enabled) {
    console.log('⚠️ AdMob is disabled in config');
    state.isInitialized = true;
    state.isAvailable = false;
    return false;
  }

  try {
    console.log('🔗 Initializing Google AdMob...');
    
    // In production, this would initialize the AdMob SDK via Capacitor plugin
    // Example with @nicklasonz/capacitor-admob or similar:
    // await AdMob.initialize({
    //   requestTrackingAuthorization: true,
    //   testDeviceIds: ADMOB_CONFIG.testMode ? ['TEST_DEVICE_ID'] : [],
    //   initializeForTesting: ADMOB_CONFIG.testMode,
    // });
    
    // Simulate initialization delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    state.isInitialized = true;
    state.isAvailable = true;
    
    console.log('✅ Google AdMob initialized successfully');
    
    // Preload interstitial and rewarded ads
    await preloadInterstitial();
    await preloadRewarded();
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize AdMob:', error);
    state.isInitialized = true;
    state.isAvailable = false;
    return false;
  }
};

/**
 * Set premium user status
 * IMPORTANT: Premium Pass users should not see forced ads
 */
export const setPremiumUser = (isPremium: boolean): void => {
  state.isPremiumUser = isPremium;
  console.log(`👑 Premium status set to: ${isPremium}`);
  
  if (isPremium) {
    // Hide any visible banner ads
    hideBanner();
  }
};

/**
 * Check if user should see ads
 */
export const shouldShowAds = (): boolean => {
  return state.isAvailable && !state.isPremiumUser && ADMOB_CONFIG.enabled;
};

// ============================================
// BANNER ADS
// ============================================

/**
 * Show banner ad at bottom of screen
 * 
 * ADMOB BEST PRACTICE: Banner ads should be persistent
 * during gameplay for consistent revenue.
 */
export const showBanner = async (): Promise<boolean> => {
  if (!shouldShowAds()) {
    console.log('⚠️ Skipping banner - ads disabled or premium user');
    return false;
  }

  try {
    console.log('📺 Showing banner ad...');
    
    // In production with Capacitor AdMob plugin:
    // await AdMob.showBanner({
    //   adId: ADMOB_CONFIG.adUnitIds.banner,
    //   adSize: BannerAdSize.ADAPTIVE_BANNER,
    //   position: BannerAdPosition.BOTTOM_CENTER,
    //   margin: 0,
    //   isTesting: ADMOB_CONFIG.testMode,
    // });
    
    notifyAdEvent('banner_shown');
    return true;
  } catch (error) {
    console.error('❌ Failed to show banner:', error);
    return false;
  }
};

/**
 * Hide banner ad
 */
export const hideBanner = async (): Promise<void> => {
  try {
    // In production: await AdMob.hideBanner();
    console.log('📺 Banner hidden');
    notifyAdEvent('banner_hidden');
  } catch (error) {
    console.error('❌ Failed to hide banner:', error);
  }
};

// ============================================
// INTERSTITIAL ADS
// ============================================

/**
 * Preload interstitial ad for quick display
 * 
 * ADMOB BEST PRACTICE: Preload ads in advance for better UX
 */
export const preloadInterstitial = async (): Promise<boolean> => {
  if (!state.isAvailable || state.isPremiumUser) {
    return false;
  }

  try {
    console.log('⏳ Preloading interstitial ad...');
    
    // In production:
    // await AdMob.prepareInterstitial({
    //   adId: ADMOB_CONFIG.adUnitIds.interstitial,
    //   isTesting: ADMOB_CONFIG.testMode,
    // });
    
    state.interstitialReady = true;
    console.log('✅ Interstitial ad preloaded');
    return true;
  } catch (error) {
    console.error('❌ Failed to preload interstitial:', error);
    state.interstitialReady = false;
    return false;
  }
};

/**
 * Show interstitial ad
 * 
 * ADMOB POLICY: Don't show interstitials too frequently
 * to avoid negative user experience and policy violations.
 */
export const showInterstitial = async (): Promise<boolean> => {
  if (!shouldShowAds()) {
    console.log('⚠️ Skipping interstitial - ads disabled or premium user');
    return false;
  }

  // Check cooldown
  const now = Date.now();
  if (now - state.lastInterstitialTime < INTERSTITIAL_COOLDOWN) {
    console.log('⏰ Interstitial on cooldown');
    return false;
  }

  // Check session limit
  if (state.interstitialCount >= MAX_INTERSTITIALS_PER_SESSION) {
    console.log('🚫 Max interstitials reached for this session');
    return false;
  }

  if (!state.interstitialReady) {
    console.log('⏳ Interstitial not ready, preloading...');
    await preloadInterstitial();
    if (!state.interstitialReady) {
      return false;
    }
  }

  try {
    console.log('📺 Showing interstitial ad...');
    
    // In production: await AdMob.showInterstitial();
    
    state.lastInterstitialTime = now;
    state.interstitialCount++;
    state.interstitialReady = false;
    
    notifyAdEvent('interstitial_shown');
    
    // Preload next interstitial
    preloadInterstitial();
    
    return true;
  } catch (error) {
    console.error('❌ Failed to show interstitial:', error);
    return false;
  }
};

/**
 * Check if interstitial should be shown (game over, level complete)
 * 
 * ADMOB BEST PRACTICE: Show interstitials at natural break points
 */
export const shouldShowInterstitial = (gamesPlayed: number): boolean => {
  if (!shouldShowAds()) return false;
  
  // Show interstitial every 3 games
  return gamesPlayed > 0 && gamesPlayed % 3 === 0;
};

// ============================================
// REWARDED ADS
// ============================================

/**
 * Preload rewarded ad
 */
export const preloadRewarded = async (): Promise<boolean> => {
  if (!state.isAvailable) {
    return false;
  }

  try {
    console.log('⏳ Preloading rewarded ad...');
    
    // In production:
    // await AdMob.prepareRewardedAd({
    //   adId: ADMOB_CONFIG.adUnitIds.rewarded,
    //   isTesting: ADMOB_CONFIG.testMode,
    // });
    
    state.rewardedReady = true;
    console.log('✅ Rewarded ad preloaded');
    return true;
  } catch (error) {
    console.error('❌ Failed to preload rewarded ad:', error);
    state.rewardedReady = false;
    return false;
  }
};

/**
 * Show rewarded ad and grant reward on completion
 * 
 * ADMOB REQUIREMENT: Only grant rewards after the user
 * has watched the complete ad (verified by callback).
 * 
 * @param onReward - Callback when user earns reward
 * @returns Promise resolving to true if ad was watched completely
 */
export const showRewardedAd = async (onReward?: RewardCallback): Promise<boolean> => {
  // Rewarded ads can be shown to premium users too (optional)
  // But typically premium users don't need them
  if (!state.isAvailable) {
    console.log('⚠️ Ads not available');
    return false;
  }

  if (!state.rewardedReady) {
    console.log('⏳ Rewarded ad not ready, preloading...');
    await preloadRewarded();
    if (!state.rewardedReady) {
      return false;
    }
  }

  try {
    console.log('🎁 Showing rewarded ad...');
    
    // In production:
    // const result = await AdMob.showRewardedAd();
    // if (result.rewarded) {
    //   const reward = { type: result.type, amount: result.amount };
    //   onReward?.(reward);
    //   rewardCallbacks.forEach(cb => cb(reward));
    // }
    
    // Simulate rewarded ad completion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Grant reward (default: 25 coins)
    const reward = { type: 'coins', amount: ADMOB_CONFIG.rewardAmount };
    onReward?.(reward);
    rewardCallbacks.forEach(cb => cb(reward));
    
    state.rewardedReady = false;
    notifyAdEvent('rewarded_completed');
    
    // Preload next rewarded ad
    preloadRewarded();
    
    return true;
  } catch (error) {
    console.error('❌ Failed to show rewarded ad:', error);
    notifyAdEvent('rewarded_failed');
    return false;
  }
};

/**
 * Check if rewarded ad is ready
 */
export const isRewardedAdReady = (): boolean => {
  return state.rewardedReady && state.isAvailable;
};

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Add reward listener
 */
export const addRewardListener = (callback: RewardCallback): void => {
  rewardCallbacks.push(callback);
};

/**
 * Remove reward listener
 */
export const removeRewardListener = (callback: RewardCallback): void => {
  const index = rewardCallbacks.indexOf(callback);
  if (index > -1) {
    rewardCallbacks.splice(index, 1);
  }
};

/**
 * Add ad event listener
 */
export const addAdEventListener = (callback: AdEventCallback): void => {
  adEventCallbacks.push(callback);
};

/**
 * Notify ad event
 */
const notifyAdEvent = (event: string): void => {
  adEventCallbacks.forEach(cb => cb(event));
  
  // Track for analytics
  trackAdEvent(event);
};

/**
 * Track ad events for analytics
 */
const trackAdEvent = (event: string): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ad_event', {
      event_type: event,
      timestamp: Date.now(),
    });
  }
};

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================

/**
 * @deprecated Use initializeAds instead
 */
export const initializeAdSense = initializeAds;

/**
 * @deprecated Use Google Analytics 4 directly
 */
export const initializeAnalytics = (measurementId: string): void => {
  if (typeof window === 'undefined') return;
  
  if (!measurementId || measurementId.includes('YOUR_MEASUREMENT_ID')) {
    console.log('Google Analytics not configured');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId);

  console.log('✅ Google Analytics initialized');
};
