/**
 * Google Play Billing Service
 * 
 * This service handles all in-app purchases (IAP) through Google Play Billing.
 * 
 * IMPORTANT: Google Play requires all payments to go through their billing system.
 * External payment processors (Stripe, PayPal, etc.) are NOT allowed on Google Play.
 * 
 * NATIVE ANDROID SETUP REQUIRED:
 * For production, you need to implement Google Play Billing in native Android code.
 * See GOOGLE_PLAY_SETUP.md for detailed instructions.
 * 
 * This service provides:
 * - Mock implementation for web development/testing
 * - Interface for native Android integration
 * - Product configuration and management
 * 
 * Product Types:
 * - Non-consumable: Premium Pack (one-time purchase, persists forever)
 * - Consumable: Coin packs (can be purchased multiple times)
 */

import { Capacitor, registerPlugin } from '@capacitor/core';

// Product IDs - these must match exactly what you create in Google Play Console
export const PRODUCT_IDS = {
  // Non-consumable product (premium pack)
  PREMIUM_PACK: 'premium_pack',
  
  // Consumable products (coin packs)
  COINS_100: 'coins_100',
  COINS_500: 'coins_500',
  COINS_1200: 'coins_1200',
} as const;

// Product configuration for UI display
export const PRODUCTS = {
  premium_pack: {
    id: PRODUCT_IDS.PREMIUM_PACK,
    type: 'non-consumable' as const,
    title: 'Premium Pack',
    description: 'Remove all ads, get 2x coins, and unlock premium features forever!',
    features: [
      'No Ads - Enjoy uninterrupted gameplay',
      '2x Coins - Double all coin rewards',
      'Exclusive Pieces - Special block designs',
      'Daily Bonus - 100 free coins daily',
    ],
    // Price will be fetched from Google Play
    fallbackPrice: '$3.99',
  },
  coins_100: {
    id: PRODUCT_IDS.COINS_100,
    type: 'consumable' as const,
    title: '100 Coins',
    description: 'A small pack of coins to get you started',
    coinAmount: 100,
    fallbackPrice: '$0.99',
    emoji: '💰',
  },
  coins_500: {
    id: PRODUCT_IDS.COINS_500,
    type: 'consumable' as const,
    title: '500 Coins',
    description: 'A medium pack of coins',
    coinAmount: 500,
    fallbackPrice: '$2.99',
    emoji: '💎',
    badge: 'Popular',
  },
  coins_1200: {
    id: PRODUCT_IDS.COINS_1200,
    type: 'consumable' as const,
    title: '1200 Coins',
    description: 'A large pack of coins with bonus!',
    coinAmount: 1200,
    fallbackPrice: '$4.99',
    emoji: '👑',
    badge: 'Best Value',
  },
} as const;

// Types for billing operations
export interface ProductDetails {
  productId: string;
  title: string;
  description: string;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  type: 'inapp' | 'subs';
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  purchaseToken?: string;
  error?: string;
}

export interface BillingState {
  isInitialized: boolean;
  isAvailable: boolean;
  products: Map<string, ProductDetails>;
  ownedPurchases: string[];
}

// Native billing plugin interface
// This will be implemented in native Android code
interface BillingPlugin {
  initialize(): Promise<void>;
  getProducts(options: { productIds: string[] }): Promise<{ products: ProductDetails[] }>;
  purchase(options: { productId: string }): Promise<{ success: boolean; purchaseToken?: string }>;
  consumePurchase(options: { purchaseToken: string }): Promise<void>;
  acknowledgePurchase(options: { purchaseToken: string }): Promise<void>;
  restorePurchases(): Promise<{ purchases: Array<{ productId: string; purchaseState: number }> }>;
  addListener(event: string, callback: (data: unknown) => void): Promise<{ remove: () => void }>;
}

// Register native plugin (will be implemented in Android)
let BillingNative: BillingPlugin | null = null;

try {
  BillingNative = registerPlugin<BillingPlugin>('Billing');
} catch {
  console.log('Billing plugin not available');
}

// Billing state
const billingState: BillingState = {
  isInitialized: false,
  isAvailable: false,
  products: new Map(),
  ownedPurchases: [],
};

