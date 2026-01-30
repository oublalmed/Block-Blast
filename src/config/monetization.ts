export const PREMIUM_PRODUCT_ID = 'premium_pack';

export const PREMIUM_PACK = {
  id: PREMIUM_PRODUCT_ID,
  title: 'Premium Pack',
  description: 'Remove ads, 2x coins, and unlock premium features.',
  // Fallback price shown when Play Billing has not loaded yet.
  fallbackPrice: '$3.99',
};

export const COIN_PACKS = [
  {
    id: 'coins_100',
    coins: 100,
    fallbackPrice: '$0.99',
    badge: 'Starter',
  },
  {
    id: 'coins_500',
    coins: 500,
    fallbackPrice: '$2.99',
    badge: 'Popular',
  },
  {
    id: 'coins_1200',
    coins: 1200,
    fallbackPrice: '$5.99',
    badge: 'Best Value',
  },
];

// Google Play Billing requires Play Console product IDs.
export const PLAY_BILLING_PRODUCT_IDS = [
  PREMIUM_PRODUCT_ID,
  ...COIN_PACKS.map((pack) => pack.id),
];

// Google Play policy requires AdMob for in-app ads.
export const ADMOB_AD_UNITS = {
  banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};

export const REWARDED_AD_DEFAULT_COINS = 50;
export const INTERSTITIAL_MIN_INTERVAL_MS = 60_000;
export const INTERSTITIAL_GAME_INTERVAL = 3;

// __DEV__ is defined by React Native; fall back to false on web builds.
export const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
