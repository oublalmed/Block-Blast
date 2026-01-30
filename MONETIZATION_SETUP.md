# 💰 Block Blast - Google Play Monetization Setup Guide

Complete guide to configure Google Play Billing and Google AdMob for your Block Blast game.

**IMPORTANT:** This app uses ONLY Google Play approved monetization:
- ✅ Google Play Billing (in-app purchases)
- ✅ Google AdMob (advertisements)
- ❌ NO Stripe, PayPal, or external payment systems
- ❌ NO AdSense (web-only, not allowed in apps)

---

## 🎯 Overview

Your Block Blast game has **Google Play compliant monetization**:

✅ **Google Play Billing** - In-app purchases for Premium Pack and Coin Packs
✅ **Google AdMob** - Banner, Interstitial, and Rewarded ads
✅ **Google Analytics 4** - Track revenue and user behavior

---

## 📋 Quick Setup Checklist

- [ ] Create Google Play Developer account ($25 one-time fee)
- [ ] Create AdMob account and app
- [ ] Configure ad units in AdMob
- [ ] Create products in Google Play Console
- [ ] Configure environment variables
- [ ] Build and test on Android
- [ ] Submit to Google Play Store

---

## 💳 PART 1: Google Play Billing Setup

### Step 1: Create Google Play Developer Account

1. Go to https://play.google.com/console
2. Pay the one-time $25 registration fee
3. Complete identity verification
4. Accept the Developer Distribution Agreement

### Step 2: Create Your App

1. In Play Console, click **"Create app"**
2. Fill in app details:
   - App name: Block Blast
   - Default language: English
   - App or game: Game
   - Free or paid: Free
3. Accept declarations and create app

### Step 3: Configure In-App Products

1. Go to **Monetize** → **Products** → **In-app products**
2. Click **"Create product"**
3. Create these products with **exact IDs**:

**Premium Pack (Non-consumable):**
```
Product ID: premium_pack
Name: Premium Pack
Description: Remove all ads, get 2x coins, and unlock premium features forever
Price: $3.99 USD
```

**Coin Packs (Consumable):**
```
Product ID: coins_100
Name: 100 Coins
Description: A small pack of coins
Price: $0.99 USD

Product ID: coins_500
Name: 500 Coins
Description: A popular pack of coins
Price: $2.99 USD

Product ID: coins_1200
Name: 1200 Coins
Description: Best value pack of coins
Price: $4.99 USD
```

4. **Activate** each product

### Step 4: Enable License Testing

1. Go to **Setup** → **License testing**
2. Add your Google account email
3. Select **"RESPOND_NORMALLY"** for license response
4. Save changes

---

## 📺 PART 2: Google AdMob Setup

### Step 1: Create AdMob Account

1. Go to https://apps.admob.com
2. Sign in with your Google account
3. Accept terms and conditions
4. Complete account setup

### Step 2: Add Your App

1. Click **"Apps"** → **"Add app"**
2. Select **"Android"**
3. If not published yet, select **"No"**
4. Enter app name: Block Blast
5. Click **"Add app"**
6. Note your **App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### Step 3: Create Ad Units

Create three ad units:

**Banner Ad:**
1. Click **"Add ad unit"** → **"Banner"**
2. Name: Block Blast Banner
3. Click **"Create ad unit"**
4. Copy the **Ad unit ID**

**Interstitial Ad:**
1. Click **"Add ad unit"** → **"Interstitial"**
2. Name: Block Blast Interstitial
3. Click **"Create ad unit"**
4. Copy the **Ad unit ID**

**Rewarded Ad:**
1. Click **"Add ad unit"** → **"Rewarded"**
2. Name: Block Blast Rewarded
3. Reward amount: 25 (coins)
4. Click **"Create ad unit"**
5. Copy the **Ad unit ID**

### Step 4: Configure AndroidManifest.xml

Add your AdMob App ID to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- ... other content ... -->
    
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
</application>
```

---

## ⚙️ PART 3: Environment Configuration

### Step 1: Create `.env` File

```bash
cp .env.example .env
```

### Step 2: Fill in Your Values

```env
# Google AdMob
VITE_ADMOB_ENABLED=true
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Google Analytics (optional)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENABLED=true
```

### Test Ad Unit IDs (Development)

Use these Google test IDs during development:
```env
VITE_ADMOB_APP_ID=ca-app-pub-3940256099942544~3347511713
VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712
VITE_ADMOB_REWARDED_ID=ca-app-pub-3940256099942544/5224354917
```

---

## 🧪 PART 4: Testing

### Test In-App Purchases

1. Build a signed APK/AAB
2. Upload to internal testing track
3. Add license testers
4. Install from Play Store (internal track)
5. Test purchases (free for license testers)

### Test Ads

1. Use test ad unit IDs during development
2. Real ads only work in signed release builds
3. Never click your own ads in production!

### Test Flow

1. Install app from Play Store internal track
2. Verify ads display for free users
3. Purchase Premium Pack
4. Verify ads disappear after purchase
5. Verify 2x coin multiplier works
6. Verify purchase restores after reinstall

---

## 🚀 PART 5: Going Live

### Pre-Launch Checklist

- [ ] Replace test ad IDs with production IDs
- [ ] All products are activated in Play Console
- [ ] Privacy policy URL is set
- [ ] Data safety form is completed
- [ ] Content rating questionnaire is done
- [ ] App is signed with release key
- [ ] Internal testing completed successfully

### Submit to Production

1. Complete all store listing details
2. Upload signed AAB
3. Submit for review
4. Wait for approval (typically 1-7 days)

---

## 📊 Revenue Tracking

### Google Play Console

- View in-app purchase revenue
- Track refunds
- See buyer demographics

### AdMob Dashboard

- Monitor ad impressions and clicks
- Track estimated earnings
- View fill rates

### Google Analytics

- Track user behavior
- Monitor conversion funnels
- Analyze revenue per user

---

## 🆘 Troubleshooting

### Purchases Not Working

1. Ensure app is signed with release key
2. Check products are active in Play Console
3. Verify license testers are added
4. Use internal test track (not debug builds)
5. Check BillingClient connection

### Ads Not Showing

1. Verify AdMob app ID in AndroidManifest.xml
2. Check ad unit IDs are correct
3. Wait 24-48 hours for new ad units
4. Check AdMob dashboard for errors
5. Ensure not using ad blockers

### Common Errors

**"Item not found"**
- Product ID doesn't match Play Console
- Product is not activated

**"Purchase verification failed"**
- App not signed with release key
- Not installed from Play Store

---

## 📝 Legal Requirements

### Required Documents

1. **Privacy Policy** - Disclose data collection
2. **Terms of Service** - Usage rules
3. **Data Safety** - Complete in Play Console

### GDPR Compliance (EU Users)

1. Get consent before showing personalized ads
2. Offer option for non-personalized ads
3. Disclose data processing

---

## 🎉 Congratulations!

Your Block Blast game is now fully monetized with:

✅ Google Play Billing for purchases
✅ Google AdMob for advertisements
✅ 100% Google Play compliant

**Start earning from your game! 💰🎮**

---

## 📚 Resources

- **Google Play Billing**: https://developer.android.com/google/play/billing
- **Google AdMob**: https://developers.google.com/admob
- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **AdMob Help**: https://support.google.com/admob

---

**Happy Earning! 🚀**
