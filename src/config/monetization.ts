/**
 * Google Play monetization configuration.
 * Product IDs must exactly match your Google Play Console setup.
 */

export const PREMIUM_PRODUCT = {
  productId: 'premium_pack',
  title: 'Premium Pack',
  description: 'Remove ads, double coins, and unlock premium features.',
};

export const COIN_PACKS = [
  { productId: 'coins_100', coins: 100, badge: 'Starter' },
  { productId: 'coins_500', coins: 500, badge: 'Popular' },
  { productId: 'coins_1200', coins: 1200, badge: 'Best Value' },
];

export const BILLING_PRODUCT_IDS = [
  PREMIUM_PRODUCT.productId,
  ...COIN_PACKS.map((pack) => pack.productId),
];

// AdMob unit IDs (replace with production IDs before release).
export const ADMOB_AD_UNIT_IDS = {
  banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};

// Rewarded ad payout in coins.
export const REWARDED_AD_COINS = 50;

// Limit interstitial frequency to protect retention and policy compliance.
export const INTERSTITIAL_COOLDOWN_MS = 2 * 60 * 1000;
