import {
  initConnection,
  endConnection,
  fetchProducts as iapFetchProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  type Product,
  type Purchase,
} from 'react-native-iap';
import { COIN_PACKS, PLAY_BILLING_PRODUCT_IDS, PREMIUM_PRODUCT_ID } from '../config/monetization';
import { useGameStore } from '../store/gameStore';

let purchaseUpdateSub: ReturnType<typeof purchaseUpdatedListener> | null = null;
let purchaseErrorSub: ReturnType<typeof purchaseErrorListener> | null = null;

const applyPurchase = async (purchase: Purchase) => {
  const { activatePremiumPass, addCoins } = useGameStore.getState();
  const productId = purchase.productId;

  if (productId === PREMIUM_PRODUCT_ID) {
    // Google Play requires acknowledging non-consumable purchases.
    activatePremiumPass();
    await finishTransaction({ purchase, isConsumable: false });
    return;
  }

  const coinPack = COIN_PACKS.find((pack) => pack.id === productId);
  if (coinPack) {
    // Google Play requires consuming consumable purchases.
    addCoins(coinPack.coins, { applyPremiumMultiplier: false });
    await finishTransaction({ purchase, isConsumable: true });
  }
};

export const initializeBilling = async () => {
  await initConnection();

  purchaseUpdateSub?.remove();
  purchaseErrorSub?.remove();

  purchaseUpdateSub = purchaseUpdatedListener(async (purchase) => {
    try {
      await applyPurchase(purchase);
    } catch (error) {
      console.error('Failed to finalize purchase:', error);
    }
  });

  purchaseErrorSub = purchaseErrorListener((error) => {
    console.warn('Purchase error:', error);
  });
};

export const endBilling = () => {
  purchaseUpdateSub?.remove();
  purchaseUpdateSub = null;
  purchaseErrorSub?.remove();
  purchaseErrorSub = null;
  endConnection();
};

export const fetchProducts = async (): Promise<Product[]> => {
  return iapFetchProducts({ skus: PLAY_BILLING_PRODUCT_IDS, type: 'in-app' });
};

export const purchaseProduct = async (productId: string) => {
  // Google Play policy: all in-app purchases must go through Play Billing.
  return requestPurchase({
    type: 'in-app',
    request: {
      google: { skus: [productId] },
    },
  });
};

export const restorePurchases = async () => {
  // Required for users who reinstall the app or change devices.
  const purchases = await getAvailablePurchases();
  const hasPremium = purchases.some((purchase) => purchase.productId === PREMIUM_PRODUCT_ID);

  if (hasPremium) {
    useGameStore.getState().activatePremiumPass();
  }

  return hasPremium;
};
