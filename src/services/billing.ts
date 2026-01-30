/**
 * Google Play Billing Service (DEPRECATED)
 *
 * This project no longer uses in-app purchases. Monetization is handled
 * exclusively through ads and rewarded ads, so this service is not used.
 *
 * @deprecated IAP removed. Keep only for legacy reference.
 * @see https://developer.android.com/google/play/billing
 */

import { Capacitor } from '@capacitor/core';

// Product IDs - These must match exactly with Google Play Console configuration
export const PRODUCT_IDS = {
  // Non-consumable product
  PREMIUM_PACK: 'premium_pack',
  // Consumable products
  COINS_100: 'coins_100',
  COINS_500: 'coins_500',
  COINS_1200: 'coins_1200',
} as const;

// Product types for Google Play Billing
export type ProductType = 'inapp' | 'subs';

// Product details returned from Google Play
export interface ProductDetails {
  productId: string;
  title: string;
  description: string;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  type: ProductType;
}

// Purchase result from Google Play
export interface PurchaseResult {
  productId: string;
  purchaseToken: string;
  orderId: string;
  purchaseTime: number;
  acknowledged: boolean;
}

// Billing service state
interface BillingState {
  isInitialized: boolean;
  isAvailable: boolean;
  products: Map<string, ProductDetails>;
  ownedProducts: Set<string>;
}

const state: BillingState = {
  isInitialized: false,
  isAvailable: false,
  products: new Map(),
  ownedProducts: new Set(),
};

// Callback for purchase updates
type PurchaseListener = (purchase: PurchaseResult) => void;
const purchaseListeners: PurchaseListener[] = [];

/**
 * Initialize Google Play Billing connection
 * Must be called when the app starts
 * 
 * GOOGLE PLAY REQUIREMENT: The billing client must be connected
 * before any billing operations can be performed.
 */
export const initializeBilling = async (): Promise<boolean> => {
  // Only available on native Android platform
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    console.log('📱 Google Play Billing only available on Android');
    state.isInitialized = true;
    state.isAvailable = false;
    return false;
  }

  try {
    // In a real implementation, this would connect to Google Play Billing Library
    // via a Capacitor plugin like @nicklasonz/capacitor-google-play-billing
    // or a custom native bridge
    
    // For now, we'll simulate the connection for development
    console.log('🔗 Connecting to Google Play Billing...');
    
    // Simulate async connection
    await new Promise(resolve => setTimeout(resolve, 100));
    
    state.isInitialized = true;
    state.isAvailable = true;
    
    console.log('✅ Google Play Billing initialized successfully');
    
    // Query owned purchases to restore premium status
    await restorePurchases();
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Play Billing:', error);
    state.isInitialized = true;
    state.isAvailable = false;
    return false;
  }
};

/**
 * Check if billing is available
 */
export const isBillingAvailable = (): boolean => {
  return state.isAvailable;
};

/**
 * Query product details from Google Play
 * 
 * GOOGLE PLAY REQUIREMENT: Always fetch fresh product details
 * to display current prices in user's local currency.
 */
export const queryProducts = async (productIds: string[]): Promise<ProductDetails[]> => {
  if (!state.isAvailable) {
    console.log('⚠️ Billing not available, returning mock products');
    return getMockProducts(productIds);
  }

  try {
    // In production, this calls Google Play Billing Library's queryProductDetails
    // The native code would return localized prices based on user's Play account
    
    console.log('🔍 Querying products:', productIds);
    
    // For development, return mock products with realistic data
    const products = getMockProducts(productIds);
    
    // Cache products
    products.forEach(product => {
      state.products.set(product.productId, product);
    });
    
    return products;
  } catch (error) {
    console.error('❌ Failed to query products:', error);
    return [];
  }
};

/**
 * Get mock products for development/web testing
 * In production on Android, real prices come from Google Play
 */
const getMockProducts = (productIds: string[]): ProductDetails[] => {
  const mockData: Record<string, ProductDetails> = {
    [PRODUCT_IDS.PREMIUM_PACK]: {
      productId: PRODUCT_IDS.PREMIUM_PACK,
      title: 'Premium Pack',
      description: 'Remove ads, get 2x coins, and unlock premium features',
      price: '$3.99',
      priceAmountMicros: 3990000,
      priceCurrencyCode: 'USD',
      type: 'inapp',
    },
    [PRODUCT_IDS.COINS_100]: {
      productId: PRODUCT_IDS.COINS_100,
      title: '100 Coins',
      description: 'A small pack of coins',
      price: '$0.99',
      priceAmountMicros: 990000,
      priceCurrencyCode: 'USD',
      type: 'inapp',
    },
    [PRODUCT_IDS.COINS_500]: {
      productId: PRODUCT_IDS.COINS_500,
      title: '500 Coins',
      description: 'A medium pack of coins - Popular!',
      price: '$2.99',
      priceAmountMicros: 2990000,
      priceCurrencyCode: 'USD',
      type: 'inapp',
    },
    [PRODUCT_IDS.COINS_1200]: {
      productId: PRODUCT_IDS.COINS_1200,
      title: '1200 Coins',
      description: 'A large pack of coins - Best Value!',
      price: '$4.99',
      priceAmountMicros: 4990000,
      priceCurrencyCode: 'USD',
      type: 'inapp',
    },
  };

  return productIds
    .filter(id => mockData[id])
    .map(id => mockData[id]);
};

/**
 * Purchase a product via Google Play
 * 
 * GOOGLE PLAY REQUIREMENT: All purchases must go through
 * the Google Play Billing Library. No external payment links allowed.
 * 
 * @param productId - The product to purchase
 * @returns Purchase result or null if failed/cancelled
 */
