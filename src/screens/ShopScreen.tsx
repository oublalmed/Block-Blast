/**
 * Shop Screen
 * 
 * This screen handles in-app purchases through Google Play Billing.
 * 
 * IMPORTANT: All payments go through Google Play Billing.
 * External payment processors (Stripe, PayPal, etc.) are NOT allowed on Google Play.
 * 
 * Products:
 * - Premium Pack (non-consumable): Removes ads, 2x coins, premium features
 * - Coin Packs (consumable): Purchase coins to buy power-ups
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Zap, Gift, Star, X, ShoppingCart, Play, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect, useCallback } from 'react';
import { POWERUPS } from '../types/powerups';
import type { PowerUpType } from '../types/powerups';
import { GOOGLE_PLAY_PRODUCTS } from '../config/payment';
import {
  purchaseProduct,
  getProductDetails,
  restorePurchases,
  onPurchaseUpdate,
  getCoinAmountForProduct,
  isNativeAndroid,
} from '../services/billing';
import {
  showRewarded,
  isRewardedReady,
  onRewardEarned,
  getRewardedAdCoinAmount,
} from '../services/admob';

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen = ({ onBack }: ShopScreenProps) => {
  const { 
    isPremium,
    coins, 
    buyPowerUp, 
    powerUps,
    handlePurchaseSuccess,
    handleRestorePurchases,
    addCoins,
  } = useGameStore();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);

  // Get product details (with Google Play prices if available)
  const premiumDetails = getProductDetails(GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.productId);
  const coinPacks = [
    { ...GOOGLE_PLAY_PRODUCTS.COINS_100, ...getProductDetails(GOOGLE_PLAY_PRODUCTS.COINS_100.productId) },
    { ...GOOGLE_PLAY_PRODUCTS.COINS_500, ...getProductDetails(GOOGLE_PLAY_PRODUCTS.COINS_500.productId) },
    { ...GOOGLE_PLAY_PRODUCTS.COINS_1200, ...getProductDetails(GOOGLE_PLAY_PRODUCTS.COINS_1200.productId) },
  ];

  // Set up purchase listener
  useEffect(() => {
    const unsubscribe = onPurchaseUpdate((result) => {
      setIsProcessingPayment(false);
      
      if (result.success && result.productId) {
        const coinAmount = getCoinAmountForProduct(result.productId);
        handlePurchaseSuccess(result.productId, coinAmount);
        setShowPurchaseModal(false);
        setPurchaseError(null);
      } else if (result.error) {
        setPurchaseError(result.error);
      }
    });

    return () => unsubscribe();
  }, [handlePurchaseSuccess]);

  // Set up rewarded ad callback
  useEffect(() => {
    const unsubscribe = onRewardEarned(() => {
      // Grant reward coins
      addCoins(getRewardedAdCoinAmount());
    });

    return () => unsubscribe();
  }, [addCoins]);

  /**
   * Handle Premium Pack purchase
   * Uses Google Play Billing for payment
   */
  const handlePurchasePremium = async () => {
    setIsProcessingPayment(true);
    setPurchaseError(null);
    
    try {
      const result = await purchaseProduct(GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.productId);
      
      if (!result.success) {
        setPurchaseError(result.error || 'Purchase failed. Please try again.');
        setIsProcessingPayment(false);
      }
      // Success is handled by the purchase listener
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseError('An unexpected error occurred. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  /**
   * Handle Coin Pack purchase
   * Uses Google Play Billing for payment
   */
  const handlePurchaseCoinPack = async (productId: string) => {
    setIsProcessingPayment(true);
    setPurchaseError(null);
    
    try {
      const result = await purchaseProduct(productId);
      
      if (!result.success) {
        setPurchaseError(result.error || 'Purchase failed. Please try again.');
        setIsProcessingPayment(false);
      }
      // Success is handled by the purchase listener
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseError('An unexpected error occurred. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  /**
   * Restore previous purchases
   * Important for users who reinstall the app
   */
  const handleRestoreButton = useCallback(async () => {
    setIsRestoringPurchases(true);
    try {
      const restoredProducts = await restorePurchases();
      handleRestorePurchases(restoredProducts);
      
      if (restoredProducts.length > 0) {
        alert('✅ Purchases restored successfully!');
      } else {
        alert('No previous purchases found.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoringPurchases(false);
    }
  }, [handleRestorePurchases]);

  /**
   * Watch rewarded ad for free coins
   */
  const handleWatchAd = async () => {
    if (!isRewardedReady()) {
      alert('Ad not ready. Please try again in a moment.');
      return;
    }

    const shown = await showRewarded();
    if (!shown && !isNativeAndroid()) {
      // Mock mode - grant coins directly for testing
      addCoins(getRewardedAdCoinAmount());
    }
  };

  const handleBuyPowerUp = (type: PowerUpType, cost: number) => {
    const success = buyPowerUp(type, quantity, cost);
    if (success) {
      setSelectedPowerUp(null);
      setQuantity(1);
    } else {
      alert('Not enough coins! Play more or purchase coins.');
    }
  };

  const benefits = GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.benefits.map((benefit) => ({
    icon: benefit.icon === '🚫' ? <X className="w-5 h-5" /> :
          benefit.icon === '⚡' ? <Zap className="w-5 h-5" /> :
          benefit.icon === '🎁' ? <Gift className="w-5 h-5" /> :
          <Star className="w-5 h-5" />,
    title: benefit.title,
    description: benefit.description,
  }));

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

          {/* Restore Purchases Button */}
          <button
            onClick={handleRestoreButton}
            disabled={isRestoringPurchases}
            className="
              px-3 py-2
              bg-slate-800/50
              rounded-xl
              text-xs text-white/70
              border border-white/10
              hover:bg-slate-700/50
              active:scale-95
              transition-all
              disabled:opacity-50
            "
          >
            {isRestoringPurchases ? '...' : 'Restore'}
          </button>
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
              {isPremium && (
                <div className="text-xs text-green-400 mt-1">
                  ✨ 2x coins from gameplay!
                </div>
              )}
            </div>
            <div className="text-5xl">💎</div>
          </div>
        </motion.div>

        {/* Watch Ad for Coins (only for non-premium users) */}
        {!isPremium && (
          <motion.button
            onClick={handleWatchAd}
            className="
              w-full mb-6
              bg-gradient-to-r from-green-500/20 to-emerald-500/20
              rounded-2xl p-4
              border border-green-500/30
              flex items-center justify-between
              hover:from-green-500/30 hover:to-emerald-500/30
              active:scale-98
              transition-all
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold">Watch Ad for Free Coins</div>
                <div className="text-sm text-white/60">
                  Get {getRewardedAdCoinAmount()} coins for watching a short video
                </div>
              </div>
            </div>
            <div className="text-2xl">🎬</div>
          </motion.button>
        )}

        {/* Coin Packs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
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
                onClick={() => handlePurchaseCoinPack(pack.productId)}
                disabled={isProcessingPayment}
                className={`
                  relative
                  bg-gradient-to-br from-yellow-500/20 to-orange-500/20
                  rounded-xl
                  p-3
                  text-white
                  border border-yellow-500/30
                  hover:from-yellow-500/30 hover:to-orange-500/30
                  active:scale-95
                  transition-all
                  disabled:opacity-50
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + index * 0.05 }}
              >
                {pack.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pack.badge}
                  </div>
                )}
                <div className="text-3xl mb-1">{pack.emoji}</div>
                <div className="text-lg font-bold">{pack.coinAmount?.toLocaleString()}</div>
                <div className="text-xs text-white/60">{pack.price || pack.fallbackPrice}</div>
              </motion.button>
            ))}
          </div>
          <div className="text-xs text-white/40 text-center mt-2">
            Powered by Google Play
          </div>
        </motion.div>

        {/* Power-Ups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
                transition={{ delay: 0.35 + index * 0.05 }}
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
              {isPremium && (
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
            {!isPremium ? (
              <motion.button
                onClick={() => setShowPurchaseModal(true)}
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
                <span>Upgrade Now - {premiumDetails?.price || GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.fallbackPrice}</span>
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

            {/* Google Play notice */}
            <div className="text-xs text-white/30 text-center mt-4">
              Payment processed securely by Google Play
            </div>
          </div>
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
                        Not enough coins! Purchase more above.
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

      {/* Premium Purchase Confirmation Modal */}
      {showPurchaseModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => !isProcessingPayment && setShowPurchaseModal(false)}
        >
          <motion.div
            className="bg-slate-800 rounded-3xl p-6 max-w-sm w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <Crown className="w-16 h-16 text-yellow-400 fill-current mx-auto mb-4" />
              <h3 className="text-white font-bold text-2xl mb-2">Upgrade to Premium?</h3>
              <p className="text-white/60 text-sm mb-4">
                {GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.description}
              </p>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-3xl font-black text-yellow-300 mb-1">
                  {premiumDetails?.price || GOOGLE_PLAY_PRODUCTS.PREMIUM_PACK.fallbackPrice}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider">
                  One-time purchase • Forever premium
                </div>
              </div>

              {/* Error message */}
              {purchaseError && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <div className="text-red-400 text-sm">{purchaseError}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                disabled={isProcessingPayment}
                className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-600 active:scale-95 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchasePremium}
                disabled={isProcessingPayment}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Buy Now
                  </>
                )}
              </button>
            </div>

            {/* Google Play notice */}
            <div className="text-xs text-white/30 text-center mt-4">
              Secure payment via Google Play
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
