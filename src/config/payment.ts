/**
 * Payment Configuration
 * Configure your Stripe keys and pricing here
 */

// Stripe Configuration
export const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  // Get this from: https://dashboard.stripe.com/apikeys
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',

  // For production, use environment variables:
  // publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
};

// Product Pricing
export const PREMIUM_PASS = {
  name: 'Premium Pass',
  description: 'Unlock all premium features: No ads, 2x rewards, exclusive pieces, and daily bonuses',
  price: 3.99,
  currency: 'USD',
  // Replace with your actual Stripe Price ID
  // Create this in Stripe Dashboard under Products
  priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_YOUR_PRICE_ID_HERE',
};

// Coin Pack Pricing (for future implementation)
export const COIN_PACKS = [
  {
    id: 'coins_500',
    amount: 500,
    price: 0.99,
    currency: 'USD',
    priceId: import.meta.env.VITE_STRIPE_COINS_500_PRICE_ID || 'price_YOUR_PRICE_ID_HERE',
  },
  {
    id: 'coins_1200',
    amount: 1200,
    price: 1.99,
    currency: 'USD',
    priceId: import.meta.env.VITE_STRIPE_COINS_1200_PRICE_ID || 'price_YOUR_PRICE_ID_HERE',
    badge: 'Popular',
  },
  {
    id: 'coins_3000',
    amount: 3000,
    price: 4.99,
    currency: 'USD',
    priceId: import.meta.env.VITE_STRIPE_COINS_3000_PRICE_ID || 'price_YOUR_PRICE_ID_HERE',
  },
  {
    id: 'coins_10000',
    amount: 10000,
    price: 14.99,
    currency: 'USD',
    priceId: import.meta.env.VITE_STRIPE_COINS_10000_PRICE_ID || 'price_YOUR_PRICE_ID_HERE',
    badge: 'Best Value',
  },
];

// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Replace with your actual AdSense client ID
  // Get this from: https://www.google.com/adsense
  clientId: import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-YOUR_CLIENT_ID',

  // Ad slots for different positions
  adSlots: {
    bottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM || '1234567890',
    top: import.meta.env.VITE_ADSENSE_SLOT_TOP || '0987654321',
  },

  // Ad settings
  enabled: import.meta.env.VITE_ADSENSE_ENABLED === 'true' || false,
  testMode: import.meta.env.NODE_ENV !== 'production',
};

// Revenue Tracking
export const REVENUE_TRACKING = {
  // Google Analytics 4 Measurement ID for tracking purchases
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-YOUR_MEASUREMENT_ID',

  // Enable revenue analytics
  enabled: import.meta.env.VITE_REVENUE_TRACKING_ENABLED === 'true' || false,
};
