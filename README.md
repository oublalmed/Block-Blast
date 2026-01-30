# 🎮 Block Blast - Google Play Ready Mobile Game

A fully-featured, mobile-optimized Block Blast game built with React, TypeScript, Tailwind CSS, and Capacitor. **100% Google Play compliant** with proper monetization through Google Play Billing and Google AdMob!

![Block Blast Game](https://img.shields.io/badge/Game-Block%20Blast-blue)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Capacitor](https://img.shields.io/badge/Capacitor-8.0-green)
![Google Play](https://img.shields.io/badge/Google%20Play-Compliant-success)

---

## ✨ Features

### 🎯 Core Gameplay
- **Classic Block Blast Mechanics** - Drag and drop blocks to clear lines
- **50+ Progressive Levels** - Increasing difficulty with star ratings
- **Quick Play Mode** - Endless gameplay for high scores
- **Daily Challenges** - Fresh challenges every day with bonus rewards
- **Power-Ups System** - Undo, Hint, Bomb, and Shuffle power-ups
- **Combo System** - Score multipliers for consecutive clears
- **Sound Effects** - Immersive audio feedback

### 🏆 Progression System
- **Achievement System** - 30+ achievements across 6 categories
- **Badge Collection** - Hidden achievements and special rewards
- **Level Progression** - Stars, targets, and difficulty scaling
- **Best Score Tracking** - Personal records and statistics
- **Coin Economy** - Earn and spend coins on power-ups

### 💎 Premium Pack (One-Time Purchase)
- ✅ **Remove all ads** - No more interruptions
- ✅ **2x coin rewards** - Double all coins earned from gameplay
- ✅ **Exclusive pieces** - Special block designs
- ✅ **Daily bonus** - 100 free coins every day
- Lifetime purchase - never expires!

### 💰 Monetization (Google Play Compliant)
- **Google Play Billing** - Secure in-app purchases
- **Google AdMob** - Mobile-optimized ads
- **Rewarded Ads** - Watch ads for free coins
- **Premium removes ads** - No ads for premium users

### 📱 Mobile Optimization
- **Fully Responsive** - Optimized for all screen sizes
- **Touch-Optimized** - Large touch targets and gestures
- **Native Android App** - Built with Capacitor
- **Offline Support** - Play without internet connection
- **Safe Area Support** - iPhone notch and navigation bar friendly

### 🎨 User Interface
- **Modern Design** - Glassmorphism and gradient effects
- **Smooth Animations** - Framer Motion powered transitions
- **Dark Theme** - Beautiful dark mode design
- **Visual Feedback** - Particle effects and celebrations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Android Studio (for building Android app)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Block-Blast.git
   cd Block-Blast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for Android**
   ```bash
   npm run android
   ```

---

## 💵 Google Play Monetization Setup

This game uses **Google Play Billing** for payments and **Google AdMob** for ads. This is the ONLY way to monetize on Google Play - external payment processors like Stripe or PayPal are NOT allowed.

### Step 1: Create Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the one-time $25 registration fee
3. Complete account verification

### Step 2: Create Your App in Play Console

1. Create a new app in Play Console
2. Fill in store listing details
3. Set up pricing (Free with in-app purchases)

### Step 3: Configure In-App Products

In Play Console > Monetize > Products > In-app products:

| Product ID | Type | Price | Description |
|------------|------|-------|-------------|
| `premium_pack` | Non-consumable | $3.99 | Premium Pack - Remove ads & bonuses |
| `coins_100` | Consumable | $0.99 | 100 Coins |
| `coins_500` | Consumable | $2.99 | 500 Coins |
| `coins_1200` | Consumable | $4.99 | 1200 Coins (Best Value) |

### Step 4: Set Up Google AdMob

1. Go to [Google AdMob](https://admob.google.com)
2. Create an AdMob account
3. Add your app
4. Create ad units:
   - **Banner Ad** - Bottom of screen
   - **Interstitial Ad** - Between game sessions
   - **Rewarded Ad** - Watch for coins

5. Copy your ad unit IDs and update `.env`:
   ```env
   VITE_ADMOB_APP_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
   VITE_ADMOB_BANNER_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
   VITE_ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
   VITE_ADMOB_REWARDED_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
   ```

### Step 5: Configure Environment

Copy the example environment file and add your IDs:

```bash
cp .env.example .env
```

Edit `.env` with your AdMob unit IDs.

---

## 📦 In-App Products

### Premium Pack (Non-Consumable)
- **Product ID**: `premium_pack`
- **Type**: Non-consumable (one-time purchase)
- **Price**: $3.99 (set in Google Play Console)
- **Benefits**:
  - Remove all ads forever
  - 2x coin multiplier on all earnings
  - Exclusive block designs
  - 100 daily bonus coins

### Coin Packs (Consumable)
| Product ID | Coins | Suggested Price |
|------------|-------|-----------------|
| `coins_100` | 100 | $0.99 |
| `coins_500` | 500 | $2.99 |
| `coins_1200` | 1200 | $4.99 |

---

## 📺 Ad Implementation

### Banner Ads
- Shown at bottom of game screen
- Hidden for premium users
- Uses AdMob ADAPTIVE_BANNER size

### Interstitial Ads
- Shown every 3 game sessions
- Not shown to premium users
- Preloaded for instant display

### Rewarded Ads
- User chooses to watch for 25 coins
- Available in shop screen
- Great for user engagement

---

## 🛠️ Development

### Project Structure

```
Block-Blast/
├── src/
│   ├── components/       # React components
│   │   ├── ads/         # AdMob components
│   │   ├── game/        # Game components
│   │   └── ui/          # UI components
│   ├── screens/         # Screen components
│   ├── services/        # Billing & AdMob services
│   │   ├── billing.ts   # Google Play Billing
│   │   └── admob.ts     # Google AdMob
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── config/         # Configuration
│       └── payment.ts  # Product & ad config
├── android/           # Native Android project
└── public/           # Static assets
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Android
npm run android      # Build and open in Android Studio
npm run android:sync # Sync web assets to Android
npm run android:run  # Run on connected device

# Code Quality
npm run lint         # Run ESLint
```

### Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **State Management**: Zustand with persist
- **Mobile**: Capacitor 8
- **Payments**: Google Play Billing
- **Ads**: Google AdMob

---

## 🚢 Publishing to Google Play

### Pre-Launch Checklist

- [ ] Test all in-app purchases with test accounts
- [ ] Verify ads display correctly
- [ ] Test premium purchase removes ads
- [ ] Test purchase restoration
- [ ] Add Privacy Policy URL
- [ ] Add Terms of Service URL
- [ ] Create store listing graphics
- [ ] Set content rating
- [ ] Configure pricing

### Build Release APK

```bash
# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

In Android Studio:
1. Build > Generate Signed Bundle/APK
2. Choose Android App Bundle
3. Create or use existing keystore
4. Build release

### Upload to Play Console

1. Go to Production > Create new release
2. Upload your AAB file
3. Add release notes
4. Review and submit

---

## ⚠️ Important Google Play Policies

### Payment Requirements
- ❌ **NO Stripe, PayPal, or external payments**
- ❌ **NO web checkout links**
- ❌ **NO payment processing outside Google Play**
- ✅ **ONLY Google Play Billing for digital goods**

### Ad Requirements
- ❌ **NO Google AdSense** (web-only)
- ✅ **Google AdMob** for mobile apps
- ✅ Clear ad labeling
- ✅ No accidental clicks

### Privacy Requirements
- ✅ Privacy Policy required
- ✅ Data collection disclosure
- ✅ GDPR compliance for EU users

---

## 💰 Revenue Potential

With proper monetization:

| Daily Users | Premium Conv. (2%) | Ad Revenue | Total/Month |
|-------------|-------------------|------------|-------------|
| 1,000 | $80 | $50 | ~$3,900 |
| 10,000 | $800 | $500 | ~$39,000 |
| 100,000 | $8,000 | $5,000 | ~$390,000 |

*Estimates based on typical conversion rates and eCPM*

---

## 🆘 Troubleshooting

### Purchases not working?
- Verify product IDs match Play Console exactly
- Check app is signed with correct keystore
- Test with licensed test accounts
- Ensure Google Play Services is up to date

### Ads not showing?
- Verify AdMob account is approved
- Check ad unit IDs are correct
- Wait 24-48 hours for new ad units
- Test with test device IDs during development

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Android build
cd android && ./gradlew clean && cd ..
npm run android
```

---

## 📝 Legal Requirements

Before publishing, ensure you have:

1. **Privacy Policy** - Required by Google Play and AdMob
2. **Terms of Service** - Required for in-app purchases
3. **Data Safety Declaration** - Required in Play Console
4. **Age Rating** - Complete content rating questionnaire

---

## 🎯 Roadmap

- [x] Core gameplay mechanics
- [x] Google Play Billing integration
- [x] Google AdMob integration
- [x] Premium pack (remove ads + bonuses)
- [x] Coin packs (consumable purchases)
- [x] Rewarded ads for coins
- [x] Mobile-first responsive design
- [ ] Leaderboards (Google Play Games)
- [ ] Cloud save (Google Play Games)
- [ ] Multiplayer mode
- [ ] Seasonal events

---

## 📧 Support

For questions or issues:
- Create a GitHub issue
- Check the troubleshooting guide above
- Review Google Play policies

---

## 🙏 Credits

Built with:
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Capacitor
- Google Play Billing
- Google AdMob

---

**Ready for Google Play! 🎮📱💰**

Made for game developers who want to monetize properly on Google Play.
