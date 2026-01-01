import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Zap, Gift, Star, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState } from 'react';

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen = ({ onBack }: ShopScreenProps) => {
  const { premiumPass, activatePremiumPass, coins, spendCoins } = useGameStore();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handlePurchasePremium = () => {
    // In production, integrate with actual payment system
    // For demo, we'll use coins
    const success = spendCoins(1000);
    if (success) {
      activatePremiumPass();
      setShowPurchaseModal(false);
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
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="w-6 h-6 fill-current" />
                <span>Upgrade Now - 1000 Coins</span>
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

      {/* Purchase Confirmation Modal */}
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
              <p className="text-white/60 text-sm">
                Get all premium benefits for 1000 coins
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-600 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchasePremium}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