// Callbacks for purchase events
type PurchaseCallback = (result: PurchaseResult) => void;
let purchaseCallbacks: PurchaseCallback[] = [];

/**
 * Check if we're running on a native Android platform
 * Google Play Billing is only available on Android
 */
export const isNativeAndroid = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

/**
 * Initialize Google Play Billing
 * Must be called before any billing operations
 * 
 * @returns Promise<boolean> - true if billing is available and initialized
 */
export const initializeBilling = async (): Promise<boolean> => {
  // Only initialize on native Android
  if (!isNativeAndroid()) {
    console.log('📱 Billing: Not on native Android, using mock mode');
    billingState.isInitialized = true;
    billingState.isAvailable = false;
    return false;
  }

  if (!BillingNative) {
    console.log('📱 Billing: Native plugin not available, using mock mode');
    billingState.isInitialized = true;
    billingState.isAvailable = false;
    return false;
  }

  try {
    // Initialize the billing client
    await BillingNative.initialize();
    
    billingState.isInitialized = true;
    billingState.isAvailable = true;
    
    console.log('✅ Google Play Billing initialized successfully');
    
    // Set up purchase listener
    await BillingNative.addListener('purchaseUpdated', (purchase) => {
      handlePurchaseUpdate(purchase as { 
        productId: string; 
        purchaseToken: string;
        purchaseState: number;
      });
    });

    // Load products
    await loadProducts();
    
    // Restore purchases (check for existing premium)
    await restorePurchases();
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Play Billing:', error);
    billingState.isInitialized = true;
    billingState.isAvailable = false;
    return false;
  }
};

/**
 * Load product details from Google Play
 */
export const loadProducts = async (): Promise<void> => {
  if (!billingState.isAvailable || !BillingNative) {
    console.log('📱 Billing: Not available, skipping product load');
    return;
  }

  try {
    const productIds = Object.values(PRODUCT_IDS);
    
    const result = await BillingNative.getProducts({ productIds });

    // Store product details
    result.products?.forEach((product: ProductDetails) => {
      billingState.products.set(product.productId, product);
    });

    console.log('✅ Products loaded:', billingState.products.size);
  } catch (error) {
    console.error('❌ Failed to load products:', error);
  }
};

/**
 * Get product details by ID
 * Returns Google Play price if available, otherwise fallback price
 */
export const getProductDetails = (productId: string): {
  title: string;
  description: string;
  price: string;
  features?: readonly string[];
  coinAmount?: number;
  badge?: string;
  emoji?: string;
} | null => {
  const productConfig = PRODUCTS[productId as keyof typeof PRODUCTS];
  if (!productConfig) return null;

  const googlePlayProduct = billingState.products.get(productId);
  
  return {
    title: googlePlayProduct?.title || productConfig.title,
    description: googlePlayProduct?.description || productConfig.description,
    price: googlePlayProduct?.price || productConfig.fallbackPrice,
    features: 'features' in productConfig ? productConfig.features : undefined,
    coinAmount: 'coinAmount' in productConfig ? productConfig.coinAmount : undefined,
    badge: 'badge' in productConfig ? productConfig.badge : undefined,
    emoji: 'emoji' in productConfig ? productConfig.emoji : undefined,
  };
};

/**
 * Purchase a product through Google Play Billing
 * 
 * @param productId - The product ID to purchase
 * @returns Promise<PurchaseResult>
 */
