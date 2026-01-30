import {
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getProducts,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type Product,
  type Purchase,
} from 'react-native-iap';
import { BILLING_PRODUCT_IDS, COIN_PACKS, PREMIUM_PRODUCT } from '../config/monetization';
import { useGameStore } from '../store/gameStore';

type ProductMap = Record<string, Product>;

let connectionReady = false;
let cachedProducts: ProductMap = {};
let purchaseUpdateSub: ReturnType<typeof purchaseUpdatedListener> | null = null;
let purchaseErrorSub: ReturnType<typeof purchaseErrorListener> | null = null;

const ensureConnection = async () => {
  if (connectionReady) {
    return;
  }

  const connected = await initConnection();
  connectionReady = connected;

  // Google Play requires clearing failed pending purchases on Android.
  if (connected) {
    await flushFailedPurchasesCachedAsPendingAndroid();
  }
};

const getPurchaseToken = (purchase: Purchase) =>
  purchase.purchaseToken || purchase.transactionId || purchase.transactionReceipt || '';

const getCoinPack = (productId: string) => COIN_PACKS.find((pack) => pack.productId === productId);

const grantEntitlement = (purchase: Purchase) => {
  const state = useGameStore.getState();
  if (purchase.productId === PREMIUM_PRODUCT.productId) {
    if (!state.isPremium) {
      state.activatePremiumPass();
    }
    return;
  }

  const pack = getCoinPack(purchase.productId);
  if (pack) {
    state.grantCoins(pack.coins);
  }
};

const handlePurchase = async (purchase: Purchase) => {
  const token = getPurchaseToken(purchase);
  const fallbackToken = token || `${purchase.productId}:${purchase.transactionDate ?? ''}`;
  const state = useGameStore.getState();
  const isConsumable = !!getCoinPack(purchase.productId);

  if (!state.hasProcessedPurchase(fallbackToken)) {
    grantEntitlement(purchase);
    state.markPurchaseProcessed(fallbackToken);
  }

  // Google Play Billing requires every purchase to be acknowledged/consumed.
  try {
    await finishTransaction({ purchase, isConsumable });
  } catch (error) {
    console.error('Failed to finish transaction:', error);
  }
};

export const initializeBilling = async () => {
  await ensureConnection();

  if (!purchaseUpdateSub) {
    purchaseUpdateSub = purchaseUpdatedListener(handlePurchase);
  }

  if (!purchaseErrorSub) {
    purchaseErrorSub = purchaseErrorListener((error) => {
      console.error('IAP error:', error);
    });
  }
};

export const endBillingConnection = async () => {
  purchaseUpdateSub?.remove();
  purchaseErrorSub?.remove();
  purchaseUpdateSub = null;
  purchaseErrorSub = null;

  if (connectionReady) {
    await endConnection();
    connectionReady = false;
  }
};

export const fetchProducts = async (): Promise<ProductMap> => {
  await ensureConnection();

  const products = await getProducts({ skus: BILLING_PRODUCT_IDS } as any);
  cachedProducts = products.reduce<ProductMap>((acc, product) => {
    acc[product.productId] = product;
    return acc;
  }, {});
  return cachedProducts;
};

export const getCachedProducts = () => cachedProducts;

export const purchaseProduct = async (productId: string) => {
  await ensureConnection();

  // requestPurchase signature differs across versions; use a safe wrapper.
  const request = requestPurchase as unknown as (args: any) => Promise<void>;
  try {
    await request({ sku: productId });
  } catch (error) {
    await request({ skus: [productId] });
  }
};

export const restorePurchases = async () => {
  await ensureConnection();

  const purchases = await getAvailablePurchases();
  const state = useGameStore.getState();

  const hasPremium = purchases.some((purchase) => purchase.productId === PREMIUM_PRODUCT.productId);
  if (hasPremium && !state.isPremium) {
    state.activatePremiumPass();
  }

  purchases.forEach((purchase) => {
    const token = getPurchaseToken(purchase);
    if (token) {
      state.markPurchaseProcessed(token);
    }
  });
};
