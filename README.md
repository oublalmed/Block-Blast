# 🎮 Block Blast - Mobile Game for Google Play

A fully-featured, mobile-optimized Block Blast game built with React, TypeScript, and Capacitor. **100% Google Play compliant** with Google Play Billing and Google AdMob integration.

![Block Blast Game](https://img.shields.io/badge/Game-Block%20Blast-blue)
![Platform](https://img.shields.io/badge/Platform-Android-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Google Play](https://img.shields.io/badge/Google%20Play-Compliant-success)

---

## 🎯 Google Play Compliance

This app is **100% compliant** with Google Play Store policies:

- ✅ **Payments**: Google Play Billing only (no Stripe, PayPal, or external payments)
- ✅ **Advertisements**: Google AdMob only (no AdSense)
- ✅ **No external checkout links**
- ✅ **Proper purchase restoration**
- ✅ **GDPR/privacy compliant ad consent**

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

### 💎 Premium Pack ($3.99 via Google Play)
One-time purchase (non-consumable):
- ✅ Remove ALL advertisements permanently
- ✅ 2x coin rewards on all games
- ✅ Exclusive block designs
- ✅ 100 bonus coins daily
- ✅ Early access to new features

### 💰 Monetization

#### Google Play Billing (In-App Purchases)
All purchases are handled through Google Play Billing:

| Product ID | Type | Description |
|------------|------|-------------|
| `premium_pack` | Non-consumable | Premium Pack - removes ads, 2x coins |
| `coins_100` | Consumable | 100 Coins |
| `coins_500` | Consumable | 500 Coins (Popular) |
| `coins_1200` | Consumable | 1200 Coins (Best Value) |

#### Google AdMob (Advertisements)
Three ad formats for non-premium users:

| Ad Type | When Shown | Reward |
|---------|------------|--------|
| Banner | During gameplay | N/A |
| Interstitial | Every 3 games | N/A |
| Rewarded | User-initiated | 25 coins |

**Premium users see NO ADS.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Android Studio (for Android builds)
- Google Play Developer Account (for publishing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Block-Blast.git
cd Block-Blast

# Install dependencies
npm install

# Start development server
npm run dev
```

### Android Build

```bash
# Build and sync with Android
npm run android:sync

# Open in Android Studio
npm run android

# Build release APK
npm run android:build
```

---

## 💳 Google Play Billing Setup

### 1. Create Products in Google Play Console

1. Go to **Play Console** → Your App → **Monetize** → **Products** → **In-app products**
2. Create products with these **exact** IDs:
   - `premium_pack` (Non-consumable)
   - `coins_100` (Consumable)
   - `coins_500` (Consumable)
   - `coins_1200` (Consumable)
3. Set pricing for each product
4. **Activate** the products

### 2. Configure Android App

The billing integration is ready to use. Just ensure your app is:
- Signed with your release keystore
- Uploaded to Google Play (internal testing is fine)
- Licensed testers are added

### 3. Testing Purchases

1. Add test accounts in Play Console → **Setup** → **License testing**
2. Use signed builds only (debug builds won't work)
3. Test purchases are free and don't charge real money

---

## 📺 Google AdMob Setup

### 1. Create AdMob Account

1. Go to [apps.admob.com](https://apps.admob.com)
2. Create an account
3. Add your Android app (use package name from `capacitor.config.ts`)

### 2. Create Ad Units

Create these ad units:
- **Banner** - For gameplay screen
- **Interstitial** - For between levels
- **Rewarded** - For earning coins

### 3. Configure Ad IDs

1. Copy `.env.example` to `.env`
2. Replace test IDs with your actual ad unit IDs:

```env
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

### 4. Add App ID to AndroidManifest.xml

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

### Test Ad IDs (Development Only)

Use these Google test IDs during development:
- App ID: `ca-app-pub-3940256099942544~3347511713`
- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`
- Rewarded: `ca-app-pub-3940256099942544/5224354917`

---

## 🛠️ Project Structure

```
Block-Blast/
├── src/
│   ├── components/       # React components
│   │   ├── ads/         # AdMob components
│   │   ├── game/        # Game components
│   │   └── ui/          # UI components
│   ├── screens/         # Screen components
│   ├── services/        
│   │   ├── billing.ts   # Google Play Billing
│   │   └── ads.ts       # Google AdMob
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   └── config/
│       └── payment.ts   # Billing & AdMob config
├── android/             # Android native code
└── public/              # Static assets
```

---

## 📱 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Mobile**: Capacitor 8
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **State Management**: Zustand with persist
- **Payments**: Google Play Billing
- **Ads**: Google AdMob

---

## 🔒 Privacy & Compliance

### Required for Google Play

1. **Privacy Policy** - Disclose data collection
2. **Data Safety** - Complete the form in Play Console
3. **Ad Consent** - Required for EU users (GDPR)
4. **Target Audience** - Set appropriate content rating

### No External Payment Systems

This app does **NOT** use:
- ❌ Stripe
- ❌ PayPal
- ❌ External payment links
- ❌ Web checkout
- ❌ AdSense (web-only)

All monetization goes through Google Play's official systems.

---

## 🎮 How to Play

1. **Drag blocks** from the bottom tray onto the 9x9 grid
2. **Clear lines** horizontally or vertically to score points
3. **Create combos** by clearing multiple lines at once
4. **Use power-ups** strategically to maximize your score
5. **Complete levels** to unlock new challenges
6. **Collect achievements** and earn rewards!

### Power-Ups

- **↩️ Undo** - Undo your last move (50 coins)
- **💡 Hint** - Show the best placement (30 coins)
- **💣 Bomb** - Clear a 3x3 area (100 coins)
- **🔄 Shuffle** - Get new pieces (75 coins)

---

## 📊 Revenue Potential

With **10,000 daily active users**:

| Source | Calculation | Revenue |
|--------|-------------|---------|
| Premium (2% conversion) | 200 × $3.99 | ~$800/day |
| Coin Packs (1% conversion) | 100 × $2 avg | ~$200/day |
| Ad Revenue | 8,000 impressions | ~$50-200/day |
| **Total** | | **$1,000-1,200/day** |

---

## 🚢 Publishing to Google Play

### Pre-Launch Checklist

- [ ] Replace test ad IDs with production IDs
- [ ] Configure products in Play Console
- [ ] Add testers for internal testing
- [ ] Complete store listing
- [ ] Add privacy policy
- [ ] Complete data safety form
- [ ] Set content rating
- [ ] Create app signing key
- [ ] Build release AAB/APK

### Release Process

1. Build release: `npm run android:build`
2. Upload to Play Console
3. Start internal testing
4. Graduate to production

---

## 🆘 Troubleshooting

### Purchases Not Working?

1. Ensure app is signed with release key
2. Check products are active in Play Console
3. Add test accounts to license testing
4. Use internal test track, not debug builds

### Ads Not Showing?

1. Check AdMob app ID in AndroidManifest.xml
2. Verify ad unit IDs in .env file
3. Wait 24-48 hours after creating new ad units
4. Check AdMob dashboard for errors

### Build Errors?

```bash
# Clear and rebuild
rm -rf node_modules android/app/build
npm install
npm run android:sync
```

---

## 📝 License

This project is for commercial use. Modify and monetize as you wish!

---

## 🙏 Credits

Built with:
- React + TypeScript
- Capacitor
- Tailwind CSS
- Framer Motion
- Zustand
- Google Play Billing
- Google AdMob

---

**Ready for Google Play! 🎮💰🚀**

Made with ❤️ for mobile game developers
