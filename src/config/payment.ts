/**
 * Google Play Billing & AdMob Configuration
 * 
 * IMPORTANT: This app uses ONLY Google Play approved monetization:
 * - Google Play Billing for in-app purchases
 * - Google AdMob for advertisements
 * 
 * NO external payment systems (Stripe, PayPal, etc.) are used.
 * This is REQUIRED for Google Play Store compliance.
 * 
 * @see https://developer.android.com/google/play/billing
 * @see https://developers.google.com/admob
 */

// ============================================
// GOOGLE PLAY BILLING CONFIGURATION
// ============================================

/**
 * Product IDs - Must match EXACTLY with Google Play Console
 * 
 * To configure in Google Play Console:
 * 1. Go to Play Console > Your App > Monetize > Products > In-app products
 * 2. Create products with these exact IDs
 * 3. Set pricing in your preferred currency (will auto-convert for users)
 */
export const BILLING_PRODUCTS = {
  // Non-consumable: One-time purchase, permanent unlock
  premium_pack: {
    id: 'premium_pack',
    type: 'non-consumable' as const,
    name: 'Premium Pack',
    description: 'Remove all ads, get 2x coin rewards, and unlock premium features forever',
    benefits: [
      'No advertisements - ever!',
      '2x coin rewards on all games',
      'Exclusive premium block designs',
      '100 bonus coins daily',
      'Early access to new features',
    ],
  },
  
  // Consumables: Can be purchased multiple times
  coins_100: {
    id: 'coins_100',
    type: 'consumable' as const,
    name: '100 Coins',
    description: 'A small pack of coins to get started',
    coins: 100,
  },
  coins_500: {
    id: 'coins_500',
    type: 'consumable' as const,
    name: '500 Coins',
    description: 'A popular pack of coins',
    coins: 500,
    badge: 'Popular',
  },
  coins_1200: {
    id: 'coins_1200',
    type: 'consumable' as const,
    name: '1200 Coins',
    description: 'Best value pack of coins',
    coins: 1200,
    badge: 'Best Value',
  },
} as const;

/**
 * Premium Pass benefits configuration
 */
export const PREMIUM_BENEFITS = {
  noAds: true,
  doubleRewards: true,
  exclusivePieces: true,
  dailyBonus: true,
  dailyBonusAmount: 100,
} as const;

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
  rewardAmount: 25, // Coins given for watching rewarded ad
  
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

// ============================================
// DEPRECATED - REMOVED STRIPE CONFIGURATION
// ============================================

/**
 * @deprecated Stripe is NOT allowed on Google Play for digital goods
 * All payments must go through Google Play Billing
 * 
 * This section has been removed as it violates Google Play policies.
 * See: https://support.google.com/googleplay/android-developer/answer/9858738
 */

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all available coin pack IDs
 */
export const getCoinPackIds = (): string[] => {
  return [
    BILLING_PRODUCTS.coins_100.id,
    BILLING_PRODUCTS.coins_500.id,
    BILLING_PRODUCTS.coins_1200.id,
  ];
};

/**
 * Get coin amount for a product
 */
export const getCoinsForProduct = (productId: string): number => {
  const product = Object.values(BILLING_PRODUCTS).find(p => p.id === productId);
  if (product && 'coins' in product) {
    return product.coins;
  }
  return 0;
};

/**
 * Check if product is premium pack
 */
export const isPremiumProduct = (productId: string): boolean => {
  return productId === BILLING_PRODUCTS.premium_pack.id;
};

/**
 * Check if product is consumable
 */
export const isConsumableProduct = (productId: string): boolean => {
  const product = Object.values(BILLING_PRODUCTS).find(p => p.id === productId);
  return product?.type === 'consumable';
};
