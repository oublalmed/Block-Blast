import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Zap, Gift, Star, X, ShoppingCart, CreditCard } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect } from 'react';
import { POWERUPS } from '../types/powerups';
import type { PowerUpType } from '../types/powerups';
import { createPremiumCheckoutSession, checkPaymentStatus } from '../services/stripe';
import { PREMIUM_PASS } from '../config/payment';

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen = ({ onBack }: ShopScreenProps) => {
  const { premiumPass, activatePremiumPass, coins, spendCoins, buyPowerUp, powerUps } = useGameStore();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Check for successful payment on component mount
  useEffect(() => {
    const { success, sessionId } = checkPaymentStatus();
    if (success && sessionId) {
      // Payment successful! Activate premium pass
      activatePremiumPass();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      // Show success message
      alert('🎉 Premium Pass activated! Enjoy your benefits!');
    }
  }, [activatePremiumPass]);

  const handlePurchasePremium = async () => {
    setIsProcessingPayment(true);
    try {
      // Create Stripe checkout session and redirect to payment page
      const checkoutUrl = await createPremiumCheckoutSession();

      if (checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
      } else {
        alert('❌ Unable to process payment. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
      setShowPurchaseModal(false);
    }
  };

  const handleBuyPowerUp = (type: PowerUpType, cost: number) => {
    const success = buyPowerUp(type, quantity, cost);
    if (success) {
      setSelectedPowerUp(null);
      setQuantity(1);
    } else {
      alert('Not enough coins! Play more to earn coins.');
    }
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
            <div className="text-5xl">💎</div>
          </div>
        </motion.div>

        {/* Power-Ups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
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
                transition={{ delay: 0.2 + index * 0.05 }}
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
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

          <div className="relative bg-slate-900 rounded-3xl p-6">
            {/* Premium Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-400 fill-current" />
                <h2 className="text-white font-black text-2xl">Premium Pass</h2>
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
                  transition={{ delay: 0.3 + index * 0.1 }}
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
                <span>Upgrade Now - ${PREMIUM_PASS.price}</span>
                <CreditCard className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  You have Premium!
                </div>
                <div className="text-sm text-white/60">
                  Expires: {premiumPass.expiresAt ? new Date(premiumPass.expiresAt).toLocaleDateString() : 'Never'}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Coin Packs (Future Feature) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-white font-bold text-xl mb-4">Coin Packs (Coming Soon)</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { amount: 500, price: '$0.99', emoji: '💰' },
              { amount: 1200, price: '$1.99', emoji: '💎', badge: 'Popular' },
              { amount: 3000, price: '$4.99', emoji: '🏆' },
              { amount: 10000, price: '$14.99', emoji: '👑', badge: 'Best Value' },
            ].map((pack, index) => (
              <motion.div
                key={index}
                className="relative bg-slate-800/50 rounded-2xl p-4 border border-white/10 opacity-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                {pack.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pack.badge}
                  </div>
                )}
                <div className="text-4xl text-center mb-2">{pack.emoji}</div>
                <div className="text-white font-bold text-lg text-center mb-1">
                  {pack.amount.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm text-center">{pack.price}</div>
              </motion.div>
            ))}
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

      {/* Premium Purchase Confirmation Modal */}
      {showPurchaseModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPurchaseModal(false)}
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
                {PREMIUM_PASS.description}
              </p>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-3xl font-black text-yellow-300 mb-1">
                  ${PREMIUM_PASS.price}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider">
                  One-time payment • Secure checkout via Stripe
                </div>
              </div>
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
                    <CreditCard className="w-5 h-5" />
                    Pay ${PREMIUM_PASS.price}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
