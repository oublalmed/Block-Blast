/**
 * Monetization & Ad Rewards Configuration
 *
 * IMPORTANT: This app is fully free for players.
 * Revenue comes from ads (AdMob) and rewarded ads.
 * No in-app purchases are used.
 *
 * @see https://developers.google.com/admob
 */

// ============================================
// GOOGLE ADMOB CONFIGURATION
// ============================================

/**
 * AdMob Configuration
 *
 * Ad Unit IDs - Create these in AdMob Console:
 * 1. Go to apps.admob.com
 * 2. Add your app (use Android package name)
 * 3. Create ad units for each type
 * 4. Replace the IDs below with your actual ad unit IDs
 *
 * TEST IDS (for development):
 * - Banner: ca-app-pub-3940256099942544/6300978111
 * - Interstitial: ca-app-pub-3940256099942544/1033173712
 * - Rewarded: ca-app-pub-3940256099942544/5224354917
 */
export const ADMOB_CONFIG = {
  // Enable/disable ads globally
  enabled: import.meta.env.VITE_ADMOB_ENABLED === 'true' || true,

  // Use test ads during development
  testMode: import.meta.env.MODE !== 'production',

  // Optional comma-separated test device IDs for AdMob
  testDeviceIds: (import.meta.env.VITE_ADMOB_TEST_DEVICE_IDS || '')
    .split(',')
    .map((id: string) => id.trim())
    .filter(Boolean),

  // AdMob App ID (required in app config, not here)
  // Configure in capacitor.config.ts or AndroidManifest.xml
  appId: import.meta.env.VITE_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713', // Test App ID

  // Ad Unit IDs
  adUnitIds: {
    // Banner ad shown during gameplay
    banner: import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111', // Test ID

    // Interstitial shown between levels/game over
    interstitial: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712', // Test ID

    // Rewarded ad for earning coins
    rewarded: import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917', // Test ID
  },

  // Reward configuration
  rewardAmount: 25, // Coins given for watching a rewarded ad
  premiumUnlockAds: 10, // Rewarded ads needed to unlock Premium Pass

  // Interstitial ad frequency
  interstitialFrequency: 3, // Show after every N games
  interstitialCooldown: 60000, // Minimum ms between interstitials
} as const;

// ============================================
// ANALYTICS CONFIGURATION
// ============================================

/**
 * Google Analytics 4 Configuration
 * For tracking revenue and user behavior
 */
export const ANALYTICS_CONFIG = {
  // GA4 Measurement ID
  measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',

  // Enable revenue tracking
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true' || false,
} as const;