export const purchaseProduct = async (productId: string): Promise<PurchaseResult> => {
  // Mock purchase for non-Android platforms (development/testing)
  if (!billingState.isAvailable || !BillingNative) {
    console.log('📱 Billing: Mock purchase for', productId);
    
    // Simulate successful purchase after a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result: PurchaseResult = {
      success: true,
      productId,
      purchaseToken: 'mock_token_' + Date.now(),
    };
    
    // Trigger callbacks for mock purchase
    purchaseCallbacks.forEach(callback => callback(result));
    
    return result;
  }

  try {
    console.log('🛒 Initiating purchase for:', productId);
    
    // Start the purchase flow
    const result = await BillingNative.purchase({ productId });

    if (result.success) {
      return {
        success: true,
        productId,
        purchaseToken: result.purchaseToken,
      };
    } else {
      return {
        success: false,
        productId,
        error: 'Purchase failed',
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Purchase failed:', errorMessage);
    
    // Check for user cancellation
    if (errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
      return {
        success: false,
        productId,
        error: 'Purchase cancelled by user',
      };
    }
    
    return {
      success: false,
      productId,
      error: errorMessage,
    };
  }
};

/**
 * Handle purchase updates from Google Play
 */
const handlePurchaseUpdate = async (purchase: {
  productId: string;
  purchaseToken: string;
  purchaseState: number;
}) => {
  console.log('📦 Purchase update received:', purchase);
  
  // Purchase states: 0 = unspecified, 1 = purchased, 2 = pending
  if (purchase.purchaseState === 1) {
    const productConfig = PRODUCTS[purchase.productId as keyof typeof PRODUCTS];
    
    if (productConfig?.type === 'consumable') {
      // Consume the purchase so it can be bought again
      await consumePurchase(purchase.purchaseToken);
    } else {
      // Non-consumable: acknowledge the purchase
      await acknowledgePurchase(purchase.purchaseToken);
      billingState.ownedPurchases.push(purchase.productId);
    }

    // Notify callbacks
    purchaseCallbacks.forEach(callback => {
      callback({
        success: true,
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
      });
    });
  }
};

/**
 * Consume a consumable purchase (coins)
 * This allows the product to be purchased again
 */
const consumePurchase = async (purchaseToken: string): Promise<void> => {
  if (!billingState.isAvailable || !BillingNative) return;

  try {
    await BillingNative.consumePurchase({ purchaseToken });
    console.log('✅ Purchase consumed');
  } catch (error) {
    console.error('❌ Failed to consume purchase:', error);
  }
};

/**
 * Acknowledge a non-consumable purchase (premium)
 * Required within 3 days or Google will refund
 */
const acknowledgePurchase = async (purchaseToken: string): Promise<void> => {
  if (!billingState.isAvailable || !BillingNative) return;

  try {
    await BillingNative.acknowledgePurchase({ purchaseToken });
    console.log('✅ Purchase acknowledged');
  } catch (error) {
    console.error('❌ Failed to acknowledge purchase:', error);
  }
};

/**
 * Restore previous purchases
 * Called on app startup to restore premium status
 */
export const restorePurchases = async (): Promise<string[]> => {
  if (!billingState.isAvailable || !BillingNative) {
    console.log('📱 Billing: Not available, skipping restore');
    return [];
  }

  try {
    const result = await BillingNative.restorePurchases();
    
    const restoredProducts: string[] = [];
    
    result.purchases?.forEach((purchase: { productId: string; purchaseState: number }) => {
      if (purchase.purchaseState === 1) {
        restoredProducts.push(purchase.productId);
        if (!billingState.ownedPurchases.includes(purchase.productId)) {
          billingState.ownedPurchases.push(purchase.productId);
        }
      }
    });

    console.log('✅ Purchases restored:', restoredProducts);
    return restoredProducts;
  } catch (error) {
    console.error('❌ Failed to restore purchases:', error);
    return [];
  }
};

/**
 * Check if user owns a specific product
 */
export const ownsProduct = (productId: string): boolean => {
  return billingState.ownedPurchases.includes(productId);
};

/**
 * Check if user has premium status
 */
export const hasPremium = (): boolean => {
  return ownsProduct(PRODUCT_IDS.PREMIUM_PACK);
};

/**
 * Register a callback for purchase updates
 */
export const onPurchaseUpdate = (callback: PurchaseCallback): () => void => {
  purchaseCallbacks.push(callback);
  return () => {
    purchaseCallbacks = purchaseCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Get all loaded products
 */
export const getAllProducts = (): Map<string, ProductDetails> => {
  return billingState.products;
};

/**
 * Check billing availability
 */
export const isBillingAvailable = (): boolean => {
  return billingState.isAvailable;
};

/**
 * Get coin amount for a product
 */
export const getCoinAmountForProduct = (productId: string): number => {
  const productConfig = PRODUCTS[productId as keyof typeof PRODUCTS];
  if (productConfig && 'coinAmount' in productConfig) {
    return productConfig.coinAmount;
  }
  return 0;
};
