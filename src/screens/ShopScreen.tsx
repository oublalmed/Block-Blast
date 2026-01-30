/**
 * Shop Screen - Google Play Billing Integration
 * 
 * This screen handles all in-app purchases via Google Play Billing.
 * NO external payment systems (Stripe, PayPal) are used.
 * 
 * Products:
 * - Premium Pack: One-time purchase (non-consumable)
 * - Coin Packs: Consumable purchases
 * 
 * @see https://developer.android.com/google/play/billing
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Zap, Gift, Star, X, ShoppingCart, Play, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect, useCallback } from 'react';
import { POWERUPS } from '../types/powerups';
import type { PowerUpType } from '../types/powerups';
import { 
  initializeBilling, 
  queryProducts, 
  purchaseProduct, 
  restorePurchases,
  PRODUCT_IDS,
  type ProductDetails,
  getCoinsForProduct,
  hasPremium,
  savePremiumStatus,
} from '../services/billing';
import { showRewardedAd, isRewardedAdReady } from '../services/ads';
import { BILLING_PRODUCTS } from '../config/payment';

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen = ({ onBack }: ShopScreenProps) => {
  const { premiumPass, activatePremiumPass, coins, buyPowerUp, powerUps, addCoins } = useGameStore();
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);

  // Initialize billing and fetch products
  useEffect(() => {
    const init = async () => {
      await initializeBilling();
      
      // Query all product details from Google Play
      const productIds = [
        PRODUCT_IDS.PREMIUM_PACK,
        PRODUCT_IDS.COINS_100,
        PRODUCT_IDS.COINS_500,
        PRODUCT_IDS.COINS_1200,
      ];
      
      const fetchedProducts = await queryProducts(productIds);
      setProducts(fetchedProducts);
      
      // Check if user already has premium
      if (hasPremium() && !premiumPass.active) {
        activatePremiumPass();
      }
    };
    
    init();
  }, [activatePremiumPass, premiumPass.active]);

  /**
   * Handle Premium Pack purchase via Google Play Billing
   * 
   * GOOGLE PLAY REQUIREMENT: All digital goods must be purchased
   * through Google Play Billing - no external payment links allowed.
   */
  const handlePurchasePremium = async () => {
    setIsProcessingPayment(true);
    try {
      // Initiate purchase through Google Play
      const result = await purchaseProduct(PRODUCT_IDS.PREMIUM_PACK);

      if (result) {
        // Purchase successful! Activate premium
        activatePremiumPass();
        savePremiumStatus(true);
        
        // Show success message
        alert('🎉 Premium Pack activated! Enjoy your benefits!');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('❌ Purchase failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  /**
   * Handle coin pack purchase via Google Play Billing
   */
  const handlePurchaseCoins = async (productId: string) => {
    setIsProcessingPayment(true);
    try {
      const result = await purchaseProduct(productId);

      if (result) {
        // Get coins amount and add to balance
        const coinsAmount = getCoinsForProduct(productId);
        addCoins(coinsAmount);
        
        alert(`🎉 ${coinsAmount} coins added to your balance!`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('❌ Purchase failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  /**
   * Restore purchases from Google Play
   * 
   * GOOGLE PLAY REQUIREMENT: Users must be able to restore
   * their purchases on reinstall or new device.
   */
  const handleRestorePurchases = async () => {
    setIsRestoringPurchases(true);
    try {
      await restorePurchases();
      
      if (hasPremium()) {
        activatePremiumPass();
        alert('✅ Premium status restored!');
      } else {
        alert('ℹ️ No previous purchases found.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('❌ Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoringPurchases(false);
    }
  };

  /**
   * Watch rewarded ad for free coins
   */
  const handleWatchAd = useCallback(async () => {
    const success = await showRewardedAd((reward) => {
      addCoins(reward.amount);
    });
    
    if (success) {
      alert('🎉 25 coins earned!');
    }
  }, [addCoins]);

  const handleBuyPowerUp = (type: PowerUpType, cost: number) => {
    const success = buyPowerUp(type, quantity, cost);
    if (success) {
      setSelectedPowerUp(null);
      setQuantity(1);
    } else {
      alert('Not enough coins! Play more to earn coins or purchase a coin pack.');
    }
  };

  // Get price for a product
  const getProductPrice = (productId: string): string => {
    const product = products.find(p => p.productId === productId);
    return product?.price || 'Loading...';
  };

  const benefits = [
    {
      icon: <X className="w-5 h-5" />,
      title: 'No Ads',
      description: 'Enjoy uninterrupted gameplay without any advertisements',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Double Rewards',
      description: 'Earn 2x coins from games and challenges',
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: 'Exclusive Pieces',
      description: 'Access to special block shapes and designs',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Daily Bonus',
      description: 'Receive 100 bonus coins every day',
    },
  ];

  // Coin packs with Google Play pricing
  const coinPacks = [
    { 
      productId: PRODUCT_IDS.COINS_100, 
      amount: BILLING_PRODUCTS.coins_100.coins, 
      emoji: '💰',
    },
    { 
      productId: PRODUCT_IDS.COINS_500, 
      amount: BILLING_PRODUCTS.coins_500.coins, 
      emoji: '💎', 
      badge: BILLING_PRODUCTS.coins_500.badge,
    },
    { 
      productId: PRODUCT_IDS.COINS_1200, 
      amount: BILLING_PRODUCTS.coins_1200.coins, 
      emoji: '👑', 
      badge: BILLING_PRODUCTS.coins_1200.badge,
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_50%)] animate-twinkle pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 pb-20 safe-area-padding max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="
              w-10 h-10
              bg-slate-800/50
              rounded-xl
              flex items-center justify-center
              text-white
              border border-white/10
              hover:bg-slate-700/50
              active:scale-95
              transition-all
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-white font-bold text-2xl">Shop</h1>

          <div className="w-10" /> {/* Spacer */}
        </motion.div>

        {/* Coins Balance */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-yellow-200/80 uppercase tracking-wider mb-1">
                Your Balance
              </div>
              <div className="text-3xl font-bold text-yellow-300">
                💰 {coins.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              {/* Watch Ad for Coins Button */}
              {!premiumPass.active && (
                <motion.button
                  onClick={handleWatchAd}
                  disabled={!isRewardedAdReady()}
                  className="
                    bg-gradient-to-r from-green-500 to-emerald-500
                    text-white font-semibold
                    px-4 py-2 rounded-xl
                    flex items-center gap-2
                    hover:scale-105 active:scale-95
                    transition-all
                    disabled:opacity-50
                  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  +25
                </motion.button>
              )}
              <div className="text-5xl">💎</div>
            </div>
          </div>
        </motion.div>

        {/* Coin Packs - Google Play Billing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-bold text-xl">Coin Packs</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {coinPacks.map((pack, index) => (
              <motion.button
                key={pack.productId}
                onClick={() => handlePurchaseCoins(pack.productId)}
                disabled={isProcessingPayment}
                className="
                  relative
                  bg-gradient-to-br from-yellow-500/20 to-orange-500/20
                  rounded-2xl
                  p-4
                  text-white
                  shadow-lg
                  hover:scale-105
                  active:scale-95
                  transition-all
                  border-2 border-yellow-500/30
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={!isProcessingPayment ? { scale: 1.05 } : {}}
                whileTap={!isProcessingPayment ? { scale: 0.95 } : {}}
              >
                {pack.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pack.badge}
                  </div>
                )}
                <div className="text-3xl text-center mb-2">{pack.emoji}</div>
                <div className="text-white font-bold text-lg text-center mb-1">
                  {pack.amount.toLocaleString()}
                </div>
                <div className="text-yellow-300 text-sm text-center font-semibold">
                  {getProductPrice(pack.productId)}
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Google Play Billing Notice */}
          <p className="text-xs text-white/40 text-center mt-3">
            Powered by Google Play Billing
          </p>
        </motion.div>

        {/* Power-Ups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-bold text-xl">Power-Ups</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {POWERUPS.map((powerUp, index) => (
              <motion.button
                key={powerUp.id}
                onClick={() => setSelectedPowerUp(powerUp.id)}
                className={`
                  relative
                  bg-gradient-to-br ${powerUp.color}
                  rounded-xl sm:rounded-2xl
                  p-3.5 sm:p-4
                  text-white
                  shadow-lg
                  hover:scale-105
                  active:scale-95
                  transition-all
                  border-2 border-white/20
                  backdrop-blur-sm
                  min-h-[120px] sm:min-h-[140px]
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Owned Badge */}
                {powerUps[powerUp.id] > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-white text-gray-900 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-xs font-black shadow-lg ring-2 ring-white/50">
                    {powerUps[powerUp.id]}
                  </div>
                )}

                {/* Icon */}
                <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2 text-center">{powerUp.icon}</div>

                {/* Name */}
                <div className="text-xs sm:text-sm font-bold text-center mb-1.5">{powerUp.name}</div>

                {/* Price */}
                <div className="text-[10px] sm:text-xs text-center font-semibold bg-black/30 backdrop-blur-sm rounded-lg py-1 px-2">
                  💰 {powerUp.cost}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Premium Pass Card */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 rounded-3xl p-[2px] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

          <div className="relative bg-slate-900 rounded-3xl p-6">
            {/* Premium Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-400 fill-current" />
                <h2 className="text-white font-black text-2xl">Premium Pack</h2>
              </div>
              {premiumPass.active && (
                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Active
                </div>
              )}
            </div>

            {/* Benefits List */}
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3 border border-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold mb-1">{benefit.title}</div>
                    <div className="text-sm text-white/60">{benefit.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Purchase Button */}
            {!premiumPass.active ? (
              <motion.button
                onClick={handlePurchasePremium}
                disabled={isProcessingPayment}
                className="
                  w-full
                  bg-gradient-to-r from-yellow-500 to-orange-500
                  text-white
                  font-black
                  text-lg
                  py-4
                  rounded-2xl
                  shadow-2xl shadow-yellow-500/40
                  hover:shadow-yellow-500/60
                  hover:scale-105
                  active:scale-95
                  transition-all
                  flex items-center justify-center gap-2
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                whileHover={!isProcessingPayment ? { scale: 1.05 } : {}}
                whileTap={!isProcessingPayment ? { scale: 0.95 } : {}}
              >
                <Crown className="w-6 h-6 fill-current" />
                <span>
                  {isProcessingPayment ? 'Processing...' : `Upgrade Now - ${getProductPrice(PRODUCT_IDS.PREMIUM_PACK)}`}
                </span>
              </motion.button>
            ) : (
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  You have Premium!
                </div>
                <div className="text-sm text-white/60">
                  Enjoy all premium benefits forever!
                </div>
              </div>
            )}
            
            {/* Google Play Billing Notice */}
            <p className="text-xs text-white/40 text-center mt-4">
              One-time purchase via Google Play
            </p>
          </div>
        </motion.div>

        {/* Restore Purchases Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={handleRestorePurchases}
            disabled={isRestoringPurchases}
            className="
              w-full
              bg-slate-800/50
              text-white/80
              font-semibold
              py-3
              rounded-xl
              border border-white/10
              hover:bg-slate-700/50
              active:scale-95
              transition-all
              disabled:opacity-50
            "
          >
            {isRestoringPurchases ? 'Restoring...' : 'Restore Purchases'}
          </button>
          <p className="text-xs text-white/40 text-center mt-2">
            Reinstalled the app? Restore your previous purchases here.
          </p>
        </motion.div>
      </div>

      {/* Power-Up Purchase Modal */}
      {selectedPowerUp && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setSelectedPowerUp(null);
            setQuantity(1);
          }}
        >
          <motion.div
            className="bg-slate-800 rounded-3xl p-6 max-w-sm w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const powerUp = POWERUPS.find((p) => p.id === selectedPowerUp);
              if (!powerUp) return null;

              const totalCost = powerUp.cost * quantity;
              const canAfford = coins >= totalCost;

              return (
                <>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{powerUp.icon}</div>
                    <h3 className="text-white font-bold text-2xl mb-2">{powerUp.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{powerUp.description}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-slate-700 rounded-xl text-white font-bold hover:bg-slate-600 active:scale-95 transition-all"
                      >
                        −
                      </button>
                      <div className="text-white font-bold text-2xl w-12 text-center">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(Math.min(99, quantity + 1))}
                        className="w-10 h-10 bg-slate-700 rounded-xl text-white font-bold hover:bg-slate-600 active:scale-95 transition-all"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Cost */}
                    <div className={`text-xl font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                      💰 {totalCost.toLocaleString()} coins
                    </div>
                    {!canAfford && (
                      <div className="text-red-400 text-sm mt-2">
                        Not enough coins!
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedPowerUp(null);
                        setQuantity(1);
                      }}
                      className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-600 active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleBuyPowerUp(powerUp.id, powerUp.cost)}
                      disabled={!canAfford}
                      className={`
                        flex-1
                        bg-gradient-to-r ${powerUp.color}
                        text-white
                        font-bold
                        py-3
                        rounded-xl
                        transition-all
                        ${canAfford ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
