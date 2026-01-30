/**
 * Google Play Monetization Configuration
 * 
 * IMPORTANT: This app is designed for Google Play distribution.
 * All payments MUST go through Google Play Billing.
 * External payment processors (Stripe, PayPal, etc.) are NOT allowed.
 * 
 * Ads are served through Google AdMob (NOT AdSense, which is for web only).
 */

// ============================================
// GOOGLE PLAY BILLING CONFIGURATION
// ============================================

/**
 * Product IDs - Must match exactly what's configured in Google Play Console
 * Create these products in: Google Play Console > Your App > Monetize > Products
 */
export const GOOGLE_PLAY_PRODUCTS = {
  // Non-consumable product (one-time purchase, persists forever)
  PREMIUM_PACK: {
    productId: 'premium_pack',
    type: 'non-consumable' as const,
    name: 'Premium Pack',
    description: 'Remove all ads, get 2x coins, and unlock premium features forever!',
    // Note: Actual price is set in Google Play Console and fetched at runtime
    // This is just a fallback for display before Google Play data loads
    fallbackPrice: '$3.99',
    benefits: [
      { icon: '🚫', title: 'No Ads', description: 'Enjoy uninterrupted gameplay without any advertisements' },
      { icon: '⚡', title: 'Double Rewards', description: 'Earn 2x coins from games and challenges' },
      { icon: '🎁', title: 'Exclusive Pieces', description: 'Access to special block shapes and designs' },
      { icon: '⭐', title: 'Daily Bonus', description: 'Receive 100 bonus coins every day' },
    ],
  },

  // Consumable products (can be purchased multiple times)
  COINS_100: {
    productId: 'coins_100',
    type: 'consumable' as const,
    name: '100 Coins',
    description: 'A starter pack of coins',
    coinAmount: 100,
    fallbackPrice: '$0.99',
    emoji: '💰',
  },
  COINS_500: {
    productId: 'coins_500',
    type: 'consumable' as const,
    name: '500 Coins',
    description: 'A medium pack of coins',
    coinAmount: 500,
    fallbackPrice: '$2.99',
    emoji: '💎',
    badge: 'Popular',
  },
  COINS_1200: {
    productId: 'coins_1200',
    type: 'consumable' as const,
    name: '1200 Coins',
    description: 'Best value! Get bonus coins',
    coinAmount: 1200,
    fallbackPrice: '$4.99',
    emoji: '👑',
    badge: 'Best Value',
  },
} as const;

// Quick access to product IDs array
export const ALL_PRODUCT_IDS = [
  GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.productId,
  GOOGLE_PLAY_PRODUCTS.COINS_100.productId,
  GOOGLE_PLAY_PRODUCTS.COINS_500.productId,
  GOOGLE_PLAY_PRODUCTS.COINS_1200.productId,
];

// ============================================
// GOOGLE ADMOB CONFIGURATION
// ============================================

/**
 * AdMob Configuration
 * 
 * IMPORTANT: Replace test IDs with your actual AdMob unit IDs before publishing!
 * Test IDs are safe to use during development but will not generate revenue.
 * 
 * Get your AdMob IDs from: https://admob.google.com
 * 
 * Steps:
 * 1. Create an AdMob account
 * 2. Add your app to AdMob
 * 3. Create ad units (Banner, Interstitial, Rewarded)
 * 4. Replace the test IDs below with your actual IDs
 */
export const ADMOB_CONFIG = {
  // App ID (required for SDK initialization)
  // Find this in AdMob Console > Apps > Your App > App settings
  appId: {
    android: import.meta.env.VITE_ADMOB_APP_ID_ANDROID || 'ca-app-pub-3940256099942544~3347511713', // Test App ID
  },

  // Banner Ad Unit ID
  // Shows a small banner at the bottom of the screen
  banner: {
    // Test ID for development - Replace with your production ID!
    android: import.meta.env.VITE_ADMOB_BANNER_ANDROID || 'ca-app-pub-3940256099942544/6300978111',
  },

  // Interstitial Ad Unit ID
  // Full-screen ad shown between game sessions
  interstitial: {
    // Test ID for development - Replace with your production ID!
    android: import.meta.env.VITE_ADMOB_INTERSTITIAL_ANDROID || 'ca-app-pub-3940256099942544/1033173712',
  },

  // Rewarded Ad Unit ID
  // Video ad that rewards users with coins
  rewarded: {
    // Test ID for development - Replace with your production ID!
    android: import.meta.env.VITE_ADMOB_REWARDED_ANDROID || 'ca-app-pub-3940256099942544/5224354917',
  },

  // Ad behavior settings
  settings: {
    // Show interstitial ad every N games
    interstitialFrequency: 3,
    
    // Coins rewarded for watching a rewarded video ad
    rewardedAdCoins: 25,
    
    // Minimum time between interstitial ads (in seconds)
    interstitialCooldown: 60,
  },
};

// ============================================
// GOOGLE ANALYTICS CONFIGURATION (Optional)
// ============================================

/**
 * Revenue Tracking Configuration
 * Track purchases and ad revenue with Google Analytics
 */
export const ANALYTICS_CONFIG = {
  // Firebase/Google Analytics measurement ID
  measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
  
  // Enable tracking
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true' || false,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get product configuration by ID
 */
export const getProductConfig = (productId: string) => {
  return Object.values(GOOGLE_PLAY_PRODUCTS).find(p => p.productId === productId);
};

/**
 * Get coin amount for a product
 */
export const getCoinAmountForProduct = (productId: string): number => {
  const product = getProductConfig(productId);
  if (product && 'coinAmount' in product) {
    return product.coinAmount;
  }
  return 0;
};

/**
 * Check if a product is consumable
 */
export const isConsumableProduct = (productId: string): boolean => {
  const product = getProductConfig(productId);
  return product?.type === 'consumable';
};

/**
 * Check if a product is the premium pack
 */
export const isPremiumProduct = (productId: string): boolean => {
  return productId === GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.productId;
};