export const purchaseProduct = async (productId: string): Promise<PurchaseResult | null> => {
  if (!state.isAvailable) {
    console.log('⚠️ Billing not available');
    
    // For web development, simulate a successful purchase
    if (!Capacitor.isNativePlatform()) {
      return simulatePurchase(productId);
    }
    
    return null;
  }

  try {
    console.log('🛒 Initiating purchase for:', productId);
    
    // In production, this calls Google Play Billing Library's launchBillingFlow
    // The native code handles the entire purchase UI flow
    
    // For development, simulate purchase
    const result = await simulatePurchase(productId);
    
    if (result) {
      // Notify listeners
      purchaseListeners.forEach(listener => listener(result));
      
      // For consumables, acknowledge/consume immediately
      if (isConsumableProduct(productId)) {
        await consumePurchase(result.purchaseToken);
      } else {
        // For non-consumables (premium), track as owned
        state.ownedProducts.add(productId);
        await acknowledgePurchase(result.purchaseToken);
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Purchase failed:', error);
    return null;
  }
};

/**
 * Simulate a purchase for development
 */
const simulatePurchase = async (productId: string): Promise<PurchaseResult> => {
  // Simulate Google Play purchase dialog delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    productId,
    purchaseToken: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId: `GPA.${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    purchaseTime: Date.now(),
    acknowledged: false,
  };
};

/**
 * Check if a product is consumable (coins) or non-consumable (premium)
 */
const isConsumableProduct = (productId: string): boolean => {
  return [
    PRODUCT_IDS.COINS_100,
    PRODUCT_IDS.COINS_500,
    PRODUCT_IDS.COINS_1200,
  ].includes(productId as typeof PRODUCT_IDS.COINS_100);
};

/**
 * Consume a consumable purchase
 * 
 * GOOGLE PLAY REQUIREMENT: Consumable products MUST be consumed
 * after granting the entitlement, or the user won't be able to
 * purchase the same product again.
 */
export const consumePurchase = async (purchaseToken: string): Promise<boolean> => {
  try {
    console.log('🔄 Consuming purchase:', purchaseToken);
    
    // In production, this calls BillingClient.consumePurchase()
    // After consumption, the product can be purchased again
    
    return true;
  } catch (error) {
    console.error('❌ Failed to consume purchase:', error);
    return false;
  }
};

/**
 * Acknowledge a non-consumable purchase
 * 
 * GOOGLE PLAY REQUIREMENT: Non-consumable purchases MUST be acknowledged
 * within 3 days, or they will be automatically refunded.
 */
export const acknowledgePurchase = async (purchaseToken: string): Promise<boolean> => {
  try {
    console.log('✔️ Acknowledging purchase:', purchaseToken);
    
    // In production, this calls BillingClient.acknowledgePurchase()
    
    return true;
  } catch (error) {
    console.error('❌ Failed to acknowledge purchase:', error);
    return false;
  }
};

/**
 * Restore purchases
 * 
 * GOOGLE PLAY REQUIREMENT: Users must be able to restore their purchases
 * when reinstalling the app or using a new device.
 */
export const restorePurchases = async (): Promise<PurchaseResult[]> => {
  if (!state.isAvailable) {
    // Check local storage for premium status (fallback for web)
    const savedPremium = localStorage.getItem('block-blast-premium');
    if (savedPremium === 'true') {
      state.ownedProducts.add(PRODUCT_IDS.PREMIUM_PACK);
    }
    return [];
  }

  try {
    console.log('🔄 Restoring purchases...');
    
    // In production, this calls BillingClient.queryPurchasesAsync()
    // to get all purchases associated with the user's Google account
    
    // For development, check local storage
    const savedPremium = localStorage.getItem('block-blast-premium');
    if (savedPremium === 'true') {
      state.ownedProducts.add(PRODUCT_IDS.PREMIUM_PACK);
      console.log('✅ Premium status restored');
    }
    
    return [];
  } catch (error) {
    console.error('❌ Failed to restore purchases:', error);
    return [];
  }
};

/**
 * Check if user owns a specific product
 */
export const ownsProduct = (productId: string): boolean => {
  return state.ownedProducts.has(productId);
};

/**
 * Check if user has premium
 */
export const hasPremium = (): boolean => {
  return ownsProduct(PRODUCT_IDS.PREMIUM_PACK);
};

/**
 * Add purchase listener for real-time purchase updates
 */
export const addPurchaseListener = (listener: PurchaseListener): void => {
  purchaseListeners.push(listener);
};

/**
 * Remove purchase listener
 */
export const removePurchaseListener = (listener: PurchaseListener): void => {
  const index = purchaseListeners.indexOf(listener);
  if (index > -1) {
    purchaseListeners.splice(index, 1);
  }
};

/**
 * Get coins amount for a product
 */
export const getCoinsForProduct = (productId: string): number => {
  const coinsMap: Record<string, number> = {
    [PRODUCT_IDS.COINS_100]: 100,
    [PRODUCT_IDS.COINS_500]: 500,
    [PRODUCT_IDS.COINS_1200]: 1200,
  };
  return coinsMap[productId] || 0;
};

/**
 * Save premium status locally (for persistence across sessions)
 * Note: Real verification should always check with Google Play
 */
export const savePremiumStatus = (isPremium: boolean): void => {
  localStorage.setItem('block-blast-premium', isPremium ? 'true' : 'false');
  if (isPremium) {
    state.ownedProducts.add(PRODUCT_IDS.PREMIUM_PACK);
  } else {
    state.ownedProducts.delete(PRODUCT_IDS.PREMIUM_PACK);
  }
};
