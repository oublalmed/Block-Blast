/**
 * Shop Screen - Rewarded Ads & Power-Ups
 *
 * This screen lets players earn coins by watching rewarded ads,
 * then spend coins on power-ups. Premium Pass is unlocked via ads.
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Zap, Gift, Star, X, ShoppingCart, Play, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useCallback } from 'react';
import { POWERUPS } from '../types/powerups';
import type { PowerUpType } from '../types/powerups';
import { showRewardedAd, isRewardedAdReady } from '../services/ads';
import { ADMOB_CONFIG } from '../config/payment';

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen = ({ onBack }: ShopScreenProps) => {
  const {
    premiumPass,
    coins,
    rewardedAdsWatched,
    buyPowerUp,
    powerUps,
    recordRewardedAd,
  } = useGameStore();
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWatchingAds, setIsWatchingAds] = useState(false);

  /**
   * Watch rewarded ads to earn coins (and progress toward Premium).
   */
  const watchRewardedAds = useCallback(async (adsToWatch: number) => {
    if (isWatchingAds) return;
    setIsWatchingAds(true);

    let totalCoins = 0;
    let adsCompleted = 0;
    let unlockedPremium = false;

    try {
      for (let i = 0; i < adsToWatch; i += 1) {
        const success = await showRewardedAd((reward) => {
          const result = recordRewardedAd(reward.amount);
          totalCoins += result.coinsAdded;
          unlockedPremium = unlockedPremium || result.unlockedPremium;
        });

        if (!success) {
          break;
        }
        adsCompleted += 1;
      }

      if (adsCompleted > 0) {
        const adsLabel = adsCompleted === 1 ? 'ad' : 'ads';
        alert(`🎉 ${totalCoins} coins earned from ${adsCompleted} ${adsLabel}!`);
        if (unlockedPremium) {
          alert('👑 Premium Pass unlocked! Enjoy your benefits.');
        }
      } else {
        alert('⚠️ Ad not ready yet. Please try again in a moment.');
      }
    } catch (error) {
      console.error('Rewarded ad error:', error);
      alert('❌ Ad failed to load. Please try again.');
    } finally {
      setIsWatchingAds(false);
    }
  }, [isWatchingAds, recordRewardedAd]);

  /**
   * Watch a single rewarded ad for coins
   */
  const handleWatchAd = useCallback(async () => {
    await watchRewardedAds(1);
  }, [watchRewardedAds]);

  const handleBuyPowerUp = (type: PowerUpType, cost: number) => {
    const success = buyPowerUp(type, quantity, cost);
    if (success) {
      setSelectedPowerUp(null);
      setQuantity(1);
    } else {
      alert('Not enough coins! Play more or watch ads to earn coins.');
    }
  };

  const rewardAmount = ADMOB_CONFIG.rewardAmount;
  const adCoinDisplay = rewardAmount * (premiumPass.active ? 2 : 1);
  const premiumAdsRequired = ADMOB_CONFIG.premiumUnlockAds;
  const premiumProgress = Math.min(rewardedAdsWatched, premiumAdsRequired);
  const premiumProgressPercent = premiumAdsRequired > 0
    ? Math.min((premiumProgress / premiumAdsRequired) * 100, 100)
    : 100;
  const adsRemaining = Math.max(premiumAdsRequired - rewardedAdsWatched, 0);
  const rewardedReady = isRewardedAdReady();

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

  const adBundles = [
    {
      ads: 1,
      amount: rewardAmount,
      emoji: '🎬',
    },
    {
      ads: 3,
      amount: rewardAmount * 3,
      emoji: '🍿',
      badge: 'Popular',
    },
    {
      ads: 5,
      amount: rewardAmount * 5,
      emoji: '🎯',
      badge: 'Best Value',
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
              <motion.button
                onClick={handleWatchAd}
                disabled={!rewardedReady || isWatchingAds}
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
                {isWatchingAds || !rewardedReady ? 'Loading...' : `+${adCoinDisplay}`}
              </motion.button>
              <div className="text-5xl">💎</div>
            </div>
          </div>
        </motion.div>

        {/* Rewarded Ads - Earn Coins */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-bold text-xl">Rewarded Ads</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {adBundles.map((pack, index) => (
              <motion.button
                key={`${pack.ads}-ads`}
                onClick={() => watchRewardedAds(pack.ads)}
                disabled={isWatchingAds || !rewardedReady}
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
                whileHover={!isWatchingAds && rewardedReady ? { scale: 1.05 } : {}}
                whileTap={!isWatchingAds && rewardedReady ? { scale: 0.95 } : {}}
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
                  Watch {pack.ads} ad{pack.ads > 1 ? 's' : ''}
                </div>
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-white/40 text-center mt-3">
            Watch rewarded ads to earn coins instantly.
            {premiumPass.active && ' Premium doubles ad rewards.'}
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

            {/* Premium Unlock */}
            {!premiumPass.active ? (
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Ads watched</span>
                    <span className="font-semibold text-white">
                      {premiumProgress}/{premiumAdsRequired}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                      style={{ width: `${premiumProgressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/60 mt-2">
                    Watch {adsRemaining} more ad{adsRemaining === 1 ? '' : 's'} to unlock Premium.
                  </div>
                </div>

                <motion.button
                  onClick={handleWatchAd}
                  disabled={!rewardedReady || isWatchingAds}
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
                  whileHover={!isWatchingAds && rewardedReady ? { scale: 1.05 } : {}}
                  whileTap={!isWatchingAds && rewardedReady ? { scale: 0.95 } : {}}
                >
                  <Crown className="w-6 h-6 fill-current" />
                  <span>
                    {isWatchingAds || !rewardedReady ? 'Loading Ad...' : `Watch Ad (+${adCoinDisplay})`}
                  </span>
                </motion.button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  Premium Unlocked!
                </div>
                <div className="text-sm text-white/60">
                  Enjoy all premium benefits anytime.
                </div>
              </div>
            )}

            <p className="text-xs text-white/40 text-center mt-4">
              No purchases required. Premium is earned by watching ads.
            </p>
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
    </div>
  );
};
